<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'registration_number',
        'contact_name',
        'location',
        'description',
        'facilities',
        'gear_list',
        'photos',
        'certifications',
        'status',
        'rejection_reason',
        'reviewed_by',
        'reviewed_at',
        'certification_proof',
        'logo',
        'phone',
        'website',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            'gear_list' => 'array',
            'photos' => 'array',
            'is_active' => 'boolean',
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

    public function instructors(): HasMany
    {
        return $this->hasMany(Instructor::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(SchoolPackage::class);
    }
}
