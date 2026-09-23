<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class ReviewNotification extends Notification
{
    use Queueable;

    public function __construct(public Review $review) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $studentName = $this->review->student?->name ?? 'A client';
        $stars = str_repeat('★', $this->review->rating);
        $snippet = $this->review->comment ? '"'.Str::limit($this->review->comment, 60).'"' : "Rated {$this->review->rating}/5 stars";

        return [
            'type' => 'review',
            'title' => "{$this->review->rating}-Star Review from {$studentName}",
            'message' => "{$studentName} ({$stars}): {$snippet}",
            'link' => '/instructor/reviews',
            'review_id' => $this->review->id,
            'rating' => $this->review->rating,
        ];
    }
}
