<?php

use Illuminate\Database\Seeder;

class RpgChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('rpg_chats')->insert([
            'text'       =>  "Hej",
            'campaign_id' => 1,
            'user_id'    =>  1,
            'type'       => 0
        ]);
        DB::table('rpg_chats')->insert([
            'text'       =>  "Hoj hoj",
            'campaign_id' => 1,
            'user_id'    =>  2,
            'type'       =>  0
        ]);
        DB::table('rpg_chats')->insert([
            'text'       =>  "Pelle slog 1T20+3 och fick 14.",
            'campaign_id' => 1,
            'user_id'    =>  2,
            'type'       =>  1
        ]);
    }
    //'created_at' =>  new DateTime('01/10/2016')
}
