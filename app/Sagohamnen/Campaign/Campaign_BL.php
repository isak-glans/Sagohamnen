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
use Sagohamnen\Rpg_chat\Rpg_chat_BL;
use Sagohamnen\Character\Character_BL;
use Sagohamnen\Character\Character_repository;
use Sagohamnen\Last_read\Last_read_repository;
use App\Http\Requests;
use DB;

class Campaign_BL {

	private $camp_rep;
	private $user_rep;
	private $char_rep;
	private $Char_BL;

	private $status_none;
	private $status_applying;
	private $status_player;
	private $status_gamemaster;
	private $status_blocked;

	function __construct() {
		$this->camp_rep = new Campaign_repository();
		$this->user_rep = new User_repository();
		$this->char_rep = new Character_repository();

		$this->status_none 		= config('sh.campaign_user_status_none');
		$this->status_applying 	= config('sh.campaign_user_status_applying');
		$this->status_player 	= config('sh.campaign_user_status_playing');
		$this->status_gamemaster = config('sh.campaign_user_status_gamemaster');
		$this->status_blocked 	= config('sh.campaign_user_status_blocked');
	}

	public function campaigns_per_page($page_nr)
	{
        // Get info
        $data = $this->camp_rep->campaigns($page_nr);
        //dd($data);
        if ( $data === null ) return "not_found";

        // Count nr players in each campaign.
        /*echo "inne";
        for ($i=0; $i < count($data); $i++) :
            $data[$i]->nr_players = count($data[$i]->players);
            // Remove list of names on players,
            // to save bandwith with info sent back to client.
            // unset($campaigns[$i]->players);
        endfor;*/

        return $data;
	}

	public function can_create_new()
	{
		if (Auth::check() == false) return false;
        $user_id = Auth::id();
    	$nr_char_as_gm = $this->camp_rep->count_campaigns_i_am_gamemaster($user_id);
        return $nr_char_as_gm <= config('sh.max_nr_campaigns_as_gamemaster');
	}

	public function setup_edit_campaign($campaign_id)
	{
		return $this->camp_rep->setup_edit_campagin($campaign_id);
	}

	public function single_campaign($campaign_id)
	{
		// Get campaign data.
		$data = $this->camp_rep->campaign($campaign_id);
		if($data == null) return $data;

		// Start settings.
		$data->can_apply = false;
		$data->can_edit = false;
		$data->unread_chronicle = false;
		$data->unread_chat = false;
		$last_read_chronicle_id = 0;
		$last_read_chat_id = 0;

		$my_id = $this->user_rep->my_id();

		// Decide the user relation to campaign.
		$relation = $this->sort_and_decide_relation($data->characters, $my_id, $data->user_id);
		$data->i_am_gm = $relation->i_am_gm;
		$data->i_am_player = $relation->i_am_player;
		unset($data->characters);
		$data->players 		= $relation->players;
		$data->applicants 	= $relation->applicants;

		if ( $my_id === null) return $data;

		// Fetch repositories.
		$chronicle_BL = new Chronicle_BL();
  		$chat_BL = new Rpg_chat_BL();
		$last_read_rep = new Last_read_repository();

		// Last read
		$last_read_object = $last_read_rep->last_read_info($campaign_id, $my_id);

		//var_dump($last_read_object);
		$last_read_chronicle_id = $last_read_object['chronicle_id'];
		$last_read_chat_id = $last_read_object['chat_id'];

		// If no row for last_read, then create one.
		if ( $last_read_object == null) :
			$last_read_rep->create_new($campaign_id, $my_id);
			$last_read_chronicle_id = 0;
			$last_read_chat_id = 0;
		endif;
		//$data->blocked 		= $relation->blocked;

		// Unread chronicles or chats.
		if ( $relation->i_am_gm || $relation->i_am_player ) :
  			$data->unread_chat = $chat_BL->have_unread_chat( $campaign_id, $last_read_chat_id );
		endif;
		$data->unread_chronicle = $chronicle_BL->have_unread_chronicle( $campaign_id, $last_read_chronicle_id );
		unset($data->last_read);

		// Count campaigns I am playing in.
		$nr_campaigns_as_player = $this->char_rep->count_campaigns_i_am_playing($my_id);

		// Can I apply to this campaign?
		$data->can_apply = $this->can_i_apply($relation,$data->max_nr_players,$data->players_count,$nr_campaigns_as_player);

      	return $data;
	}

