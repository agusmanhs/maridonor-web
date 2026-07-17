<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait HasAuditLog
{
    protected static function bootHasAuditLog(): void
    {
        static::created(function ($model) {
            $model->logAudit('created', null, $model->getAttributes());
        });

        static::updated(function ($model) {
            $oldValues = array_intersect_key($model->getOriginal(), $model->getChanges());
            $model->logAudit('updated', $oldValues, $model->getChanges());
        });

        static::deleted(function ($model) {
            $model->logAudit('deleted', $model->getOriginal(), null);
        });
    }

    protected function logAudit(string $action, ?array $old = null, ?array $new = null): void
    {
        // Don't log AuditLog model changes to avoid recursion
        if (class_basename($this) === 'AuditLog') {
            return;
        }

        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => strtolower(class_basename($this)) . '.' . $action,
                'entity_type' => class_basename($this),
                'entity_id' => $this->getKey(),
                'old_values' => $old,
                'new_values' => $new,
                'ip_address' => request()->ip() ?? '127.0.0.1',
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Throwable $e) {
            // Silence log errors if database isn't ready or during migrations
        }
    }
}
