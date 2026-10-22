<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Audit Log Retention Days
    |--------------------------------------------------------------------------
    |
    | Number of days to retain audit logs before pruning.
    | Default is 365 days.
    |
    */
    'retention_days' => (int) env('AUDIT_LOG_RETENTION_DAYS', 365),

    /*
    |--------------------------------------------------------------------------
    | Sensitive Attributes
    |--------------------------------------------------------------------------
    |
    | Attributes that must never be recorded in audit log diffs or values.
    |
    */
    'sensitive_attributes' => [
        'password',
        'remember_token',
        'token',
        'access_token',
        'api_key',
        'secret',
        'stripe_id',
        'card_number',
        'card_last_four',
        'cvv',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'verification_document',
        'id_document',
        'certification_proof',
    ],
];
