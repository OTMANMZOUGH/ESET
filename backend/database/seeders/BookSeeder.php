<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = [
            [
                'title' => 'El Principito',
                'author' => 'Antoine de Saint-Exupéry',
                'content' => 'Cuando yo tenía seis años vi una vez una lámina magnífica en un libro sobre el Bosque Virgen que se llamaba "Historias vividas". Representaba una serpiente boa comiéndose a una fiera. Esta es la copia del dibujo. En el libro decía: "Las serpientes boas tragan a sus presas enteras, sin masticarlas. Luego no pueden moverse y duermen durante los seis meses que dura su digestión".',
                'difficulty_level' => 'B1',
                'language' => 'es',
            ],
            [
                'title' => 'La Casa en Mango Street',
                'author' => 'Sandra Cisneros',
                'content' => 'No siempre hemos vivido en Mango Street. Antes vivimos en el tercer piso de Loomis, y antes de allí vivimos en Keeler. Antes de Keeler fue en Paulina, pero de lo que más me acuerdo es de Mango Street, la casa triste y roja, la casa que no es en absoluto como la que pensé algún día tener.',
                'difficulty_level' => 'A2',
                'language' => 'es',
            ],
            [
                'title' => 'Cuentos de la Selva',
                'author' => 'Horacio Quiroga',
                'content' => 'Había una vez un hombre que vivía en Buenos Aires y estaba muy contento porque era un hombre sano y trabajador. Pero un día se enfermó, y los médicos le dijeron que solamente yéndose al campo podría curarse. Él no quería ir, porque tenía hermanos chicos a quienes daba de comer.',
                'difficulty_level' => 'B1',
                'language' => 'es',
            ],
            [
                'title' => 'Mi Primer Libro de Español',
                'author' => 'Various',
                'content' => 'Hola, me llamo María. Tengo veinte años y vivo en Madrid con mi familia. Mi padre se llama José y mi madre se llama Carmen. Tengo un hermano pequeño que se llama Pablo. Él tiene ocho años. Me gusta estudiar español porque es muy interesante.',
                'difficulty_level' => 'A1',
                'language' => 'es',
            ],
            [
                'title' => 'Cien Años de Soledad (Extracto)',
                'author' => 'Gabriel García Márquez',
                'content' => 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas.',
                'difficulty_level' => 'C1',
                'language' => 'es',
            ],
        ];

        foreach ($books as $book) {
            \App\Models\Book::create($book);
        }
    }
}
