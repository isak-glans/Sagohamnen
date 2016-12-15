<?php
use Sagohamnen\Helpers\Dice_helper\DiceHelper;

class diceLogicTest extends TestCase
{
    /** @test */
    public function role_3T6()
    {
    	$this->role_dices_test(3,6,0,array(1,1,6), 8, false);
    }

    /** @test */
    public function role_3T6_pluss_3()
    {
    	$this->role_dices_test(3,6,3,array(1,1,6), 11, false);
    }

    /** @test */
    public function role_OB_3T6()
    {
    	$this->role_dices_test(3,6,0,array(1,1,6,6,1,1,1), 5, true);
    }

    /** @test */
    public function role_OB_3T6_lucky()
    {
    	$this->role_dices_test(3,6,0,array(1,1,6,6,6,1,1,1,1), 6, true);
    }

    /** @test */
    public function role_OB_3T20()
    {
    	$this->role_dices_test(3,20,0,array(1,1,20,1,1), 4, true);
    }

    /** @test */
    public function role_OB_3T20_pluss_3()
    {
    	$this->role_dices_test(3,20,3,array(1,1,20,1,1), 7, true);
    }

    /** @test */
    public function role_OB_3T20_lucky()
    {
    	$this->role_dices_test(3,20,0,array(20,20,20,1,1,1,1,1,1), 6, true);
    }


    private function role_dices_test($nrDices, $diceType, $mod, $arrayOfResults, $expected, $ob = false)
    {
    	$a = $arrayOfResults; // I alias the array.

    	// Make sure a serie of 20 numbers sent.
    	// This is becayse then onConsecutiveCalls method
    	// cant take an array of arguments.
    	for ($x= count($a); $x < 20; $x++) {
    		array_push($a, 1);
    	}

    	// Construct mock for role die class.
    	$phpunitMock = $this->getMock( 'Sagohamnen\Helpers\Dice_helper\RoleDice');

		// Run followin numbers in a serie. The first number will be returned on first
		// call. Then the second and so on.
		// OBS This is PhpUnit code.
		$phpunitMock->method('role_one_dice')->will( $this->onConsecutiveCalls(
			$a[0],$a[1],$a[2],$a[3],$a[4],$a[5],$a[6],$a[7],$a[8],$a[9],
			$a[10],$a[11],$a[12],$a[13],$a[14],$a[15],$a[16],$a[17],$a[18],$a[19] ) );

		// Construct Dice helper with the mock as argument.
		$diceHelper = new DiceHelper($phpunitMock);

		// Get result. It will return an array.
		$response = $diceHelper->role_dices($nrDices,$diceType,$mod, $ob);
	    $this->assertEquals($expected, $response['result']);
    }

	public function tearDown()
	{
	  Mockery::close();
	}

}
