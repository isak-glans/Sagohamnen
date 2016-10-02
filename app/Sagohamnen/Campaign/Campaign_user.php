<?php

namespace Sagohamnen\Campaign;

use Illuminate\Database\Eloquent\Model;

class Campaign_user extends Model
{
	/*protected $primaryKey = ['user_id', 'campaign_id'];
	public $incrementing = false;*/
    protected $table = 'campaign_user';

    /*public function user()
    {
        return $this->hasMany('App\User', 'id', 'user_id');
    }

    public function campaign()
    {
    	return $this->hasMany('Sagohamnen\Campaign\Campaign', 'id', 'campaign_id')->select('name', 'id');
    }*/

}
