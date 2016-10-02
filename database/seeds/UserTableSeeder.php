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
        DB::table('users')->insert([
        	'name'				=> 'isak',
        	'email'				=> 'isakglans@hotmail.com',
        	'password'			=>	bcrypt('bananskruv'),
            'description'       => 'Jag bor i Göteborg och jag började att spela rollspel när jag var tonåring.',
            'status'            => 2
    	]);

        DB::table('users')->insert([
            'name'              => 'kalle',
            'email'             => 'kalleglans@hotmail.com',
            'password'          =>  bcrypt('bananskruv'),
            'description'       =>  'Saknas.',
            'status'            => 1
        ]);
    }
}
