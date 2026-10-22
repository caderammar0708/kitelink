<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    use HasFactory;

    protected $table = 'audit_logs';

    /**
     * Whether pruning is currently enabled.
     */
    public static bool $allowPruning = false;

    protected $fillable = [
        'user_id',
        'user_name',
        'user_role',
        'event',
        'auditable_type',
        'auditable_id',
        'description',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'url',
        'method',
        // Legacy fields for backward compatibility
        'admin_id',
        'action',
        'target_type',
        'target_id',
        'target_name',
        'details',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'details' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Audit logs are append-only. Prevent updates and ad-hoc deletes.
     */
    protected static function booted(): void
    {
        static::updating(function () {
            return false;
        });

        static::deleting(function () {
            if (! static::$allowPruning) {
                return false;
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Legacy relationship alias for AdminAction compatibility.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Safely record an audit log entry.
     */
    public static function recordEvent(
        ?User $user,
        string $event,
        ?Model $auditable = null,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $userName = null,
        ?string $userRole = null
    ): ?self {
        try {
            $req = request();
            $resolvedUserId = $user?->id ?? auth()->id();
            $resolvedUser = $user ?? auth()->user();

            $name = $userName ?? $resolvedUser?->name ?? 'Guest';
            $role = $userRole ?? $resolvedUser?->role ?? 'guest';

            $targetName = null;
            if ($auditable) {
                if (isset($auditable->name)) {
                    $targetName = $auditable->name;
                } elseif (isset($auditable->user) && isset($auditable->user->name)) {
                    $targetName = $auditable->user->name;
                } elseif (isset($auditable->id)) {
                    $targetName = '#'.$auditable->id;
                }
            }

            // Sensitive fields mask/omission
            $sensitiveKeys = config('audit.sensitive_attributes', [
                'password', 'remember_token', 'token', 'access_token', 'api_key', 'secret',
                'stripe_id', 'card_number', 'card_last_four', 'cvv', 'two_factor_secret',
            ]);

            $cleanOld = $oldValues ? self::sanitizeAttributes($oldValues, $sensitiveKeys) : null;
            $cleanNew = $newValues ? self::sanitizeAttributes($newValues, $sensitiveKeys) : null;

            return self::create([
                'user_id' => $resolvedUserId,
                'user_name' => $name,
                'user_role' => $role,
                'event' => $event,
                'auditable_type' => $auditable ? get_class($auditable) : null,
                'auditable_id' => $auditable?->getKey(),
                'description' => $description,
                'old_values' => $cleanOld,
                'new_values' => $cleanNew,
                'ip_address' => $req?->ip() ?? '127.0.0.1',
                'user_agent' => $req?->userAgent(),
                'url' => $req?->fullUrl(),
                'method' => $req?->method() ?? 'CLI',
                // Legacy fields
                'admin_id' => $resolvedUserId,
                'action' => $event,
                'target_type' => $auditable ? class_basename($auditable) : null,
                'target_id' => $auditable?->getKey(),
                'target_name' => $targetName,
                'details' => $cleanNew ?? (['summary' => $description]),
            ]);
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    /**
     * Sanitize array values to omit sensitive fields.
     *
     * @param  array<string, mixed>  $attributes
     * @param  list<string>  $sensitiveKeys
     * @return array<string, mixed>
     */
    public static function sanitizeAttributes(array $attributes, array $sensitiveKeys): array
    {
        $sanitized = [];
        foreach ($attributes as $key => $value) {
            $lowerKey = strtolower($key);
            $isSensitive = false;
            foreach ($sensitiveKeys as $sensitive) {
                if ($lowerKey === $sensitive || str_contains($lowerKey, 'password') || str_contains($lowerKey, 'token') || str_contains($lowerKey, 'secret')) {
                    $isSensitive = true;
                    break;
                }
            }

            if (! $isSensitive) {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
