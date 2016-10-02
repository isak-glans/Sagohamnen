<?php

use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('chats')->insert([
            'text'       =>  "Hej",
            'campaign_id' => 1,
            'user_id'    =>  1,
            'type'       => 1,
            'created_at' =>  new DateTime('01/10/2016')
        ]);
        DB::table('chats')->insert([
            'text'       =>  "Hoj hoj",
            'campaign_id' => 1,
            'user_id'    =>  2,
            'type'       =>  1,
            'created_at' =>  new DateTime('01/10/2016')
        ]);
        DB::table('chats')->insert([
            'text'       =>  "Pelle slog 1T20+3 och fick 14.",
            'campaign_id' => 1,
            'user_id'    =>  2,
            'type'       =>  2,
            'created_at' =>  new DateTime('01/10/2016')
        ]);
    }
}
