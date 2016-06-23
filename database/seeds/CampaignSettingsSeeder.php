<?php

use Illuminate\Database\Seeder;

class CampaignSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sh_campaign_settings')->insert([
            'campaign_id'              	=> 1,
            'post_per_page'            	=> 10,
            'chat_expire_days'         	=> 11,
            'inactivity_days'          	=> 5,
            'max_nr_players'			=> 6,
            'chronicle_font_id'        	=> 1,
        ]);
    }
}
