<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Sagohamnen\Campaign\Campaign_BL;
use Sagohamnen\Campaign\Campaign_user;
use Sagohamnen\Material\Material;
use Illuminate\Support\Facades\Auth;
use DB;

class CampaignUserController extends ApiController
{
    private $Campaign_repository;
    private $Camp_BL;

    public function __construct()
    {
        $this->Camp_BL = new Campaign_BL();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'campaign_id' => 'required|integer',
            'name' => 'required|regex:/^[a-zA-ZåäöÅÄÖ_\s]*$/|min:3|max:30',
            'description' => 'required|min:3|max:4500',
            'portrait_id' => 'required|integer',
        ]);
        $form_data = array(
        'campaign_id'    => $request->input('campaign_id'),
        'name'           => $request->input('name'),
        'description'    => $request->input('description'),
        'portrait_id'    => $request->input('portrait_id'),
        'my_id'          => Auth::id() );

        try {
            $result = $this->Camp_BL->store_apply($form_data);
            if ($result === false ) return $this->respondInternalError("Ansökan kunde inte genomföras.");
            return $this->respond(array('canApply' => $result) );
        } catch (Exception $e)
        {
            return $this->respondInternalError();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
