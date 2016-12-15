<?php
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Carbon\Carbon;
use Sagohamnen\Character\Character;

class SaveChronicleTest extends TestCase
{
	use DatabaseMigrations;

	public function setup() {
		parent::setUp();
		$this->signIn();
		$this->set_user_as_player($this->the_user->id);
		$this->getCsrfToken();
	}

	/** @test */
	public function store_chronicle_with_character()
	{

        // Add CSRF token, so controller wont redirect to 302.
        $params = [
            '_token'            => $this->csrfToken,
            'text'       		=> "Detta är ett test inlägg",
            'campaign_id'       => 1,
            'character_id'      => 1
        ];

         // Call the controller via routes.
        $response = $this->call('POST', '/api/chronicle/', $params);
        //$data = json_decode($response);
        //var_dump($data);

        // See if HTTP response to controller are okey.
        $result = $this->assertEquals(200, $response->status() );
        //echo $response->getContent();
        // See if the chat dice was saved. It should
        // have id 1.
        $this->seeInDatabase('chronicles', ['id' => 1]);

        $find = Character::find(1);
        //var_dump($find);cls

	}

}