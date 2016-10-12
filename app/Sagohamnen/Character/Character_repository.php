<?php

namespace Sagohamnen\Character;

use Sagohamnen\Character\Character;
use Sagohamnen\Campaign\campaign_user;
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
		$this->char_status_none = config('sh.character_status_none');
		$this->char_status_applying = config('sh.character_status_applying');
		$this->char_status_playing = config('sh.character_status_playing');
		$this->char_status_npc = config('sh.character_status_npc');
		$this->char_status_erased = config('sh.character_status_erased');
	}

	public function show($id)
	{
		return Character::select('*')->where('id',$id)->whereNotIn('status', [$this->char_status_deleted])->with('portrait', 'User', 'campaign')->first();
	}

	public function store_character($character)
	{

	}

	public function find($id)
	{
		return Character::select('id', 'name', 'user_id', 'campaign_id', 'status')->where('id', $id)->first();
	}

	public function change_status_query1($id)
	{
		return Character::select('id', 'status')->with('campagin_user_status')->where('id', $id)->first();
	}

	/*public function owner_campaign_status($user_id)
	{
		return Character
	}*/

	public function playing_or_applying_in_campaign($campaign_id)
	{
		return Character::select('id','name', 'status', 'portrait_id')->where('campaign_id', $campaign_id)->whereIn('status', [$this->char_status_applying, $this->char_status_playing])->with('portrait')->get();
	}

	public function owned_by_user_in_campaign($campaign_id, $user_id)
	{
		return Character::select('id', 'status')->where(['user_id' => $user_id, 'campaign_id' => $campaign_id])->get();
	}

	public function count_mine_playing_in_campaign($user_id, $campaign_id)
	{
		return Character::where(['campaign_id' => $campaign_id, 'user_id' => $user_id, 'status' =>$this->char_status_player])->count();

		/*return Campaign_user::where(['campaign_id' => $campaign_id, 'status' => $this->status_player ])->count();*/
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
}