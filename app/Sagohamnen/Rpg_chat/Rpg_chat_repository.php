<?php
namespace Sagohamnen\Rpg_chat;

use Sagohamnen\Chronicle\chronicle;
use Sagohamnen\Campaign\Campaign;
use App\User;

use Carbon\Carbon;

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

	public function last_x_chats($campaign_id, $nr_of_chats)
	{
		return Rpg_chat::select('id','text', 'created_at', 'user_id', 'type')->where('campaign_id', $campaign_id)->take($nr_of_chats)->orderBy('id', 'DESC')->get();
	}

	public function delete_chats_with_older_id($campaign_id, $has_lower_id)
	{
		$chats_to_delete = Rpg_chat::select('id')->where('campaign_id', $campaign_id)->where('id', '<=', $has_lower_id)->get();

		echo $chats_to_delete;

		if(count($chats_to_delete) > 0 ){
			foreach($chats_to_delete as $chat){
				$chat->delete();
			}
		}
	}

	public function store($campaign_id, $user_id, $text, $type)
	{
		$new_chat = new Rpg_chat();
		$new_chat->campaign_id 	= $campaign_id;
		$new_chat->user_id 		= $user_id;
		$new_chat->text 		= $text;
		$new_chat->type 		= $type;
		$new_chat->created_at 	= Carbon::now();
		$new_chat->save();

		return $new_chat;
	}

}
