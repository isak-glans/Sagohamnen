<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Sagohamnen\Chronicle\chronicle_bl;
use Auth;

class chronicleController extends ApiController
{
	private $BL;

    public function __construct()
	{
		return $this->BL = new Chronicle_BL();
	}

	public function index($campaign_id)
	{
		// One have to decide which campaign to watch for.
		return $this->respondNotFound();
		/*$result = $this->chronicles_per_page($campaign_id,1);
		return $this->respond($result);*/
	}

	public function chronicles_per_page($campaign_id, $page_nr)
	{
		try {
			return $this->BL->chronicle_per_page($campaign_id, $page_nr);
		} catch (Exception $e)
		{
			return $this->respondWithError($e);
		}
	}

	public function show($id)
	{

	}

	public function store(Request $request)
    {
    	try {

    		$this->validate($request, [
	            'text'          => 'required|min:3|max:2500',
	            'campaign_id'   => 'required|numeric',
	            'character_id' 	=> 'required|numeric'
	        ]);

			$result = $this->BL->store($request);
			if($result == false) return $this->respondNotAuthorized();
			return $this->respond($result);
		} catch (Exception $e)
		{
			return $this->respondWithError($e);
		}
    }

    public function update(Request $request, $id)
    {

    }

    public function destroy($id)
    {
    	echo "index";
    }
}
