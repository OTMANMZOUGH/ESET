<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Verb extends Model
{
    protected $fillable = [
        'infinitive',
        'group',
        'irregularity_type',
        'translations',
    ];

    protected $casts = [
        'translations' => 'array',
    ];

    public function verbForms(): HasMany
    {
        return $this->hasMany(VerbForm::class);
    }
}
