<?php
use Illuminate\Foundation\Testing\DatabaseMigrations;

use Sagohamnen\Chronicle\Chronicle_BL;
use Carbon\Carbon;

class SaveChronicleTest extends TestCase
{
	use DatabaseMigrations;

	protected $theUser;
    protected $chronicle_BL;
    protected $currentCampaignId = 1;

    public function setUp()
    {
        parent::setUp();

        $this->signIn();

        $this->chronicle_BL = new Chronicle_BL();

        // Make eleven chronicles.
        factory(Sagohamnen\Chronicle\Chronicle::class, 11)->create([
            'user_id'        =>1,
            'campaign_id'    =>1,
            'created_at'	 =>Carbon::now()->subSeconds(1)
        ]);
    }

    /** @test */
    public function user_is_spamming_chronicles()
    {
        $is_spamming = $this->chronicle_BL->is_spamming_chronicles(
        	$this->currentCampaignId,
        	$this->the_user->id);
        $this->assertTrue($is_spamming);
    }

    /** @test */
    public function user_is_not_spamming_chronicles()
    {
    	// Another user have written input after mine.
        factory(Sagohamnen\Chronicle\Chronicle::class)->create([
            'user_id'        =>2,
            'campaign_id'    =>1,
            'created_at'	 =>Carbon::now()
        ]);

        $is_spamming = $this->chronicle_BL->is_spamming_chronicles(
        	$this->currentCampaignId,
        	$this->the_user->id);
        $this->assertFalse($is_spamming);
    }
}