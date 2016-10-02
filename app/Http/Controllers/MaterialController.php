<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Sagohamnen\Material\Material_BL;

class MaterialController extends ApiController
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
        return $this->materials_per_page(1);
	}

    public function materials_per_page($page_nr)
    {
    	return "hello";
    }

    // Get info about a single campaign.
    public function show($campaign_id)
    {

    }

    // Save in database.
    public function store(Request $request)
    {
    	// User signed in?
        if ( !Auth::check() ) return $this->respondNotAuthorized();

        $user_id = Auth::id();

        $this->validate($request, [
            'name' => 'required|min:4|max:1000',
            'description' => 'required|min:4|max:4500',
            'genre' => 'required|max:255',
        ]);

    }

    public function update(Request $request, $id) {


    }

    public function destroy($id)
    {
    	echo "index";
    }
}
