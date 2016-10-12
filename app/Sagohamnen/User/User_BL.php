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
		//$data = User::select("id", "name", "email", "description", "created_at", "updated_at")->where('id', $user_id)->with('campaigns')->first();
		$data = $this->user_repository->user_info_and_campaigns($user_id);
		$this->fetch_avatar_img($data);
		$data->mine = $this->is_my_user($user_id);

		$applying = array();
		$playing = array();
		$gamemastering = array();

		// See who is what.
		if(count($data->campaigns) > 0) :
			foreach($data->campaigns as $camp) :
				if ($camp->pivot->status == config('sh.campaign_user_status_applying') )
					array_push($applying, $camp);
				if ($camp->pivot->status == config('sh.campaign_user_status_playing') )
					array_push($playing, $camp);
				if ($camp->pivot->status == config('sh.campaign_user_status_gamemaster') )
					array_push($gamemastering, $camp);
			endforeach;
		endif;

		$data->applying = $applying;
		$data->playing = $playing;
		$data->gamemastering = $gamemastering;
		unset($data->campaigns);
		return $data;
	}

	private function fetch_avatar_img($user)
	{
		// Avatar image, https://en.gravatar.com/site/implement/hash/
        // Hash the email, so it wont be shown in public.
		$user->makeVisible('email');
        $email = $user->email;
		$size = 150;
    	$grav_url = "https://www.gravatar.com/avatar/" . md5( strtolower( trim( $email ) ) ) . "?s=" . $size;
        $user->avatar = $grav_url;
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