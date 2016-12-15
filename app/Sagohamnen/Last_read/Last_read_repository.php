<?php
namespace Sagohamnen\Last_read;

use Sagohamnen\Campaign\Campaign;
use Sagohamnen\Last_read\Last_read;
use DB;
use App\User;
use Carbon\Carbon;

class Last_read_repository
{
	//private $last_read_rep = new Last_read();
	public function __construct()
	{
	}

	public function last_read_info($campaign_id, $user_id)
	{
		return Last_read::select('campaign_id', 'user_id', 'chronicle_id', 'chat_id')->where(['campaign_id' => $campaign_id, 'user_id' => $user_id])->first();
	}

	public function create_new($campaign_id, $user_id)
	{
		$row = new Last_read();
		$row->campaign_id = $campaign_id;
		$row->user_id = $user_id;
		$row->save();
	}

	public function update_my_activity($campaign_id,$user_id)
	{
		$row = Last_read::select('id','activity')->where(['campaign_id' => $campaign_id, 'user_id' => $user_id])->first();
		//var_dump($row); $now->subMinute()
		if ($row){
			$row->activity = Carbon::now();
			$row->save();
		}
	}

	public function users_in_rpg_room($campaign_id)
	{
		$oneMinute = Carbon::now()->subMinute(1);
		return Last_read::select('user_id')->where('campaign_id', $campaign_id)->where('activity', '>', $oneMinute)->get();
	}

}