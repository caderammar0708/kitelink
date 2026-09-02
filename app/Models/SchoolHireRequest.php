<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolHireRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'instructor_id',
        'proposed_start',
        'proposed_end',
        'proposed_rate',
        'location',
        'message',
        'status',
        'counter_rate',
        'counter_message',
    ];

    protected function casts(): array
    {
        return [
            'proposed_start' => 'date',
            'proposed_end' => 'date',
            'proposed_rate' => 'decimal:2',
            'counter_rate' => 'decimal:2',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }
}
