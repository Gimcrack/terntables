<?php

namespace App;

class NotificationExemption extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'notification_exemptions';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
    , 'server_name'
  ];

  protected $searchableColumns = [
    'name' => 80,
    'server_name' => 80,
  ];

  public function identifiableName()
  {
    return $this->name;
  }
}
