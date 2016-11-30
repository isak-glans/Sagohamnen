<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableChronicles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('chronicles', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->integer('campaign_id')->unsigned()->index();
            $table->integer('user_id')->unsigned();
            $table->tinyInteger('character_id')->unsigned()->nullable()->index()->comments ="nullable because if GM";
            $table->tinyInteger('status')->unsigned()->index()->comments = "0=deleted, 1=active";
            $table->timestamps();
            $table->text('text');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('chronicles');
    }
}
