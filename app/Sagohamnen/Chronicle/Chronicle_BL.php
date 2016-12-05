<?php
namespace Sagohamnen\Chronicle;

use Illuminate\Database\Eloquent\Model;
use Sagohamnen\Chronicle\Chronicle_repository;
use Sagohamnen\Campaign\Campaign_repository;
use Sagohamnen\Character\Character_repository;
use Sagohamnen\Chat\Chat_repository;
use Auth;
use Carbon\Carbon;

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

		// If GM and he picked no character (id equal zero),
		// then set it to null. Character_id is nullable.
		if ($character_id == 0) $character_id = null;

		// Check if user logged in.
		if (Auth::check() == false) return false;
        $my_id = Auth::id();

        // Character checks.
        if ($character_id !== null ){
        	// Do it exist.
        	$the_character = $character_rep->find_in_campaign($character_id, $campaign_id);
	        if ($the_character == null) return false;

	        // Is it mine?
	        if ($my_id != $the_character->id ) return false;
        }

		// Check if campaign exist.
		$the_campaign = $campaign_rep->identify_campaign($campaign_id);
		if ($the_campaign == null) return false;

		// Am I the GM or player?
		$me_gm = $my_id == $the_campaign->user_id;
		$me_player = $character_rep->count_mine_playing_or_npc_in_campaign($my_id, $campaign_id);

		// If I am neither GM or player, dont continue.
		if ( $me_player == false && $me_gm == false ) return false;

		// If user spamming, dont save.
		if ( $this->is_spamming_chronicles($campaign_id, $my_id) ) return null;

		// If code reach here, it is okay to save it.
		$obj_to_store = new \StdClass;
		$obj_to_store->text 		= $text;
		$obj_to_store->campaign_id 	= $campaign_id;
		$obj_to_store->character_id = $character_id;
		$obj_to_store->user_id		= $my_id;

		// Store it
		$table_id = $this->chronicle_rep->store($obj_to_store);

		return $table_id;
	}

	public function is_spamming_chronicles($campaign_id, $my_id)
	{
		// Make sure the user is not spamming entries.
		// Check last (say 10 entries) and check if all is made by me.
		$max_nr = config('sh.max_chronicles_in_row');
		$spamming = true;

		// Get last chronicle entries made.
		$last_chronicles = $this->chronicle_rep->latest_chronicles_in_rpg($campaign_id, $max_nr);

		// If rpg have no chronicle entries.
		if ($last_chronicles == null) return false;

		// If rpg have less then max_nr of chronicles in row.
		if (count($last_chronicles) < $max_nr ) return false;

		// Check if all has been made by me.
		foreach ($last_chronicles as $chronicle ) {
			// If any chronicle not mine, then I am not spamming.
			if ( $chronicle->user_id != $my_id) {
				$spamming = false;
			}
		}

		$apa = $spamming == true ? "true" : "false";
		return $spamming;

		//echo "my_last_entry: " .$my_last_entry;
		/*echo "<pre>";
		print_r($my_last_entry);
		echo "</pre>";*/

		/*if ($my_last_entry) {
			// Check if done within minute.
			$last_entry = Carbon::parse( $my_last_entry );
			//echo "my_last_entry as Carbon: " .$last_entry;
            $now = Carbon::now();

            // See if last activity less then one minute ago.
            // lte = Less Then or Equal to.
            if ( $last_entry->gte( $now->subMinute() ) ) {
            	//echo " Mindre än 1 minut sedan. ";
                return true;
            }
		}
		return false;*/

	}

}
