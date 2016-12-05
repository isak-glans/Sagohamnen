<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\User;
use Sagohamnen\campaign\campaign;
use Sagohamnen\Chronicle\chronicle;
use Sagohamnen\Character\Character;
use Sagohamnen\Character\character_BL;
use Sagohamnen\Chronicle\Chronicle_BL;
use Sagohamnen\Rpg_chat\Rpg_chat_BL;
use Sagohamnen\Rpg_chat\Rpg_chat;
use Sagohamnen\character\character_repository;
use Carbon\Carbon;


class rpgChatTest extends TestCase
{
	use DatabaseMigrations;
    //use DatabaseTransactions;
    //use WithoutMiddleware;

    /*protected $theUser;

    public function setUp()
    {
        $this->theUser = factory(App\User::class)->create([
            'id'        =>1,
            'status'    =>1,
        ]);
    }*/

    public function testIsSpammingChronicles()
    {
        $chronicle_BL = new Chronicle_BL();
        $this->setupTestSpamming();

        $my_id = 1;
        $campaign_id_to_check = 1;
        $is_spamming = $chronicle_BL->is_spamming_chronicles($campaign_id_to_check,$my_id);

        $this->assertTrue($is_spamming);
    }

    public function testIsNotSpammingChronicles()
    {
        $chronicle_BL = new Chronicle_BL();
        $this->setupTestSpamming();

        // Another user have written input after mine.
        $my_characters = factory(Sagohamnen\Chronicle\Chronicle::class)->create([
            'user_id'        =>2,
            'campaign_id'    =>1
        ]);

        $my_id = 1;
        $campaign_id_to_check = 1;
        $is_spamming = $chronicle_BL->is_spamming_chronicles($campaign_id_to_check, $my_id);

        $this->assertFalse($is_spamming);
    }

    /** @test */
    public function store_a_dice_Succesfull()
    {
        $this->storeDice(1, 6, 0, 0, 200, "A correct dice could not be stored.");
    }
    /** @test */
    public function store_a_dice_minus_modification()
    {
        $this->storeDice(1, 6, 1, 4, 200, "A dice with minus mod could not be stored.");
    }
    /** @test */
    public function store_dice_bad_type()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 14, 0, 0, 302, "A dice with invalid dice type did not cause 302 exception.");
    }
    /** @test */
    public function store_dice_bad_mod_type()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 6, 7, 0, 302, "A dice with invalid modificaiton type did not cause 302 exception.");
    }
    /** @test */
    public function store_dice_bad_mod()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 6, 0, "ab", 302, "A dice with invalid modificaiton did not cause 302 exception.");
    }


    /* =======================================
            Private Methods
    ==========================================*/

    private function setupTestSpamming()
    {
        $the_user = factory(App\User::class)->create([
            'id'        =>1,
            'status'    =>1,
        ]);
        $the_user = factory(App\User::class)->create([
            'id'        =>2,
            'status'    =>1,
        ]);

        $campaign = factory(Sagohamnen\Campaign\Campaign::class)->create([
            'id'        => 1,
            'status'    => 1,
            'user_id'   => 1
        ]);

        // Make eleven chronicles.
        $my_characters = factory(Sagohamnen\Chronicle\Chronicle::class, 11)->create([
            'user_id'        =>1,
            'campaign_id'    =>1
        ]);
    }

    private function storeDice($nr_dices, $dice_type, $mod_type, $mod, $expectedStatus, $errorMessage)
    {
        $the_user = factory(App\User::class)->create([
            'id'        =>1,
            'status'    =>1,
        ]);

        $my_char = factory(Sagohamnen\Character\Character::class)->create([
            'user_id'        =>1,
            'campaign_id'    =>1,
            'status'         =>config('sh.character_status_playing')
        ]);

        $campaign = factory(Sagohamnen\Campaign\Campaign::class)->create([
            'id'        => 1,
            'status'    => 1,
            'user_id'   => 2
        ]);

        // Add CSRF token, so controller wont redirect to 302.
        Session::start();
        $params = [
            '_token'            => csrf_token(), // Retrieve current csrf token
            'campaign_id'       => 1,
            'dice_nr'           => $nr_dices,
            'dice_type'         => $dice_type,
            'dice_mod_type'     => $mod_type,
            'dice_mod'          => $mod,
            'dice_description'  => "Testing dice",
        ];

        // Call the controller via routes.
        $response = $this
            ->actingAs($the_user)
            ->call('POST', '/api/rpg/role_dice', $params);

        // See if HTTP response went okey.
        $this->assertEquals($expectedStatus, $response->status(),$errorMessage);

        // Can I see the result in DB?
        //$this->seeInDatabase('rpg_chat', ['email' => 'sally@example.com']);
    }

}

