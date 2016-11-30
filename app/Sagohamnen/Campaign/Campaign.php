<?php

namespace Sagohamnen\Campaign;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Sagohamnen\Campaign\Campaign_players;
use Sagohamnen\Character\Character;
use Sagohamnen\Last_read\Last_read;


class Campaign extends Model
{

	//protected $table = 'sh_campaigns';
    protected $fillable = [ 'name', 'description', 'genre'  ];

    public function gamemaster()
    {
        return $this->belongsTo('App\User', 'user_id')->select('id', 'name')->whereIn('status', [config('sh.user_status_active'), config('sh.user_status_admin')]);
    }

    public function gamemaster_avatar()
    {
        return $this->belongsTo('App\User', 'user_id')->select('id', 'name', 'avatar')->whereIn('status', [config('sh.user_status_active'), config('sh.user_status_admin')]);
    }

    public function players()
    {
        return $this->hasMany('Sagohamnen\Character\Character')->where('status', config('sh.character_status_playing'));
    }

    public function last_read()
    {
        return $this->hasMany('Sagohamnen\Last_read\Last_read')->select('campaign_id','user_id', 'chronicle_id', 'chat_id');
    }
    /*public function count_players()
    {
        return $this->belongsToMany('App\User')->where('campaign_user.status', config('sh.campaign_user_status_playing'))->count();
    }*/

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
        return $this->hasMany('Sagohamnen\Character\Character')->whereIn('status', [config('sh.character_status_applying'),
            config('sh.character_status_playing'),
            config('sh.character_status_gamemaster')])->select('id', 'name');
    }

    public function characters()
    {
        return $this->hasMany('Sagohamnen\Character\Character')->select('id','campaign_id', 'user_id', 'name', 'status', 'portrait_id', 'excerpt')->whereIn('status', [
                config('sh.character_status_applying'),
                config('sh.character_status_playing'),
                config('sh.character_status_blocked')]);
    }

}
