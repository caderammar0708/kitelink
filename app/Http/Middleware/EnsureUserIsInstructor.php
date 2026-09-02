<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsInstructor
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()?->role !== 'instructor') {
            abort(403);
        }

        return $next($request);
    }
}
