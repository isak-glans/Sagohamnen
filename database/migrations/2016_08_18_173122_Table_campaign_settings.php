<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableCampaignSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('campaign_settings', function (Blueprint $table) {
            $table->integer('campaign_id')->unsigned()->primary();
            $table->tinyInteger("post_per_page")->unsigned()->default( env( 'RPG_POST_PER_PAGE', 10 ) );
            $table->tinyInteger("chat_expire_days")->unsigned()->default( env( 'RPG_CHAT_EXPIRE_DAYS', 10 ) );
            $table->tinyInteger('inactivity_days')->default( env( 'RPG_USER_INACTIVITY', 10 ) );
            $table->integer('chronicle_font_id')->unsigned()->default( env( 'RPG_CHRO_FONT_ID', 1 ) );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('campaign_settings');
    }
}
