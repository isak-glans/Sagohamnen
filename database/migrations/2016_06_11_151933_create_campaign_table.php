<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCampaignTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (! Schema::hasTable('sh_campaigns') ) :
            Schema::create('sh_campaigns', function (Blueprint $table) {
                $table->increments('id')->unsigned();
                $table->text('name', 1000);
                $table->text('text', 4500);
                $table->string('genre', 255);
                $table->integer('gamemaster_id')->unsigned();
                $table->tinyInteger("rating")->unsigned();
                $table->integer("nr_chronicles")->unsigned();
                $table->tinyInteger("nr_players")->unsigned();
                $table->tinyInteger("max_nr_players")->unsigned();
                $table->tinyInteger("chro_per_page")->unsigned();
                $table->tinyInteger("chat_clear_days")->unsigned();
                $table->integer('chronicle_font_id')->unsigned();
                $table->tinyInteger('inactivity_days')->unsigned();
                $table->timestamps();
                $table->tinyInteger("status")->unsigned()->comments = "0=archived, 1= active";
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
        Schema::drop('sh_campaigns');
    }
}
