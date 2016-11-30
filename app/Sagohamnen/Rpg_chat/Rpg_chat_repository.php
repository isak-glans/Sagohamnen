<?php
namespace Sagohamnen\Rpg_chat;

use Sagohamnen\Chronicle\chronicle;
use Sagohamnen\Campaign\Campaign;
use App\User;

class Rpg_chat_repository
{

	public function last_chat_id($campaign_id)
	{
		return Rpg_chat::where('campaign_id', $campaign_id)->max('id');
	}

	public function chats_time_back($campaign_id, $dateHowOld)
	{
		return Rpg_chat::select('id', 'text', 'created_at', 'user_id', 'type')->with('user')->where('campaign_id', $campaign_id)->where('created_at', '>=', $dateHowOld)->take(40)->get();
	}

	public function chats_id_back($campaign_id, $dateId)
	{
		return Rpg_chat::select('id','text', 'created_at', 'user_id', 'type')->where('campaign_id', $campaign_id)->where('id', '>', $dateId)->take(40)->orderBy('id', 'DESC')->get();
	}

	public function store($campaign_id, $user_id, $text, $type)
	{
		$new_chat = new Rpg_chat();
		$new_chat->campaign_id 	= $campaign_id;
		$new_chat->user_id 		= $user_id;
		$new_chat->text 		= $text;
		$new_chat->type 		= $type;
		$new_chat->save();
	}

}
