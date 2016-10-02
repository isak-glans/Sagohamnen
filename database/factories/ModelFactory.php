<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

$factory->define(App\User::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'password' => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
    ];
});

$factory->define(Sagohamnen\Campaign\Campaign::class, function(Faker\Generator $faker){
	return [
		'name' => $faker->name,
		'genre' => $faker->word,
		'max_nr_players' => $faker->numberBetween($min = 2, $max = 10),
		'description' => $faker->text($maxNbChars = 200),
		'status' => $faker->numberBetween($min = 0, $max = 1),
		'rating' => $faker->numberBetween($min = 1, $max = 10),
		'created_at' => $faker->dateTimeThisMonth($max = 'now'),
		'updated_at' => $faker->dateTimeThisMonth($max = 'now'),
	];
});

$factory->define(Sagohamnen\Character\Character::class, function(Faker\Generator $faker){
	return [
		'name' => $faker->name,
		'user_id' => $faker->numberBetween($min = 1, $max = 2),
		'campaign_id' => $faker->numberBetween($min = 1, $max = 2),
		'description' => $faker->text($maxNbChars = 200),
		'status' => $faker->numberBetween($min = 0, $max = 4),
		'portrait_id' => $faker->numberBetween($min = 1, $max = 10),
		'created_at' => $faker->dateTimeThisMonth($max = 'now'),
	];
});
