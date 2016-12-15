<?php

namespace Sagohamnen\Chronicle;

use Illuminate\Database\Eloquent\Model;
use App\User;

use Sagohamnen\Traits\likeability;

class Chronicle extends Model
{

    public function user()
    {
    	return $this->belongsTo('App\User')->select('id', 'name');
    }

    public function character()
    {
    	return $this->belongsTo('Sagohamnen\Character\Character')->select('id', 'name', 'portrait_id', 'status');
    }

    use Likeability;
}