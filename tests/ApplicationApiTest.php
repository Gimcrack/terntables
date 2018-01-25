<?php

class ApplicationApiTest extends ApiTest {

  public $mass_update_changes = 
  [ 
    'inactive_flag' => 0, 
  ];

  public function __construct()
  {
    $this->model_class = "App\\Application";
    $this->model_short = 'Application';
    $this->friendly_identifier = 'name';

    parent::__construct();
  }

}
