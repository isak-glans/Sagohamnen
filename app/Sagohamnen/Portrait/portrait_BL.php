<?php

namespace Sagohamnen\Portrait;

use Sagohamnen\Portrait\Portrait;

class Portrait_BL
{

	public function portraits_with_tags()
	{

		return Portrait::select('medium', 'thumbnail', 'id')->with('tags')->where('status', 1)->get();

	}

}