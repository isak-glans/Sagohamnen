<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;
use Session;
use Carbon\Carbon;
use App\SocialAccountService;
use Socialite;

class SocialAuthController extends ApiController
{

    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(SocialAccountService $service, $provider)
    {
        try {
            $user = $service->createOrGetUser(Socialite::driver($provider));

            if ($user === null) return $this->respondInternalError();
            //dd($user);

            auth()->login($user);

            $user = Auth::user();
            if ($user) {
                $now = Carbon::now();
                $user->updated_at = $now;
                $user->save();
                Session::put('last_activity', $now);
            }

            return redirect()->to('index');
        } catch(Exception $e)
        {
            return $this->respondInternalError();
        }
    }



    /*public function redirect()
    {
        return Socialite::driver('facebook')->redirect();
    }*/

    // public function fb_callback(SocialAccountService $service)
    // {
    //     $user = $service->createOrGetUser(Socialite::driver('facebook')->user());

    //     auth()->login($user);

    //     return redirect()->to('index');
    //     //return Redirect::to('index');
    // }
}

