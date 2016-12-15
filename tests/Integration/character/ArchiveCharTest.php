<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Sagohamnen\campaign\campaign_user;
use Sagohamnen\character\character_BL;
use Sagohamnen\character\character;
use App\User;
use Sagohamnen\character\character_repository;

class ArchiveCharTest extends TestCase
{
    use DatabaseMigrations;

    private $the_campagin;
    private $character1;
    private $character2;
    private $campaign_user;

    public function testCreateCharacter()
    {
        //$user = factory(App\User::class)->create();
        /*$Campaign = factory(Sagohamnen\Campaign\Campaign::class)->create();
        //echo $character;
        $character->save();
        $this->get('api/character/1')
             ->seeJson([ 'id' => 1]);*/
    }

   /* public function testTransactionArchiveUpdate()
    {
        $this->my_testdata_set1();

        $char_rep = new character_repository();
        $char_rep->archive_char_with_update($this->character1, 1);

        $the_campagin_user = campaign_user::where(['user_id'=>1, 'campaign_id' => 1])->first();
        $status = $the_campagin_user->status;
        $this->assertTrue($status == 1);
    }

    public function testArchivePlayerWithApplier()
    {
        $this->my_testdata_set1();
        $this->exceute_test(1, "Campaign_user status borde vara 1.");
    }

    public function testArchivePlayerWithNoApplier()
    {
        $this->my_testdata_set1();
        $this->character2->status = 0;
        $this->character2->save();
        $this->exceute_test(0, "Campaign_user status borde vara 0.");
    }

    public function testArchiveApplierWithPlayer()
    {
        $this->my_testdata_set1();
        $this->character1->status = 1;
        $this->character2->status = 2;
        $this->character1->save();
        $this->character2->save();
        $this->exceute_test(2, "Campaign_user status borde vara 2.");
    }

    public function testArchiveApplierWithNoPlayer()
    {
        $this->my_testdata_set1();
        $this->character1->status = 1;
        $this->character2->status = 0;
        $this->character1->save();
        $this->character2->save();
        $this->exceute_test(0, "Campaign_user status borde vara 0.");
    }
    public function testArchiveSlpWithPlayer()
    {
        $this->my_testdata_set1();
        $this->the_campagin_user->status = 3;
        $this->the_campagin_user->save();
        $this->character1->status = 3;
        $this->character2->status = 2;
        $this->character1->save();
        $this->character2->save();
        $this->exceute_test(2, "Campaign_user status borde vara 2.");
    }

    private function my_testdata_set1()
    {
        $this->the_user = factory(App\User::class)->create();
        $this->the_user->id = 1;

        $this->Campaign = factory(Sagohamnen\Campaign\Campaign::class)->create();
        $this->Campaign->id = 1;
        $this->Campaign->save();

        $this->character1 = factory(Sagohamnen\Character\Character::class)->create();
        $this->character1->id = 1;
        $this->character1->status = 2;
        $this->character1->user_id = 1;
        $this->character1->campaign_id = 1;
        $this->character1->save();

        $this->character2 = factory(Sagohamnen\Character\Character::class)->create();
        $this->character2->id = 2;
        $this->character2->status = 1;
        $this->character2->user_id = 1;
        $this->character2->campaign_id = 1;
        $this->character2->save();

        /*$this->the_campagin_user = new campaign_user();
        $this->the_campagin_user->user_id = 1;
        $this->the_campagin_user->campaign_id = 1;
        $this->the_campagin_user->status = 2;
        $this->the_campagin_user->save();
    }

    private function exceute_test($expected_status, $failure_message)
    {
        $this->actingAs($this->the_user)
             ->withSession(['foo' => 'bar'])
             ->visit('/api/character/1/leave_campaign')
             ->seeJson([ 'success' => true]);
        $the_campagin_user = campaign_user::where(['user_id'=>1, 'campaign_id' => 1])->first();
        $status = $the_campagin_user->status;
        $this->assertTrue($status == $expected_status, $failure_message);
    }*/
}