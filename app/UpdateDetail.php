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
    'kb_article'
  ];

  protected $searchableColumns = [
    'server.name',
    'header.title',
    'header.kb_article',
  ];

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'approved_flag'
  ];

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
