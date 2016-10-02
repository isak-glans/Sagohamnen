<?php

namespace Sagohamnen\Character;

use Sagohamnen\Character\Character;
use Sagohamnen\Campaign\campaign_user;

class Character_repository
{
	private $char_status_archived = 0;
	private $char_status_applying = 1;
	private $char_status_player = 2;
	private $char_status_gamemaster = 3;
	private $char_status_deleted = 4;

	public function show($id)
	{
		return Character::select('*')->where('id',$id)->whereNotIn('status', [$this->char_status_deleted])->with('portrait', 'User', 'campaign')->first();
	}

	public function store_character($character)
	{

	}

	public function find($id)
	{
		return Character::select('id', 'name', 'user_id')->where('id', $id)->first();
	}
}