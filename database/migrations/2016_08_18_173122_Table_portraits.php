<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TablePortraits extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('portraits', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->text('medium');
            $table->text('thumbnail');
            $table->tinyInteger('status')->unsigned()->index()->default(1);
        });
         //https://s-media-cache-ak0.pinimg.com/236x/9a/ce/1a/9ace1a3e716fc439d2810ec7cb91e6f3.jpg
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('portraits');
    }
}
