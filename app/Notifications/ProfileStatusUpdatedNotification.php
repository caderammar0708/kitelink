<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProfileStatusUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $status, // 'approved', 'rejected', 'info_requested', 'suspended', 'reactivated'
        public ?string $reason = null,
        public string $role = 'instructor'
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $title = match ($this->status) {
            'approved' => 'Your profile was approved',
            'rejected' => 'Rejected: Profile requires revision',
            'info_requested' => 'Action required: More information needed',
            'suspended' => 'Account suspended',
            'reactivated' => 'Account reactivated',
            default => 'Profile status updated',
        };

        $message = match ($this->status) {
            'approved' => 'Congratulations! Your profile has been reviewed and approved by KiteLink administration. Your listing is now live!',
            'rejected' => 'Rejected: '.($this->reason ?? 'Profile does not meet platform requirements. You can edit and resubmit.'),
            'info_requested' => 'Admin requested more information: '.($this->reason ?? 'Please check your profile details and certifications.'),
            'suspended' => 'Your account has been suspended: '.($this->reason ?? 'Please contact platform administration.'),
            'reactivated' => 'Your account has been reactivated. You can now access your dashboard and bookings.',
            default => 'Your profile status is now '.$this->status.'.',
        };

        $link = match ($this->status) {
            'approved' => $this->role === 'school' ? '/school/dashboard' : '/instructor/dashboard',
            'rejected', 'info_requested' => $this->role === 'school' ? '/school/profile' : '/instructor/profile',
            default => '/dashboard',
        };

        return [
            'type' => 'account_status',
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'status' => $this->status,
            'reason' => $this->reason,
            'role' => $this->role,
        ];
    }
}
