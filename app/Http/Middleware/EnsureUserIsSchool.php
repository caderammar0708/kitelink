<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsSchool
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'school') {
            abort(403, 'Unauthorized access.');
        }

        if ($user->is_suspended || $user->school?->status === 'suspended') {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'Your account has been suspended by an administrator.',
            ]);
        }

        $school = $user->school;
        if (! $school || $school->status !== 'approved') {
            if ($request->routeIs('school.dashboard')) {
                return $next($request);
            }

            return redirect()->route('school.dashboard');
        }

        return $next($request);
    }
}
