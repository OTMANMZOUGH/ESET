<?php

namespace App\Services;

use App\Models\Verb;

class ConjugationService
{
    // Spanish verb conjugation patterns for presente (present tense)
    private const PRESENTE_ENDINGS = [
        'ar' => ['yo' => 'o', 'tu' => 'as', 'el' => 'a', 'nosotros' => 'amos', 'vosotros' => 'ais', 'ellos' => 'an'],
        'er' => ['yo' => 'o', 'tu' => 'es', 'el' => 'e', 'nosotros' => 'emos', 'vosotros' => 'eis', 'ellos' => 'en'],
        'ir' => ['yo' => 'o', 'tu' => 'es', 'el' => 'e', 'nosotros' => 'imos', 'vosotros' => 'is', 'ellos' => 'en'],
    ];

    // Preterite (past tense) endings
    private const PRETERITO_ENDINGS = [
        'ar' => ['yo' => 'e', 'tu' => 'aste', 'el' => 'o', 'nosotros' => 'amos', 'vosotros' => 'asteis', 'ellos' => 'aron'],
        'er' => ['yo' => 'i', 'tu' => 'iste', 'el' => 'io', 'nosotros' => 'imos', 'vosotros' => 'isteis', 'ellos' => 'ieron'],
        'ir' => ['yo' => 'i', 'tu' => 'iste', 'el' => 'io', 'nosotros' => 'imos', 'vosotros' => 'isteis', 'ellos' => 'ieron'],
    ];

    // Imperfect (imperfecto) endings
    private const IMPERFECTO_ENDINGS = [
        'ar' => ['yo' => 'aba', 'tu' => 'abas', 'el' => 'aba', 'nosotros' => 'abamos', 'vosotros' => 'abais', 'ellos' => 'aban'],
        'er' => ['yo' => 'ia', 'tu' => 'ias', 'el' => 'ia', 'nosotros' => 'iamos', 'vosotros' => 'iais', 'ellos' => 'ian'],
        'ir' => ['yo' => 'ia', 'tu' => 'ias', 'el' => 'ia', 'nosotros' => 'iamos', 'vosotros' => 'iais', 'ellos' => 'ian'],
    ];

    // Future endings (same for all groups)
    private const FUTURO_ENDINGS = [
        'yo' => 'e', 'tu' => 'as', 'el' => 'a', 'nosotros' => 'emos', 'vosotros' => 'eis', 'ellos' => 'an'
    ];

    /**
     * Conjugate a verb in a specific tense
     */
    public static function conjugate(string $infinitive, string $tense = 'presente'): array
    {
        $verb = Verb::where('infinitive', $infinitive)->first();

        if (!$verb) {
            throw new \Exception("Verb not found: {$infinitive}");
        }

        $group = $verb->group;
        $irregularityType = $verb->irregularity_type;

        // Get the stem by removing the ending (-ar, -er, -ir)
        $stem = substr($infinitive, 0, -2);

        return match ($tense) {
            'presente' => self::conjugatePresente($stem, $group, $irregularityType),
            'preterito' => self::conjugatePreterito($stem, $group, $irregularityType),
            'imperfecto' => self::conjugateImperfecto($stem, $group, $irregularityType),
            'futuro' => self::conjugateFuturo($infinitive, $irregularityType),
            default => throw new \Exception("Tense not supported: {$tense}"),
        };
    }

    /**
     * Conjugate in presente (present tense)
     */
    private static function conjugatePresente(string $stem, string $group, ?string $irregularityType): array
    {
        $endings = self::PRESENTE_ENDINGS[$group];
        $result = [];

        foreach ($endings as $person => $ending) {
            $modifiedStem = self::applyIrregularity($stem, $irregularityType, $person, 'presente');
            $result[$person] = $modifiedStem . $ending;
        }

        return $result;
    }

    /**
     * Conjugate in preterito (preterite/past tense)
     */
    private static function conjugatePreterito(string $stem, string $group, ?string $irregularityType): array
    {
        $endings = self::PRETERITO_ENDINGS[$group];
        $result = [];

        foreach ($endings as $person => $ending) {
            $modifiedStem = self::applyIrregularity($stem, $irregularityType, $person, 'preterito');
            $result[$person] = $modifiedStem . $ending;
        }

        return $result;
    }

    /**
     * Conjugate in imperfecto (imperfect tense)
     */
    private static function conjugateImperfecto(string $stem, string $group, ?string $irregularityType): array
    {
        $endings = self::IMPERFECTO_ENDINGS[$group];
        $result = [];

        foreach ($endings as $person => $ending) {
            $result[$person] = $stem . $ending;
        }

        return $result;
    }

    /**
     * Conjugate in futuro (future tense)
     */
    private static function conjugateFuturo(string $infinitive, ?string $irregularityType): array
    {
        $result = [];

        foreach (self::FUTURO_ENDINGS as $person => $ending) {
            $result[$person] = $infinitive . $ending;
        }

        return $result;
    }

    /**
     * Apply irregularity rules to the stem
     */
    private static function applyIrregularity(string $stem, ?string $irregularityType, string $person, string $tense): string
    {
        if (!$irregularityType) {
            return $stem;
        }

        // Diphthongization: e→ie (present tense, not nosotros/vosotros)
        if ($irregularityType === 'e_ie' && $tense === 'presente' && !in_array($person, ['nosotros', 'vosotros'])) {
            return preg_replace('/e([^e]*)$/', 'ie$1', $stem);
        }

        // Diphthongization: o→ue (present tense, not nosotros/vosotros)
        if ($irregularityType === 'o_ue' && $tense === 'presente' && !in_array($person, ['nosotros', 'vosotros'])) {
            return preg_replace('/o([^o]*)$/', 'ue$1', $stem);
        }

        // Stem change: e→i (present tense, not nosotros/vosotros)
        if ($irregularityType === 'e_i' && $tense === 'presente' && !in_array($person, ['nosotros', 'vosotros'])) {
            return preg_replace('/e([^e]*)$/', 'i$1', $stem);
        }

        // Orthographic change: c→qu (before e)
        if ($irregularityType === 'c_qu' && $person === 'yo' && $tense === 'preterito') {
            return preg_replace('/c$/', 'qu', $stem);
        }

        // Orthographic change: g→gu (before e)
        if ($irregularityType === 'g_gu' && $person === 'yo' && $tense === 'preterito') {
            return preg_replace('/g$/', 'gu', $stem);
        }

        // Orthographic change: z→c (before e)
        if ($irregularityType === 'z_c' && $person === 'yo' && $tense === 'preterito') {
            return preg_replace('/z$/', 'c', $stem);
        }

        return $stem;
    }

    /**
     * Check if a user's answer is correct
     */
    public static function checkAnswer(string $infinitive, string $tense, string $person, string $userAnswer): bool
    {
        $conjugations = self::conjugate($infinitive, $tense);
        $correctAnswer = $conjugations[$person] ?? null;

        if (!$correctAnswer) {
            return false;
        }

        return strtolower(trim($userAnswer)) === strtolower(trim($correctAnswer));
    }

    /**
     * Get a random verb for practice
     */
    public static function getRandomVerb(?string $level = null): ?Verb
    {
        $query = Verb::query();

        // Filter by difficulty level if provided
        // This would require adding a level field to verbs table in the future

        return $query->inRandomOrder()->first();
    }
}
