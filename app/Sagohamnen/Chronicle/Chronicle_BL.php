<?php
namespace Sagohamnen\Chronicle;

use Illuminate\Database\Eloquent\Model;
use Sagohamnen\Chronicle\Chronicle_repository;
use Sagohamnen\Campaign\Campaign_repository;
use Sagohamnen\Character\Character_repository;
use Sagohamnen\Chat\Chat_repository;
use Auth;

class Chronicle_BL {

	private $chronicle_rep;
	private $campaign_rep;
	private $campaign_id;

	public function __construct()
	{
		$this->chronicle_rep = new chronicle_repository();
		$this->campaign_rep = new campaign_repository();
	}

	public function chronicle_per_page($campaign_id, $page_nr)
	{
		$campaign = $this->campaign_rep->identify_campaign($campaign_id);
		$chronicles = $this->chronicle_rep->chronicle_per_page($campaign_id, $page_nr);
		return array("campaign" => $campaign, "chronicles" => $chronicles);
	}

	public function newest_chronicles_per_id($campaign_id, $last_chronicle_id)
	{
		$newest_chronicles = $this->chronicle_rep->newest_chronicle_per_id($campaign_id, $last_chronicle_id);

		// Create container object.
		$container_obj = new \StdClass;

		// If no newest chat found.
		if (count($newest_chronicles) == 0) {
			$container_obj->last_chronicle_id = $last_chronicle_id;
			return $container_obj;
		}

		// Find last (highest) chronicle ID that was returned.
		$highest_id = 0;
		foreach($newest_chronicles as $row)
		{
			if ($row->id > $highest_id) $highest_id = $row->id;
		}

		// Add result to container object.
		$container_obj->last_chronicle_id = $highest_id;
		$container_obj->chronicles = $newest_chronicles;

		return $container_obj;
	}

	public function have_unread_chronicle($campaign_id, $last_read_chronicle_id)
	{
		$chronicle_rep = new chronicle_repository();
		//$chat_rep = new Chat_repository();
		$last_chronicle_id = $chronicle_rep->last_chronicle_id($campaign_id);
		return $last_chronicle_id > $last_read_chronicle_id ? true: false;
	}

	public function store($request_data)
	{
		$campaign_rep = new campaign_repository();
		$character_rep = new character_repository();

		$campaign_id 	= $request_data->campaign_id;
		$text 			= $request_data->text;
		$character_id	= $request_data->character_id;

		// Check if user own the character.
		if (Auth::check() == false) return false;
        $my_id = Auth::id();

        // Check if the character exist.
        $the_character = $character_rep->find_in_campaign($character_id, $campaign_id);
        if ($the_character == null) return false;

        // Is it mine?
        if ($my_id != $the_character->id ) return false;

		// Check if campaign exist.
		$the_campaign = $campaign_rep->identify_campaign($campaign_id);
		if ($the_campaign == null) return false;

		// Am I the GM or player?
		$me_gm = $my_id == $the_campaign->user_id;
		$me_player = $character_rep->count_mine_playing_or_npc_in_campaign($my_id, $campaign_id);

		// If I am neither GM or player, dont continue.
		if ( $me_player == false && $me_gm == false ) return false;

		$obj_to_store = new \StdClass;
		$obj_to_store->text 			= $text;
		$obj_to_store->campaign_id 	= $campaign_id;
		$obj_to_store->character_id = $character_id;
		$obj_to_store->user_id		= $my_id;

		// Store it
		$this->chronicle_rep->store($obj_to_store);

		return true;
	}

}