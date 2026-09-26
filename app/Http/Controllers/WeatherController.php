<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class WeatherController extends Controller
{
    /**
     * Default primary kitesurfing spot in Sri Lanka.
     */
    protected const DEFAULT_PLACE_ID = 'kalpitiya-1242089';

    protected const DEFAULT_PLACE_NAME = 'Kalpitiya, Sri Lanka';

    /**
     * Curated popular Sri Lankan spots for instant search and offline/fallback matching.
     *
     * @var array<int, array<string, string>>
     */
    protected array $curatedSpots = [
        [
            'name' => 'Kalpitiya',
            'place_id' => 'kalpitiya-1242089',
            'adm_area1' => 'North Western',
            'adm_area2' => 'Puttalam District',
            'country' => 'Sri Lanka',
            'lat' => '8.22873N',
            'lon' => '79.75988E',
        ],
        [
            'name' => 'Mannar',
            'place_id' => 'mannar-1236150',
            'adm_area1' => 'Northern Province',
            'adm_area2' => 'Mannar District',
            'country' => 'Sri Lanka',
            'lat' => '8.9806N',
            'lon' => '79.9042E',
        ],
        [
            'name' => 'Trincomalee',
            'place_id' => 'trincomalee',
            'adm_area1' => 'Eastern Province',
            'adm_area2' => 'Trincomalee District',
            'country' => 'Sri Lanka',
            'lat' => '8.5711N',
            'lon' => '81.2335E',
        ],
        [
            'name' => 'Arugam Bay',
            'place_id' => 'arugam-bay-1250935',
            'adm_area1' => 'Eastern Province',
            'adm_area2' => 'Ampara District',
            'country' => 'Sri Lanka',
            'lat' => '6.8417N',
            'lon' => '81.8286E',
        ],
        [
            'name' => 'Colombo',
            'place_id' => 'colombo',
            'adm_area1' => 'Western Province',
            'adm_area2' => 'Colombo District',
            'country' => 'Sri Lanka',
            'lat' => '6.9271N',
            'lon' => '79.8612E',
        ],
        [
            'name' => 'Bentota',
            'place_id' => 'bentota',
            'adm_area1' => 'Southern Province',
            'adm_area2' => 'Galle District',
            'country' => 'Sri Lanka',
            'lat' => '6.4256N',
            'lon' => '79.9984E',
        ],
        [
            'name' => 'Hikkaduwa',
            'place_id' => 'hikkaduwa',
            'adm_area1' => 'Southern Province',
            'adm_area2' => 'Galle District',
            'country' => 'Sri Lanka',
            'lat' => '6.1408N',
            'lon' => '80.1011E',
        ],
        [
            'name' => 'Mirissa',
            'place_id' => 'mirissa-city',
            'adm_area1' => 'Southern Province',
            'adm_area2' => 'Matara District',
            'country' => 'Sri Lanka',
            'lat' => '5.9483N',
            'lon' => '80.4578E',
        ],
        [
            'name' => 'Galle',
            'place_id' => 'galle',
            'adm_area1' => 'Southern Province',
            'adm_area2' => 'Galle District',
            'country' => 'Sri Lanka',
            'lat' => '6.0535N',
            'lon' => '80.2210E',
        ],
        [
            'name' => 'Jaffna',
            'place_id' => 'jaffna',
            'adm_area1' => 'Northern Province',
            'adm_area2' => 'Jaffna District',
            'country' => 'Sri Lanka',
            'lat' => '9.6615N',
            'lon' => '80.0255E',
        ],
        [
            'name' => 'Puttalam',
            'place_id' => 'puttalam',
            'adm_area1' => 'North Western',
            'adm_area2' => 'Puttalam District',
            'country' => 'Sri Lanka',
            'lat' => '8.0362N',
            'lon' => '79.8283E',
        ],
        [
            'name' => 'Kandy',
            'place_id' => 'kandy',
            'adm_area1' => 'Central Province',
            'adm_area2' => 'Kandy District',
            'country' => 'Sri Lanka',
            'lat' => '7.2906N',
            'lon' => '80.6337E',
        ],
    ];

    /**
     * Display the full Weather Dashboard page.
     */
    public function index(Request $request): Response
    {
        $placeId = $request->input('place_id', self::DEFAULT_PLACE_ID);
        $weatherData = $this->fetchWeatherData($placeId);

        return Inertia::render('weather/Index', [
            'initialWeather' => $weatherData,
            'defaultPlaceId' => $placeId,
            'defaultPlaceName' => self::DEFAULT_PLACE_NAME,
        ]);
    }

    /**
     * Search locations across Sri Lanka and globally using Meteosource API.
     */
    public function searchLocations(Request $request): JsonResponse
    {
        $query = trim((string) $request->input('q', ''));

        if (mb_strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => array_slice($this->curatedSpots, 0, 8),
            ]);
        }

        $cacheKey = 'weather_loc_search_'.md5(mb_strtolower($query));

        $results = Cache::remember($cacheKey, 3600, function () use ($query) {
            $apiKey = config('services.meteosource.key');
            $baseUrl = rtrim((string) config('services.meteosource.url', 'https://www.meteosource.com/api/v1/free'), '/');

            // Find places matching the query in curated list for instant fuzzy match
            $matchedCurated = array_filter($this->curatedSpots, function ($spot) use ($query) {
                return stripos($spot['name'], $query) !== false ||
                    stripos($spot['adm_area1'] ?? '', $query) !== false ||
                    stripos($spot['adm_area2'] ?? '', $query) !== false;
            });

            $apiMatches = [];

            if ($apiKey) {
                try {
                    $response = Http::timeout(5)->get("{$baseUrl}/find_places", [
                        'text' => $query,
                        'key' => $apiKey,
                        'language' => 'en',
                    ]);

                    if ($response->successful()) {
                        $rawMatches = $response->json();
                        if (is_array($rawMatches)) {
                            foreach ($rawMatches as $item) {
                                if (! isset($item['place_id'], $item['name'])) {
                                    continue;
                                }

                                $apiMatches[] = [
                                    'name' => $item['name'],
                                    'place_id' => $item['place_id'],
                                    'adm_area1' => $item['adm_area1'] ?? null,
                                    'adm_area2' => $item['adm_area2'] ?? null,
                                    'country' => $item['country'] ?? 'Sri Lanka',
                                    'lat' => $item['lat'] ?? null,
                                    'lon' => $item['lon'] ?? null,
                                ];
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    Log::warning('Meteosource search failed: '.$e->getMessage());
                }
            }

            // Merge curated and API matches without duplicates
            $merged = [];
            $seenIds = [];

            foreach (array_merge($matchedCurated, $apiMatches) as $spot) {
                $id = $spot['place_id'];
                if (! isset($seenIds[$id])) {
                    $seenIds[$id] = true;
                    $merged[] = $spot;
                }
            }

            // Prioritize Sri Lanka spots at the top
            usort($merged, function ($a, $b) {
                $aIsSl = ($a['country'] ?? '') === 'Sri Lanka' ? 1 : 0;
                $bIsSl = ($b['country'] ?? '') === 'Sri Lanka' ? 1 : 0;

                return $bIsSl <=> $aIsSl;
            });

            return array_slice($merged, 0, 10);
        });

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }

    /**
     * Fetch live weather conditions, hourly forecast, and 7-day outlook.
     */
    public function getWeather(Request $request): JsonResponse
    {
        $placeId = trim((string) $request->input('place_id', self::DEFAULT_PLACE_ID));

        if ($placeId === '' || $placeId === 'kalpitiya') {
            $placeId = self::DEFAULT_PLACE_ID;
        }

        $weatherData = $this->fetchWeatherData($placeId);

        if (! $weatherData) {
            return response()->json([
                'success' => false,
                'error' => 'Unable to load weather data for this location. Please try again.',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'data' => $weatherData,
        ]);
    }

    /**
     * Core weather retrieval and caching logic.
     *
     * @return array<string, mixed>|null
     */
    protected function fetchWeatherData(string $placeId): ?array
    {
        $cacheKey = 'weather_point_'.md5($placeId);

        return Cache::remember($cacheKey, 900, function () use ($placeId) {
            $apiKey = config('services.meteosource.key');
            $baseUrl = rtrim((string) config('services.meteosource.url', 'https://www.meteosource.com/api/v1/free'), '/');

            if (! $apiKey) {
                Log::error('Meteosource API key is not configured in environment.');

                return null;
            }

            try {
                $response = Http::timeout(7)->get("{$baseUrl}/point", [
                    'place_id' => $placeId,
                    'sections' => 'current,hourly,daily',
                    'timezone' => 'Asia/Colombo',
                    'units' => 'metric',
                    'key' => $apiKey,
                ]);

                // Fallback to free tier if standard returns tier error
                if ($response->status() === 403 && str_contains($baseUrl, 'standard')) {
                    $response = Http::timeout(7)->get('https://www.meteosource.com/api/v1/free/point', [
                        'place_id' => $placeId,
                        'sections' => 'current,hourly,daily',
                        'timezone' => 'Asia/Colombo',
                        'units' => 'metric',
                        'key' => $apiKey,
                    ]);
                }

                if (! $response->successful()) {
                    Log::warning("Meteosource point API error for {$placeId}: ".$response->body());

                    return null;
                }

                $raw = $response->json();
                if (! is_array($raw)) {
                    return null;
                }

                return $this->formatWeatherResponse($placeId, $raw);
            } catch (\Throwable $e) {
                Log::error("Failed to fetch Meteosource weather for {$placeId}: ".$e->getMessage());

                return null;
            }
        });
    }

    /**
     * Normalize raw Meteosource response into clean, domain-rich data for the frontend.
     *
     * @param  array<string, mixed>  $raw
     * @return array<string, mixed>
     */
    protected function formatWeatherResponse(string $placeId, array $raw): array
    {
        $locationName = $this->resolveLocationName($placeId);

        $currentRaw = $raw['current'] ?? [];
        $temp = isset($currentRaw['temperature']) ? (float) $currentRaw['temperature'] : 28.0;
        $windSpeedMs = isset($currentRaw['wind']['speed']) ? (float) $currentRaw['wind']['speed'] : 0.0;
        $windSpeedKnots = round($windSpeedMs * 1.94384, 1);
        $windDir = $currentRaw['wind']['dir'] ?? 'SW';
        $windAngle = isset($currentRaw['wind']['angle']) ? (int) $currentRaw['wind']['angle'] : 0;
        $summary = $currentRaw['summary'] ?? 'Clear';
        $icon = $currentRaw['icon'] ?? 'sunny';
        $iconNum = isset($currentRaw['icon_num']) ? (int) $currentRaw['icon_num'] : 1;
        $cloudCover = isset($currentRaw['cloud_cover']) ? (int) $currentRaw['cloud_cover'] : 0;
        $precip = isset($currentRaw['precipitation']['total']) ? (float) $currentRaw['precipitation']['total'] : 0.0;

        // Calculate feels like (wind-adjusted heat index)
        $feelsLike = $this->calculateFeelsLike($temp, $windSpeedMs);

        // Kitesurfing condition analysis
        [$kitingRating, $kitingCondition, $kitingColor] = $this->evaluateKitesurfingConditions($windSpeedKnots);

        // Format 24-hour forecast
        $hourly = [];
        $rawHourly = $raw['hourly']['data'] ?? [];
        foreach (array_slice($rawHourly, 0, 24) as $h) {
            $hDate = isset($h['date']) ? Carbon::parse($h['date']) : now();
            $hWindMs = isset($h['wind']['speed']) ? (float) $h['wind']['speed'] : 0.0;
            $hWindKnots = round($hWindMs * 1.94384, 1);

            $hourly[] = [
                'date' => $h['date'] ?? null,
                'time' => $hDate->format('g A'),
                'time_24' => $hDate->format('H:i'),
                'temperature' => isset($h['temperature']) ? round((float) $h['temperature']) : null,
                'summary' => $h['summary'] ?? '',
                'icon' => $h['icon'] ?? 1,
                'weather' => $h['weather'] ?? 'clear',
                'wind_speed' => $hWindMs,
                'wind_speed_knots' => $hWindKnots,
                'wind_dir' => $h['wind']['dir'] ?? 'SW',
                'wind_angle' => isset($h['wind']['angle']) ? (int) $h['wind']['angle'] : 0,
                'precipitation' => isset($h['precipitation']['total']) ? (float) $h['precipitation']['total'] : 0.0,
            ];
        }

        // Format 7-day outlook
        $daily = [];
        $rawDaily = $raw['daily']['data'] ?? [];
        foreach ($rawDaily as $d) {
            $dDate = isset($d['day']) ? Carbon::parse($d['day']) : now();
            $allDay = $d['all_day'] ?? [];
            $dWindMs = isset($allDay['wind']['speed']) ? (float) $allDay['wind']['speed'] : 0.0;
            $dWindKnots = round($dWindMs * 1.94384, 1);

            $daily[] = [
                'day' => $d['day'] ?? null,
                'day_name' => $dDate->isToday() ? 'Today' : ($dDate->isTomorrow() ? 'Tomorrow' : $dDate->format('D')),
                'date_formatted' => $dDate->format('M j'),
                'summary' => $d['summary'] ?? ($allDay['weather'] ?? 'Clear'),
                'weather' => $d['weather'] ?? 'clear',
                'icon' => $d['icon'] ?? ($allDay['icon'] ?? 1),
                'temp_min' => isset($allDay['temperature_min']) ? round((float) $allDay['temperature_min']) : null,
                'temp_max' => isset($allDay['temperature_max']) ? round((float) $allDay['temperature_max']) : null,
                'wind_speed' => $dWindMs,
                'wind_speed_knots' => $dWindKnots,
                'wind_dir' => $allDay['wind']['dir'] ?? 'SW',
                'precipitation_total' => isset($allDay['precipitation']['total']) ? (float) $allDay['precipitation']['total'] : 0.0,
            ];
        }

        return [
            'place_id' => $placeId,
            'location' => $locationName,
            'timezone' => $raw['timezone'] ?? 'Asia/Colombo',
            'elevation' => $raw['elevation'] ?? 0,
            'current' => [
                'temperature' => round($temp, 1),
                'temperature_int' => round($temp),
                'feels_like' => $feelsLike,
                'summary' => $summary,
                'icon' => $icon,
                'icon_num' => $iconNum,
                'wind_speed' => round($windSpeedMs, 1),
                'wind_speed_knots' => $windSpeedKnots,
                'wind_dir' => $windDir,
                'wind_angle' => $windAngle,
                'cloud_cover' => $cloudCover,
                'precipitation' => $precip,
                'humidity' => $this->estimateHumidity($precip, $cloudCover),
                'kitesurf_condition' => $kitingCondition,
                'kitesurf_rating' => $kitingRating,
                'kitesurf_color' => $kitingColor,
                'updated_at' => now()->format('g:i A'),
            ],
            'hourly' => $hourly,
            'daily' => $daily,
        ];
    }

    /**
     * Resolve human-friendly location name from curated list or place_id.
     */
    protected function resolveLocationName(string $placeId): string
    {
        foreach ($this->curatedSpots as $spot) {
            if ($spot['place_id'] === $placeId) {
                return $spot['name'].', '.$spot['country'];
            }
        }

        // Clean place_id into a readable string: "kalpitiya-peninsula" => "Kalpitiya Peninsula, Sri Lanka"
        $parts = explode('-', $placeId);
        // Remove trailing numeric IDs if present: e.g. "kalpitiya-1242089" => "Kalpitiya"
        if (count($parts) > 1 && is_numeric(end($parts))) {
            array_pop($parts);
        }

        $cleanName = ucwords(implode(' ', $parts));

        return $cleanName !== '' ? $cleanName.', Sri Lanka' : self::DEFAULT_PLACE_NAME;
    }

    /**
     * Calculate feels-like temperature based on ambient temperature and wind speed.
     */
    protected function calculateFeelsLike(float $temp, float $windSpeedMs): float
    {
        // Tropical apparent temperature adjustment
        $windAdjustment = $windSpeedMs > 4 ? ($windSpeedMs * 0.25) : 0;
        $feels = $temp - $windAdjustment + 1.2;

        return round($feels, 1);
    }

    /**
     * Approximate relative humidity from cloud cover and precipitation.
     */
    protected function estimateHumidity(float $precipitation, int $cloudCover): int
    {
        if ($precipitation > 0) {
            return min(95, 78 + (int) ($precipitation * 4));
        }

        return max(55, min(88, 60 + (int) ($cloudCover * 0.25)));
    }

    /**
     * Evaluate kitesurfing suitability based on wind speed in knots.
     *
     * @return array{0: string, 1: string, 2: string} [Rating, Description, BadgeColor]
     */
    protected function evaluateKitesurfingConditions(float $knots): array
    {
        if ($knots >= 16 && $knots <= 26) {
            return ['Optimal', 'Prime Kiting Winds (16–26 kts)', 'emerald'];
        }

        if ($knots > 26 && $knots <= 34) {
            return ['High Wind', 'Strong Advanced Conditions (27+ kts)', 'amber'];
        }

        if ($knots > 34) {
            return ['Extreme', 'Storm / Gale Warning (35+ kts)', 'rose'];
        }

        if ($knots >= 11 && $knots < 16) {
            return ['Moderate', 'Light Breeze (Big Kites & Foil: 11–15 kts)', 'sky'];
        }

        return ['Calm', 'Light Wind / No Session (<11 kts)', 'slate'];
    }
}
