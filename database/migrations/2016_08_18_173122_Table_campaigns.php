<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableCampaigns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (! Schema::hasTable('campaigns') ) :
            Schema::create('campaigns', function (Blueprint $table) {
                $table->increments('id')->unsigned();
                $table->string('name', 255);
                $table->text('description', 4500);
                $table->string('genre', 255);
                $table->integer('media_id')->unsigned()->nullable();
                $table->tinyInteger("max_nr_players")->unsigned()->default( env( 'RPG_MAX_NR_PLAYERS', 5 ) );
                $table->tinyInteger("rating")->unsigned()->default(0);
                $table->timestamps();
                $table->tinyInteger("status")->unsigned()->comments = "0=archived, 1=active";

            });
        endif;
    }




    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('campaigns');
    }
}
