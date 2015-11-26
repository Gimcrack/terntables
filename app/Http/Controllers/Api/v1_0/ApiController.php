<?php

namespace App\Http\Controllers\Api\v1_0;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ApiController extends Controller
{
    public $model_short;

    public $model_class;

    public $with;

    /**
     * Return servers view
     * @method servers
     * @return [type]  [description]
     */
    public function servers()
    {
      $this->model_class = 'App\Server';

      $this->with = [
        'applications',
        'databases',
        'people',
        'tags',
      ];
      
      return $this->indexjson();
    }

    /**
     * Return applications view
     * @method servers
     * @return [type]  [description]
     */
    public function applications()
    {
      $this->model_class = 'App\Application';

      $this->with = [
        'databases',
        'servers',
        'people',
        'tags'
      ];

      return $this->indexjson();
    }

    /**
     * Return databases view
     * @method servers
     * @return [type]  [description]
     */
    public function databases()
    {
      $this->model_class = 'App\Database';

      $this->with = [
        'applications',
        'servers',
        'people',
        'tags',
        'host'
      ];

      return $this->indexjson();
    }
}
