<?php
use Illuminate\Foundation\Testing\DatabaseMigrations;

use Sagohamnen\Rpg_chat\Rpg_chat_BL;

class rpgSetupTest extends TestCase
{
	use DatabaseMigrations;

	public function setup()
	{
		parent::setUp();
        $this->signIn();

        $this->set_user_as_player($this->the_user->id);
        $this->getCsrfToken();
	}

	/** @test */
	public function remove_chats_from_campaign()
	{
		// If the campaign have too many chats, remove some.

		$max_limit = config('sh.chat_max_nr_entries');
		$extra_entries = 5;
		$bl = new Rpg_chat_BL();
		$campaign_id = 1;

		// Make too many chats.
		factory( Sagohamnen\Rpg_chat\Rpg_chat::class, $max_limit +$extra_entries )->create([
            'campaign_id'    =>1
        ]);

        $bl->trim_campaign_chat($campaign_id);

        // Now all chats should not be there.
        $this->dontSeeInDatabase('rpg_chats', ['id' => $extra_entries ]);
	}
}