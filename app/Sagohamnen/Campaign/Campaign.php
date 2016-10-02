<?php

namespace Sagohamnen\Campaign;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Sagohamnen\Campaign\Campaign_players;
use Sagohamnen\Character\Character;


class Campaign extends Model
{
    private $character_type_player = 1;
    private $character_type_gm = 2;
    private $character_status_archived = 0;
    private $character_status_applying = 1;
    private $character_status_playing = 2;

	//protected $table = 'sh_campaigns';
    protected $fillable = [ 'name', 'description', 'genre'  ];

    public function gamemaster()
    {
        return $this->belongsToMany('App\User')->select('id', 'name')->where('campaign_user.status', 2);
    }

    public function players()
    {
        return $this->belongsToMany('App\User')->select('id', 'name')->where('campaign_user.status', 1);
    }

    public function media()
    {
        return $this->belongsTo('Sagohamnen\Portrait\Portrait' )->where('status', 1);
    }

    public function nr_players_count()
    {
        //return $this->nr_players->count;
    }

    public function users_not_audience()
    {
        return $this->belongsToMany('App\User')->withPivot("status")->select('id', 'name')->where('campaign_user.status', '>', 0);
    }
    public function users()
    {
        return $this->belongsToMany('App\User')->withPivot("status", "updated_at")->select('id', 'name');
    }

    public function player_characters()
    {
        return $this->hasMany('Sagohamnen\Character\Character', 'campaign_id')->select('id','campaign_id', 'name', 'status', 'portrait_id')->whereBetween('status', array($this->character_status_applying, $this->character_status_playing));
    }

}
