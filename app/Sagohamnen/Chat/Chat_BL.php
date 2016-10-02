<?php
namespace Sagohamnen\Chat;
use Sagohamnen\Chat\Chat_repository;
use App\User;

class Chat_BL
{


	public function have_unread_chat($campaign_id, $last_read_chat)
	{
		$chat_rep = new Chat_repository();
		$last_chat_id = $chat_rep->last_chat_id($campaign_id);
		return $last_chat_id > $last_read_chat ? true: false;
	}

}
