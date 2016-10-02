<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Auth;
use Sagohamnen\Campaign\Campaign;
use Sagohamnen\Campaign\Campaign_user;
//use App\Post;
// use App\Sh_library\Transformers\DbResults;
use Sagohamnen\Campaign\Campaign_repository;
use Sagohamnen\Campaign\Campaign_BL;


class campaignController extends ApiController
{
	protected $Campaign_repository;
    protected $Camp_BL;

	public function __construct()
	{
		$this->Campaign_repository = new Campaign_repository();
        $this->Camp_BL = new Campaign_BL();
	}

	public function index() {
        // This method is almost the same as campaigns_per_page.
        return $this->campaigns_per_page(1);
	}

    public function campaigns_per_page($page_nr)
    {
        try {
            $user_allowed_create_new = false;
            // Get info
            $campaigns = $this->Campaign_repository->campaigns($page_nr);
            if ( ! $campaigns ) return $this->respondNotFound();

            // Count nr players in each campaign.
            for ($i=0; $i < count($campaigns); $i++) :
                $campaigns[$i]->nr_players = count($campaigns[$i]->players);
                // Remove list of names on players,
                // to save bandwith with info sent back to client.
                // unset($campaigns[$i]->players);
            endfor;

            // Can User make a new campaign?
            if (Auth::check()) :
                $user_id = Auth::id();
                $nr_campaigns_as_gamemaster = $this->Campaign_repository->count_campagins_as_gamemaster($user_id);
                $user_allowed_create_new = $nr_campaigns_as_gamemaster <= 2;
            endif;

            return $this->respond([
                    'campaigns' => $campaigns,
                    'allowed_make_new' => $user_allowed_create_new]);
        }
        catch (Exception $e)
        {
            return $this->respondWithError("Ett fel uppstod på sidan.");
        }
    }

    // Get info about a single campaign.
    public function show($campaign_id)
    {
        try
        {
            $campaign = $this->Camp_BL->single_campaign($campaign_id);
            if ( ! $campaign ) return $this->respondNotFound();
            return $this->respond($campaign);
        }
        catch(Exeption $e)
        {
            $this->respondWithError("Ett fel uppstod på sidan.");
        }

    }

    // Save in database.
    public function store(Request $request)
    {
        // User signed in?
        if ( !Auth::check() ) return $this->respondNotAuthorized();

        $user_id = Auth::id();

        $this->validate($request, [
            'name' => 'required|min:4|max:1000',
            'text' => 'required|min:4|max:4500',
            'genre' => 'required|max:255',
        ]);

        echo "All fine";
        //return response()->json( array( 'name' => ) );

    }

    public function update(Request $request, $id) {
        $campaign = Campaign::find($id);

        if ( ! $campaign ) :
            return $this->respondNotFound('Kampanjen hittades inte');
        endif;

        $this->validate($request, [
            'name' => 'required|min:4|max:255',
            'description' => 'required|min:4|max:4500',
            'genre' => 'required|max:255',
            'max_nr_players' => 'required|numeric|digits_between:1,10'
        ]);

        $campaign->name             = $request->input('name');
        $campaign->genre            = $request->input('genre');
        $campaign->description      = $request->input('description');
        $campaign->max_nr_players   = $request->input('max_nr_players');
        $campaign->save();

    }

    public function apply_to_campaign($campaign_id)
    {
        $BL = new Campaign_BL();
        try {
            if ( $BL->apply_to_campaign($campaign_id) ) :
                return $this->respond(['apply_succesful' => true ]);
            else:
                return $this->respondNotAuthorized("Denna handling är inte tillåten.");
            endif;
        } catch(Exception $e){
            $this->respondInternalError();
        }
    }

    public function identify($campaign_id)
    {
        try {
            $campaign = $this->Camp_BL->identify_campaign($campaign_id);
            return $this->respond($campaign);
        } catch (Exception $e) {
            $this->respondInternalError();
        }
    }

    public function destroy($id)
    {
    	echo "index";
    }
}
