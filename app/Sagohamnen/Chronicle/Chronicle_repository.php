<?php
namespace Sagohamnen\Chronicle;

use Sagohamnen\Chronicle\Chronicle;
use Sagohamnen\Campaign\Campaign;
use App\User;

class Chronicle_repository
{

	public function chronicle_per_page($campaign_id, $page_nr)
	{
		$skip = ($page_nr - 1) * 10;
		$take = 10;
		return $chronicles = Chronicle::where('campaign_id', $campaign_id)->with('materials')->skip($skip)->take($take)->get();
	}

	public function last_chronicle_id($campaign_id)
	{
		return Chronicle::where('campaign_id', $campaign_id)->max('id');
	}

	public function newest_chronicle_per_id($campaign_id, $last_id)
	{
		$take = 40;
		return $chronicles = Chronicle::where('campaign_id', $campaign_id)->where('id', '>', $last_id)->with('character')->take($take)->orderBy('id', 'DESC')->get();
		/*return $chronicles = Chronicle::where('campaign_id', $campaign_id)->where('id', '>', $last_id)->with('user')->take($take)->get();*/
	}

	public function store($obj_to_store)
	{
		$chronicle = new Chronicle();
		$chronicle->user_id 		=  $obj_to_store->user_id;
		$chronicle->text 			=  $obj_to_store->text;
		$chronicle->character_id 	=  $obj_to_store->character_id;
		$chronicle->campaign_id 	=  $obj_to_store->campaign_id;
		$chronicle->save();
	}

}