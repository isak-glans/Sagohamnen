<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class characterTest extends TestCase
{
	use DatabaseMigrations;

    /*public function testCreateCharacter()
    {
        //$user = factory(App\User::class)->create();
        $Campaign = factory(Sagohamnen\Campaign\Campaign::class)->create();
        //echo $character;
        $character->save();
        $this->get('api/character/1')
             ->seeJson([ 'id' => 1]);
    }*/

    public function testSingleCharacter()
    {
        $character = factory(Sagohamnen\Character\Character::class)->create();
        $character->save();

        $this->get('api/character/1')
             ->seeJson([ 'id' => 1]);
    }
}
