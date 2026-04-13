<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VerbSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $verbs = [
            // Regular -ar verbs
            ['infinitive' => 'hablar', 'group' => 'ar', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to speak', 'fr' => 'parler'])],
            ['infinitive' => 'trabajar', 'group' => 'ar', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to work', 'fr' => 'travailler'])],
            ['infinitive' => 'estudiar', 'group' => 'ar', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to study', 'fr' => 'étudier'])],
            ['infinitive' => 'caminar', 'group' => 'ar', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to walk', 'fr' => 'marcher'])],

            // Regular -er verbs
            ['infinitive' => 'comer', 'group' => 'er', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to eat', 'fr' => 'manger'])],
            ['infinitive' => 'beber', 'group' => 'er', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to drink', 'fr' => 'boire'])],
            ['infinitive' => 'leer', 'group' => 'er', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to read', 'fr' => 'lire'])],
            ['infinitive' => 'correr', 'group' => 'er', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to run', 'fr' => 'courir'])],

            // Regular -ir verbs
            ['infinitive' => 'vivir', 'group' => 'ir', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to live', 'fr' => 'vivre'])],
            ['infinitive' => 'escribir', 'group' => 'ir', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to write', 'fr' => 'écrire'])],
            ['infinitive' => 'abrir', 'group' => 'ir', 'irregularity_type' => null, 'translations' => json_encode(['en' => 'to open', 'fr' => 'ouvrir'])],

            // Stem-changing verbs (e→ie)
            ['infinitive' => 'pensar', 'group' => 'ar', 'irregularity_type' => 'e_ie', 'translations' => json_encode(['en' => 'to think', 'fr' => 'penser'])],
            ['infinitive' => 'querer', 'group' => 'er', 'irregularity_type' => 'e_ie', 'translations' => json_encode(['en' => 'to want', 'fr' => 'vouloir'])],
            ['infinitive' => 'empezar', 'group' => 'ar', 'irregularity_type' => 'e_ie', 'translations' => json_encode(['en' => 'to begin', 'fr' => 'commencer'])],

            // Stem-changing verbs (o→ue)
            ['infinitive' => 'poder', 'group' => 'er', 'irregularity_type' => 'o_ue', 'translations' => json_encode(['en' => 'to be able', 'fr' => 'pouvoir'])],
            ['infinitive' => 'dormir', 'group' => 'ir', 'irregularity_type' => 'o_ue', 'translations' => json_encode(['en' => 'to sleep', 'fr' => 'dormir'])],
            ['infinitive' => 'volver', 'group' => 'er', 'irregularity_type' => 'o_ue', 'translations' => json_encode(['en' => 'to return', 'fr' => 'revenir'])],

            // Stem-changing verbs (e→i)
            ['infinitive' => 'pedir', 'group' => 'ir', 'irregularity_type' => 'e_i', 'translations' => json_encode(['en' => 'to ask for', 'fr' => 'demander'])],
            ['infinitive' => 'servir', 'group' => 'ir', 'irregularity_type' => 'e_i', 'translations' => json_encode(['en' => 'to serve', 'fr' => 'servir'])],

            // Orthographic changes
            ['infinitive' => 'buscar', 'group' => 'ar', 'irregularity_type' => 'c_qu', 'translations' => json_encode(['en' => 'to search', 'fr' => 'chercher'])],
            ['infinitive' => 'llegar', 'group' => 'ar', 'irregularity_type' => 'g_gu', 'translations' => json_encode(['en' => 'to arrive', 'fr' => 'arriver'])],
            ['infinitive' => 'cruzar', 'group' => 'ar', 'irregularity_type' => 'z_c', 'translations' => json_encode(['en' => 'to cross', 'fr' => 'traverser'])],
        ];

        foreach ($verbs as $verb) {
            \App\Models\Verb::create($verb);
        }
    }
}
