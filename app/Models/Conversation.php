<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'participant_one_id',
        'participant_two_id',
        'type',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function participantOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_one_id');
    }

    public function participantTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get the other participant in the conversation.
     */
    public function getOtherParticipant(int $userId): ?User
    {
        if ($this->participant_one_id === $userId) {
            return $this->participantTwo;
        }

        return $this->participantOne;
    }

    /**
     * Scope conversations for a given user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('participant_one_id', $userId)
            ->orWhere('participant_two_id', $userId);
    }
}
