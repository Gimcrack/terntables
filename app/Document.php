<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
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
     * The database table that the model references
     *
     * @var string
     */
    protected $table = 'documents';

    /**
     * The mass assignable fields
     *
     * @var array
     */
    protected $fillable = [
        'name'
      , 'description'
    ];

    /**
     * Polymorphic relationship. Second parameter to morphOne/morphMany
     * should be the same as the prefix for the *_id/*_type fields.
     */
    public function recordLock()
    {
        return $this->morphOne('App\RecordLock', 'lockable');
    }

    /**
     * Polymorphic relationship. Second parameter to morphOne/morphMany
     * should be the same as the prefix for the *_id/*_type fields.
     */
    public function tags()
    {
        return $this->morphMany('App\Tag', 'taggable');
    }

    /**
     * A document belongs to one user
     * @method owner
     * @return [type] [description]
     */
    public function owner()
    {
        return $this->belongTo('App\User','user_id');
    }
}
