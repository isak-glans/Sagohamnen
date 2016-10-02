<?php

use Illuminate\Database\Seeder;

class PortraitTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('portrait_tag')->insert([
            'portrait_id'         => 3,
            'tag_id'           => 2
        ]);
        DB::table('portrait_tag')->insert([
            'portrait_id'         => 4,
            'tag_id'           => 1
        ]);
        DB::table('portrait_tag')->insert([
            'portrait_id'         => 7,
            'tag_id'           => 1
        ]);
        DB::table('portrait_tag')->insert([
            'portrait_id'         => 8,
            'tag_id'           => 1
        ]);
    }
}
