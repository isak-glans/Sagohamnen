<?php

namespace Sagohamnen\Character;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Character extends Model
{
	protected $fillable = [ 'name' ];
	/*public function media()
    {
        return $this->belongsTo('Sagohamnen\Media\Media')->select('id', 'description', 'url')->where('status', 1);
    }
*/

    public function portrait()
    {
    	return $this->belongsTo('Sagohamnen\Portrait\Portrait')->select('thumbnail', 'medium', 'id');
    	//return $this->belongsTo('Sagohamnen\Portrait\Portrait', 'portrait_id')->select('thumbnail', 'id');
    }

    public function user()
    {
        return $this->belongsTo('App\User')->select('id', 'name');
    }

    public function campaign()
    {
        return $this->belongsTo('Sagohamnen\Campaign\Campaign')->select('id', 'name');
    }

    /*public function campagin_user_status()
    {
        return $this->belongsTo('Sagohamnen\Campaign\Campaign')->select('id')->withPivot('status');
    }*/

}