<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Auth;
use App\User;
use Sagohamnen\User\User_BL;
use Sagohamnen\User\User_repository;


class UserController extends ApiController
{
	protected $User_repository;

	public function __construct()
	{
		$this->User_repository = new User_repository;
        $this->User_BL = new User_BL;
	}

    // Show the user.
    public function index() {

    }

    public function info() {
        $result = new \stdClass();
        $result->signed_in = false;
        $result->name = "";
        $result->id = 0;

        if (Auth::check()) {
            $result->name = Auth::user()->name;
            $result->id = Auth::user()->id;
            $result->signed_in = true;
        } else {
            //return $this->respondNotAuthorized("User not logged in.");
        }
        return $this->respond($result);
    }


    // Show a user
    public function show($id){
        try {
            $result = $this->User_BL->single_user($id);
            if ( ! $result ) return $this->respondNotFound();
            return $this->respond( $result );
        } catch (Exception $e)
        {
            return $this->respondInternalError();
        }
    }

    // Return data user for editing a user.
    // To reach here use this url: user/1/edit
    public function edit($id)
    {
        try {
            $result = $this->User_BL->setup_edit_user($id);
            if ( ! $result ) return $this->respondNotFound();
            return $this->respond( $result );
        } catch (Exception $e)
        {
            return $this->respondInternalError();
        }
    }

    public function store(Request $request){
        return $this->respond( array('result' => "inne i store") );
    }

    public function update(Request $request, $id) {
        $the_user = User::find($id);

        if ( ! $the_user ) :
            return $this->respondNotFound('Användaren hittades inte');
        endif;

        $this->validate($request, [
            'name'          => 'required|min:4|max:30',
            'description'   => 'max:4000'
        ]);

        $the_user->name         = $request->input('name');
        $the_user->description  = $request->input('description');
        $the_user->save();

        return $this->respond(true);
    }

    public function destroy($id){
    }
}
