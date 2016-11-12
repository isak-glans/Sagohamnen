<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Sagohamnen\Campaign\campaign_player;

class User extends Authenticatable
{
    // Tell laravel to use a different table name.
    //protected $table = 'sh_users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'description', 'status', 'password', 'avatar'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'email', 'remember_token',
    ];

    /*public function campaign_players()
    {
        return $this->belongsTo('App\Sagohamnen\campaign\campaign_players', 'user_id', 'id');
    }*/

    public function campaigns_player()
    {
        return $this->belongsTo('Sagohamnen\Campaign\Campaign')->select('id', 'name')->where('status', config('sh.campaign_status_active'));
        //return $this->belongsToMany('Sagohamnen\campaign\campaign', 'sh_campaign_players', 'user_id')->select('id', 'name')->where('sh_campaign_players.status',1);
    }

    public function gamemaster_campaigns()
    {
        return $this->hasMany('Sagohamnen\Campaign\Campaign')->select('id', 'name', 'user_id')->where('status', config('sh.campaign_status_active'));
        //return $this->belongsToMany('Sagohamnen\campaign\campaign')->select('id', 'name')->where('campaign_user.status', 2);
        //return $this->belongsTo('Sagohamnen\campaign\campaign', 'gm_id')->select('id', 'name')->where('campaign.status', 1);
    }

    public function characters()
    {
        return $this->hasMany('Sagohamnen\Character\Character')->select('id', 'name', 'user_id', 'campaign_id', 'portrait_id')->whereIn('characters.status', [config('sh.campaign_user_status_applying'),
            config('sh.campaign_user_status_playing')]);
    }

    public function user_characters()
    {
        return $this->hasMany('Sagohamnen\Character\Character')->select('id', 'name', 'user_id', 'campaign_id', 'portrait_id', 'status', 'excerpt')->with('campaign', 'portrait')->whereIn('characters.status', [config('sh.campaign_user_status_applying'), config('sh.campaign_user_status_playing')]);
    }



}
