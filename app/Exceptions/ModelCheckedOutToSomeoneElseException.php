<?php
namespace App\Exceptions;

use Exception;

class ModelCheckedOutToSomeoneElseException extends Exception {

  public $model;

  public $message;

  public $code;

  public $operation;

  public $explanation;

  public function __construct($model, $operation = null) {
    $this->model = $model;
    $this->operation = $operation;

    $this->setMessage();
    $this->setCode();
  }


  public function setMessage()
  {
    $this->message = "Error performing {$this->operation} operation.";
  }

  public function setCode()
  {
    $this->code = 409;
  }

  public function setExplanation()
  {
    $class = str_replace("App\\","",get_class($this->model) );
    $user = $this->model->checkedOutToUser();
    $username = ( !! $user ) ? $user->username : "someone else.";
    $this->explanation = "The {$class} record with id {$this->model->id} is checked out to {$username}.";
  }


  public function getExplanation()
  {
    return $this->explanation;
  }

}
