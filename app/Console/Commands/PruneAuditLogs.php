<?php

namespace App\Console\Commands;

use App\Models\AuditLog;
use Illuminate\Console\Command;

class PruneAuditLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audit:prune {--days= : Retention days to keep}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune old audit logs based on retention policy';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) ($this->option('days') ?: config('audit.retention_days', 365));

        if ($days <= 0) {
            $this->error('Retention days must be a positive integer.');

            return self::FAILURE;
        }

        $cutoff = now()->subDays($days);

        AuditLog::$allowPruning = true;
        try {
            $deleted = AuditLog::where('created_at', '<', $cutoff)->delete();
        } finally {
            AuditLog::$allowPruning = false;
        }

        $this->info("Successfully pruned {$deleted} audit log entries older than {$days} days (before {$cutoff->toDateTimeString()}).");

        return self::SUCCESS;
    }
}
