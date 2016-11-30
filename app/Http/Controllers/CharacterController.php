<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Sagohamnen\Character\Character_BL;
use Sagohamnen\Character\Character;
use Auth;

class CharacterController extends ApiController
{
    protected $Char_BL;

	public function __construct()
	{
        $this->Char_BL = new Character_BL();
	}

	public function index()
	{
        // Show all players,appliers and SLP in a campaign
		return $this->respond(array('result'=>"inne i index") );
	}
    public function show($id)
    {
    	$id_value = ctype_digit($id) ? intval($id) : null;
    	if($id_value === null) return $this->respondMissingInput();

    	$result = $this->Char_BL->single_character($id_value);
        if ($result === "not_found") return $this->respondNotFound();
    	if ($result === false) return $this->respondInternalError();
    	return $this->respond($result );
    }

    // Create new
    public function store(Request $request)
    {
        //return $this->respond(true);
        $this->validate($request, [
            'campaign_id'   => 'required|integer',
            'name'          => 'required|min:3|max:1000',
            'description'   => 'string|required|min:3|max:4500',
            'secret_data'   => 'string|max:4500',
            'excerpt'       => 'string|required|min:3|max:250',
            'portrait_id'   => 'integer|required']);

        $character = array(
            'campaign_id'   => $request->input('campaign_id'),
            'name'          => $request->input('name'),
            'description'   => $request->input('description'),
            'secret_data'   => $request->input('secret_data'),
            'excerpt'       => $request->input('excerpt'),
            'portrait_id'   => $request->input('portrait_id'));

        try {
            $result = $this->Char_BL->store_character($character);
            if ($result === false)
                return $this->respondNotAuthorized();
            return $this->respond(true);
        }catch(Exception $e)
        {
            return $this->respondInternalError();
        }
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'id'            => 'required|integer',
            'name'          => 'required|min:4|max:1000',
            'description'   => 'string|required|min:4|max:4500',
            'secret_data'   => 'string|max:4500',
            'excerpt'       => 'string|max:250',
            'portrait_id'   => 'integer|required'
        ]);
        $character = array(
            'id'            => $request->input('id'),
            'name'          => $request->input('name'),
            'description'   => $request->input('description'),
            'secret_data'   => $request->input('secret_data'),
            'excerpt'       => $request->input('excerpt'),
            'portrait_id'   => $request->input('portrait_id'));

        try {
            $result = $this->Char_BL->update_character($character);
            if ($result === false)
                return $this->respondNotAuthorized();
            return $this->respond(true);
        }catch(Exception $e)
        {
            return $this->respondInternalError();
        }
    }

    public function destroy($id)
    {
    	echo "index";
    }

    public function set_status($id, $status)
    {
        try {
            $result = $this->Char_BL->change_status($id, $status);
            if ($result === false) return $this->respondNotAuthorized();
            return $this->respond($result);
        }catch(Exception $e)
        {
            return $this->respondInternalError($e->message() );
        }
        return $this->respond(array("result"=>"Funkar", 'id'=>$id, 'status' => $status));
    }



}
