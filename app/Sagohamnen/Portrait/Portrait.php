<?php

namespace Sagohamnen\Portrait;

use Illuminate\Database\Eloquent\Model;

class Portrait extends Model
{
	public $timestamps = false;
    protected $fillable = [ 'url', 'description' ];

    public function Tags()
    {
    	return $this->belongsToMany('Sagohamnen\Tag\Tag');
    }
}
