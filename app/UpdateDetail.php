<?php

namespace App;

class UpdateDetail extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'update_details';

  public $appends = [
    'updated_at_for_humans',
    'identifiable_name',
    'title',
    'description',
    'hostname',
    'kb_article',
    'owner_name'
  ];

  protected $searchableColumns = [
    'server.owner.name' => 100,
    'server.name' => 80,
    'header.title' => 80,
    'header.kb_article' => 50,
  ];

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'approved_flag'
  ];

  public function scopeProduction($query)
  {
    return $query->whereHas('server', function($q) {
      return $q->where('production_flag',1);
    });
  }

  public function scopeNonproduction($query)
  {
    return $query->whereHas('server', function($q) {
      return $q->where('production_flag',0);
    });
  }

  /**
   * Get the owner name
   * @method getOwnerNameAttribute
   * @return [type]                [description]
   */
  public function getOwnerNameAttribute()
  {
    return $this->server->owner->name;
  }

  public function identifiableName()
  {
    return $this->header->title;
  }

  public function getKbArticleAttribute()
  {
    return $this->header->kb_article;
  }

  public function getHostnameAttribute()
  {
    return $this->server->name;
  }

  public function getTitleAttribute()
  {
    return $this->header->title;
  }

  public function getDescriptionAttribute()
  {
    return $this->header->description;
  }

  /**
   * An update detail belongs to one server
   * @method updates
   * @return [type]  [description]
   */
  public function server()
  {
    return $this->belongsTo('App\Server');
  }

  public function header()
  {
    return $this->belongsTo('App\Update','update_id');
  }

}
