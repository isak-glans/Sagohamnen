<?php
use Illuminate\Foundation\Testing\DatabaseMigrations;

use Sagohamnen\Rpg_chat\Rpg_chat_BL;

class rpgUpdateTest extends TestCase
{
	use DatabaseMigrations;

	public function setup()
	{
		parent::setUp();
        $this->signIn();

        $this->set_user_as_player($this->the_user->id);
        $this->getCsrfToken();
	}

	public function get_active_users()
	{
		// Get the active users.
        $result_container->active_users = $last_read_BL->active_users($campaign_id);

	}


}