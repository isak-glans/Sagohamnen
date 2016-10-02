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

    // Show a user
    public function show($id){
    	//$user = $this->User_repository->user($id);
        $result = $this->User_BL->single_user($id);
        if ( ! $result ) return $this->respondNotFound();

        return $this->respond($result);
    }

    public function store(Request $request){
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
    }

    public function destroy($id){
    }
}
