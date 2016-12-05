<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;
use Sagohamnen\campaign\campaign;
use Sagohamnen\character\character;
use Sagohamnen\Rpg_chat\Rpg_chat;
use Sagohamnen\Rpg_chat\Rpg_chat_BL;
use Carbon\Carbon;


class saveChatTest extends TestCase
{
	use DatabaseMigrations;

	protected $the_user;
	protected $chat;

	public function testSaveChatAsPlayer()
	{
		$rep = new Rpg_chat_BL( true);
		$this->setupData(true);

		// Authenticate me.
		$this->be($this->the_user);

		// Call BL.
		$result = $rep->store($this->chat);

		// See if stored.
		$chats = Rpg_chat::select('id', 'text')->where('text', 'Detta är ett test.')->first();
		$is_found = $chats === null ? false: true;
		//if ($is_found) echo $chats->text;

		$this->assertTrue($is_found);
	}

	public function testSaveChatNotPlayer()
	{
		$rep = new Rpg_chat_BL( true);
		$this->setupData(false);

		// Authenticate me.
		$this->be($this->the_user);

		// Call BL.
		$result = $rep->store($this->chat);

		// See if stored.
		$chats = Rpg_chat::select('id', 'text')->where('text', 'Detta är ett test.')->first();
		$is_found = $chats === null ? false: true;
		//if ($is_found) echo $chats->text;

		$this->assertFalse($is_found, 'En user kan spara chat utan att vara spelare.');
	}

	private function setupData( $playing){
		$this->the_user = new User();
        $this->the_user->id = 1;
        $this->the_user->name = "isak";
        $this->the_user->rating = 0;
        $this->the_user->status = 1;
        $this->the_user->save();

        $campaign = new campaign();
        $campaign->id = 1;
        $campaign->name = "test";
        $campaign->description = "bla lba";
        $campaign->genre = "eon";
        $campaign->status = 1;
        $campaign->rating = 0;
        $campaign->user_id = 2;
        $campaign->save();

        $character = new character();
        $character->id = 1;
        $character->user_id = 1;
        $character->status = $playing ? 2 : 1;
        $character->name = "pelle";
        $character->campaign_id = 1;
        $character->description = "test gubbe";
        $character->portrait_id = 1;
        $character->secret_data = "1";
        $character->excerpt = "1";
        $character->save();

        // Make a chat.
		$this->chat = new Rpg_chat();
		$this->chat->user_id = 1;
		$this->chat->campaign_id = 1;
		$this->chat->type = config('sh.chat_type_chat');
		$this->chat->text  = "Detta är ett test.";
		$timeNow = Carbon::now();
		$this->chat->created_at = $timeNow;
	}
}
