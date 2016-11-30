<?php

namespace Sagohamnen\Rpg_chat;

use Illuminate\Database\Eloquent\Model;
use App\User;
use Sagohamnen\Character\Character;


class Rpg_chat extends Model
{
	public $timestamps = false;
	protected $fillable = [ 'text' ];

	public function user()
    {
    	return $this->belongsTo('App\User')->select('id', 'name');
    	//return $this->belongsTo('Sagohamnen\Portrait\Portrait', 'portrait_id')->select('thumbnail', 'id');
    }

}