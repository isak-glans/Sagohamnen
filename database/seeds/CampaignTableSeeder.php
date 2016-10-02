<?php

use Illuminate\Database\Seeder;

class CampaignTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('campaigns')->insert([
            'name'              => 'Grå tornet',
            'genre'             => 'Eon',
            'description'              => 'Djupt inne i skogen låg ett torn som få vågat att besöka. Det sades nämligen att onda andar och fällor vaktade tornet. Men vad vaktade de, visste få. Detta beslöt sig ett par äventyrare för att ta reda på.

                Det finns många olika varianter av Lorem Ipsum, men majoriteten av dessa har ändrats på någotvis. Antingen med inslag av humor, eller med inlägg av ord som knappast ser trovärdiga ut. Skall man använda långa stycken av Lorem Ipsum bör man försäkra sig om att det inte gömmer sig något pinsamt mitt i texten. Lorem Ipsum-generatorer på internet tenderar att repetera Lorem Ipsum-texten styckvis efter behov, något som gör denna sidan till den första riktiga Lorem Ipsum-generatorn på internet. Den använder ett ordförråd på över 200 ord, kombinerat med ett antal meningsbyggnadsstrukturer som tillsamman genererar Lorem Ipsum som ser ut som en normal mening. Lorem Ipsum genererad på denna sidan är därför alltid fri från repetitioner, humorinslag, märkliga ordformationer osv.',
            'rating'            => 0,
            'max_nr_players'    => 6,
            'media_id'          => 1,
            'created_at'        => new DateTime('01/10/2016'),
            'updated_at'        => new DateTime('02/30/2016'),
            'status'            => 1,
        ]);

        DB::table('campaigns')->insert([
            'name'              => 'Markslandet',
            'genre'             => 'Eon',
            'description'              => 'Det finns många olika varianter av Lorem Ipsum, men majoriteten av dessa har ändrats på någotvis. Antingen med inslag av humor, eller med inlägg av ord som knappast ser trovärdiga ut. Skall man använda långa stycken av Lorem Ipsum bör man försäkra sig om att det inte gömmer sig något pinsamt mitt i texten. Lorem Ipsum-generatorer på internet tenderar att repetera Lorem Ipsum-texten styckvis efter behov, något som gör denna sidan till den första riktiga Lorem Ipsum-generatorn på internet. Den använder ett ordförråd på över 200 ord, kombinerat med ett antal meningsbyggnadsstrukturer som tillsamman genererar Lorem Ipsum som ser ut som en normal mening. Lorem Ipsum genererad på denna sidan är därför alltid fri från repetitioner, humorinslag, märkliga ordformationer osv.',
            //'gm_id'             => 2,
            'rating'            => 0,
            'media_id'          => 1,
            'max_nr_players'    => 4,
            'created_at'        => new DateTime('02/10/2016'),
            'updated_at'        => new DateTime('03/30/2016'),
            'status'            => 1,
        ]);

    }
}
