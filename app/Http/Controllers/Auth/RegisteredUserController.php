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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
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
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'nullable|in:client,instructor,school',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ];

        if (Schema::hasColumn('users', 'role')) {
            $userData['role'] = $request->role ?? 'client';
        }

        $user = User::create($userData);

        if (($request->role ?? null) === 'instructor') {
            if (Schema::hasTable('instructors')) {
                Instructor::create(['user_id' => $user->id]);
            } else {
                Log::warning('Attempted to create instructor record but instructors table does not exist.', ['user_id' => $user->id]);
            }
        } elseif (($request->role ?? null) === 'school') {
            if (Schema::hasTable('schools')) {
                School::firstOrCreate(
                    ['name' => $user->name],
                    ['slug' => Str::slug($user->name)]
                );
            }
        }

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
