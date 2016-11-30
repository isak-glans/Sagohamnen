<?php
namespace Sagohamnen\Rpg;

use DB;
use App\User;
use Sagohamnen\Campaign\Campaign;
use Sagohamnen\Character\Character;

class Rpg_repository
{

	public function rpg_setup($campaign_id)
	{
		$char_playing = config('sh.character_status_playing');

		// Get users playing in campaign, or is GM.

		return DB::table('users')
			// who have characters playing in game ...
            ->Join('characters', function($q1) use($campaign_id, $char_playing) {
            	$q1->on('users.id', '=', 'characters.user_id');
            	$q1->where('characters.campaign_id', '=', $campaign_id, 'and');
            	$q1->where('characters.status', '=', $char_playing, 'and');
        	})
        	// but also the one who is GM ...
            ->leftJoin('campaigns', function($q) use($campaign_id, $char_playing)  {
            	$q->on('users.id', '=', 'campaigns.user_id');
            	$q->where('campaigns.id', "=", $campaign_id, 'and');
            })
            ->select('users.id', 'users.name', 'users.avatar')
            ->get();
	}

}