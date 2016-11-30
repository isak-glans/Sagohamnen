<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Sagohamnen\Rpg\Rpg_BL;
use Sagohamnen\Rpg\Rpg_repository;


class RpgController extends ApiController
{

	protected $BL;
    protected $rep;

	public function __construct()
	{
        $this->rep = new Rpg_repository();
		$this->BL = new Rpg_BL();
	}

    public function index() {
        // This method is almost the same as campaigns_per_page.
        return "Inne i index";
    }

    public function rpg_setup($campaign_id)
    {
        try {
            $result = $this->BL->rpg_setup($campaign_id);
            return $this->respond( $result );
        } catch (Exception $e)
        {
            return $this->respondInternalError();
        }
    }

    public function rpg_update($campaign_id, $last_chat_id, $last_chronicle_id)
    {
    	try {
    		$result = $this->BL->rpg_update($campaign_id,$last_chat_id, $last_chronicle_id);
            if ($result === false) return $this->respondInternalError();
    		return $this->respond($result);
    	} catch(Exception $e)
    	{
    		return $this->respondInternalError($e);
    	}
    }
}
