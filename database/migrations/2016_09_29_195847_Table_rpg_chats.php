<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableRpgChats extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rpg_chats', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->integer('campaign_id')->unsigned()->index();
            $table->integer('user_id')->unsigned()->index();
            $table->integer('type')->unsigned()->default(0)->index()->comment = "0=default, 1=dice";
            $table->text('text', 500);
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('rpg_chats');
    }
}
