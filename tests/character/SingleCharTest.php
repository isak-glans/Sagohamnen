<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Sagohamnen\campaign\campaign_user;
use Sagohamnen\character\character_BL;
use Sagohamnen\character\character;
use App\User;
use Sagohamnen\character\character_repository;


class SingleCharTest extends TestCase
{
	use DatabaseMigrations;

    private $the_user;
    private $the_campagin;
    private $character1;
    private $character2;
    private $campaign_user;

    public function testSingleCharacter()
    {
        $character = factory(Sagohamnen\Character\Character::class)->create();
        $character->status = 1;
        $character->save();

        $this->get('api/character/1')
             ->seeJson([ 'id' => 1]);
    }

}