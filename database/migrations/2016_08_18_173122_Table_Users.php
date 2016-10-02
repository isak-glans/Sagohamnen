<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->string('name', 255);
            $table->text('description', 4000)->nullable();
            $table->string('email')->unique()->nullable();;
            $table->string('password');
            $table->tinyInteger('rating')->unsigned()->default(0);
            $table->rememberToken();
            $table->timestamps();
            $table->tinyInteger('status')->unsigned()->index()->default(0)->comment = "0:not active; 1:registered, 2: admin";
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
