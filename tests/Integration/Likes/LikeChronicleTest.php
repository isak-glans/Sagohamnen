<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use Sagohamnen\Like\Like;
use Sagohamnen\Chronicle\chronicle;

class LikeChronicleTest extends TestCase
{
	use DatabaseMigrations;

	protected $the_user;
	protected $chronicle;

	public function setUp()
	{
		parent::setUp();

		// This functionality can be found
		// in TestCae.php
		$this->signIn();

        $this->chronicle = factory(Sagohamnen\Chronicle\Chronicle::class)->create([
            'status'    	=> 1,
            'user_id'   	=> 2,
            'campaign_id'   => 1,
        ]);
	}

    /** @test */
    public function user_can_like_a_this_chronicle()
    {
        $this->chronicle->like();

        $this->seeInDatabase('likes', [
        	'user_id'		=> $this->the_user->id,
        	'likeable_id'	=> $this->chronicle->id,
        	'likeable_type'	=> get_class($this->chronicle)
        ]);

        $this->assertTrue($this->chronicle->isLiked());
    }

    /** @test */
    public function user_can_unlike_a_this_chronicle()
    {
        $this->chronicle->like();
        $this->chronicle->unlike();

        $this->notSeeInDatabase('likes', [
        	'user_id'		=> $this->the_user->id,
        	'likeable_id'	=> $this->chronicle->id,
        	'likeable_type'	=> get_class($this->chronicle)
        ]);

        $this->assertFalse($this->chronicle->isLiked());
    }

    /** @test */
    public function a_user_can_toggle_like_chronicle()
    {
        $this->chronicle->toggle();
        $this->assertTrue($this->chronicle->isLiked());

        $this->chronicle->toggle();
        $this->assertFalse($this->chronicle->isLiked());
    }

    public function a_post_know_how_many_likes_it_has()
    {
        $this->chronicle->toggle();

        $this->assertEquals(1, $this->chronicle->likesCount() );
    }

}
