<?php

namespace App;

class Notification extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'notifications';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'person_id'
    , 'notifications_enabled'
    , 'email'
    , 'phone_number'
  ];

  protected $searchableColumns = [
    'person.name' => 80,
    'email' => 50,
    'phone_number' => 50,
  ];

  public function identifiableName()
  {
    return $this->person->name . "_notification";
  }

  /**
   * A notification belongs to one person
   * @method groups
   * @return [type]  [description]
   */
  public function person()
  {
    return $this->belongsTo('App\Person');
  }
}
