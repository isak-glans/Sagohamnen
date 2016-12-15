<?php
use Illuminate\Foundation\Testing\DatabaseMigrations;

class storeChatTest extends TestCase
{
	use DatabaseMigrations;

    public function setUp()
    {
        parent::setUp();
        $this->signIn();

        $this->set_user_as_player($this->the_user->id);
        $this->getCsrfToken();
    }

    /** @test */
    public function store_chat()
    {
    	$this->store_a_chat(200,1);
    }

    /** @test */
    public function store_too_many_chats()
    {
    	// Make too many chats.
        factory( Sagohamnen\Rpg_chat\Rpg_chat::class, config('sh.dices_spam_nr') )->create([
            'user_id'        =>1,
            'campaign_id'    =>1
        ]);

        $this->store_a_chat(429, config('sh.dices_spam_nr') +1 );
    }

    private function store_a_chat($expectedStatus, $expected_id)
    {
    	// Add CSRF token, so controller wont redirect to 302.
        $params = [
            '_token'            => $this->csrfToken,
            'campaign_id'       => '1',
            'text'				=> "Test",
            'type'				=> config('sh.chat_type_chat')
        ];

        // Call the controller via routes.
        $response = $this->call('POST', '/api/rpg_chat', $params);

        // See if HTTP response to controller are okey.
        $this->assertEquals($expectedStatus, $response->status() );

        // If test are supposed to work, check if dice were
        // saved in database.
        if ($expectedStatus == 200) {
            // See if the chat dice was saved. It should
            // have id 1.
            $this->notSeeInDatabase('rpg_chats', ['id' => $expected_id]);
        }
    }

}