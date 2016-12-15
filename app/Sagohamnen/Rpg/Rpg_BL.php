<?php
namespace Sagohamnen\Rpg;

use Sagohamnen\Rpg\Rpg_repository;
use App\User;
use Carbon\Carbon;

use Sagohamnen\Rpg_chat\Rpg_chat_BL;
use Sagohamnen\Chronicle\Chronicle_BL;
use Sagohamnen\Last_read\Last_read_BL;
use Sagohamnen\Campaign\Campaign_repository;
use Sagohamnen\Character\Character_repository;

class Rpg_BL
{
    protected $rep;

	public function __construct()
	{
        $this->rep = new Rpg_repository();
	}

	public function rpg_setup($campaign_id)
	{
		$result = new \StdClass;
		$campaign_rep = new Campaign_repository();
		$character_rep = new character_repository();
		$rpg_chat_BL = new Rpg_chat_BL();

		// Find user and their avatars.
		$result->users = $this->fetch_rpg_users($campaign_id);

		// Fetch characters playing in the campagin.
		$result->characters = $character_rep->playing_or_npc_in_campaign($campaign_id);

        // Campaign info.
        $result->campaign = $campaign_rep->identify_campaign($campaign_id);

        // Remove older chat entries.
        $rpg_chat_BL->trim_campaign_chat($campaign_id);

        return $result;
	}

	public function rpg_update($campaign_id, $last_chat_id, $last_chronicle_id)
	{
		$result_container 	= new \StdClass;
        $rpg_chat_BL 		= new Rpg_chat_BL();
        $chronicle_BL 		= new chronicle_BL();
        $last_read_BL 		= new last_read_BL();

		// Latest chats
		$result_container->newest_chats = $rpg_chat_BL->get_newest($campaign_id, $last_chat_id);

		// Latest chronicles.
		$result_container->newest_chronicles = $chronicle_BL->newest_chronicles_per_id($campaign_id, $last_chronicle_id);

        // Update the user's RPG activity.
        $update_result = $last_read_BL->update_activity($campaign_id);

        // Get the users in the RPG room.
        $result_container->active_users = $last_read_BL->active_users($campaign_id);

        return $result_container;
	}

	public function fetch_rpg_users($campaign_id)
	{
		$users = array();
		$campaign_rep = new Campaign_repository();
		$character_rep = new character_repository();

		// Fetch users who are playing in the campaign.
		$players = $character_rep->users_playing_in_campaign($campaign_id);

		// Fetch gamemaster user.
		$gm = $campaign_rep->gamemaster_with_avatar($campaign_id);

		// Combine players and gm to one array.
        // So frontend can easily search through it and find user avatar.
        if (count($players) > 0 )
        {
        	foreach($players as $player)
	        {
	        	$new_user 			= new \StdClass;
	        	$new_user->id 		= $player->user_id;
	        	$new_user->name 	= $player->user_avatars->name;
	        	$new_user->avatar 	= $player->user_avatars->avatar;
	        	array_push($users, $new_user);
	        }
        }
        if ( $gm )
        {
        	$new_user 			= new \StdClass;
        	$new_user->id 		= $gm->user_id;
        	$new_user->name 	= $gm->gamemaster_avatar->name;
        	$new_user->avatar 	= $gm->gamemaster_avatar->avatar;
        	array_push($users, $new_user);
        }
        return $users;
	}

}