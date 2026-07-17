<?php

namespace App\Repositories\Contracts;

use App\Models\OtpCode;

interface OtpCodeRepositoryInterface
{
    public function findValidOtp(string $identifier, string $type): ?OtpCode;

    public function create(array $data): OtpCode;

    public function incrementAttempts(string $id): void;

    public function markAsUsed(string $id): void;
}
