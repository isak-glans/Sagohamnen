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

	private $camp_user_status_none;
	private $camp_user_status_applying;
	private $camp_user_status_playing;
	private $camp_user_status_gamemaster;
	private $camp_user_status_blocked;


	function __construct() {
		$this->char_rep = new character_repository();
		$this->user_rep = new user_repository();

		$this->char_status_archived 	= config('sh.character_status_none');
		$this->char_status_applying 	= config('sh.character_status_applying');
		$this->char_status_playing 		= config('sh.character_status_playing');
		$this->char_status_gamemaster 	= config('sh.character_status_gamemaster');
		$this->char_status_erased 		= config('sh.character_status_erased');

		$this->camp_user_status_none 		= config('sh.campaign_user_status_none');
		$this->camp_user_status_applying 	= config('sh.campaign_user_status_applying');
		$this->camp_user_status_playing 	= config('sh.campaign_user_status_playing');
		$this->camp_user_status_gamemaster 	= config('sh.campaign_user_status_gamemaster');
		$this->camp_user_status_blocked 	= config('sh.campaign_user_status_blocked');
	}

	public function show($id)
	{
		$result = $this->char_rep->show($id);
		if($result === null) return "not_found";
		// Can user edit it?
		if (isset($result->user_id) === false ) return false;
		$my_id 	= $this->user_rep->my_id();
		if($my_id !== null) :
			// Is this my character?
			$result->can_edit = $result->user_id == $my_id;
			// If you dont own character, dont show secret data.
			if ($result->can_edit === false ) :
				$result->secret_data = null;
			endif;
		else:
			$result->can_edit = false;
		endif;

		return $result;
	}

	public function store_character($formdata)
	{
		// See if character exist.
		// See if user own it.
		$actual_character = $this->char_rep->find($formdata['id']);
		$my_id 	= $this->user_rep->my_id();
		if ($my_id === null) return false;
		if($actual_character->user_id !== $my_id) return false;

		$actual_character->name 		= $formdata['name'];
		$actual_character->description 	= $formdata['description'];
		$actual_character->secret_data 	= $formdata['secret_data'];
		$actual_character->portrait_id 	= $formdata['portrait_id'];

		$actual_character->save();
		return true;
		// Store it
		//return $this->character_rep->store_character($actual_character);
	}

	public function leave_campaign($character_id)
	{
		// Find the character.
		$the_character = $this->char_rep->find($character_id);

		if ($the_character === null
			|| $the_character->user_id === null
			|| $the_character->campaign_id === null) return false;
		$campaign_id = $the_character->campaign_id;

		// Find my id.
		$my_id = Auth::id();
		//$my_id = $this->user_rep->my_id();
		if ($my_id === null) return false;
		$user_id = (int)$the_character->user_id;

		// Check if I own user.
		if( $user_id != $my_id ) return false;

		//return "Kookies! " . gettype($my_id) . " " . gettype($user_id);

		// If character is player or applying
		if ($the_character->status == $this->char_status_playing
			|| $the_character->status == $this->char_status_applying):

			$status = $the_character->status;
			$delete_player = $status == $this->char_status_playing;
			$delete_applier = $status == $this->char_status_applying;

			// All my characters in this campaign.
			if( $my_id != 1) return false;
			$my_characters = $this->char_rep->owned_by_user_in_campaign($campaign_id, $my_id);
			$playing_char = array();
			$applying_char = array();
			//if( count($my_characters) != 2) return false;

			foreach($my_characters as $character):
				if($character->status == $this->char_status_playing)
					array_push($playing_char, $character);
				if($character->status == $this->char_status_applying)
					array_push($applying_char, $character);
			endforeach;
			$nr_appliers 	= count($applying_char);
			$nr_players 	= count($playing_char);

			// Special condition to change campaign_user.status
			if ($delete_player && $nr_players == 1 && $nr_appliers == 0 ) :
				// Change campaign_user->status from 2 to 0.
				$this->char_rep->update_status_and_campaign_user_status($the_character, $this->char_status_erased, $this->camp_user_status_blocked);
			elseif ($delete_player && $nr_players == 1 && $nr_appliers >= 1 ) :
				// Change campaign_user->status from 2 to 1.
				$this->char_rep->update_status_and_campaign_user_status($the_character, $this->char_status_applying, $this->camp_user_status_applying);
			elseif ($delete_applier && $nr_players == 0 && $nr_appliers == 1) :
				// Change campaign_user->status from 1 to 0.
				$this->char_rep->update_status_and_campaign_user_status($the_character, $this->char_status_archived, $this->camp_user_status_archived);
			else:
				// Only change character status.
				$this->char_rep->archive_char($the_character);
			endif;
		else:

			// Character is archived or SLP.
			$this->char_rep->archive_char($the_character);
		endif;
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

		//$the_character = $this->char_rep->find($character_id);
		$the_character = $this->char_rep->change_status_query1($character_id);
		if($the_character === null) return null;

		dd($the_character);

		$current_char_status = $the_character->status;
		$user_campaign_status = $the_character->campaign_status->pivot->status;
		$i_am_gm = $user_campaign_status == config('sh.campaign_user_status_gamemaster');
		$is_my_char = $the_character->user_id == $my_id;

		if( is_new_status_ok($current_char_status, $new_char_status, $is_my_char, $i_am_gm) ) :
			$user_characters_in_campaign = $this->char_rep->owned_by_user_in_campaign($campaign_id, $my_id);
			$this->update_status($the_character, $new_char_status, $user_campaign_status, $user_characters_in_campaign);
		else :
			return false;
		endif;

		return true;
	}

	private function is_new_status_ok($current_char_status, $new_char_status, $is_my_char, $i_am_gm)
	{
		// Checking GM´s status change on characters that are
		// part of the his campaign.
		if ($new_char_status > $this->char_status_erased) return false;

		// NPC character
		if ($current_status == $this->char_status_npc):
			if ( $new_status == $this->char_status_archived && $i_am_gm )
				return true;
			else return false;
		endif;

		// Player character
		if ($current_status == $this->char_status_playing ):
			if( $new_status == $this->char_status_applying && ($is_my_char || $i_am_gm) ) return true;
			else return false;
		endif;

		// Applying character
		if ($current_status == $this->char_status_applying):
			if( $new_status == $this->char_status_playing && $i_am_gm )
				return true;
			elseif( $new_status == $this->char_status_archived && ($is_my_char || $i_am_gm) )
				return true;
			else return false;
		endif;

		// Archived character
		if ($current_status == $this->char_status_archived):
			if ( $new_status == $this->char_status_erased && $is_my_char)
				return true;
			elseif( $new_status == $this->char_status_applying && $is_my_char && $i_am_gm == false )
				return true;
			elseif( $new_status == $this->char_status_npc && $is_my_char && $i_am_gm )
				return true;
			else return false;
		endif;
	}

	public function update_status($character, $new_status, $user_campaign_status, $user_characters_in_campaign)
	{
		$new_campaign_user_status = $this->calculate_campaign_user_status($user_campaign_status, $user_characters_in_campaign);

		// Update if need to.
		if ( $user_campaign_status != $new_campaign_user_status ) :
			$this->character_rep->update_status_and_campaign_user_status($character,$user_campaign_status);
		else:
			$character->status = $new_status;
			$character->save();
		endif;
	}

	private function calculate_campaign_user_status($user_campaign_status, $user_characters_in_campaign)
	{
		// This method counts to see if
		// the user_campaign_status need to be updated.
		$characters = $user_characters_in_campaign;

		// If Gamemaster
		if ( count($characters->npc) > 0 ) $new_campaign_user_status = $this->char_status_gamemaster;
		// If Player
		elseif (count($characters->playing) > 0 ) $new_campaign_user_status = $this->char_status_playing;
		// If Applyer
		elseif (count($characters->applying) > 0 ) $new_campaign_user_status = $this->char_status_applying;
		// If no relation
		else $new_campaign_user_status = $this->char_status_none;

		return $new_campaign_user_status;
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
