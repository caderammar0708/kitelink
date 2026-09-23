<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    public function __construct(public Booking $booking) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $studentName = $this->booking->student?->name ?? 'A student';

        return [
            'type' => 'booking',
            'title' => "New Booking Request from {$studentName}",
            'message' => "{$studentName} requested a {$this->booking->lesson_type} for {$this->booking->date} ($".number_format((float) $this->booking->total_price, 2).').',
            'link' => '/instructor/bookings?tab=pending',
            'booking_id' => $this->booking->id,
            'status' => 'pending',
        ];
    }
}
