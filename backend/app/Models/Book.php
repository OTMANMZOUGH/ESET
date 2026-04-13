<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'content',
        'difficulty_level',
        'language',
    ];

    public function userVocabulary(): HasMany
    {
        return $this->hasMany(UserVocabulary::class, 'source_book_id');
    }
}
