<?php

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Carbon\Carbon;
use Sagohamnen\Last_read\Last_read_BL;

class LastReadTest extends TestCase
{
	use DatabaseMigrations;
	private $rep;

	public function setup() {
		parent::setUp();
		$this->rep = new Last_read_BL();
	}

	/** @test */
	public function show_two_users_in_rpg_room()
	{
		$user = factory(App\User::class,2)->create();
		$campaign_id = 1;

		factory(Sagohamnen\Last_read\Last_read::class)->create([
			'user_id' => 1,
			'campaign_id' => 1,
			'activity'	=> Carbon::now()
		]);

		factory(Sagohamnen\Last_read\Last_read::class)->create([
			'user_id' => 2,
			'campaign_id' => 1,
			'activity'	=> Carbon::now()
		]);

		// It should return an array of two objects.
		$result = $this->rep->active_users($campaign_id);
		$nr_of_objects = count($result);
		$this->assertEquals($nr_of_objects, 2);

		// Find a user with ID 1 and 2
		$user_one_found = false; $user_two_found = false;
		foreach ($result as $user) {
			if ($user ==1) $user_one_found = true;
			else if ($user ==2) $user_two_found = true;
		}
		// If both true, then both were found.
		$both_found = $user_one_found && $user_two_found;
		$this->assertTrue($both_found, 'Active users in RPG did not find the 2 expected users');

	}

}