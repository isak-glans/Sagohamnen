<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Campaign;
use App\Campaign_user;
use App\Post;

use DB;
use App\Http\Requests;




class campaignController extends Controller
{

	public function all() {

		$campaigns = DB::table('sh_campaigns')->leftJoin('sh_users', 'sh_campaigns.gamemaster_id', '=', 'sh_users.id')
            ->select(['sh_campaigns.*', 'sh_users.name as gamemaster_name'])
            ->where('sh_campaigns.status', '=', 1)
            ->orderBy('sh_users.updated_at', 'desc')
            ->get();

		/*$campaigns = Campaign::where('status', '=', 1)->with(['gamemaster' => function($query){
		    $query->select(['id', 'gamemaster_id', 'name', 'updated_at']);
			}])->select('id', 'name')->get()->sortByDesc(function ($campaign) {
		    return $campaign->gamemaster->updated_at;
		});*/


		return response()->json( $campaigns );
	}
    //
    public function single ($id)
    {
    	//$result = "Hej svejs";
    	$result = Campaign::find($id)->first();
    	if($result == null) return response()->json( $result );

		$result->gamemaster_name= $result->gamemaster()->value('name');

		return response()->json( $result );
    }
}
