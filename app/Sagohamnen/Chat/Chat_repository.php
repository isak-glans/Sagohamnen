<?php
namespace Sagohamnen\Chat;

use Sagohamnen\Chronicle\chronicle;
use Sagohamnen\Campaign\Campaign;
use App\User;

class Chat_repository
{

	public function last_chat_id($campaign_id)
	{
		return Chat::where('campaign_id', $campaign_id)->max('id');
	}

}
