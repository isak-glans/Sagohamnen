<?php
namespace Sagohamnen\Campaign;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Auth;
use Sagohamnen\Campaign\Campaign_players;
use Sagohamnen\Campaign\Campaign_repository;
use Sagohamnen\User\User_BL;
use Sagohamnen\User\User_repository;
use Sagohamnen\Chronicle\Chronicle_BL;
use Sagohamnen\Chat\Chat_BL;
use Sagohamnen\Character\Character_BL;


class Campaign_BL {

	private $camp_rep;
	private $user_rep;

	private $status_none 		= 0;
	private $status_applying 	= 1;
	private $status_player 		= 2;
	private $status_gamemaster 	= 3;
	private $status_blocked 	= 4;

	function __construct() {
		$this->camp_rep = new Campaign_repository();
		$this->user_rep = new User_repository();
	}

	public function single_campaign($campaign_id)
	{
		$data = $this->camp_rep->campaign($campaign_id);
		if($data == null) return $data;
		$data->can_apply = false;
		$data->can_edit = false;
		$data->unread_chronicle = false;
		$data->unread_chat = false;
		$data->nr_players = 0;
		foreach ($data->player_characters as $character):
			if($character->status == $this->status_player) $data->nr_players += 1;
		endforeach;

		$my_id = $this->user_rep->my_id();
		if ( $my_id === null) return $data;
      	$campaign_relation = $this->my_campaign_user_info($campaign_id, $my_id);

      	// If first visit in campaign
      	if ($campaign_relation === null) :
      		// User that are not part of campaign still need a row
      		// to store data of what chronicle id he/she read.
      		$this->camp_rep->create_relation_to_campagin($campaign_id, $my_id);
      		// Since code can't wait for request
      		// tell the user status in code.
      		$campaign_user_status =  $this->status_none;
      		$data->user_blocked = false;
      	else :
      		$data->can_edit = $campaign_relation->status == 2? true : false;
      		$campaign_user_status = $campaign_relation->status;
      		$data->user_blocked = $campaign_user_status === $this->status_blocked;
      		// Have unread chronicles or chat?
      		$last_read_chronicle = $campaign_relation->last_read_chro_id;
      		$last_read_chat = $campaign_relation->last_read_chat_id;
      		$chronicle_BL = new Chronicle_BL();
      		$chat_BL = new Chat_BL();
      		$data->unread_chronicle = $chronicle_BL->have_unread_chronicle($campaign_id, $last_read_chronicle);
      		if ($campaign_relation->status == $this->status_player || $campaign_relation->status == $this->status_gamemaster ) :
      			$data->unread_chat = $chat_BL->have_unread_chat($campaign_id, $last_read_chat);
  			endif;
      	endif;

      	// Can user apply?
      	$max_nr_players = $data->max_nr_players;
      	$current_nr_players = count($data->player_characters);
      	$nr_campaigns_as_player = $this->nr_campaigns_as_player($campaign_id);
      	$data->can_apply = $this->can_i_apply($campaign_id, $campaign_user_status, $max_nr_players, $current_nr_players, $nr_campaigns_as_player);
		return $data;
	}


	public function can_i_apply($campaign_id, $campaign_user_status, $max_nr_players, $current_nr_players, $nr_campaigns_as_player)
	{
		$my_id = $this->user_rep->my_id();
		if ( $my_id == null ) return false;

		// Is there space left in campaign.
		if ($max_nr_players <= $current_nr_players) return false;

		// Am I applying, playing or GM:ing this campaign?
		$can_apply = true;
		if( $campaign_user_status !== null ) :
			switch($campaign_user_status) :
				case $this->status_applying:
				case $this->status_player:
				case $this->status_gamemaster:
				case $this->status_blocked:
					$can_apply = false;
					break;
			endswitch;
			if ($can_apply == false) return false;
		endif;


		// Am I part of less then 2 campaigns?
		if ($nr_campaigns_as_player >= 2) return false;

		// If All ok return true.
		return true;
	}

	public function store_apply($form_data)
	{
		$campaign_id 	= $form_data['campaign_id'];
		$my_id 		= $form_data['my_id'];

		// Get campaign id and max_nr_players.
		$max_nr_players = $this->camp_rep->max_nr_players($campaign_id);
		if ($max_nr_players === null) return false;

		// 1. Check my relation to campaign.
		$the_campaign_user = $this->camp_rep->campaign_user_info($campaign_id, $my_id);
		$campaign_user_status = $the_campaign_user->status;
		// 1. Check my relation to campaign.
		if ($campaign_user_status === null) return false;

		$current_nr_players = $this->camp_rep->count_nr_players($campaign_id);
		//echo typeof($current_nr_players);
		// 1. Count nr players.
		if ($current_nr_players === null) return false;
		// 1. Count how many campaigns I part of.
		$nr_campaigns_as_player = $this->camp_rep->count_campaigns_i_am_playing($my_id);
		if ($nr_campaigns_as_player === null) return false;

		// Can I apply?
        $can_apply = $this->can_i_apply($campaign_id, $campaign_user_status, $max_nr_players, $current_nr_players, $nr_campaigns_as_player);
        if($can_apply === false) return false;

        // Store it
        $this->camp_rep->store_character_apply($form_data, $the_campaign_user);

        /*DB::transaction(function () use($form_data) {
        	// OBS behöver vara update, inte store.
            $a_campagin_user = new campaign_user();
            $a_campagin_user->user_id = $form_data['my_id'];
            $a_campagin_user->campaign_id = $form_data['campaign_id'];
            $a_campagin_user->created_at = date("Y-m-d H:i:s") ;
            $a_campagin_user->save();

            $rp = new Character();
            $rp->name = $form_data['name'];
            $rp->user_id = $form_data['my_id'];
            $rp->status = $this->char_status_applying;
            $rp->campaign_id = $data['campaign_id'];
            $rp->description = $data['description'];
            $rp->media_id = $data['portrait_id'];
            $rp->save();
        });*/
        return true;
	}



	public function identify_campaign($campaign_id)
	{
		return $this->camp_rep->identify_campaign($campaign_id);
	}
	public function count_nr_players($campaign_id)
	{
		$result = $this->camp_rep->count_nr_players($campaign_id);
		if($result == null) $result = 0;
		return $result;
	}
	private function nr_campaigns_as_player($my_id)
	{
		return $this->camp_rep->count_campaigns_i_am_playing($my_id);
	}
	private function my_campaign_user_info($campaign_id, $my_id)
	{
		return $this->camp_rep->campaign_user_info($campaign_id, $my_id);
	}
	private function prepare_for_apply($campaign_id, $my_id)
	{
		return $this->camp_rep->prep($campaign_id, $my_id);
	}

}