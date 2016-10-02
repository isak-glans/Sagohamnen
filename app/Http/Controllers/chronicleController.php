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

    }

    public function update(Request $request, $id)
    {

    }

    public function destroy($id)
    {
    	echo "index";
    }
}
