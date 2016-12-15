<?php
namespace Sagohamnen\Last_read;

use Illuminate\Database\Eloquent\Model;
use Auth;
use Sagohamnen\Last_read\Last_read_repository;
use App\Http\Requests;

class Last_read_BL {

	protected $rep;

	function __construct() {
		$this->rep =new Last_read_repository();
	}

	public function update_activity($campaign_id)
	{
		// My id.
		if (Auth::check() == false) return false;
        $my_id = Auth::id();

        $this->rep->update_my_activity($campaign_id, $my_id);
        return true;
	}

	public function active_users($campaign_id)
	{
		$result_objs = $this->rep->users_in_rpg_room($campaign_id);
		$result_array = array();
		foreach( $result_objs as $object){
			array_push($result_array, $object->user_id);
		}

		return $result_array;
	}

}