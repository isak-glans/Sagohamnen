<?php
namespace App\Sh_library\Transformers;

use App\Sh_library\Transformers\Transformer;

abstract class Transformer {
	public function transformCollection(array $items, $function = "transform")
    {
    	return array_map([$this, $function], $items );
    }

    //public abstract function transform($item);
}