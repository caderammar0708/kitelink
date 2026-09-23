<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingStatusChangedNotification extends Notification
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $status = $this->booking->status;
        $statusLabel = $status === 'confirmed' ? 'Confirmed' : 'Declined';
        $instructorName = $this->booking->instructor?->user?->name ?? 'Your instructor';

        return [
            'type' => 'booking',
            'title' => "Booking {$statusLabel}",
            'message' => "{$instructorName} has marked your booking on {$this->booking->date} as {$status}.",
            'link' => '/client/bookings?highlight='.$this->booking->id,
            'booking_id' => $this->booking->id,
            'status' => $status,
        ];
    }
}
