<?php

namespace App;

class UpdateBatch extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'update_batches';

  /**
   * An update batch belongs to one server
   * @method server
   * @return [type] [description]
   */
  public function server()
  {
    return $this->belongsTo('App\Server');
  }
}
