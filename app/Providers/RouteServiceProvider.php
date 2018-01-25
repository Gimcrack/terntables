<?php

namespace App\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to the controller routes in your routes file.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    protected $api_namespace = 'App\Http\Controllers\Api\v1';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public function boot(Router $router)
    {
        //

        parent::boot($router);

        //$router->model('colparams',function($id) { return \App\ColParam::where('colparam_id',$id)->firstOrFail();  });
    }

    /**
     * Define the routes for the application.
     *
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public function map(Router $router)
    {
        $router->group(['namespace' => $this->api_namespace ], function ($router) {
            require app_path('Http/api.php');
        });

        $router->group(['namespace' => $this->namespace, 'middleware' => ['web'] ], function ($router) {
            require app_path('Http/routes.php');
        });
    }
}
