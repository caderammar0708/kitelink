<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'action',
        'target_type',
        'target_id',
        'target_name',
        'details',
        'ip_address',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Record an audit action performed by an admin.
     */
    public static function record(
        User $admin,
        string $action,
        Model $target,
        ?string $details = null,
        ?array $meta = []
    ): self {
        $name = null;
        if (isset($target->name)) {
            $name = $target->name;
        } elseif (isset($target->user) && isset($target->user->name)) {
            $name = $target->user->name;
        } elseif (isset($target->id)) {
            $name = '#'.$target->id;
        }

        return self::create([
            'admin_id' => $admin->id,
            'action' => $action,
            'target_type' => class_basename($target),
            'target_id' => $target->getKey(),
            'target_name' => $name,
            'details' => array_merge(['summary' => $details], $meta ?? []),
            'ip_address' => request()->ip(),
        ]);
    }
}
