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

}