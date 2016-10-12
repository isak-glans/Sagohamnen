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
    protected $Character_BL;

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
            $campaigns = $this->Camp_BL->campaigns_per_page($page_nr);
            if ($campaigns == "not_found") return $this->respondNotFound();

            $can_create_new = $this->Camp_BL->can_create_new();

            return $this->respond(array('campaigns' => $campaigns, 'can_create' => $can_create_new) );
        }
        catch (Exception $e)
        {
            return $this->respondWithError("Ett fel uppstod på sidan.");
        }
    }

    // Get info about a single campaign.
    public function show($campaign_id)
    {
        /*return $this->respondNotAuthorized();
        throw new exception();*/
        //sleep(5);
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

    public function campaignApplication_setup($campaign_id)
    {
        //$Character_BL
        try {
            $result = $this->Camp_BL->campaign_applications_setup($campaign_id);
            if($result === false) return $this->respondNotAuthorized();
            return $this->respond($result);
            //return $this->respond($result);
        } catch(Exception $e)
        {
            return $this->respondInternalError();
        }

    }
}
