<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Booking;
use App\Models\Instructor;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();
        $instructorUser = User::where('role', 'instructor')->first();
        $schoolUser = User::where('role', 'school')->first();
        $clientUser = User::where('role', 'client')->first();

        $booking = Booking::first();
        $instructor = Instructor::first();
        $school = School::first();

        $samples = [
            [
                'user_id' => $admin?->id,
                'user_name' => $admin?->name ?? 'Admin User',
                'user_role' => 'admin',
                'event' => 'login',
                'auditable_type' => User::class,
                'auditable_id' => $admin?->id,
                'description' => "Admin {$admin?->name} logged in from office network",
                'old_values' => null,
                'new_values' => ['guard' => 'web', 'login_type' => 'password'],
                'ip_address' => '192.168.1.105',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36',
                'url' => 'http://localhost:8800/login',
                'method' => 'POST',
                'created_at' => Carbon::now()->subMinutes(12),
            ],
            [
                'user_id' => null,
                'user_name' => 'hacker@suspicious-domain.com',
                'user_role' => 'guest',
                'event' => 'login_failed',
                'auditable_type' => User::class,
                'auditable_id' => null,
                'description' => 'Failed login attempt for email: hacker@suspicious-domain.com (invalid credentials)',
                'old_values' => null,
                'new_values' => ['attempted_email' => 'hacker@suspicious-domain.com', 'reason' => 'invalid_credentials'],
                'ip_address' => '45.133.1.89',
                'user_agent' => 'Python-requests/2.31.0',
                'url' => 'http://localhost:8800/login',
                'method' => 'POST',
                'created_at' => Carbon::now()->subMinutes(45),
            ],
            [
                'user_id' => null,
                'user_name' => 'hacker@suspicious-domain.com',
                'user_role' => 'guest',
                'event' => 'login_failed',
                'auditable_type' => User::class,
                'auditable_id' => null,
                'description' => 'Repeated failed login attempt #2 for email: hacker@suspicious-domain.com',
                'old_values' => null,
                'new_values' => ['attempted_email' => 'hacker@suspicious-domain.com', 'reason' => 'invalid_credentials'],
                'ip_address' => '45.133.1.89',
                'user_agent' => 'Python-requests/2.31.0',
                'url' => 'http://localhost:8800/login',
                'method' => 'POST',
                'created_at' => Carbon::now()->subMinutes(43),
            ],
            [
                'user_id' => null,
                'user_name' => 'hacker@suspicious-domain.com',
                'user_role' => 'guest',
                'event' => 'login_failed',
                'auditable_type' => User::class,
                'auditable_id' => null,
                'description' => 'Repeated failed login attempt #3 for email: hacker@suspicious-domain.com',
                'old_values' => null,
                'new_values' => ['attempted_email' => 'hacker@suspicious-domain.com', 'reason' => 'invalid_credentials'],
                'ip_address' => '45.133.1.89',
                'user_agent' => 'Python-requests/2.31.0',
                'url' => 'http://localhost:8800/login',
                'method' => 'POST',
                'created_at' => Carbon::now()->subMinutes(41),
            ],
            [
                'user_id' => $admin?->id,
                'user_name' => $admin?->name ?? 'Admin User',
                'user_role' => 'admin',
                'event' => 'approved',
                'auditable_type' => Instructor::class,
                'auditable_id' => $instructor?->id ?? 1,
                'description' => 'Admin approved instructor profile application after IKO certification verification',
                'old_values' => ['status' => 'pending', 'is_active' => false],
                'new_values' => ['status' => 'approved', 'is_active' => true, 'reviewed_at' => Carbon::now()->subHours(2)->toIso8601String()],
                'ip_address' => '192.168.1.105',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
                'url' => 'http://localhost:8800/admin/approvals/instructors/1/approve',
                'method' => 'POST',
                'created_at' => Carbon::now()->subHours(2),
            ],
            [
                'user_id' => $clientUser?->id,
                'user_name' => $clientUser?->name ?? 'Client User',
                'user_role' => 'client',
                'event' => 'updated',
                'auditable_type' => Booking::class,
                'auditable_id' => $booking?->id ?? 1,
                'description' => 'Client updated booking lesson date and notes',
                'old_values' => ['date' => Carbon::now()->addDays(3)->toDateString(), 'notes' => 'Beginner lesson requested'],
                'old_values' => ['date' => Carbon::now()->addDays(3)->toDateString(), 'notes' => 'Beginner lesson requested'],
                'new_values' => ['date' => Carbon::now()->addDays(5)->toDateString(), 'notes' => 'Beginner lesson requested - changed to Friday afternoon due to wind forecast'],
                'ip_address' => '172.56.21.9',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
                'url' => 'http://localhost:8800/client/bookings/1',
                'method' => 'POST',
                'created_at' => Carbon::now()->subHours(6),
            ],
            [
                'user_id' => $admin?->id,
                'user_name' => $admin?->name ?? 'Admin User',
                'user_role' => 'admin',
                'event' => 'settings_changed',
                'auditable_type' => User::class,
                'auditable_id' => $admin?->id,
                'description' => 'Admin updated platform commission percentage and registration rules',
                'old_values' => ['booking_commission_percentage' => '10', 'require_instructor_approval' => true],
                'new_values' => ['booking_commission_percentage' => '12.5', 'require_instructor_approval' => true],
                'ip_address' => '192.168.1.105',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
                'url' => 'http://localhost:8800/admin/settings',
                'method' => 'POST',
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'user_id' => $instructorUser?->id,
                'user_name' => $instructorUser?->name ?? 'Instructor User',
                'user_role' => 'instructor',
                'event' => 'password_changed',
                'auditable_type' => User::class,
                'auditable_id' => $instructorUser?->id ?? 2,
                'description' => 'Instructor updated account security password',
                'old_values' => null,
                'new_values' => ['password' => '[REDACTED]'],
                'ip_address' => '82.165.197.1',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
                'url' => 'http://localhost:8800/instructor/settings/password',
                'method' => 'POST',
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'user_id' => $schoolUser?->id,
                'user_name' => $schoolUser?->name ?? 'School Owner',
                'user_role' => 'school',
                'event' => 'login',
                'auditable_type' => User::class,
                'auditable_id' => $schoolUser?->id,
                'description' => "School manager {$schoolUser?->name} logged in",
                'old_values' => null,
                'new_values' => ['guard' => 'web'],
                'ip_address' => '185.220.101.5',
                'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36',
                'url' => 'http://localhost:8800/login',
                'method' => 'POST',
                'created_at' => Carbon::now()->subDays(12),
            ],
            [
                'user_id' => $admin?->id,
                'user_name' => $admin?->name ?? 'Admin User',
                'user_role' => 'admin',
                'event' => 'suspended',
                'auditable_type' => User::class,
                'auditable_id' => 999,
                'description' => 'Admin suspended fraudulent user account: Repeated terms of service violations',
                'old_values' => ['is_suspended' => false],
                'new_values' => ['is_suspended' => true, 'reason' => 'Repeated terms of service violations'],
                'ip_address' => '192.168.1.105',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36',
                'url' => 'http://localhost:8800/admin/clients/999/suspend',
                'method' => 'POST',
                'created_at' => Carbon::now()->subDays(25),
            ],
        ];

        foreach ($samples as $sample) {
            AuditLog::create($sample);
        }
    }
}
