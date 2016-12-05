<?php

namespace Sagohamnen\Character;

use Sagohamnen\Character\Character;
use DB;

class Character_repository
{
	private $char_status_none;
	private $char_status_applying;
	private $char_status_playing;
	private $char_status_npc;
	private $char_status_erased;

	public function __construct()
	{
		$this->char_status_none = config('sh.character_status_archived');
		$this->char_status_applying = config('sh.character_status_applying');
		$this->char_status_playing = config('sh.character_status_playing');
		$this->char_status_npc = config('sh.character_status_npc');
		$this->char_status_erased = config('sh.character_status_erased');
	}

	public function single_character($id)
	{
		return Character::select('*')->where('id', $id)->whereNotIn('status', [ config('sh.character_status_erased') ])->with('portrait', 'User', 'campaign')->first();
	}

	public function store_character($formdata, $my_id)
	{
		$new_character 					= new Character();
		$new_character->name 			= $formdata['name'];
		$new_character->user_id			= $my_id;
		$new_character->campaign_id		= $formdata['campaign_id'];
		$new_character->description 	= $formdata['description'];
		$new_character->secret_data 	= $formdata['secret_data'];
		$new_character->excerpt 		= $formdata['excerpt'];
		$new_character->portrait_id 	= $formdata['portrait_id'];
		$new_character->status 			= config('sh.character_status_applying');
		$new_character->save();
	}

	public function update_character($character, $formdata)
	{
		$character->name 			= $formdata['name'];
		$character->description 	= $formdata['description'];
		$character->secret_data 	= $formdata['secret_data'];
		$character->portrait_id 	= $formdata['portrait_id'];
		$character->excerpt 		= $formdata['excerpt'];
		$character->save();
	}

	public function find($id)
	{
		return Character::select('id', 'name', 'user_id', 'campaign_id', 'status')->where('id', $id)->first();
	}

	public function find_with_campaign($id)
	{
		return Character::select('id', 'name', 'user_id', 'campaign_id', 'status')->with('campaign')->where('id', $id)->first();
	}

	public function find_in_campaign($id, $campaign_id)
	{
		return Character::select('id', 'name', 'user_id', 'campaign_id', 'status')->where(['id' => $id, 'campaign_id' => $campaign_id])->first();
	}

	public function playing_or_applying_in_campaign($campaign_id)
	{
		return Character::select('id','name', 'status', 'portrait_id')->where('campaign_id', $campaign_id)->whereIn('status', [$this->char_status_applying, $this->char_status_playing])->with('portrait')->get();
	}

	public function playing_or_npc_in_campaign($campaign_id)
	{
		return Character::select('id','name', 'status', 'portrait_id')->where('campaign_id', $campaign_id)->whereIn('status', [config('sh.character_status_playing'), config('sh.character_status_npc') ])->get();
	}

	public function owned_by_user_in_campaign($campaign_id, $user_id)
	{
		return Character::select('id', 'status')->where(['user_id' => $user_id, 'campaign_id' => $campaign_id])->get();
	}

	public function count_mine_playing_in_campaign($user_id, $campaign_id)
	{
		return Character::where(['campaign_id' => $campaign_id, 'user_id' => $user_id, 'status' =>$this->char_status_player])->count();
	}

	public function count_mine_playing_or_npc_in_campaign($user_id, $campaign_id)
	{
		return Character::where(['campaign_id' => $campaign_id, 'user_id' => $user_id])->whereIn('status', [ config('sh.character_status_playing'), config('sh.character_status_npc')])->count() >= 1;
	}

	public function count_mine_not_archived($user_id, $campaign_id)
	{
		return Character::where(['campaign_id' => $campaign_id, 'user_id' => $user_id])->whereIn('status', [$this->char_status_applying, $this->char_status_playing])->count();
	}

	public function count_campaigns_i_am_playing($user_id)
	{
		return Character::where(['user_id' => $user_id, 'status' => config('sh.character_status_playing')])->groupBy('id')->count();
	}

	public function archive_char($the_character)
	{
		$the_character->status = $this->char_status_archived;
		$the_character->save();
	}
	public function update_status_and_campaign_user_status($the_character, $new_char_status, $new_campaign_user_status)
	{
		DB::transaction(function () use($the_character, $new_status) {

            $the_character->status = $new_char_status;
			$the_character->save();

            DB::table('campaign_user')
            ->where('user_id', $the_character->user_id)
            ->where('campaign_id', $the_character->campaign_id)
            ->update(['status' => $new_campaign_user_status,
            	'updated_at' => date("Y-m-d H:i:s")]);
        });
	}

	public function users_playing_in_campaign($campaign_id)
	{
		return Character::select('user_id')->where(['campaign_id' => $campaign_id, 'status' => $this->char_status_playing])->with('user_avatars')->groupBy('user_id')->get();
	}
}