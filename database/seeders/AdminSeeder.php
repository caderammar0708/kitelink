<?php

namespace Database\Seeders;

use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminPassword = env('ADMIN_DEFAULT_PASSWORD', env('ADMIN_PASSWORD', 'Admin#KiteLink2026!Secure'));

        User::firstOrCreate(
            ['email' => 'admin@kitelink.com'],
            [
                'name' => 'KiteLink Admin',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'email_verified_at' => now(),
                'notification_sound_enabled' => true,
            ]
        );

        // Seed default platform settings if missing
        PlatformSetting::set('platform_name', 'KiteLink', 'general');
        PlatformSetting::set('support_email', 'support@kitelink.com', 'general');
        PlatformSetting::set('contact_phone', '+1 (555) 019-2834', 'general');
        PlatformSetting::set('require_instructor_approval', '1', 'approval');
        PlatformSetting::set('require_school_approval', '1', 'approval');
        PlatformSetting::set('booking_commission_percentage', '10', 'financial');
        PlatformSetting::set('allow_public_registration', '1', 'general');
    }
}
