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
    , 'group_id'
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

  /**
   * A notification belongs to one group
   * @method groups
   * @return [type]  [description]
   */
  public function group()
  {
    return $this->belongsTo('App\Group');
  }

  /**
   * Get notification records with emails
   * @method scopeEmail
   * @param  [type]     $query [description]
   * @return [type]            [description]
   */
  public function scopeEmail($query)
  {
    return $query->whereNotNull('email')->where('email','<>','')->whereIn('notifications_enabled',['Email','Both']);
  }

  /**
   * Get notification records with phone numbers
   * @method scopeEmail
   * @param  [type]     $query [description]
   * @return [type]            [description]
   */
  public function scopePhone($query)
  {
    return $query->whereNotNull('phone_number')->where('phone_number','<>','')->whereIn('notifications_enabled',['Text','Both']);
  }

  /**
   * Get a list of email addresses
   * @method getemails
   * @return [type]    [description]
   */
  public static function getemails()
  {
    $raw = static::email()->get()->lists('email');
    $parsed = [];

    foreach( $raw as $emails )
    {
      $parsed = array_merge($parsed, explode("\n",$emails));
    }

    return $parsed;
  }

  /**
   * Get a list of phone numbers
   * @method getemails
   * @return [type]    [description]
   */
  public static function getphones()
  {
    $raw = static::phone()->get()->lists('phone_number');
    $parsed = [];

    foreach( $raw as $phones )
    {
      $parsed = array_merge($parsed, explode("\n",$phones));
    }

    return $parsed;
  }
}
