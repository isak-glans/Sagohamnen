<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use App\Http\Requests;

use App\Campaign;
use App\Campaign_user;
use App\Post;
use App\Sh_library\Transformers\CampaignTransformer;

class campaignController extends ApiController
{
	protected $campaignTransformer;

	public function __construct(CampaignTransformer $campaignTransformer)
	{
		$this->campaignTransformer = $campaignTransformer;
	}

	public function index() {

		$campaigns = DB::table('sh_campaigns')->leftJoin('sh_users', 'sh_campaigns.gm_id', '=', 'sh_users.id')
            ->select(['sh_campaigns.*', 'sh_users.name as gm_name'])
            ->where('sh_campaigns.status', '=', 1)
            ->orderBy('sh_users.updated_at', 'desc')
            ->get();

		/*$campaigns = Campaign::where('status', '=', 1)->with(['gamemaster' => function($query){
		    $query->select(['id', 'gamemaster_id', 'name', 'updated_at']);
			}])->select('id', 'name')->get()->sortByDesc(function ($campaign) {
		    return $campaign->gamemaster->updated_at;
		});*/

		$array_result = $this->campaignTransformer->transformCollection($campaigns, 'home');

		return response()->json( $array_result );
	}
    //
    public function show($id)
    {
    	$result = Campaign::find($id)->first();
    	if($result == null) return response()->json( $result );

		$result->gamemaster_name= $result->gamemaster()->value('name');

		return response()->json( $result );
    }

    public function store(Request $request)
    {

        /*if ( Input::has('name') && Input::has('text') && Input::has('genre') ) :
            $name = Input::get('name');
            $text = Input::get('text');
            $text = Input::get('genre');
        else :
            return $this->respondMissingInput();
        endif;*/

        // Get the user id
        /*if (Auth::check())
        {
            // The user is logged in...
            $id = Auth::id();
        } else {
            return $this->respondNotAuthorized();
        }*/

        $this->validate($request, [
            'name' => 'required|min:4|max:1000',
            'text' => 'required|min:4|max:4500',
            'genre' => 'required|max:255',
        ]);




        echo "All fine";
        //return response()->json( array( 'name' => ) );

        /*$table->increments('id')->unsigned();
                $table->text('name', 1000);
                $table->text('text', 4500);
                $table->string('genre', 255);
                $table->integer('gm_id')->unsigned();
                $table->tinyInteger("nr_players")->unsigned();
                $table->integer("nr_entries")->unsigned();
                $table->timestamps();
                $table->tinyInteger("rating")->unsigned();
                $table->tinyInteger("status")->unsigned()->comments = "0=archived, 1= active";*/

    }

    public function create()
    {
    	echo "inde";
    }

    public function edit($id)
    {
    	echo "inde";
    }

    public function update($id)
    {
    	echo "inde";
    }

    public function destroy($id)
    {
    	echo "inde";
    }
}
