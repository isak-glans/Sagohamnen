<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserTableSeeder::class);
        $this->call(CampaignTableSeeder::class);
        $this->call(LastReadSeeder::class);
        $this->call(CampaignSettingsSeeder::class);
        $this->call(PortraitsSeeder::class);
        $this->call(CharactersSeeder::class);
        $this->call(ChronicleSeeder::class);
        $this->call(CharacterChronicleSeeder::class);
        $this->call(TagSeeder::class);
        $this->call(PortraitTagSeeder::class);
        $this->call(ChatSeeder::class);

        /*DB::table('sh_campaign_media')->insert([
            'campaign_id'   => 1,
            'url'           => "https://s-media-cache-ak0.pinimg.com/236x/9a/ce/1a/9ace1a3e716fc439d2810ec7cb91e6f3.jpg",
            'descr'         => "Bild på grå tornet",
        ]);*/
    }
}
