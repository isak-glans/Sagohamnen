<?php

namespace Sagohamnen\Last_read;

use Illuminate\Database\Eloquent\Model;

class Last_read extends Model
{
	/*protected $primaryKey = ['user_id', 'campaign_id'];
	public $incrementing = false;*/
    protected $table = 'last_read';
    public $timestamps = false;

    /*public function user()
    {
        return $this->hasMany('App\User', 'id', 'user_id');
    }

    public function campaign()
    {
    	return $this->hasMany('Sagohamnen\Campaign\Campaign', 'id', 'campaign_id')->select('name', 'id');
    }*/

}
