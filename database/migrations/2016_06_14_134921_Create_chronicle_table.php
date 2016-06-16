<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChronicleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('sh_chronicles', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->text('text');
            $table->integer('campaign_id')->unsigned()->index();
            $table->integer('author_id')->unsigned();
            $table->timestamps();
            $table->tinyInteger('status')->unsigned()->index()->comments = "0=deleted, 1=active";
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sh_chronicles');
    }
}
