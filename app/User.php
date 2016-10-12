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
        'name', 'email', 'description', 'status', 'password',
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
        return $this->belongsToMany('Sagohamnen\Campaign\Campaign')->select('id', 'name')->where('campaign_user.status', 1);
        //return $this->belongsToMany('Sagohamnen\campaign\campaign', 'sh_campaign_players', 'user_id')->select('id', 'name')->where('sh_campaign_players.status',1);
    }

    public function campaigns_gamemaster()
    {
        return $this->belongsToMany('Sagohamnen\Campaign\Campaign')->select('id', 'name')->where('campaign_user.status', 2);
        //return $this->belongsToMany('Sagohamnen\campaign\campaign')->select('id', 'name')->where('campaign_user.status', 2);
        //return $this->belongsTo('Sagohamnen\campaign\campaign', 'gm_id')->select('id', 'name')->where('campaign.status', 1);
    }

    public function campaigns()
    {
        return $this->belongsToMany('Sagohamnen\Campaign\Campaign')->withPivot('status', 'last_read_chat_id', 'created_at', 'updated_at')->wherePivotIn('status', [
                config('sh.campaign_user_status_applying'),
                config('sh.campaign_user_status_playing'),
                config('sh.campaign_user_status_gamemaster') ])->select('id', 'name');
    }



}
