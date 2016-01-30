<?php
namespace App\Exceptions;

use Exception;

class OperationRequiresCheckoutException extends Exception {

  public $model;

  public $message;

  public $code;

  public $explanation;

  public function __construct($model, $operation = null) {
    $this->model = $model;
    $this->operation = $operation;

    $this->setMessage();
    $this->setCode();
  }


  public function setMessage()
  {
    if ( $this->model->isCheckedOutToSomeoneElse() ) {
      throw new ModelCheckedOutToSomeoneElseException( $this->model, $this->operation );
    } else {
      $this->message = "Error performing {$this->operation} operation.";
    }
  }

  public function setCode()
  {
    $this->code = ( $this->model->isCheckedOutToSomeoneElse() ) ? 409 : 405;
  }

  public function setExplanation()
  {
    $this->explanation = "The records is not checked out. Checkout the record and try again.";
  }


  public function getExplanation()
  {
    return $this->explanation;
  }

}