	public function sort_and_decide_relation($characters, $my_id, $gm_id)
	{
		// Am I applying, playing or GM:ing this campaign?
		// https://github.com/symfony/symfony/issues/2470
		$result = new \StdClass;
		$result->players = $result->applicants = $result->npc = $result->blocked = array();
		$result->i_am_player = $result->i_am_applying = $result->i_am_blocked = $result->i_am_gm = false;
		$result->i_am_gm = $my_id == $gm_id;

		if ( count($characters) > 0 ) {
			foreach($characters as $character ) {
		  		if ( $character->status == config('sh.character_status_playing') ){
		  			array_push($result->players, $character);
		  			if ($character->user_id == $my_id) $result->i_am_player = true;
		  		}
		  		elseif ( $character->status == config('sh.character_status_applying') ){
		  			array_push($result->applicants, $character);
		  			if ($character->user_id == $my_id) $result->i_am_applying = true;
		  		}
		  		elseif ($character->status == config('sh.character_status_blocked') ){
		  			array_push($result->blocked, $character);
		  			if ($character->user_id == $my_id) $result->i_am_blocked = true;
		  		}
		  		elseif ($character->status == config('sh.character_status_npc') ){
		  			array_push($result->npc, $character);
		  		}
			}
		}
		return $result;
	}

	public function can_i_apply($relation_to_campaign, $max_nr_players, $current_nr_players, $nr_campaigns_as_player)
	{
		if ($relation_to_campaign === null || $max_nr_players === null || $current_nr_players === null || $nr_campaigns_as_player === null)
			throw new exception("Can I apply miss parameter data in campaign_Bl->can_i_apply");

		// Is there space left in campaign.
		if ($max_nr_players <= $current_nr_players) return false;

		if ( $relation_to_campaign->i_am_gm ||
			$relation_to_campaign->i_am_player ||
			$relation_to_campaign->i_am_applying ||
			$relation_to_campaign->i_am_blocked )
			return false;

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

	public function campaign_applications_setup($campaign_id)
	{
		// Check if user signed in.
		if(Auth::check() === false) return false;

		// Find campaign and it´s name.
		/*$campaign = $this->camp_rep->identify_campaign($campaign_id);
		if($campaign === null) return false;*/

		// Get characters applying or playing in campaign.
		/*$this->Char_BL = new Character_BL();
		$result = $this->Char_BL->applying_or_playing_in_campaign($campaign_id);*/

		$result = $this->camp_rep->campaign_applications_setup($campaign_id);
		if ($result === null || empty($result)  || count($result) == 0) return false;
		return $result;
		// Can GM add more to campaign?

		//return array('characters' => $result, 'campaign' =>$campaign);
	}

	public function store_new($request)
	{
		// See if user owns the campaign.
        $my_id = $this->user_rep->my_id();
		if($my_id === false) return false;

		$campaign = new Campaign();
        $campaign->name             = $request->input('name');
        $campaign->genre            = $request->input('genre');
        $campaign->description      = $request->input('description');
        $campaign->max_nr_players   = $request->input('max_nr_players');
        $campaign->user_id			= $my_id;
        $campaign->status           = 1;
        $campaign->save();
	}

	public function update($request, $id)
	{
		// FInd the campaign.
		$campaign = $this->camp_rep->find_campaign($id);
        if ( ! $campaign ) return false;

        // See if user owns the campaign.
        $my_id = $this->user_rep->my_id();
        if ($my_id === null || $campaign->user_id != $my_id) return false;

        $campaign->name             = $request->input('name');
        $campaign->genre            = $request->input('genre');
        $campaign->description      = $request->input('description');
        $campaign->max_nr_players   = $request->input('max_nr_players');
        $campaign->save();
	}

	public function delete($id)
	{
		// FInd the campaign.
		$campaign = $this->camp_rep->find_campaign($id);
        if ( ! $campaign ) return false;

        // See if user owns the campaign.
        $my_id = $this->user_rep->my_id();
        if ($my_id === null || $campaign->user_id != $my_id) return false;

        // Set status to archived.
        $campaign->status = config('sh.campaign_status_archived');
        $campaign->save();
	}

	public function activate($id)
	{
		// FInd the campaign.
		$campaign = $this->camp_rep->find_campaign($id);
        if ( ! $campaign ) return false;

        // See if user owns the campaign.
        $my_id = $this->user_rep->my_id();
        if ($my_id === null || $campaign->user_id != $my_id) return false;

        // Set status to archived.
        $campaign->status =  config('sh.campaign_status_active');
        $campaign->save();
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