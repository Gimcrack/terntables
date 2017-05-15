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
    'owner_name',
  ];

  protected $dates = [
    'created_at',
    'updated_at',
    'installed_at'
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
  
  public function scopeUnapproved($query)
  {
    return $query->whereApprovedFlag(0)
                 ->whereHiddenFlag(0);
  }

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
   * My groups
   * @method scopeMyGroups
   * @param  [type]        $query [description]
   * @return [type]               [description]
   */
  public function scopeMyGroups($query)
  {
    $my_groups = \Auth::guard('api')->user()->groups()->lists('id')->toArray();

    return $query->whereHas('server', function($q) use ($my_groups) {
      return $q->whereIn('group_id', $my_groups);
    });
  }

  /**
   * Get my groups production servers
   * @method scopeMyGroups_Production
   * @param  [type]                   $query [description]
   * @return [type]                          [description]
   */
  public function scopeMyGroups_Production($query)
  {
    return $query->myGroups()->production();
  }

  /**
   * Get my groups non-production servers
   * @method scopeMyGroups_Production
   * @param  [type]                   $query [description]
   * @return [type]                          [description]
   */
  public function scopeMyGroups_Nonproduction($query)
  {
    return $query->myGroups()->nonproduction();
  }

  /**
   * Get my groups servers
   * @method scopeMyGroups_Production
   * @param  [type]                   $query [description]
   * @return [type]                          [description]
   */
  public function scopeMyGroups_All($query)
  {
    return $query->myGroups();
  }

  /**
   * Get my groups production servers
   * @method scopeMyGroups_Production
   * @param  [type]                   $query [description]
   * @return [type]                          [description]
   */
  public function scopeMyGroups_None($query)
  {
    return $query->none();
  }


  /**
   * Get the owner name
   * @method getOwnerNameAttribute
   * @return [type]                [description]
   */
  public function getOwnerNameAttribute()
  {
    if ( ! $this->server || ! $this->server->owner ) return null;

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
    if ( ! $this->server ) return null; 
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

  /**
   * An update details belongs to one update
   *
   * @return     <type>  ( description_of_the_return_value )
   */
  public function header()
  {
    return $this->belongsTo('App\Update','update_id') ?? new Update;
  }

}
