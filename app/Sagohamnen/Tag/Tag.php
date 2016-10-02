<?php

namespace Sagohamnen\Tag;

use Illuminate\Database\Eloquent\Model;
use App\User;

use Sagohamnen\Media\Media;

class Tag extends Model
{

	public function Portraits()
	{
		return $this->belongsToMany('Sagohamnen\Media\Media')->where('status', '>', 0)->where('type', 1);
	}
}