<?php

namespace Sagohamnen\Portrait;

use Illuminate\Database\Eloquent\Model;

class Portrait extends Model
{
    protected $fillable = [ 'url', 'description' ];

    public function Tag()
    {
    	return $this->belongsToMany('Sagohamnen\Tag\Tag');
    }
}
