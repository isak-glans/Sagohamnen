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
            'gm_id'             => 1,
            'rating'            => 0,
            'nr_entries'        => 1,
            'nr_players'        => 1,
            'created_at'        => new DateTime,
            'updated_at'        => new DateTime,
            'status'            => 1,
        ]);

        DB::table('sh_campaigns')->insert([
            'name'              => 'Markslandet',
            'genre'             => 'Eon',
            'gm_id'             => 2,
            'rating'            => 0,
            'nr_entries'        => 1,
            'nr_players'        => 1,
            'created_at'        => new DateTime,
            'updated_at'        => new DateTime,
            'status'            => 1,
        ]);

    }
}
