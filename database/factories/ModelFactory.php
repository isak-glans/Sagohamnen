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
        'activity' => $faker->dateTimeThisMonth($max = 'now')
    ];
});

$factory->define(Sagohamnen\Campaign\Campaign::class, function(Faker\Generator $faker){
	return [
		'name' => $faker->name,
		'genre' => $faker->word,
		'max_nr_players' => $faker->numberBetween($min = 2, $max = 10),
		'user_id' => $faker->numberBetween($min = 1, $max = 2),
		'description' => $faker->text($maxNbChars = 200),
		'status' => 1,
		'rating' => $faker->numberBetween($min = 1, $max = 10),
		'created_at' => $faker->dateTimeThisMonth($max = 'now'),
		'updated_at' => $faker->dateTimeThisMonth($max = 'now'),
	];
});

$factory->define(Sagohamnen\Character\Character::class, function(Faker\Generator $faker){
	return [
		'name' 			=> $faker->name,
		'user_id' 		=> $faker->numberBetween($min = 1, $max = 2),
		'campaign_id' 	=> $faker->numberBetween($min = 1, $max = 2),
		'description' 	=> $faker->text($maxNbChars = 200),
		'status' 		=> $faker->numberBetween($min = 0, $max = 4),
		'portrait_id' 	=> $faker->numberBetween($min = 1, $max = 10),
		'created_at' 	=> $faker->dateTimeThisMonth($max = 'now'),
	];
});


$factory->define(Sagohamnen\Chronicle\Chronicle::class, function(Faker\Generator $faker){
	return [
		'user_id' => $faker->numberBetween($min = 1, $max = 2),
		'campaign_id' => $faker->numberBetween($min = 1, $max = 2),
		'character_id' => $faker->numberBetween($min = 1, $max = 2),
		'text' => $faker->text($maxNbChars = 200),
		'status' => 1,
		'created_at' => $faker->dateTimeThisMonth($max = 'now'),
		'updated_at' => $faker->dateTimeThisMonth($max = 'now'),
	];
});

$factory->define(Sagohamnen\Portrait\Portrait::class, function(Faker\Generator $faker){
	return [
		'medium' => $faker->text($maxNbChars = 200),
		'thumbnail' => $faker->text($maxNbChars = 200),
		'status' => $faker->numberBetween($min = 0, $max = 1)
	];
});

$factory->define(Sagohamnen\Rpg_chat\Rpg_chat::class, function(Faker\Generator $faker){
	return [
		'text' => $faker->text($maxNbChars = 200),
		'user_id' => $faker->numberBetween($min = 0, $max = 1),
		'campaign_id' => $faker->numberBetween($min = 0, $max = 1),
		'type' => $faker->numberBetween($min = 0, $max = 1),
		'created_at' => $faker->dateTimeThisMonth($max = 'now'),
	];
});

$factory->define(Sagohamnen\Last_read\Last_read::class, function(Faker\Generator $faker){
	return [
		'user_id' => $faker->numberBetween($min = 0, $max = 1),
		'campaign_id' => $faker->numberBetween($min = 0, $max = 1),
		'chronicle_id' => $faker->numberBetween($min = 0, $max = 1),
		'activity' => $faker->dateTimeThisMonth($max = 'now'),
	];
});
