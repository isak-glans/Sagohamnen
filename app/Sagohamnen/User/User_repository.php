<?php
namespace Sagohamnen\User;


use App\User;
use Illuminate\Support\Facades\Auth;
use Sagohamnen\Campaign\Campaign_player;
use Sagohamnen\Campaign\Campaign;


class User_repository
{
	//protected $db_table_to_object;

    public function user_info($user_id)
    {
        return User::select("users.id", "name", "email", "description", "created_at", "updated_at")->where('id', $user_id)->first();
    }

    public function user_info_and_campaigns($user_id)
    {
        // 'user_characters',
        //->where('id', $user_id)
        // "users.id", "name", "email", "description", "avatar", "created_at", "updated_at"
        return User::select("users.id", "name", "email", "description", "avatar", "created_at", "updated_at")->where('id', $user_id)->with('user_characters', 'gamemaster_campaigns')->first();
    }

    public function i_signed_in()
    {
        // This will return null if user not logged in.
        $my_id = Auth::id();
        return $my_id === null ? false : true;
        // OBS: Auth::check will search and return
        // everything in a user row.
        //return Auth::check();
    }

    public function my_id()
    {
        return Auth::id();
    }

    public function rpg_users($campaign_id)
    {
        return User::select("id", "name")->where('campaign_id', $campaign_id)->with('campaigns_player')->get();
    }

}