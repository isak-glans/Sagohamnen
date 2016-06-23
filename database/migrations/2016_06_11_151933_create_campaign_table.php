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
                $table->integer('gm_id')->unsigned();
                $table->tinyInteger("nr_players")->unsigned();
                $table->integer("nr_entries")->unsigned();
                $table->timestamps();
                $table->tinyInteger("rating")->unsigned();
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
