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
        'username' => $faker->username,
        'email' => $faker->email,
        'password' => bcrypt(str_random(10)),
        'remember_token' => str_random(10),
        'api_token' => str_random(60)
    ];
});

$factory->define(App\Person::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
    ];
});

$factory->define(App\Group::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->sentence
    ];
});

$factory->define(App\Role::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->sentence
    ];
});

$factory->define(App\Server::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => 'Lorem Ipsum',
        'cname' => $faker->name,
        'ip' => '10.0.100.' . $faker->unique()->numberBetween(1,254),
        'inactive_flag' => 1, //$faker->boolean,
        'production_flag' => 1, //$faker->boolean,
        'windows_updatable_flag' => 1, //$faker->boolean,
        'last_windows_update' => '2016-04-01',
        'group_id' => 1,
        'operating_system_id' => 1,
        'status' => 'Nominal'
    ];
});

$factory->define(App\ServerDisk::class, function(Faker\Generator $faker) {
    $size = 500;
    $used = $faker->numberBetween(400,499);
    $free = $size-$used;

    return [
        'name' => ucfirst( $faker->randomElement( ['c','d','e','f','g'] ) ) . ':\\',
        'server_id' => $faker->numberBetween(1,30),
        'label' => $faker->word,
        'size_gb' => $size,
        'used_gb' => $used,
        'free_gb' => $free
    ];
});

$factory->define(App\Application::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->sentence,
        'inactive_flag' => $faker->boolean,
        'group_id' => 1,
    ];
});

$factory->define(App\Database::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->sentence,
        'inactive_flag' => $faker->boolean,
        'group_id' => 1,
        'rpo' => $faker->name,
        'rto' => $faker->name,
        'dr_strategy' => $faker->sentence,
        'ha_strategy' => $faker->sentence,
        'inactive_flag' => $faker->boolean,
        'ignore_flag' => $faker->boolean,
        'production_flag' => $faker->boolean,
        'server_id' => 1
    ];
});

$factory->define(App\Alert::class, function (Faker\Generator $faker) {
    return [
        'message' => $faker->sentence,
        'alertable_type' => 'App\Server',
        'alertable_id' => 1,
        'notification_sent_flag' => 0,
        'acknowledged_flag' => 0,
    ];
});


