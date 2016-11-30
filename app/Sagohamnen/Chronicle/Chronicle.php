<?php

namespace Sagohamnen\Chronicle;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Chronicle extends Model
{
	/*public function materials()
    {
        return $this->belongsToMany('Sagohamnen\Material\Material')->select('id', 'type', 'name', 'media_id')->with('media')->where('status', 1);
    }*/

    public function user()
    {
    	return $this->belongsTo('App\User')->select('id', 'name');
    }

    public function character()
    {
    	return $this->belongsTo('Sagohamnen\Character\Character')->select('id', 'name', 'portrait_id', 'status');
    }
}