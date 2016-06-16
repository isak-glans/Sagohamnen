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
        DB::table('sh_campaigns')->insert([
            'name'              => 'Grå tornet',
            'genre'             => 'Eon',
            'gamemaster_id'     => 1,
            'rating'            => 0,
            'nr_chronicles'     => 1,
            'nr_players'        => 1,
            'max_nr_players'    => 5,
            'chro_per_page'     => 10,
            'chat_clear_days'   => 10,
            'chronicle_font_id' => 1,
            'inactivity_days'   => 7,
            'created_at'        => new DateTime,
            'updated_at'        => new DateTime,
            'status'            => 1,
        ]);

        DB::table('sh_campaigns')->insert([
            'name'              => 'Markslandet',
            'genre'             => 'Eon',
            'gamemaster_id'     => 2,
            'rating'            => 0,
            'nr_chronicles'     => 1,
            'nr_players'        => 1,
            'max_nr_players'    => 5,
            'chro_per_page'     => 10,
            'chat_clear_days'   => 10,
            'chronicle_font_id' => 1,
            'inactivity_days'   => 7,
            'created_at'        => new DateTime,
            'updated_at'        => new DateTime,
            'status'            => 1,
        ]);

    }
}
