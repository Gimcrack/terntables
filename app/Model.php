<?php

namespace App;

use Illuminate\Database\Eloquent\Model as BaseModel;
use Input;
use App\Tag;
use App\Exceptions\OperationRequiresCheckoutException;

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
   * Is the record checked out
   * @method isCheckedOut
   * @return boolean      [description]
   */
  public function isCheckedOut()
  {
    return ( !! $this->recordLock );
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

  /**
   * Checkout this model to the logged in user
   * @method checkoutToMe
   * @return [type]       [description]
   */
  public function checkoutToMe()
  {
    return $this->checkoutToId( \Auth::id() );
  }

  /**
   * Checkin the model
   * @method checkin
   * @return [type]  [description]
   */
  public function checkin()
  {
    if ( ! $this->isCheckedOutToMe() ) {
      throw new OperationRequiresCheckoutException($this, 'checkin');
    }

    $this->recordLock->delete();

    return true;
  }

  /**
   * Can this model be checked out
   * @method canBeCheckedOut
   * @return [type]          [description]
   */
  public function canBeCheckedOut()
  {
    $lock = $this->recordLock;
    return ( empty($lock) || $lock->checkExpired() || $lock->checkUser() );
  }

  /**
   * Can this model not be checked out
   * @method cannotBeCheckedOut
   * @return [type]             [description]
   */
  public function cannotBeCheckedOut()
  {
    return ! $this->canBeCheckedOut();
  }

  /**
   * Get the user that the record is checked out to
   * @method checkedOutToUser
   * @return [type]           [description]
   */
  public function checkedOutToUser()
  {
    if ( ! $this->isCheckedOut() ) {
      return null;
    }

    $id = $this->recordLock->user_id;

    return \App\User::find($id);
  }

  /**
   * Update tags for the model
   * @method updateTags
   * @return [type]     [description]
   */
  public function updateTags()
  {
    if ( ! method_exists($this, 'tags') ) return $this;

    $tags = Input::get('tags', [] );
    Tag::resolveTags( $this, $tags );

    return $this;
  }

}
