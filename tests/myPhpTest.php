<?php


class minaPhpExp extends TestCase
{

	/** @test*/
	public function apa()
	{
		$apa = 3;

		// Dubbla utropstecken tar ut varandra.
		// Om det står siffran 3 så räknas den som
		// true. Däremot siffran 0 räknas som false.

		// Text räknas som true. Tom sträng räknas som
		// false.

		$this->assertEquals(false, !3);
		$this->assertEquals(true, !!3);
		// Om noll är false eller null.
		$this->assertEquals(true, !0);
		// Om noll Inte är false eller null.
		$this->assertEquals(false, !!0);
		// Alla siffror som inte är noll räknas som true.
		$this->assertEquals(true, !!-1, "den gick inte igenom");
		$this->assertEquals(true, !!"katt");
		$this->assertEquals(false, !!"");

	}


}
?>
