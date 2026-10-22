<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

trait Auditable
{
    /**
     * Disable auditing temporarily.
     */
    public static bool $auditingDisabled = false;

    /**
     * Boot the auditable trait for a model.
     */
    public static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            if (static::$auditingDisabled) {
                return;
            }

            try {
                $attributes = $model->getAttributes();
                $sensitiveKeys = config('audit.sensitive_attributes', []);
                $cleanNew = AuditLog::sanitizeAttributes($attributes, $sensitiveKeys);

                $description = static::resolveAuditDescription($model, 'created');

                AuditLog::recordEvent(
                    user: auth()->user(),
                    event: 'created',
                    auditable: $model,
                    description: $description,
                    oldValues: null,
                    newValues: $cleanNew
                );
            } catch (\Throwable $e) {
                report($e);
            }
        });

        static::updated(function (Model $model) {
            if (static::$auditingDisabled) {
                return;
            }

            try {
                $changes = $model->getChanges();
                // Exclude timestamps and internal token/hash
                unset($changes['updated_at']);

                $sensitiveKeys = config('audit.sensitive_attributes', []);

                // Check if password specifically changed
                $passwordChanged = isset($changes['password']);

                $cleanChanges = AuditLog::sanitizeAttributes($changes, $sensitiveKeys);
                if (empty($cleanChanges) && ! $passwordChanged) {
                    return;
                }

                $original = $model->getOriginal();
                $old = array_intersect_key($original, $changes);
                $cleanOld = AuditLog::sanitizeAttributes($old, $sensitiveKeys);

                $event = $passwordChanged && count($changes) === 1 ? 'password_changed' : 'updated';
                $description = $passwordChanged && count($changes) === 1
                    ? 'Password updated for '.class_basename($model)." #{$model->getKey()}"
                    : static::resolveAuditDescription($model, 'updated', array_keys($cleanChanges));

                AuditLog::recordEvent(
                    user: auth()->user(),
                    event: $event,
                    auditable: $model,
                    description: $description,
                    oldValues: $cleanOld,
                    newValues: $cleanChanges
                );
            } catch (\Throwable $e) {
                report($e);
            }
        });

        static::deleted(function (Model $model) {
            if (static::$auditingDisabled) {
                return;
            }

            try {
                $sensitiveKeys = config('audit.sensitive_attributes', []);
                $cleanOld = AuditLog::sanitizeAttributes($model->getAttributes(), $sensitiveKeys);

                $description = static::resolveAuditDescription($model, 'deleted');

                AuditLog::recordEvent(
                    user: auth()->user(),
                    event: 'deleted',
                    auditable: $model,
                    description: $description,
                    oldValues: $cleanOld,
                    newValues: null
                );
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    /**
     * Resolve a human-friendly description for the audit action.
     *
     * @param  list<string>  $changedKeys
     */
    protected static function resolveAuditDescription(Model $model, string $action, array $changedKeys = []): string
    {
        $class = class_basename($model);
        $ident = null;
        if (isset($model->name)) {
            $ident = " \"{$model->name}\"";
        } elseif (isset($model->title)) {
            $ident = " \"{$model->title}\"";
        } elseif (isset($model->user) && isset($model->user->name)) {
            $ident = " for {$model->user->name}";
        } elseif (isset($model->id)) {
            $ident = " #{$model->id}";
        }

        $verb = match ($action) {
            'created' => 'Created',
            'updated' => 'Updated',
            'deleted' => 'Deleted',
            default => ucfirst($action),
        };

        if ($action === 'updated' && ! empty($changedKeys)) {
            $fields = implode(', ', array_slice($changedKeys, 0, 4));
            if (count($changedKeys) > 4) {
                $fields .= ' +'.(count($changedKeys) - 4).' more';
            }

            return "{$verb} {$class}{$ident} ({$fields})";
        }

        return "{$verb} {$class}{$ident}";
    }

    /**
     * Run a callback without recording audits.
     */
    public static function withoutAuditing(callable $callback): mixed
    {
        $previous = static::$auditingDisabled;
        static::$auditingDisabled = true;

        try {
            return $callback();
        } finally {
            static::$auditingDisabled = $previous;
        }
    }
}
