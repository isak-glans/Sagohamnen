<?php
namespace Sagohamnen\Helpers\Dice_helper;

use Sagohamnen\Helpers\Dice_helper\RoleDice;

class DiceHelper {

	protected $diceRoler;

	public function __construct($diceRoler = null )
	{
		if ($diceRoler == null) $diceRoler = new RoleDice();

		$this->diceRoler = $diceRoler;
	}

	public function role_dices($diceNr, $diceType, $diceMod = 0, $ob = false)
	{
		$result = 0;
		$tossed_dices = array();
		$nr_throws = $diceNr;

		if ($diceNr > 100 || $diceNr = 0) return 0;
		if ( !in_array($diceType, config('sh.dice_types')) )
			throw new \Exception("Illegal dice type");
		if ( $diceMod > 10000) return 0;

		for($x=0; $x < $nr_throws; $x++)
		{
			// Get a random number.
			$dice_result = $this->diceRoler->role_one_dice($diceType);

			if ($ob && $dice_result == $diceType){
				// The user get one extra die to throw.
				$nr_throws +=2;
			} else {
				$result += $dice_result;
			}

			array_push($tossed_dices, $dice_result);

			// Safety check.
			if ($x > 1000)break;
		}

		// Add dice modification.
		$result += $diceMod;
		return array('result' => $result, 'dices' => $tossed_dices );
	}
}



