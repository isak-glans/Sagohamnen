<?php

use Illuminate\Database\Seeder;

class CampaignUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
    	// User 1
        DB::table('campaign_user')->insert([
            'user_id'                   =>  1,
            'campaign_id'               =>  1,
            'created_at'                =>  new DateTime('01/10/2016'),
            'updated_at'                =>  new DateTime('01/10/2016'),
            'status'                    =>  config('sh.campaign_user_status_gamemaster')
        ]);

    	// User 2
    	DB::table('campaign_user')->insert([
            'user_id'                   =>  2,
            'campaign_id'               =>  2,
            'created_at'                =>  new DateTime('01/10/2016'),
            'updated_at'                =>  new DateTime('01/10/2016'),
            'status'                    =>  config('sh.campaign_user_status_gamemaster')
        ]);

        DB::table('campaign_user')->insert([
            'user_id'                   =>  2,
            'campaign_id'               =>  1,
            'created_at'                =>  new DateTime('01/10/2016'),
            'updated_at'                =>  new DateTime('01/10/2016'),
            'status'                    =>  config('sh.campaign_user_status_none')
        ]);
    }
}
