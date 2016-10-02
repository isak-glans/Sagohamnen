<?php

use Illuminate\Database\Seeder;

class PortraitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Default porträtt
        DB::table('portraits')->insert([
            'id'            => 1,
            'medium'           => "http://localhost:8000/assets/img/portraits/default.png",
            'thumbnail'           => "http://localhost:8000/assets/img/portraits/default.png"
        ]);
        DB::table('portraits')->insert([
            'id'            => 2,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/man1.jpg",
            'medium' => "http://localhost:8000/assets/img/portraits/man1.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 3,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/man2.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/man2.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 4,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/man3.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/man3.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 5,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/man4.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/man4.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 6,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/female1.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/female1.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 7,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/female2.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/female2.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 8,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/female4.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/female4.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 9,
            'thumbnail' => "http://localhost:8000/assets/img/portraits/man11.jpg",
            'medium' =>"http://localhost:8000/assets/img/portraits/man11.jpg"]);
        /*DB::table('portraits')->insert([
            'id'            => 2,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/man1.jpg",
            'medium' => "www.sagohamnen.se/assets/img/portraits/man1.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 3,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/man2.jpg",
            'medium' =>"www.sagohamnen.se/assets/img/portraits/man2.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 4,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/man3.jpg",
            'medium' =>"www.sagohamnen.se/assets/img/portraits/man3.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 5,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/man4.jpg",
            'medium' =>"www.sagohamnen.se/assets/img/portraits/man4.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 6,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/female1.jpg",
            'medium' =>"www.sagohamnen.se/assets/img/portraits/female1.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 7,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/female2.jpg",
            'medium' =>"www.sagohamnen.se/assets/img/portraits/female2.jpg"]);
        DB::table('portraits')->insert([
            'id'            => 8,
            'thumbnail' => "www.sagohamnen.se/assets/img/portraits/female4.jpg",
            'medium' =>"www.sagohamnen.se/assets/img/portraits/female4.jpg"]);*/

    }
}
