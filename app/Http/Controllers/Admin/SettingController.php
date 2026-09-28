<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\PlatformSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display platform settings and admin audit logs.
     */
    public function index(Request $request): Response
    {
        $settings = [
            'platform_name' => PlatformSetting::get('platform_name', 'KiteLink'),
            'support_email' => PlatformSetting::get('support_email', 'support@kitelink.com'),
            'contact_phone' => PlatformSetting::get('contact_phone', '+1 (555) 019-2834'),
            'require_instructor_approval' => PlatformSetting::getBool('require_instructor_approval', true),
            'require_school_approval' => PlatformSetting::getBool('require_school_approval', true),
            'booking_commission_percentage' => (float) PlatformSetting::get('booking_commission_percentage', '10'),
            'allow_public_registration' => PlatformSetting::getBool('allow_public_registration', true),
        ];

        $auditLogs = AdminAction::with('admin:id,name,email,profile_picture')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/Settings', [
            'settings' => $settings,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Update platform settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'platform_name' => ['required', 'string', 'max:100'],
            'support_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'require_instructor_approval' => ['required', 'boolean'],
            'require_school_approval' => ['required', 'boolean'],
            'booking_commission_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
            'allow_public_registration' => ['required', 'boolean'],
        ]);

        foreach ($validated as $key => $value) {
            PlatformSetting::set($key, $value);
        }

        $admin = $request->user();
        AdminAction::record($admin, 'update_settings', $admin, 'Updated platform configuration settings', $validated);

        return back()->with('success', 'Platform settings updated successfully.');
    }
}
