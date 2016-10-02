<?php

use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('Tags')->insert([
            'id'    => 1,
            'word'  => "man"
        ]);
        DB::table('Tags')->insert([
            'id'    => 2,
            'word'  => "kvinna"
        ]);
    }
}
