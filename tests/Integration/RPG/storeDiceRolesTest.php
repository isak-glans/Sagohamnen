<?php
use Illuminate\Foundation\Testing\DatabaseMigrations;

class storeDiceRolesTest extends TestCase
{
	use DatabaseMigrations;

    protected $currentCampaignId = 1;

    public function setUp()
    {
        parent::setUp();
        $this->signIn();

        $this->set_user_as_player($this->the_user->id);
        $this->getCsrfToken();
    }

    /** @test */
    public function store_a_dice_succesfull()
    {
        $this->storeDice(1, 6, 0, 200);
    }
    /** @test */
    public function store_a_dice_minus_modification()
    {
        $this->storeDice(1, 6, -1, 200);
    }
    /** @test */
    public function store_dice_bad_type()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 14, 0, 302);
    }
    /** @test */
    public function store_dice_bad_mod()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 6, "ab", 302);
    }
    /** @test */
    public function store_ob_dice()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 6, 0, 200, true);
    }
    /** @test */
    public function store_ob_dice_with_mod()
    {
        // If request validation fails it returns 302.
        $this->storeDice(1, 6, 5, 200, true);
    }
    /** @test */
    public function store_ob_dice_several_dices()
    {
        // If request validation fails it returns 302.
        $this->storeDice(5, 6, 0, 200, true);
    }


    /* =======================================
            Private Methods
    ==========================================*/

    private function storeDice($nr_dices, $dice_type, $mod, $expectedStatus, $dice_ob = false)
    {
        // Add CSRF token, so controller wont redirect to 302.
        $params = [
            '_token'            => $this->csrfToken,
            'campaign_id'       => 1,
            'dice_nr'           => $nr_dices,
            'dice_type'         => $dice_type,
            'dice_mod'          => $mod,
            'dice_ob'           => $dice_ob,
            'dice_description'  => "Testing dice"
        ];

        // Call the controller via routes.
        $response = $this->call('POST', '/api/rpg/role_dice', $params);

        // See if HTTP response to controller are okey.
        $this->assertEquals($expectedStatus, $response->status() );

        // If test are supposed to work, check if dice were
        // saved in database.
        if ($expectedStatus == 200) {
            // See if the chat dice was saved. It should
            // have id 1.
            $this->seeInDatabase('rpg_chats', ['id' => 1]);
        }

    }

}

