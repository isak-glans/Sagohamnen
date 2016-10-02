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
        DB::table('campaign_settings')->insert([
            'campaign_id'               => 1,
            'post_per_page'             => 10,
            'chat_expire_days'          => 11,
            'inactivity_days'           => 5,
            'chronicle_font_id'         => 1,
        ]);

        /* Schema::create('campaign_media', function (Blueprint $table) {
            $table->integer('id')->unsigned();
            $table->integer('campaign_id')->unsigned()->index();
            $table->text('url');
            $table->text('descr')->nullable;
        });*/
    }
}
