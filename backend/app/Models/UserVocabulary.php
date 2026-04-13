<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserVocabulary extends Model
{
    protected $table = 'user_vocabulary';

    protected $fillable = [
        'user_id',
        'word',
        'translation',
        'next_review_at',
        'mastery_level',
        'source_book_id',
    ];

    protected $casts = [
        'next_review_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceBook(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'source_book_id');
    }
}
