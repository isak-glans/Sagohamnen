<?php

namespace Sagohamnen\Character;

use Sagohamnen\Character\Character_repository;
use Sagohamnen\User\User_repository;

class Character_BL
{
	private $char_rep;
	private $user_rep;

	function __construct() {
		$this->char_rep = new character_repository();
		$this->user_rep = new user_repository();
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
}
