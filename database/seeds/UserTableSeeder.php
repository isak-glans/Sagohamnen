<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('sh_users')->insert([
        	'name'				=> 'isak',
        	'email'				=> 'isakglans@hotmail.com',
        	'password'			=>	bcrypt('bananskruv'),
    	]);

        DB::table('sh_users')->insert([
            'name'              => 'kalle',
            'email'             => 'kalleglans@hotmail.com',
            'password'          =>  bcrypt('bananskruv'),
        ]);
    }
}
