<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCampaignUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sh_campaign_users', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('campaign_id')->unsigned();
            $table->integer('last_read_chat_id')->unsigned()->default(0);
            $table->integer('last_read_chro_id')->unsigned()->default(0);
            $table->date('date');
            $table->primary(['user_id', 'campaign_id']);
            $table->tinyInteger('status')->unsigned()->index()->comment = "0=deltar inte, 1=deltar, 2=ansöker, 3=nekad, 4=blockerad";
        });
    }

/*user_id
campaign_id
last_read_chat_id
last_read_chro_id
joined_at
last_punishment
last_written_chro
status*/

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sh_campaign_users');
    }
}
