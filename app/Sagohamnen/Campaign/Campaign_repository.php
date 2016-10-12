<?php
namespace Sagohamnen\Campaign;

use Sagohamnen\Campaign\Campaign;
use Sagohamnen\Campaign\Campaign_user;
use Sagohamnen\Portrait\Portrait;
use Sagohamnen\Character\Character;
use DB;

use Sagohamnen\Database\Transform\Campaign_transform;
use App\User;

class Campaign_repository
{
	private $status_none;
	private $status_applying;
	private $status_player;
	private $status_gamemaster;
	private $status_denied;
	private $apa = 0;
	/*private $status_none 		= config('sh.campaign_user_status_none');
	private $status_applying 	= config('sh.campaign_user_status_applying');
	private $status_player 		= config('sh.campaign_user_status_playing');
	private $status_gamemaster 	= config('sh.campaign_user_status_gamemaster');
	private $status_blocked 	= config('sh.campaign_user_status_blocked');*/

	public function __construct()
	{
		$this->status_none = config('sh.campaign_user_status_none');
		$this->status_applying = config('sh.campaign_user_status_applying');
		$this->status_player = config('sh.campaign_user_status_playing');
		$this->status_gamemaster = config('sh.campaign_user_status_gamemaster');
		$this->status_blocked = config('sh.campaign_user_status_blocked');

		$this->db_table_to_object = new campaign_transform;
	}

	public function campaigns($page_nr)
	{
		$skip = ($page_nr - 1) * 10;
        $take = 10;
        //$campaigns = Campaign::select('id', 'name', 'max_nr_players', 'rating', 'genre')->with('gamemaster', 'players')->where('status', config('sh.campaign_status_active') )->skip($skip)->take($take)->orderBy('updated_at', 'DESC')->get();

        $campaigns = Campaign::select('id', 'name', 'max_nr_players', 'rating', 'genre')->withCount('players')->where('status', config('sh.campaign_status_active') )->with('gamemaster')->skip($skip)->take($take)->orderBy('updated_at', 'DESC')->get();

        /*$posts = Post::withCount(['votes', 'comments' => function ($query) {
		    $query->where('content', 'like', 'foo%');
		}])->get();*/

        //$campaigns = Campaign::select('id', 'name', 'max_nr_players', 'rating', 'genre')->with('gamemaster', 'players')->where('status', config('sh.campaign_status_active') )->skip($skip)->take($take)->orderBy('updated_at', 'DESC')->get();

		return $campaigns;
		//return $this->db_table_to_object->campaigns($campaigns);
	}

	public function campaign($campaign_id)
	{
		//return Character::select('id', 'name', 'portrait_id')->with('thumb_portrait')->where('id', 1)->first();

		return Campaign::select('id', 'genre', 'name', 'description', 'max_nr_players', 'rating', 'created_at', 'updated_at')->where('id', $campaign_id)->with('characters.portrait', 'gamemaster')->first();

		//return Campaign::select('id', 'genre', 'name', 'description', 'max_nr_players', 'rating', 'created_at', 'updated_at')->with('characters')->where('id', $campaign_id)->first();

		//return Campaign::select('id', 'genre', 'name', 'description', 'max_nr_players', 'rating', 'created_at', 'updated_at', 'media_id')->with('users_not_audience', 'media')->where('id', $campaign_id)->first();

		//return $campaign = Campaign::with('media', 'gamemaster', 'players')->where('id', $campaign_id)->first();
	}

	public function count_campagins_as_gamemaster($user_id)
	{
		return Campaign_user::where(['user_id' => $user_id, 'status' => config('sh.campaign_user_status_gamemaster')])->count();
	}

	public function count_campaigns_i_am_playing($user_id)
	{
		return Campaign_user::where(['user_id' => $user_id, 'status' => $this->status_player])->count();
	}

	public function count_nr_players($campaign_id)
	{
		return Campaign_user::where(['campaign_id' => $campaign_id, 'status' => $this->status_player ])->count();
	}

	public function is_user_player($campaign_id,$user_id)
	{
		return Campaign_user::where(['campaign_id' => $campaign_id, 'user_id' => $user_id, 'status' => config('sh.campaign_user_status_playing') ])->count() > 0 ;
	}

	public function campaign_user_info($campaign_id, $user_id)
	{
		return Campaign_user::select('*')->where(['campaign_id' => $campaign_id, 'user_id' => $user_id])->first();
	}

	public function campaign_user_status($campaign_id, $user_id)
	{
		// If the user have not applyed, played, gm, or been denied,
		// then he can send apply. That is, if he/she have no
		// relation to the campaign in the campaign_user table.
		return Campaign_user::select('status')->where(['campaign_id' => $campaign_id, 'user_id' => $user_id])->first()['status'];
	}
	public function identify_campaign($campaign_id)
	{
		return Campaign::where('id', $campaign_id)->select('name', 'id')->first();
	}
	public function max_nr_players($campaign_id)
	{
		return Campaign::where('id', $campaign_id)->select('max_nr_players')->first()->max_nr_players;
	}

	public function create_relation_to_campagin($campaign_id, $user_id)
	{
		$a_campagin_user = new campaign_user();
		$a_campagin_user->user_id = $user_id;
		$a_campagin_user->campaign_id = $campaign_id;
		$a_campagin_user->status = config('sh.campaign_user_status_none');
		$a_campagin_user->save();
	}

	public function store_character_apply($form_data, $the_campaign_user)
	{
		DB::transaction(function () use($form_data, $the_campaign_user) {

            $user_id = $form_data['my_id'];
            $campaign_id = $form_data['campaign_id'];

            DB::table('campaign_user')
            ->where('user_id', $user_id)
            ->where('campaign_id', $campaign_id)
            ->update(['status' => $this->status_applying,
            	'updated_at' => date("Y-m-d H:i:s")]);

            $rp = new Character();
            $rp->name = $form_data['name'];
            $rp->user_id = $form_data['my_id'];
            $rp->status = $this->status_applying;
            $rp->campaign_id = $form_data['campaign_id'];
            $rp->description = $form_data['description'];
            $rp->portrait_id = $form_data['portrait_id'];
            $rp->save();
        });
	}

	public function campaign_applications_setup($campaign_id)
	{
		return Campaign::select('id', 'name', 'max_nr_players')->where(['id' => $campaign_id, 'status' => config('sh.campaign_status_active')])->with('characters.portrait')->first();
	}

}