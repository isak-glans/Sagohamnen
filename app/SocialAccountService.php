<?php

namespace App;
use Illuminate\Http\Request;
use DB;

//use Laravel\Socialite\Contracts\User as ProviderUser;
use Laravel\Socialite\Contracts\User as ProviderUser;
use Laravel\Socialite\Contracts\Provider;


class SocialAccountService
{

    //public function createOrGetUser(ProviderUser $providerUser)
    public function createOrGetUser(Provider $provider)
    {
        // Get the user from Socialite.
        $providerUser = $provider->user();
        $providerName = class_basename($provider);

        $firstName = explode( " ", $providerUser->getName() )[0];
        $avatar = $this->avatar_url( $providerUser->getEmail(), false );

        $account = SocialAccount::whereProvider('facebook')
            ->whereProviderUserId($providerUser->getId())
            ->first();

        // Find SocialAccount.
        /*$account = SocialAccount::whereProvider($providerName)
            ->whereProviderUserId($providerUser->getId())
            ->first();*/

        // Return user depending on account found or not.
        if ($account) {
            // Find user
            $the_user = $account->user;

            // Fetch the avatar image and save in user table.
            if ($the_user)
            {   // If avatar not right. Update.
                if ($the_user->avtar != $the_user) {
                    $the_user->avatar  = $avatar;
                    $the_user->save();
                }
            }
            return $the_user;
        } else
        {
            return $this->create_user($providerUser, $providerName, $avatar, $firstName);
        }
    }

    private function create_user($providerUser,$providerName, $avatar, $firstName)
    {
        // Find user
        $user = User::whereEmail($providerUser->getEmail())->first();

        DB::transaction(function () use ($providerUser,$providerName, &$user, $avatar, $firstName )
        {
            // Create social Account
            $account = new SocialAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => $providerName
            ]);

            if ($user)
            {
                if ($user->avtar != $avatar) {
                    $user->avatar  = $avatar;
                    $user->save();
                }
            } // Create user.
            else {
                $user = User::create([
                    'email'         => $providerUser->getEmail(),
                    'name'          => $firstName,
                    'status'        => 1,
                    'description'   => "Missing.",
                    'avatar'        => $avatar
                ]);
            }

            // Set foreign key.
            $account->user()->associate($user);
            $account->save();
        });
        return $user;
    }

    private function avatar_url($email)
    {
        //$size = $thumbnail ? 40: 150;
        return "https://www.gravatar.com/avatar/" . md5( strtolower( trim( $email ) ) );
    }

    /*public function createOrGetUser(ProviderUser $providerUser)
    {
        $account = SocialAccount::whereProvider('facebook')
            ->whereProviderUserId($providerUser->getId())
            ->first();

        if ($account) {
            return $account->user;
        } else {

            $account = new SocialAccount([
                'provider_user_id' => $providerUser->getId(),
                'provider' => 'facebook'
            ]);

            $user = User::whereEmail($providerUser->getEmail())->first();

            if (!$user) {

                // 'name'     => $providerUser->getName(),
                $user = User::create([
                    'email'     => $providerUser->getEmail(),
                    'name'      => $providerUser->getName(),
                    'status'    => 1,
                    'description' => "Saknas.",
                ]);

                //$user->save();
            }

            $account->user()->associate($user);
            $account->save();

            return $user;

        }

    }*/
}