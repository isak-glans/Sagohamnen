<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sh_users', function (Blueprint $table) {
            $table->increments('id')->unsigned();
            $table->string('name', 255);
            $table->text('description', 4000)->nullable();
            $table->string('email')->unique()->nullable();;
            $table->string('password');
            $table->tinyInteger('rating')->unsigned()->default(0);
            $table->rememberToken();
            $table->timestamps();
            $table->tinyInteger('status')->unsigned()->index()->comment = "0:deleted; 1:register, 2: admin";
            $table->dateTime('last_activity');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('sh_users');
    }
}
