<?php
namespace Sagohamnen\Helpers\Dice_helper;

class RoleDice implements iDice {

	public function role_one_dice($dieType)
	{
		return rand(1, $dieType);
	}
}