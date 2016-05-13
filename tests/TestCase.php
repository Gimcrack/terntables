<?php
class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    /**
     * The base URL to use while testing the application.
     *
     * @var string
     */
    protected $baseUrl = 'http://localhost';

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();


        if ( ! \App\User::where('username','jeremy')->count() )
        {
          \App\Group::create([ 'name' => 'Super Administrators']);

          \App\User::create(
            [ 
                'username' => 'jeremy', 
                'email' => 'jeremy.bloomstrom@matsugov.us', 
                'password' => bcrypt('Matanuska1'),
                'api_token' => 'JRq1WSlKwtlLGb5iM1CugmS0qGIGAIddHvcPPxVz2fQBV2XO6e0XSDeN3YVw'
            ]                
          )->groups()->attach([1]);
        }

        return $app;
    }
}
