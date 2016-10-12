<?php

namespace Sagohamnen\Campaign;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Sagohamnen\Campaign\Campaign_players;
use Sagohamnen\Character\Character;


class Campaign extends Model
{

	//protected $table = 'sh_campaigns';
    protected $fillable = [ 'name', 'description', 'genre'  ];

    public function gamemaster()
    {
        return $this->belongsToMany('App\User')->select('id', 'name')->wherePivot('status', config('sh.campaign_user_status_gamemaster'));
    }

    public function players()
    {
        return $this->belongsToMany('App\User')->select('id', 'name')->withPivot('status')->wherePivot('status', config('sh.campaign_user_status_playing'));
    }

    public function count_players()
    {
        return $this->belongsToMany('App\User')->where('campaign_user.status', config('sh.campaign_user_status_playing'))->count();
    }

    public function media()
    {
        return $this->belongsTo('Sagohamnen\Portrait\Portrait' )->where('status', config('sh.campaign_status_active'));
    }

    public function nr_players_count()
    {
        //return $this->nr_players->count;
    }

    public function users_not_audience()
    {
        return $this->belongsToMany('App\User')->withPivot("status")->select('id', 'name')->wherePivotIn('campaign_user.status',
                [config('sh.campaign_user_status_applying'),
                 config('sh.campaign_user_status_playing')] );
    }
    public function users()
    {
        return $this->belongsToMany('App\User')->withPivot("status", "updated_at")->wherePivotIn('status', [
            config('sh.campaign_user_status_applying'),
            config('sh.campaign_user_status_playing'),
            config('sh.campaign_user_status_gamemaster')])->select('id', 'name');
    }

    public function characters()
    {
        return $this->hasMany('Sagohamnen\Character\Character', 'campaign_id')->select('id','campaign_id', 'name', 'status', 'portrait_id')->whereBetween('status', array(
            config('sh.character_status_applying'),
            config('sh.character_status_playing') ));
    }

}
