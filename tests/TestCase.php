<?php

abstract class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    protected $the_user;
    protected $csrfToken;

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

    public function signIn($user = null)
    {
        if ( ! $user ) {
            $user = factory(App\User::class)->create();
        }

        $this->the_user = $user;

        $this->actingAs($this->the_user);

        return $this;
    }

    public function getCsrfToken()
    {
        Session::start();
        $this->csrfToken = csrf_token();
        return $this;
    }

    public function set_user_as_player($user_id = 1, $campaign_id = 1)
    {
        // The user needs an character in the campaign.
        factory(Sagohamnen\Character\Character::class)->create([
            'user_id'        =>$user_id,
            'campaign_id'    =>$campaign_id,
            'status'         =>config('sh.character_status_playing')
        ]);

        // Make sure the user is not the GM.
        factory(Sagohamnen\Campaign\Campaign::class)->create([
            'id'        => $campaign_id,
            'status'    => 1,
            'user_id'   => $user_id +1
        ]);
    }
}
