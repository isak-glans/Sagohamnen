<?php

namespace Sagohamnen\Character;

use Sagohamnen\Character\Character_repository;
use Sagohamnen\User\User_repository;
use Auth;

class Character_BL
{
	private $char_rep;
	private $user_rep;

	private $char_status_archived;
	private $char_status_applying;
	private $char_status_playing;
	private $char_status_gamemaster;
	private $char_status_erased;

	function __construct() {
		$this->char_rep = new character_repository();
		$this->user_rep = new user_repository();

		$this->char_status_archived 	= config('sh.character_status_archived');
		$this->char_status_applying 	= config('sh.character_status_applying');
		$this->char_status_playing 		= config('sh.character_status_playing');
		$this->char_status_npc 			= config('sh.character_status_npc');
		$this->char_status_erased 		= config('sh.character_status_erased');
	}

	public function single_character($id)
	{
		// Get data
		$result = $this->char_rep->single_character($id);
		if($result === null) return "not_found";
		//if (isset($result->user_id) === false ) return false;

		$my_id 	= $this->user_rep->my_id();
		// Can user edit character?
		if ($my_id === null ) {
			// If you dont own character, dont show secret data.
			$result->secret_data = null;
			$result->can_edit = false;
			$result->i_am_gm = false;
		} else {
			// Is this my character?
			$result->can_edit = $result->user_id == $my_id;
			$result->i_am_gm = $my_id == $result->campaign->user_id;
			//$result->secret_data = $result->can_edit;
		}

		// If status archived, check if user are
		// allowed to set it back as player.
		// If he/she already have 1 character applying, this
		// can not be allowed.
		if ($result->status == config('sh.character_status_archived'))
		{
			// User are not allowed to edit it.
			$result->can_edit = false;

			$nr_character_not_archived = $this->char_rep->count_mine_not_archived($my_id, $result->campaign->id);
			//echo "Antal: " . $nr_character_not_archived. " max: " . config('sh.max_nr_characters_in_campaign');
			$result->can_reactivate = $nr_character_not_archived < config('sh.max_nr_characters_in_campaign');
		}

		return $result;
	}

	public function store_character($formdata)
	{
		$my_id 	= $this->user_rep->my_id();
		if ($my_id === null) return false;
		$this->char_rep->store_character($formdata, $my_id);
		return true;
	}

	public function update_character($formdata)
	{
		// See if character exist.
		$actual_character = $this->char_rep->find($formdata['id']);

		// See if user own it.
		$my_id 	= $this->user_rep->my_id();
		if ($my_id === null) return false;
		if($actual_character->user_id !== $my_id) return false;

		// Update
		$this->char_rep->update_character($actual_character, $formdata);
		return true;
	}

	public function applying_or_playing_in_campaign($campaign_id)
	{
		return $this->char_rep->playing_or_applying_in_campaign($campaign_id);
	}

	public function change_status($character_id, $new_char_status)
	{
		$my_id = Auth::id();
		if ($my_id === null) return null;

		$new_char_status = ctype_digit($new_char_status) ? intval($new_char_status) : null;
		if ($new_char_status === null) return null;

		// Get character and campaign data.
		$the_character = $this->char_rep->find_with_campaign($character_id);
		if($the_character === null) return null;

		$i_am_gm = $the_character->campaign->user_id == $my_id;
		//config('sh.campaign_user_status_gamemaster');
		$is_my_char = $the_character->user_id == $my_id;

		/*echo "<pre>";
		$katt= $i_am_gm ? 'true' : 'false';
		$fesk = $is_my_char ? 'true' : 'false';
		echo 'Current status: '. $the_character->status;
		echo 'New status: ' . $new_char_status;
		echo "I am gm: " . $katt;
		echo " Is my char: " .  $fesk;
		echo "</pre>";*/

		// Check if action okey.
		if( $this->is_new_status_ok($the_character->status, $new_char_status, $is_my_char, $i_am_gm) == false )
			return false;

		$the_character->status = $new_char_status;
		$the_character->save();
		return true;
	}

	private function is_new_status_ok($char_status, $new_char_status, $is_my_char, $i_am_gm)
	{
		// NPC character
		if ($char_status == $this->char_status_npc){
			if ( $new_char_status == $this->char_status_archived && $i_am_gm )
				return true;
			else return false;
		}

		// Player character
		if ($char_status == $this->char_status_playing ) {
			if( $new_char_status == $this->char_status_applying && ($is_my_char || $i_am_gm) )
				return true;
			else return false;
		}

		// Applying character
		if ($char_status == $this->char_status_applying) {
			if( $new_char_status == $this->char_status_playing && $i_am_gm )
				return true;
			elseif( $new_char_status == $this->char_status_archived && ($is_my_char || $i_am_gm) )
				return true;
			else return false;
		}

		// Archived character
		if ($char_status == $this->char_status_archived) {
			if ( $new_char_status == $this->char_status_erased && $is_my_char)
				return true;
			elseif( $new_char_status == $this->char_status_applying && $is_my_char && $i_am_gm == false )
				return true;
			elseif( $new_char_status == $this->char_status_npc && $is_my_char && $i_am_gm )
				return true;
			else return false;
		}

		// Not valid character status.
		return false;
	}

	private function sort_my_characters_in_campaign($characters)
	{
		$npc = array();
		$playing = array();
		$applying = array();
		//if( count($my_characters) != 2) return false;

		foreach($my_characters as $character):
			if($character->status == $this->char_status_npc)
				array_push($npc, $character);
			if($character->status == $this->char_status_playing)
				array_push($playing, $character);
			if($character->status == $this->char_status_applying)
				array_push($applying, $character);
		endforeach;

		return array('npc' => $npc, 'playing' => $playing, 'applying' => $applying);
	}
}
