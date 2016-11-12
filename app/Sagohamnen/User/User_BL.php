<?php
namespace Sagohamnen\User;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Illuminate\Support\Facades\Auth;
use Sagohamnen\Campaign\Campaign_player;
use Sagohamnen\Campaign\Campaign_user;
use Sagohamnen\Campaign\Campaign;
use Sagohamnen\Campaign\Campaign_repository;
use DB;

class User_BL {

	private $user_repository;
	private $campaign_repository;

	function __construct() {
        $this->user_repository = new user_repository();
        $this->campaign_repository = new campaign_repository();
    }

	public function single_user($user_id)
	{
		$data = $this->user_repository->user_info_and_campaigns($user_id);
		// Set avatar size.
		if($data->avatar == "" )$data->avatar = "http://www.gravatar.com/avatar";
		$data->avatar .= "?s=200";
		// Check if mine.
		$data->mine = $this->is_my_user($user_id);
		return $data;
	}

	// private function fetch_avatar_img($user)
	// {
	// 	// Avatar image, https://en.gravatar.com/site/implement/hash/
 //        // Hash the email, so it wont be shown in public.
	// 	$user->makeVisible('email');
 //        $email = $user->email;
	// 	$size = 150;
 //    	$grav_url = "https://www.gravatar.com/avatar/" . md5( strtolower( trim( $email ) ) ) . "?s=" . $size;
 //        $user->avatar = $grav_url;
	// }

	public function setup_edit_user($user_id)
	{
		return $this->user_repository->user_info($user_id);
	}

	public function i_signed_in(){
		return Auth::check();
	}
	public function is_my_user($user_id)
	{
		if ($this->i_signed_in() && Auth::id() == $user_id) return true;
		return false;
	}
}