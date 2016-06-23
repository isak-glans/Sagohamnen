<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class ApiController extends Controller
{
    protected $statusCode = 200;

    /* ===============================
          PROPERTIES
      =============================== */
    public function getStatusCode()
    {
    	return $this->statusCode;
    }

    public function setStatusCode($statusCode)
    {
    	$this->statusCode = $statusCode;

    	return $this;
    }

    /*  ===============================
            METHODS
      ===============================*/

    public function respond($data, $headers = [])
    {
    	return Response()->json($data, $this->getStatusCode(), $headers);
    }

    public function respondWithError($message)
    {
    	return $this->respond([
    		'error'	=> [
    			'message' => $message,
    			'status_code' => $this->getStatusCode()
    		]
		]);
    }


    public function respondNotFound($message = "Sidan kunde inte hittas!")
    {
    	return $this->setStatusCode(404)->respondWithError($message);
    }

    public function respondInternalError($message = "Internal Error")
    {
    	return $this->setStatusCode(500)->respondWithError($message);
    }

    public function respondNotAuthorized($message = "Du har inte behörighet till denna sida.")
    {
    	return $this->setStatusCode(403)->respondWithError($message);
    }

    public function respondMissingInput($message = "Indata saknas.")
    {
    	return $this->setStatusCode(404)->respondWithError($message);
    }

}
