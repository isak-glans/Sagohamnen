<?php
return [
	'campaign_user_status_none' 		=> 0,
	'campaign_user_status_applying' 	=> 1,
	'campaign_user_status_playing' 		=> 2,
	'campaign_user_status_gamemaster' 	=> 3,
	'campaign_user_status_blocked' 		=> 4,

	'character_status_archived'			=> 0,
	'character_status_applying'			=> 1,
	'character_status_playing'			=> 2,
	'character_status_npc'				=> 3,
	'character_status_erased'			=> 4,
	'character_status_blocked'			=> 5,

	'campaign_status_archived'			=> 0,
	'campaign_status_active'			=> 1,
	'max_nr_campaigns_as_gamemaster'	=> 2,

	'apa' => env('FB_REDIRECT_DEV'),
];