<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'phone',
    'password',
    'role',
    'status',
    'kyc_level',
    'email_verified_at',
    'phone_verified_at',
    'last_login_at',
    'fcm_token',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasUuid, SoftDeletes, HasAuditLog;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
            'kyc_level' => 'integer',
        ];
    }

    public function donorProfile(): HasOne
    {
        return $this->hasOne(DonorProfile::class);
    }

    public function kycDocuments(): HasMany
    {
        return $this->hasMany(KycDocument::class);
    }

    public function notificationPreference(): HasOne
    {
        return $this->hasOne(NotificationPreference::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function institutionStaff(): HasMany
    {
        return $this->hasMany(InstitutionStaff::class);
    }

    public function isDonor(): bool
    {
        return $this->role === UserRole::Donor;
    }

    public function isInstitutionStaff(): bool
    {
        return in_array($this->role, [
            UserRole::RsStaff,
            UserRole::RsAdmin,
            UserRole::PmiStaff,
            UserRole::PmiAdmin,
        ]);
    }
}
