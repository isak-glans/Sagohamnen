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
}