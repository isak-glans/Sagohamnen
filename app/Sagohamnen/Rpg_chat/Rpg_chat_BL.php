<?php
namespace Sagohamnen\Rpg_chat;

use App\User;
use Carbon\Carbon;
use Auth;
use Sagohamnen\Rpg_chat\Rpg_chat_repository;
use Sagohamnen\Character\Character_repository;
use Sagohamnen\Campaign\Campaign_repository;

class Rpg_chat_BL
{
	protected $rep;

	public function __construct()
	{
		$this->rep = new Rpg_chat_repository();
	}

	public function get_latest($campaign_id)
	{
		$dateBack = Carbon::now()->subDays(4);
		$latest_chats = $this->rep->chats_time_back($campaign_id, $dateBack);
		return $this->convertChatResult($latest_chats);
	}

	public function get_newest($campaign_id, $last_read_id)
	{
		$result = $this->rep->chats_id_back($campaign_id, $last_read_id);
		$newest_chats = new \StdClass;

		// If no new chat found.
		if (count($result) == 0) {
			$newest_chats->last_chat_id = $last_read_id;
			return $newest_chats;
		}

		$result_obj = $this->convertChatResult($result);
		$highest_id = 0;

		foreach($result_obj as $row)
		{
			if ($row->id > $highest_id) $highest_id = $row->id;
		}

		$newest_chats->last_chat_id = $highest_id;
		$newest_chats->chats = $result_obj;

		return $newest_chats;
	}

	private function convertChatResult($data)
	{
		$result = array();
		if( count($data) > 0) {
			foreach($data as $row)
			{
				$one_chat = new \StdClass;
				$one_chat->id = $row->id;
				//$one_chat->name = $row->user->name;
				$one_chat->user_id = $row->user_id;
				$one_chat->text = $row->text;
				$created = Carbon::parse( $row->created_at );
				$one_chat->date = $created->format('Y-m-d H:i');
				$one_chat->type = $row->type;
				array_push($result, $one_chat);
			}
		} else $result = null;

		return $result;
	}

	public function have_unread_chat($campaign_id, $last_read_chat)
	{
		$chat_rep = new Rpg_chat_repository();
		$last_chat_id = $chat_rep->last_chat_id($campaign_id);
		return $last_chat_id > $last_read_chat ? true: false;
	}

	public function store($data)
	{
		if (Auth::check() == false) return false;
        $my_id = Auth::id();

		// Check if user part of campaign.
		if(! $this->is_user_part_of_campaign($data->campaign_id, $my_id))
			return false;

		return $this->rep->store(
			$data->campaign_id,
			$data->user_id,
			$data->text,
			config('sh.chat_type_chat'));
	}

	public function store_dices($data)
	{
		$result = 0;

		if (Auth::check() == false) return false;
        $my_id = Auth::id();

		// Check if user part of campaign.
		if(! $this->is_user_part_of_campaign($data->campaign_id, $my_id))
			return false;

		// See if dice type valid.
		if ( !in_array($data->dice_type, config('sh.dice_types') ) ) return false;
		// See if dice mod type valid.
		if ( !in_array($data->dice_mod_type, config('sh.dice_mod_types') ) ) return false;

		// Check dice type.
		if ($data->dice_type == 7) {
			// Role OB T6.
		} else {
			// Role ordinary dices.
			for($x=0; $x <= $data->dice_nr; $x++){
				$result += rand(1,$data->dice_type);
				if ($x > 1000)break;
			}

			if ($data->dice_mod_type == 0) {
				// Add.
				$result += $data->dice_mod;
				$result_text = "slog " . $data->dice_nr . "T" . $data->dice_type . "+" . $data->dice_mod . " och fick " . $result . ". " . $data->dice_description;
			}else {
				// Substract
				$result -= $data->dice_mod;
				$result_text = "slog " . $data->dice_nr . "T" . $data->dice_type . "-" . $data->dice_mod . " och fick " . $result . ". " . $data->dice_description;
			}
		}

		// Save it as chat.
		$this->rep->store(
			$data->campaign_id,
			$my_id,
			$result_text,
			config('sh.chat_type_dice'));

		return true;
	}

	private function is_user_part_of_campaign($campaign_id, $my_id){
		$char_rep = new Character_repository();
		$camp_rep = new Campaign_repository();

		// See if have character playing in the campaign.
		$have_playing_or_npc = $char_rep->count_mine_playing_or_npc_in_campaign($my_id, $campaign_id);
		if ($have_playing_or_npc) return true;

		// See if user is GM.
		$gm_id = $camp_rep->find_gamemaster_id($campaign_id);
		if ($gm_id->id == $my_id) return true;

		return false;
	}

}
