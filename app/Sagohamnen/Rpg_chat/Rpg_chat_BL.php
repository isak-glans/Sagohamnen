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
		// Get chats
		$result = $this->rep->chats_id_back($campaign_id, $last_read_id);
		$newest_chats = new \StdClass;

		// If no new chat found.
		if (count($result) == 0) {
			$newest_chats->last_chat_id = $last_read_id;
			return $newest_chats;
		}

		// Format result
		$result_obj = $this->convertChatResult($result);

		// Calculate latest id.
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
		if (Auth::check() == false) abort(401);
        $my_id = Auth::id();

		// Check if user part of campaign.
		if(! $this->is_user_part_of_campaign($data->campaign_id, $my_id))
			abort(401);

		// Is spamming?
		if ( $this->user_is_spaming_chat($my_id, $data->campaign_id) )
			abort(429, "The user is flooding the chat.");

		// Store
		$new_chat = $this->rep->store(
			$data->campaign_id,
			$my_id,
			$data->text,
			config('sh.chat_type_chat'));

		return $new_chat;
	}

	public function store_dices($data)
	{
		$result = 0;

		if (Auth::check() == false) return false;
        $my_id = Auth::id();

		// Check if user part of campaign.
		if(! $this->is_user_part_of_campaign($data->campaign_id, $my_id))
			return false;

		// Is spamming?
		if ( $this->user_is_spaming_chat($my_id, $data->campaign_id) )
			abort(429, "The user is flooding the chat.");

		// Role the dices.
		$helper = new \Sagohamnen\Helpers\Dice_helper\DiceHelper();
		$dice_result =  $helper->role_dices($data->dice_nr, $data->dice_type, $data->dice_mod, $ob = $data->dice_ob);

		$dices_string = "";
		// If dices.
		if (count($dice_result['dices']) > 0 ) {

			// Format dice to string.
			$nr_dices = count($dice_result['dices']);
			for( $x=0; $x < $nr_dices ; $x++){
				$dices_string .= $dice_result['dices'][$x];
				if ($x != $nr_dices -1 ) $dices_string .= ", ";
			}

			// Check if OB should be displayed in result.
			$ob_character = $data->dice_ob ? "ob " : "";

			// Add dot if needed in description.
			if ( $data->dice_description != "" &&
				substr($data->dice_description,-1) != ".")
				$data->dice_description .= ".";

			$mod = $data->dice_mod;
			if ($data->dice_mod > 0) $mod = "+". $data->dice_mod; // Add plus character.
			else if ($data->dice_mod < 0) $mod = $data->dice_mod; // Add plus character.
			else  $mod = ""; // If Mod = 0 dont display it.

			// Concate results to text.
			$result_text = " slog " . $ob_character . $data->dice_nr . "T" . $data->dice_type . $mod;
			$result_text .= " och fick " . $dice_result['result'] . " (" . $dices_string . ").";
			if ($data->dice_description != "")
				$result_text .=  " Motivering: " . $data->dice_description;

		} else {
			$result_text = "";
		}

		// Save it as chat.
		$new_chat = $this->rep->store(
			$data->campaign_id,
			$my_id,
			$result_text,
			config('sh.chat_type_dice'));

		return $new_chat;
	}

	/*==========================================
			Private functions
	========================================== */

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

	public function user_is_spaming_chat($my_id, $campaign_id)
	{
		$spamming = true;
		$nr_entries_before_spam = config('sh.chat_spam_nr');

		// Get a number of entries back.
		$entries = $this->rep->last_x_chats($campaign_id, $nr_entries_before_spam);

		// If not enough entries made.
		if (count($entries) < $nr_entries_before_spam) return false;

		if(!!$entries && count($entries) > 0 ) {
			foreach ($entries as $entry) {
				// Check if all is made by me.
				if ($entry->user_id != $my_id) {
					$spamming = false;
					break;
				}
			}
		}
		return $spamming;
	}

	public function trim_campaign_chat($campaign_id)
	{
		// If the campaign have too many chats, then trim
		// the campaign chat.

		// Max number of chats allowed in campaign. Lets say 50.
		$too_many_limit = config('sh.chat_max_nr_entries');
		// Lets say 52.
		$last_chat_in_campaign = $this->rep->last_chat_id($campaign_id);

		if (! $last_chat_in_campaign) return; // No chat found.

		// If last Id was 52, the remove all
		// entries that was an ID lower then or equal to 2.
		$trim_from_id = $last_chat_in_campaign - $too_many_limit;

		if ($trim_from_id <= 1) return; // Too few.

		// Remove all chat entries with lower ID that are part of campaign.
		$this->rep->delete_chats_with_older_id($campaign_id, $trim_from_id);

	}

}
