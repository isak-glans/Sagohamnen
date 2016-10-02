<?php

namespace App;

use Laravel\Socialite\Contracts\User as ProviderUser;

class SocialAccountService
{
    public function createOrGetUser(ProviderUser $providerUser)
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

    }
}