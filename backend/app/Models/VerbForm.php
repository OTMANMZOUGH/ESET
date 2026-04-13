<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerbForm extends Model
{
    protected $fillable = [
        'verb_id',
        'tense',
        'person',
        'form',
    ];

    public function verb(): BelongsTo
    {
        return $this->belongsTo(Verb::class);
    }
}
