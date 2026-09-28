<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Instructor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'school_id',
        'bio',
        'certifications',
        'certification_proof',
        'experience_years',
        'location',
        'phone',
        'license_number',
        'languages',
        'hourly_rate',
        'daily_rate',
        'profile_photo',
        'is_freelance',
        'status',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'languages' => 'array',
            'is_active' => 'boolean',
            'is_freelance' => 'boolean',
            'hourly_rate' => 'decimal:2',
            'daily_rate' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(InstructorAvailability::class);
    }

    public function hireRequests(): HasMany
    {
        return $this->hasMany(SchoolHireRequest::class);
    }
}
