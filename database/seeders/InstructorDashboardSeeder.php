<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Instructor;
use App\Models\InstructorAvailability;
use App\Models\Message;
use App\Models\Review;
use App\Models\School;
use App\Models\SchoolHireRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InstructorDashboardSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create or Find Main Instructor
        $instructorUser = User::firstOrCreate(
            ['email' => 'instructor@kitelink.com'],
            [
                'name' => 'Alex Henderson',
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'profile_picture' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
            ]
        );

        // Ensure user role is instructor
        $instructorUser->update(['role' => 'instructor']);

        // 2. Create Kite Schools
        $school1 = School::firstOrCreate(
            ['slug' => 'kalpitiya-kite-center'],
            [
                'name' => 'Kalpitiya Lagoon Kite Camp',
                'location' => 'Kalpitiya, Sri Lanka',
                'description' => 'Premier IKO certified kite school located directly on the flat-water Kalpitiya lagoon.',
            ]
        );

        $school2 = School::firstOrCreate(
            ['slug' => 'tarifa-wind-academy'],
            [
                'name' => 'Tarifa Wind Academy',
                'location' => 'Tarifa, Spain',
                'description' => 'High-performance kitesurfing and wing foil center with boat rescue service.',
            ]
        );

        // 3. Create Main Instructor Profile
        $instructor = Instructor::updateOrCreate(
            ['user_id' => $instructorUser->id],
            [
                'school_id' => $school1->id,
                'bio' => 'IKO Level 2 Senior Instructor with 7+ years coaching in Sri Lanka, Tarifa, and Egypt. Specializing in zero-to-hero beginner courses, jump progression, and unhooked freestyle.',
                'certifications' => 'IKO Level 2 Senior • VDWS Pro',
                'experience_years' => 7,
                'location' => 'Kalpitiya Lagoon, Sri Lanka',
                'languages' => ['English', 'German', 'French'],
                'hourly_rate' => 65.00,
                'daily_rate' => 240.00,
                'profile_photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                'is_freelance' => true,
                'status' => 'approved',
                'is_active' => true,
            ]
        );

        // 4. Create Students (Clients)
        $student1 = User::firstOrCreate(
            ['email' => 'emma.watson@example.com'],
            [
                'name' => 'Emma Watson',
                'password' => Hash::make('password'),
                'role' => 'client',
                'profile_picture' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
            ]
        );

        $student2 = User::firstOrCreate(
            ['email' => 'marcus.aurelius@example.com'],
            [
                'name' => 'Marcus Aurelius',
                'password' => Hash::make('password'),
                'role' => 'client',
                'profile_picture' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            ]
        );

        $student3 = User::firstOrCreate(
            ['email' => 'sophia.schmidt@example.com'],
            [
                'name' => 'Sophia Schmidt',
                'password' => Hash::make('password'),
                'role' => 'client',
                'profile_picture' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            ]
        );

        // 5. Create Bookings (Pending, Upcoming Confirmed, Completed)
        $today = now()->toDateString();
        $tomorrow = now()->addDays(2)->toDateString();
        $nextWeek = now()->addDays(5)->toDateString();
        $pastDate1 = now()->subDays(4)->toDateString();
        $pastDate2 = now()->subDays(10)->toDateString();

        $booking1 = Booking::firstOrCreate(
            ['student_id' => $student1->id, 'instructor_id' => $instructor->id, 'date' => $tomorrow],
            [
                'time' => '14:00 - 16:00',
                'students_count' => 1,
                'lesson_type' => 'Waterstart & Upwind Riding',
                'total_price' => 130.00,
                'status' => 'confirmed',
                'notes' => 'Rented 10m kite and board. Looking to get consistent on upwind tacks.',
            ]
        );

        $booking2 = Booking::firstOrCreate(
            ['student_id' => $student2->id, 'instructor_id' => $instructor->id, 'date' => $nextWeek],
            [
                'time' => '09:00 - 12:00',
                'students_count' => 2,
                'lesson_type' => 'Beginner Zero-to-Hero',
                'total_price' => 195.00,
                'status' => 'pending',
                'notes' => 'First time kitesurfing for me and my partner. Bringing our own wetsuits.',
            ]
        );

        $booking3 = Booking::firstOrCreate(
            ['student_id' => $student3->id, 'instructor_id' => $instructor->id, 'date' => $pastDate1],
            [
                'time' => '13:00 - 15:00',
                'students_count' => 1,
                'lesson_type' => 'Jump & Transition Coaching',
                'total_price' => 130.00,
                'status' => 'completed',
                'notes' => 'Great wind session in the lagoon.',
            ]
        );

        $booking4 = Booking::firstOrCreate(
            ['student_id' => $student1->id, 'instructor_id' => $instructor->id, 'date' => $pastDate2],
            [
                'time' => '10:00 - 12:00',
                'students_count' => 1,
                'lesson_type' => 'Body Dragging & Board Recovery',
                'total_price' => 130.00,
                'status' => 'completed',
                'notes' => 'Completed session safely.',
            ]
        );

        // 6. Create Reviews
        Review::firstOrCreate(
            ['booking_id' => $booking3->id],
            [
                'student_id' => $student3->id,
                'instructor_id' => $instructor->id,
                'rating' => 5,
                'comment' => 'Alex is by far the most patient and communicative coach I have had. In just 2 hours he corrected my kite position during takeoffs and I landed my first clear 5-meter jumps!',
                'instructor_reply' => 'Thanks so much Sophia! You were sending it with great kite control. See you on the water again soon!',
                'replied_at' => now()->subDays(2),
            ]
        );

        Review::firstOrCreate(
            ['booking_id' => $booking4->id],
            [
                'student_id' => $student1->id,
                'instructor_id' => $instructor->id,
                'rating' => 5,
                'comment' => 'Super professional. Made me feel totally confident with deep-water self-rescue and safety systems. 10/10 recommend.',
                'replied_at' => null,
            ]
        );

        // 7. Create Conversations & Messages
        $conv1 = Conversation::firstOrCreate(
            [
                'participant_one_id' => $instructorUser->id,
                'participant_two_id' => $student1->id,
            ],
            [
                'type' => 'client',
                'last_message_at' => now(),
            ]
        );

        Message::firstOrCreate(
            ['conversation_id' => $conv1->id, 'sender_id' => $student1->id, 'body' => 'Hi Alex! Excited for our session tomorrow. What kite size should we rig?'],
            ['created_at' => now()->subHours(3)]
        );

        Message::firstOrCreate(
            ['conversation_id' => $conv1->id, 'sender_id' => $instructorUser->id, 'body' => 'Hey Emma! Forecast looks solid at 20-22 knots. We will rig 9m and 10m. Meet at Donkey Point!'],
            ['created_at' => now()->subHours(2)]
        );

        // School conversation
        $schoolManager = User::firstOrCreate(
            ['email' => 'manager@tarifa-wind.com'],
            [
                'name' => 'Tarifa Wind Academy Manager',
                'password' => Hash::make('password'),
                'role' => 'school',
                'profile_picture' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
            ]
        );

        $conv2 = Conversation::firstOrCreate(
            [
                'participant_one_id' => $instructorUser->id,
                'participant_two_id' => $schoolManager->id,
            ],
            [
                'type' => 'school',
                'last_message_at' => now()->subDay(),
            ]
        );

        Message::firstOrCreate(
            ['conversation_id' => $conv2->id, 'sender_id' => $schoolManager->id, 'body' => 'Hello Alex, we sent you an offer for our July European summer kite camp in Tarifa. Check out the hire request tab!'],
            ['created_at' => now()->subDay()]
        );

        // 8. Create School Hire Requests
        SchoolHireRequest::firstOrCreate(
            [
                'school_id' => $school2->id,
                'instructor_id' => $instructor->id,
                'proposed_start' => now()->addMonths(1)->startOfMonth()->toDateString(),
            ],
            [
                'proposed_end' => now()->addMonths(2)->endOfMonth()->toDateString(),
                'proposed_rate' => 220.00,
                'location' => 'Los Lances Beach, Tarifa, Spain',
                'message' => 'We need 2 senior IKO instructors for our high season youth & adult camps. Daily rate includes shared beachfront apartment and school vehicle.',
                'status' => 'pending',
            ]
        );

        // 9. Create Instructor Availabilities for the Month
        for ($i = 1; $i <= 20; $i += 2) {
            $date = now()->startOfMonth()->addDays($i)->toDateString();
            InstructorAvailability::firstOrCreate(
                [
                    'instructor_id' => $instructor->id,
                    'date' => $date,
                    'start_time' => '08:00',
                ],
                [
                    'end_time' => '18:00',
                    'is_available' => true,
                ]
            );
        }

        // 10. Create Other Peer Instructors for Browse Network
        $peer1User = User::firstOrCreate(
            ['email' => 'marco.rossi@example.com'],
            [
                'name' => 'Marco Rossi',
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'profile_picture' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
            ]
        );

        Instructor::updateOrCreate(
            ['user_id' => $peer1User->id],
            [
                'bio' => 'VDWS Master Instructor. 10 years experience in Tarifa and Sardinia wave spots.',
                'certifications' => 'VDWS Master • Foil Specialist',
                'experience_years' => 10,
                'location' => 'Tarifa, Spain',
                'languages' => ['Italian', 'Spanish', 'English'],
                'hourly_rate' => 80.00,
                'daily_rate' => 300.00,
                'profile_photo' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
                'is_freelance' => true,
                'status' => 'approved',
                'is_active' => true,
            ]
        );

        $peer2User = User::firstOrCreate(
            ['email' => 'sarah.connor@example.com'],
            [
                'name' => 'Sarah Connor',
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'profile_picture' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
            ]
        );

        Instructor::updateOrCreate(
            ['user_id' => $peer2User->id],
            [
                'bio' => 'IKO Coach & Big Air athlete. Coaching downwinders and megaloops in Brazil and Sri Lanka.',
                'certifications' => 'IKO Level 2 • BKSA Pro',
                'experience_years' => 6,
                'location' => 'Cumbuco, Brazil',
                'languages' => ['English', 'Portuguese'],
                'hourly_rate' => 70.00,
                'daily_rate' => 260.00,
                'profile_photo' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
                'is_freelance' => true,
                'status' => 'approved',
                'is_active' => true,
            ]
        );

        // 11. Create Notifications
        DB::table('notifications')->insertOrIgnore([
            [
                'id' => (string) Str::uuid(),
                'type' => 'App\\Notifications\\NewBookingNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $instructorUser->id,
                'data' => json_encode([
                    'type' => 'booking',
                    'title' => 'New Booking Request from Marcus Aurelius',
                    'message' => 'Marcus requested a 2-person Beginner Zero-to-Hero lesson for next week ($195.00).',
                    'link' => '/instructor/bookings?tab=pending',
                ]),
                'read_at' => null,
                'created_at' => now()->subHours(4),
                'updated_at' => now()->subHours(4),
            ],
            [
                'id' => (string) Str::uuid(),
                'type' => 'App\\Notifications\\HireOfferNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $instructorUser->id,
                'data' => json_encode([
                    'type' => 'hire_request',
                    'title' => 'Contract Offer from Tarifa Wind Academy',
                    'message' => 'Tarifa Wind Academy offered $220/day for European summer coaching camp.',
                    'link' => '/instructor/hire-requests',
                ]),
                'read_at' => null,
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'id' => (string) Str::uuid(),
                'type' => 'App\\Notifications\\ReviewNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $instructorUser->id,
                'data' => json_encode([
                    'type' => 'review',
                    'title' => '5-Star Review from Sophia Schmidt',
                    'message' => 'Sophia left you a 5-star rating: "Alex is by far the most patient coach..."',
                    'link' => '/instructor/reviews',
                ]),
                'read_at' => now()->subDays(2),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ]);
    }
}
