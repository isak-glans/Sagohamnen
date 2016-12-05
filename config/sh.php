<?php
return [
	'user_status_deleted'				=>0,
	'user_status_active'				=>1,
	'user_status_admin'					=>2,

	'character_status_archived'			=> 0,
	'character_status_applying'			=> 1,
	'character_status_playing'			=> 2,
	'character_status_npc'				=> 3,
	'character_status_erased'			=> 4,
	'character_status_blocked'			=> 5,

	'campaign_status_archived'			=> 0,
	'campaign_status_active'			=> 1,
	'max_nr_campaigns_as_gamemaster'	=> 2,

	'chat_type_chat'					=> 0,
	'chat_type_dice'					=> 1,
	'dice_types'						=> [4,6,8,12,20,100],
	'dice_mod_types'					=> [0,1],

	'max_nr_characters_in_campaign'		=> 1,
	'max_chronicles_in_row'				=> 10,

	'chronicle_status_deleted'			=> 0,
	'chronicle_status_active'			=> 1,

	'apa' => env('FB_REDIRECT_DEV'),
];