<?php

namespace App;

use Illuminate\Database\Eloquent\Model as BaseModel;

abstract class Model extends BaseModel
{
  /**
   * Make the model track revision changes
   */
  use \Venturecraft\Revisionable\RevisionableTrait;

  /**
   * Boot the model
   * @return [type] [description]
   */
  public static function boot()
  {
      parent::boot();
  }

  /**
   * The column that identifies the model
   * @return [type] [description]
   */
  public function identifiableName()
  {
      return $this->name;
  }

  /**
   * Track creations as revisions
   * @var [type]
   */
  protected $revisionCreationsEnabled = true;

  /**
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function recordLock()
  {
      return $this->morphOne('App\RecordLock', 'lockable');
  }

  /**
   * Is the model checked out to me
   * @method isCheckedOutToMe
   * @return boolean          [description]
   */
  public function isCheckedOutToMe()
  {
    if ( ! $this->recordLock ) {
      return false;
    }

    return $this->recordLock->isSameUser();
  }

  /**
   * Is the model checked out to someone else
   * @method isCheckedOutToSomeoneElse
   * @return boolean          [description]
   */
  public function isCheckedOutToSomeoneElse()
  {
    if ( ! $this->recordLock ) {
      return false;
    }

    return ! $this->recordLock->isSameUser();
  }

  /**
   * Checkout this model to the specified id
   * @method checkoutToId
   * @param  [type]       $id [description]
   * @return [type]           [description]
   */
  public function checkoutToId($id)
  {
    RecordLock::create([
      'lockable_id' => $this->id,
      'lockable_type' => get_class($this),
      'user_id' => $id
    ]);

    return $this;
  }


}
