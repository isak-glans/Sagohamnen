<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class Campaign extends Model
{
	protected $table = 'sh_campaigns';

    public function gamemaster()
    {
        return $this->belongsTo('App\User', 'gamemaster_id');
    }

}
