<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableCharacters extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (! Schema::hasTable('characters') ) :
            Schema::create('characters', function (Blueprint $table) {
                $table->increments('id')->unsigned();
                $table->integer('campaign_id')->unsigned()->index();
                $table->integer('user_id')->unsigned()->index();
                $table->tinyInteger("status")->unsigned()->index()->comments = "0=archived, 1=applying, 2=RP, 3=SLP";
                $table->timestamps();
                $table->string('name', 255);
                $table->text('description', 4500);
                $table->integer('portrait_id')->unsigned()->nullable();
                $table->text('secret_data', 4500)->nullable();
                $table->text('excerpt', 100)->nullable();
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
        Schema::drop('characters');
    }
}
