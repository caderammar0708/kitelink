<?php

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config([
        'services.meteosource.key' => 'test-meteosource-key-12345',
        'services.meteosource.url' => 'https://www.meteosource.com/api/v1/free',
    ]);
});

test('public users can search weather locations', function () {
    $response = $this->getJson('/api/weather/search-locations');

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'data' => [
                '*' => ['name', 'place_id', 'country'],
            ],
        ]);

    expect($response->json('data'))->not->toBeEmpty();
});

test('public users can search specific location with autocomplete query', function () {
    Http::fake([
        'https://www.meteosource.com/api/v1/free/find_places*' => Http::response([
            [
                'name' => 'Kalpitiya',
                'place_id' => 'kalpitiya-1242089',
                'country' => 'Sri Lanka',
                'adm_area1' => 'North Western',
                'adm_area2' => 'Puttalam District',
                'lat' => '8.22873N',
                'lon' => '79.75988E',
            ],
        ], 200),
    ]);

    $response = $this->getJson('/api/weather/search-locations?q=kalpitiya');

    $response->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $places = $response->json('data');
    expect($places)->not->toBeEmpty();
    expect($places[0]['place_id'])->toBe('kalpitiya-1242089');
});

test('public users can fetch weather for a place_id', function () {
    Http::fake([
        'https://www.meteosource.com/api/v1/free/point*' => Http::response([
            'lat' => '8.22873N',
            'lon' => '79.75988E',
            'elevation' => 10,
            'timezone' => 'Asia/Colombo',
            'current' => [
                'icon' => 'overcast',
                'icon_num' => 7,
                'summary' => 'Overcast',
                'temperature' => 28.5,
                'wind' => [
                    'speed' => 9.2,
                    'angle' => 220,
                    'dir' => 'SW',
                ],
                'precipitation' => [
                    'total' => 0,
                    'type' => 'none',
                ],
                'cloud_cover' => 90,
            ],
            'hourly' => [
                'data' => [
                    [
                        'date' => '2026-09-24T14:00:00',
                        'weather' => 'overcast',
                        'icon' => 7,
                        'summary' => 'Overcast',
                        'temperature' => 28.5,
                        'wind' => ['speed' => 9.2, 'dir' => 'SW', 'angle' => 220],
                        'precipitation' => ['total' => 0],
                    ],
                ],
            ],
            'daily' => [
                'data' => [
                    [
                        'day' => '2026-09-24',
                        'weather' => 'overcast',
                        'icon' => 7,
                        'summary' => 'Cloudy and windy',
                        'all_day' => [
                            'temperature' => 28,
                            'temperature_min' => 27,
                            'temperature_max' => 29,
                            'wind' => ['speed' => 9.0, 'dir' => 'SW'],
                            'precipitation' => ['total' => 0],
                        ],
                    ],
                ],
            ],
        ], 200),
    ]);

    Cache::flush();

    $response = $this->getJson('/api/weather?place_id=kalpitiya-1242089');

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'data' => [
                'place_id',
                'location',
                'timezone',
                'current' => [
                    'temperature',
                    'feels_like',
                    'summary',
                    'wind_speed',
                    'wind_speed_knots',
                    'wind_dir',
                    'kitesurf_rating',
                    'kitesurf_condition',
                ],
                'hourly',
                'daily',
            ],
        ]);

    $data = $response->json('data');
    expect($data['current']['temperature'])->toBe(28.5);
    expect($data['current']['wind_speed_knots'])->toBeGreaterThan(15);
    expect($data['current']['kitesurf_rating'])->toBe('Optimal');
});

test('weather endpoint gracefully handles API failure without exposing key', function () {
    Http::fake([
        'https://www.meteosource.com/api/v1/free/point*' => Http::response(['detail' => 'Error'], 500),
    ]);

    Cache::flush();

    $response = $this->getJson('/api/weather?place_id=invalid-place-id');

    $response->assertStatus(502)
        ->assertJson([
            'success' => false,
        ]);

    // Ensure API key is never in response body
    $content = $response->getContent();
    expect($content)->not->toContain(config('services.meteosource.key'));
});

test('authenticated client can view weather dashboard page', function () {
    Http::fake([
        'https://www.meteosource.com/api/v1/free/point*' => Http::response([
            'timezone' => 'Asia/Colombo',
            'current' => [
                'icon' => 'overcast',
                'summary' => 'Overcast',
                'temperature' => 28.0,
                'wind' => ['speed' => 8.5, 'dir' => 'SW'],
            ],
            'hourly' => ['data' => []],
            'daily' => ['data' => []],
        ], 200),
    ]);

    $user = User::factory()->create(['role' => 'client']);

    $response = $this->actingAs($user)->get('/client/weather');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('weather/Index'));
});

test('authenticated instructor can view weather dashboard page', function () {
    Http::fake([
        'https://www.meteosource.com/api/v1/free/point*' => Http::response([
            'timezone' => 'Asia/Colombo',
            'current' => [
                'icon' => 'clear',
                'summary' => 'Clear sky',
                'temperature' => 29.0,
                'wind' => ['speed' => 10.0, 'dir' => 'SW'],
            ],
            'hourly' => ['data' => []],
            'daily' => ['data' => []],
        ], 200),
    ]);

    $instructor = User::factory()->create(['role' => 'instructor']);

    $response = $this->actingAs($instructor)->get('/instructor/weather');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('weather/Index'));
});
