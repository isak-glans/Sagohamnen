<?php
namespace Sagohamnen\Rpg_chat;

// class Dice{
// 	public function roll($max) {
// 		return rand(1, $max);
// 	}
// }

class Dice {
    public function __call($method, $args)
    {
        if (isset($this->$method)) {
            $func = $this->$method;
            return call_user_func_array($func, $args);
        }
    }
}

class Dice_helper_kalle {

	protected $diceNr;
	protected $diceDietype;
	protected $diceMod;
	protected $ob;
	protected $dice;

	public function __construct($diceNr, $diceDietype, $diceMod = 0, $ob = false, $dice = null)
	{
		$this->diceNr 		= $diceNr;
		$this->diceDietype 	= $diceDietype;
		$this->diceMod 		= $diceMod;
		$this->ob 			= $ob;
		$this->dice 		= $dice;
		if($this->diceNr > 100)
			$this->diceNr = 0;
	}

	public function roll(&$dices)
	{
		$sum = 0; $nbDices = $this->diceNr;
		for ($x=0; $x < $nbDices; $x++) {
			if(!!$this->dice)
				$roll = $this->dice->roll($this->diceDietype);
			else
				$roll = rand(1, $this->diceDietype);
			array_push($dices, $roll);
			if($this->ob && $roll == $this->diceDietype)
				$nbDices += 2;
			else
				$sum += $roll;
		}
		return $sum + $this->diceMod;
	}
}


/**/