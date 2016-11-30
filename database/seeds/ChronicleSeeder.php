<?php

use Illuminate\Database\Seeder;

class ChronicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('chronicles')->insert([
            'id'                    => 1,
            'campaign_id'          =>  1,
            'user_id'              =>  1,
            'character_id'         => null,
            'text'                 =>  "Ni kommer till ett högt torn. Strax framför tornet står en rövare.",
            'created_at'           =>  new DateTime('01/10/2016'),
            'updated_at'           =>  new DateTime('01/10/2016'),
            'status'               =>  1,
        ]);

        DB::table('chronicles')->insert([
            'id'                    => 2,
            'campaign_id'          =>  1,
            'user_id'              =>  2,
            'character_id'         => 2,
            'text'                 =>  "Alexus drar sitt svärd.",
            'created_at'           =>  new DateTime('01/10/2016'),
            'updated_at'           =>  new DateTime('01/10/2016'),
            'status'               =>  1,
        ]);

        DB::table('chronicles')->insert([
            'id'                    => 3,
            'campaign_id'          =>  1,
            'user_id'              =>  2,
            'character_id'         =>  2,
            'text'                 =>  "Lambretta drar sin dolk och spänner blicken i rövaren.",
            'created_at'           =>  new DateTime('01/10/2016'),
            'updated_at'           =>  new DateTime('01/10/2016'),
            'status'               =>  1,
        ]);

        DB::table('chronicles')->insert([
            'id'                    => 4,
            'campaign_id'          =>  1,
            'user_id'              =>  1,
            'character_id'         => null,
            'text'                 =>  "Rövaren kastar blixtsnabbt en dolk mot Alexus och drar sedan fram ett blankt svärd.",
            'created_at'           =>  new DateTime('01/10/2016'),
            'updated_at'           =>  new DateTime('01/10/2016'),
            'status'               =>  1,
        ]);
    }
}
