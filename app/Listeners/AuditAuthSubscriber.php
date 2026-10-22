<?php

namespace App\Listeners;

use App\Models\AuditLog;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Events\Dispatcher;

class AuditAuthSubscriber
{
    /**
     * Handle user login.
     */
    public function handleLogin(Login $event): void
    {
        try {
            $user = $event->user;
            AuditLog::recordEvent(
                user: $user,
                event: 'login',
                auditable: $user,
                description: "User {$user->name} logged in successfully",
                oldValues: null,
                newValues: ['guard' => $event->guard ?? 'web']
            );
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Handle user logout.
     */
    public function handleLogout(Logout $event): void
    {
        try {
            $user = $event->user;
            if ($user) {
                AuditLog::recordEvent(
                    user: $user,
                    event: 'logout',
                    auditable: $user,
                    description: "User {$user->name} logged out"
                );
            }
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Handle failed login attempt.
     */
    public function handleFailed(Failed $event): void
    {
        try {
            $email = $event->credentials['email'] ?? 'unknown';
            $user = $event->user;

            AuditLog::recordEvent(
                user: $user,
                event: 'login_failed',
                auditable: $user,
                description: "Failed login attempt for email: {$email}",
                oldValues: null,
                newValues: [
                    'attempted_email' => $email,
                    'guard' => $event->guard ?? 'web',
                ],
                userName: $user?->name ?? $email,
                userRole: $user?->role ?? 'guest'
            );
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Handle password reset event.
     */
    public function handlePasswordReset(PasswordReset $event): void
    {
        try {
            $user = $event->user;
            AuditLog::recordEvent(
                user: $user,
                event: 'password_changed',
                auditable: $user,
                description: "Password reset for user {$user->name}"
            );
        } catch (\Throwable $e) {
            report($e);
        }
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'handleLogin',
            Logout::class => 'handleLogout',
            Failed::class => 'handleFailed',
            PasswordReset::class => 'handlePasswordReset',
        ];
    }
}
