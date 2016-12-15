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
	'chat_max_length'					=> 500,
	// The number of chats and dice a
	// user can make in row, before
	// he is spamming.
	'chat_spam_nr'						=> 30,
	// The number of chats in campaign
	// before deleting. If higher then
	// delete some when rpg is setting up.
	'chat_max_nr_entries'				=> 50,

	'dice_types'						=> [4,6,8,10,12,20,100],
	'dices_max_nr'						=> 100,
	'dices_highest_mod'					=> 1000,
	'dices_lowest_mod'					=> -1000,
	'dices_description_max_length'		=> 250,


	'max_nr_characters_in_campaign'		=> 1,
	'max_chronicles_in_row'				=> 10,

	'chronicle_status_deleted'			=> 0,
	'chronicle_status_active'			=> 1,

	'apa' => env('FB_REDIRECT_DEV'),
];