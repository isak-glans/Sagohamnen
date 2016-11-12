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
        DB::table('Tags')->insert(['id'    => 1,'word'  => "male"]);
        DB::table('Tags')->insert(['id'    => 2,'word'  => "female"]);
        DB::table('Tags')->insert(['id'    => 3,'word'  => "no_sex"]);
        DB::table('Tags')->insert(['id'    => 4,'word'  => "human"]);
        DB::table('Tags')->insert(['id'    => 5,'word'  => "dwarf"]);
        DB::table('Tags')->insert(['id'    => 6,'word'  => "elf"]);
        DB::table('Tags')->insert(['id'    => 7,'word'  => "orc"]);
        DB::table('Tags')->insert(['id'    => 8,'word'  => "no_race"]);
    }
}
