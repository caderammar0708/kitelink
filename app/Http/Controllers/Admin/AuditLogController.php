<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs with filtering and analytics.
     */
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'all'); // 'all' or 'logins'
        $search = $request->input('search', '');
        $role = $request->input('role', 'all');
        $event = $request->input('event', 'all');
        $modelType = $request->input('model_type', 'all');
        $preset = $request->input('preset', 'all'); // 'today', '7d', '30d', 'all', 'custom'
        $dateFrom = $request->input('date_from', '');
        $dateTo = $request->input('date_to', '');

        $query = $this->buildFilteredQuery($tab, $search, $role, $event, $modelType, $preset, $dateFrom, $dateTo);

        $logs = $query->latest('created_at')->paginate(20)->withQueryString();

        // Calculate Login Statistics & Security Alerts when viewing logins tab
        $loginStats = null;
        if ($tab === 'logins') {
            $last7Days = Carbon::now()->subDays(7);

            $repeatedFailed = AuditLog::where('event', 'login_failed')
                ->where('created_at', '>=', $last7Days)
                ->selectRaw('ip_address, count(*) as failed_count, max(created_at) as last_attempt_at, max(user_name) as last_attempted_identifier')
                ->groupBy('ip_address')
                ->having('failed_count', '>=', 3)
                ->orderByDesc('failed_count')
                ->limit(10)
                ->get()
                ->map(fn ($item) => [
                    'ip_address' => $item->ip_address,
                    'failed_count' => (int) $item->failed_count,
                    'last_attempt_at' => $item->last_attempt_at,
                    'last_attempted_identifier' => $item->last_attempted_identifier,
                ]);

            $lastLoginPerUser = AuditLog::where('event', 'login')
                ->whereNotNull('user_id')
                ->selectRaw('user_id, max(created_at) as last_login_at, max(user_name) as user_name, max(user_role) as user_role, max(ip_address) as ip_address')
                ->groupBy('user_id')
                ->orderByDesc('last_login_at')
                ->limit(8)
                ->get();

            $totalLogins = AuditLog::where('event', 'login')->count();
            $totalFailed = AuditLog::where('event', 'login_failed')->count();

            $loginStats = [
                'total_logins' => $totalLogins,
                'total_failed' => $totalFailed,
                'repeated_failed' => $repeatedFailed,
                'last_logins' => $lastLoginPerUser,
            ];
        }

        $availableEvents = [
            'login', 'logout', 'login_failed', 'password_changed',
            'created', 'updated', 'deleted',
            'approved', 'rejected', 'request_info',
            'suspended', 'reactivated', 'cancelled', 'settings_changed',
        ];

        $availableModels = [
            'User', 'Instructor', 'School', 'Booking', 'Review',
            'SchoolPackage', 'SchoolHireRequest', 'InstructorAvailability', 'PlatformSetting',
        ];

        return Inertia::render('admin/AuditLogs', [
            'logs' => $logs,
            'filters' => [
                'tab' => $tab,
                'search' => $search,
                'role' => $role,
                'event' => $event,
                'model_type' => $modelType,
                'preset' => $preset,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'loginStats' => $loginStats,
            'availableEvents' => $availableEvents,
            'availableModels' => $availableModels,
            'totalCount' => AuditLog::count(),
        ]);
    }

    /**
     * Export filtered audit logs to CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $tab = $request->input('tab', 'all');
        $search = $request->input('search', '');
        $role = $request->input('role', 'all');
        $event = $request->input('event', 'all');
        $modelType = $request->input('model_type', 'all');
        $preset = $request->input('preset', 'all');
        $dateFrom = $request->input('date_from', '');
        $dateTo = $request->input('date_to', '');

        $query = $this->buildFilteredQuery($tab, $search, $role, $event, $modelType, $preset, $dateFrom, $dateTo);

        $filename = 'audit-logs-'.now()->format('Y-m-d-His').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM for Excel compatibility
            fwrite($handle, "\xEF\xBB\xBF");

            // CSV Columns Header
            fputcsv($handle, [
                'ID',
                'Timestamp',
                'User Name',
                'User Role',
                'Event',
                'Model Type',
                'Model ID',
                'Description',
                'IP Address',
                'Method',
                'URL',
                'User Agent',
                'Old Values',
                'New Values',
            ]);

            $query->latest('created_at')->chunk(200, function ($rows) use ($handle) {
                foreach ($rows as $row) {
                    $modelShort = $row->auditable_type ? class_basename($row->auditable_type) : ($row->target_type ?? '');

                    fputcsv($handle, [
                        $row->id,
                        $row->created_at?->toIso8601String(),
                        $row->user_name ?? 'Guest',
                        $row->user_role ?? 'guest',
                        $row->event,
                        $modelShort,
                        $row->auditable_id ?? $row->target_id ?? '',
                        $row->description ?? '',
                        $row->ip_address ?? '',
                        $row->method ?? '',
                        $row->url ?? '',
                        $row->user_agent ?? '',
                        $row->old_values ? json_encode($row->old_values, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '',
                        $row->new_values ? json_encode($row->new_values, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '',
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Build the filtered Eloquent query based on input parameters.
     */
    protected function buildFilteredQuery(
        string $tab,
        string $search,
        string $role,
        string $event,
        string $modelType,
        string $preset,
        string $dateFrom,
        string $dateTo
    ): Builder {
        $query = AuditLog::query();

        // 1. Tab filter
        if ($tab === 'logins') {
            $query->whereIn('event', ['login', 'logout', 'login_failed', 'password_changed']);
        }

        // 2. Search filter
        if (! empty($search)) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhere('event', 'like', "%{$search}%")
                    ->orWhere('auditable_type', 'like', "%{$search}%");
            });
        }

        // 3. Role filter
        if ($role !== 'all' && ! empty($role)) {
            $query->where('user_role', $role);
        }

        // 4. Event filter
        if ($event !== 'all' && ! empty($event)) {
            $query->where('event', $event);
        }

        // 5. Model filter
        if ($modelType !== 'all' && ! empty($modelType)) {
            $query->where(function (Builder $q) use ($modelType) {
                $q->where('auditable_type', 'like', "%{$modelType}")
                    ->orWhere('target_type', $modelType);
            });
        }

        // 6. Date Presets & Custom Date Range
        $now = Carbon::now();
        if ($preset === 'today') {
            $query->where('created_at', '>=', $now->copy()->startOfDay());
        } elseif ($preset === '7d') {
            $query->where('created_at', '>=', $now->copy()->subDays(7)->startOfDay());
        } elseif ($preset === '30d') {
            $query->where('created_at', '>=', $now->copy()->subDays(30)->startOfDay());
        } elseif ($preset === 'custom') {
            if (! empty($dateFrom)) {
                $query->where('created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
            }
            if (! empty($dateTo)) {
                $query->where('created_at', '<=', Carbon::parse($dateTo)->endOfDay());
            }
        }

        return $query;
    }
}
