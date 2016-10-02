<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class campaignTest extends TestCase
{
	use DatabaseMigrations;

    public function testCampaign()
    {
    	$Campaign = factory(Sagohamnen\Campaign\Campaign::class)->create();
        $Campaign->save();

        $this->get('api/campaign/1')
             ->seeJson([ 'id' => 1]);
    }
}
