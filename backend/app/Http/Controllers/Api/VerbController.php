<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Verb;
use App\Services\ConjugationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerbController extends Controller
{
    public function index(): JsonResponse
    {
        $verbs = Verb::select('id', 'infinitive', 'group', 'irregularity_type', 'translations')
            ->paginate(20);

        return ApiResponse::success($verbs);
    }

    public function conjugate(Request $request, int $id): JsonResponse
    {
        $verb = Verb::findOrFail($id);
        $tense = $request->query('tense', 'presente');

        try {
            $conjugations = ConjugationService::conjugate($verb->infinitive, $tense);

            return ApiResponse::success([
                'verb' => $verb,
                'tense' => $tense,
                'conjugations' => $conjugations,
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 400);
        }
    }

    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'infinitive' => 'required|string',
            'tense' => 'required|string',
            'person' => 'required|string',
            'answer' => 'required|string',
        ]);

        try {
            $isCorrect = ConjugationService::checkAnswer(
                $validated['infinitive'],
                $validated['tense'],
                $validated['person'],
                $validated['answer']
            );

            $correctAnswer = ConjugationService::conjugate(
                $validated['infinitive'],
                $validated['tense']
            )[$validated['person']] ?? null;

            return ApiResponse::success([
                'correct' => $isCorrect,
                'correctAnswer' => $correctAnswer,
                'userAnswer' => $validated['answer'],
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 400);
        }
    }

    public function random(): JsonResponse
    {
        $verb = ConjugationService::getRandomVerb();

        if (!$verb) {
            return ApiResponse::error('No verbs found', 404);
        }

        return ApiResponse::success($verb);
    }
}
