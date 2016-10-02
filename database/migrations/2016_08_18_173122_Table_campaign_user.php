<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableCampaignUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('campaign_user', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('campaign_id')->unsigned();
            $table->integer('last_read_chro_id')->unsigned()->default(0);
            $table->integer('last_read_chat_id')->unsigned()->default(0);
            $table->timestamps();
            $table->tinyInteger('status')->unsigned()->index()->default(0)->comment = "0=none, 1=applying, 2=spelare, 3=spelledare, 4=blockerad";
            $table->primary(['user_id', 'campaign_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('campaign_user');
    }
}
