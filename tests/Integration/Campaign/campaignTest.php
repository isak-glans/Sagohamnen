<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use Sagohamnen\Campaign\Campaign;

class campaignTest extends TestCase
{
	use DatabaseMigrations;

    public function testCampaign()
    {
    	$campaign = new Campaign();
    	$campaign->name = " äventyr1";
    	$campaign->genre = "Eon";
    	$campaign->max_nr_players = 4;
    	$campaign->rating = 4;
    	$campaign->description = " tom";
    	$campaign->status = 1;
    	$campaign->user_id = 1;
        $campaign->save();

        $this->get('api/campaign/1')
             ->seeJson([ 'id' => 1]);
    }
}

