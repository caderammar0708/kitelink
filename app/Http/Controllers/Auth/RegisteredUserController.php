<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\School;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/register', [
            'role' => $request->query('role'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $role = $request->input('role', 'client');

        if ($role === 'school') {
            $request->validate([
                'school_name' => 'nullable|string|max:255',
                'name' => 'nullable|string|max:255',
                'registration_number' => 'nullable|string|max:100',
                'contact_name' => 'nullable|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'phone' => 'nullable|string|max:50',
                'location' => 'nullable|string|max:255',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role' => 'required|in:school',
            ]);

            $schoolName = $request->input('school_name') ?: $request->input('name') ?: 'Kite School';
            $contactPerson = $request->input('contact_name') ?: $request->input('name') ?: 'School Admin';

            $user = User::create([
                'name' => $contactPerson,
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'password' => Hash::make($request->input('password')),
                'role' => 'school',
            ]);

            School::create([
                'user_id' => $user->id,
                'name' => $schoolName,
                'slug' => Str::slug($schoolName).'-'.strtolower(Str::random(4)),
                'registration_number' => $request->input('registration_number'),
                'contact_name' => $contactPerson,
                'phone' => $request->input('phone'),
                'location' => $request->input('location'),
                'status' => 'pending',
                'is_active' => true,
            ]);
        } elseif ($role === 'instructor') {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'phone' => 'nullable|string|max:50',
                'license_number' => 'required|string|max:100',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role' => 'required|in:instructor',
            ]);

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'password' => Hash::make($request->input('password')),
                'role' => 'instructor',
            ]);

            Instructor::create([
                'user_id' => $user->id,
                'phone' => $request->input('phone'),
                'license_number' => $request->input('license_number'),
                'status' => 'pending',
                'is_freelance' => true,
                'is_active' => true,
            ]);
        } else {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role' => 'nullable|in:client',
            ]);

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'role' => 'client',
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        if (in_array($user->role, ['instructor', 'school'], true)) {
            return redirect()->route('verification.pending');
        }

        return to_route('dashboard');
    }
}
