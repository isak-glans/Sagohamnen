<?php

use Illuminate\Database\Seeder;

class LastReadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // User 1
        DB::table('last_read')->insert([
            'user_id'                   =>  1,
            'campaign_id'               =>  1
        ]);

    	// User 2
    	DB::table('last_read')->insert([
            'user_id'                   =>  2,
            'campaign_id'               =>  2
        ]);
    }
}
