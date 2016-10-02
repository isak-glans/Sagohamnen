<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Sagohamnen\Character\Character_BL;
use Sagohamnen\Character\Character;

class CharacterController extends ApiController
{
    protected $Char_BL;

	public function __construct()
	{
        $this->Char_BL = new Character_BL();
	}

	public function index()
	{
		return $this->respond(array('result'=>"inne i index") );
	}
    public function show($id)
    {
    	$id_value = ctype_digit($id) ? intval($id) : null;
    	if($id_value === null) return $this->respondMissingInput();

    	$result = $this->Char_BL->show($id_value);
        if ($result === "not_found") return $this->respondNotFound();
    	if ($result === false) return $this->respondInternalError();
    	return $this->respond($result );
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|integer',
            'name' => 'required|min:4|max:1000',
            'description' => 'string|required|min:4|max:4500',
            'secret_data' => 'string|max:4500',
            'portrait_id'   => 'integer|required'
        ]);
        $character = array(
            'id'            => $request->input('id'),
            'name'          => $request->input('name'),
            'description'   => $request->input('description'),
            'secret_data'   => $request->input('secret_data'),
            'portrait_id'   => $request->input('portrait_id'));

        try {
            $result = $this->Char_BL->store_character($character);
            if ($result === false)
                return $this->respondNotAuthorized();
            return $this->respond(array("result"=>"Det fnuka"));
        }catch(Exception $e)
        {
            return $this->respondInternalError();
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
