<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use Sagohamnen\Campaign\campaign;
use Sagohamnen\Character\character;
use App\User;

use Sagohamnen\character\character_BL;
use Sagohamnen\character\character_repository;


class SingleCharTest extends TestCase
{
	use DatabaseMigrations;

    protected $the_user;

    public function testLoadCharacter()
    {
        $this->setupTestData();

        $this->get('api/character/1')->seeJson(['id' => 1]);
    }

    public function testCharacterNotFound()
    {
        $this->setupTestData();
        $response = $this->call('GET', 'api/character/5');
        $this->assertEquals(404, $response->status());
    }

    public function setupTestData(){

        $this->the_user = factory(App\User::class)->create([
            'id'        =>1,
            'status'    =>1,
        ]);

        $campaign = factory(Sagohamnen\Campaign\Campaign::class)->create([
            'id'        => 1,
            'status'    => 1,
            'user_id'   => 2
        ]);

        $character = factory(Sagohamnen\Character\Character::class)->create([
            'id'            => 1,
            'user_id'       => 1,
            'status'        => 2,
            'portrait_id'   => 1
        ]);

        $character = factory(Sagohamnen\Portrait\Portrait::class)->create([
            'id' => 1
        ]);



    }

}