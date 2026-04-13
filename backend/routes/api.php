<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\VerbController;
use App\Http\Controllers\Api\VocabularyController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Verbs
    Route::get('/verbs', [VerbController::class, 'index']);
    Route::get('/verbs/random', [VerbController::class, 'random']);
    Route::get('/verbs/{id}/conjugate', [VerbController::class, 'conjugate']);
    Route::post('/verbs/check', [VerbController::class, 'check']);

    // Books
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::post('/books/{id}/translate', [BookController::class, 'translate']);

    // Notes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::get('/notes/{id}', [NoteController::class, 'show']);
    Route::put('/notes/{id}', [NoteController::class, 'update']);
    Route::delete('/notes/{id}', [NoteController::class, 'destroy']);

    // Vocabulary
    Route::get('/vocabulary', [VocabularyController::class, 'index']);
    Route::post('/vocabulary', [VocabularyController::class, 'store']);
    Route::get('/vocabulary/due', [VocabularyController::class, 'due']);
    Route::get('/vocabulary/stats', [VocabularyController::class, 'stats']);
    Route::post('/vocabulary/{id}/review', [VocabularyController::class, 'review']);
});
