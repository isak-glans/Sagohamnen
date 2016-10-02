<?php

namespace Sagohamnen\Database;

abstract class Repository_interface
{
	private $model;

	public function __construct($model)
	{
		$this->model = $model;
	}
}