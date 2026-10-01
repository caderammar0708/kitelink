<?php

namespace Database\Seeders;

use App\Models\Instructor;
use App\Models\School;
use App\Models\SchoolPackage;
use Illuminate\Database\Seeder;

class SchoolPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Find the test school record (named 'school' or with user_id) and improve it
        $school = School::where('name', 'school')
            ->orWhere('location', 'like', '%rgvecsx%')
            ->first();

        if (! $school) {
            $school = School::whereNotNull('user_id')->first();
        }

        if (! $school) {
            $school = School::first();
        }

        if (! $school) {
            $school = School::create([
                'name' => 'Kalpitiya Lagoon Kite Center',
                'location' => 'Kalpitiya, Sri Lanka',
                'description' => 'Premier IKO certified kiteboarding center situated right on the world-famous flat-water Kalpitiya Lagoon. We offer structured beginner courses, advanced freestyle coaching, hydrofoil progression, and high-end gear rental packages with dedicated safety boat support.',
                'status' => 'approved',
                'is_active' => true,
            ]);
        }

        $school->update([
            'name' => 'Kalpitiya Lagoon Kite Center',
            'location' => 'Kalpitiya, Sri Lanka',
            'description' => 'Premier IKO certified kiteboarding center situated right on the world-famous flat-water Kalpitiya Lagoon. We offer structured beginner courses, advanced freestyle coaching, hydrofoil progression, and high-end gear rental packages with dedicated safety boat support.',
            'facilities' => [
                'Lagoon Beachfront Access',
                'Gear Storage Lockers',
                'Dedicated Rescue Boat on Standby',
                'Equipment Wash & Dry Facility',
                'High-Pressure Electric Compressor',
                'Hot Showers & Changing Cabins',
                'Kite Shop & Certified Repair Workshop',
                'Beachfront Chill Lounge & Cafe',
                'High-Speed Spot Wi-Fi',
            ],
            'gear_list' => [
                'Core Nexus 3 & GTS Kites (7m – 15m)',
                'Duotone Rebel SLS & Evo Kites',
                'North Atmos Carbon Twintips',
                'Mystic Stealth Harnesses',
                'Bb Talkin 2-Way Radio Helmets',
                'Sabfoil Hydrofoils & Wingfoiling Kits',
            ],
            'certifications' => 'IKO Affiliated Center, VDWS International Academy',
            'contact_name' => 'Dimitri Silva',
            'phone' => '+94 77 123 4567',
            'website' => 'https://kalpitiyakitecenter.com',
            'status' => 'approved',
            'is_active' => true,
            'photos' => [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            ],
            'logo' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
        ]);

        // 2. Attach 2-3 existing instructors to this school's roster
        $instructors = Instructor::with('user')->take(3)->get();
        foreach ($instructors as $instructor) {
            $instructor->update([
                'school_id' => $school->id,
                'location' => 'Kalpitiya, Sri Lanka',
                'status' => 'approved',
                'is_active' => true,
            ]);
        }

        // 3. Create 4 realistic packages for this school
        $packages = [
            [
                'name' => 'Beginner 3-Day Course',
                'type' => 'course',
                'duration_label' => '3 Days',
                'price' => 280.00,
                'description' => 'From zero to confident independent kiter. Covers wind theory, safety systems, body dragging, waterstart technique, and your first upwind rides under supervision.',
                'features' => [
                    'All kites, boards & safety gear included',
                    'IKO Level 1 & 2 international certification',
                    'Max 2 students per dedicated coach',
                    'Safety rescue boat on standby at all times',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Full Day Gear Rental',
                'type' => 'rental',
                'duration_label' => '1 Day',
                'price' => 45.00,
                'description' => 'Unlimited full-day access to current-year high performance kites, boards, and harnesses. Free kite size swaps as the Kalpitiya afternoon thermal kicks in.',
                'features' => [
                    'Current season Core / Duotone kite + twintip board',
                    'Mystic harness + safety leash included',
                    'Beach launch & land assistance from center beach marshals',
                    'Lagoon safety boat rescue backup',
                ],
                'is_active' => true,
            ],
            [
                'name' => '7-Day Intensive Camp',
                'type' => 'camp',
                'duration_label' => '1 Week',
                'price' => 650.00,
                'description' => 'The ultimate immersive kitesurfing week: daily structured coaching, video review sessions, lagoon lodge accommodation, sunset downwinders, and transfers.',
                'features' => [
                    '15+ hours focused coaching with senior IKO coaches',
                    '7 nights shared beachfront lagoon lodge accommodation',
                    'Daily organic breakfast & Saturday seafood BBQ party',
                    'Airport pickup and return transfer from Colombo (CMB)',
                    'Vella Island downwinder safari expedition',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Private 1-on-1 Coaching (2h)',
                'type' => 'private',
                'duration_label' => '2 Hours',
                'price' => 130.00,
                'description' => 'High-focus private session with real-time Bb Talkin two-way radio communication for fast breakthroughs in upwind riding, jumps, kiteloops, or hydrofoil progression.',
                'features' => [
                    'Dedicated 1-on-1 senior IKO instructor',
                    'Bb Talkin 2-way live radio communication helmet',
                    '4K GoPro video playback and post-session breakdown',
                    'Equipment provided or ride your own gear',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkgData) {
            SchoolPackage::updateOrCreate(
                [
                    'school_id' => $school->id,
                    'name' => $pkgData['name'],
                ],
                $pkgData
            );
        }

        // Also ensure school ID 2 (if present) has packages
        $otherSchool = School::where('id', '!=', $school->id)->where('status', 'approved')->first();
        if ($otherSchool) {
            SchoolPackage::updateOrCreate(
                [
                    'school_id' => $otherSchool->id,
                    'name' => 'Lagoon Discovery Course (2 Days)',
                ],
                [
                    'type' => 'course',
                    'duration_label' => '2 Days',
                    'price' => 195.00,
                    'description' => 'Weekend fast-track introduction to kitesurfing on shallow butter-flat water.',
                    'features' => [
                        'Equipment included',
                        'IKO certification card',
                        'Rescue boat standby',
                    ],
                    'is_active' => true,
                ]
            );
        }
    }
}
