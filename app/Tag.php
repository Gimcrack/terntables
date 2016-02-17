<?php

namespace App;

use Illuminate\Database\Eloquent\Model as BaseModel;

class Tag extends BaseModel
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'tags';

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'name'
  ];

  /**
   * Polymorphic relationship. Second parameter to morphOne/morphMany
   * should be the same as the prefix for the *_id/*_type fields.
   */
  public function documents()
  {
      return $this->morphedByMany('App\Document', 'taggable');
  }

  /**
   * Resolve tags
   * @param  array  $tags [description]
   * @return [type]       [description]
   */
  public static function resolveTags($taggable, $tags = [])
  {
    if ( is_string($tags) ){
      $tags = explode(",",$tags);
    }
    if ( empty($tags) ) {
      $tags = [];
    };

    $newTagList = [];
    foreach($tags as $tagName) {
      if (empty($tagName)) continue;
      $tagName = trim($tagName);
      $tag = Tag::where('name', $tagName )->first() ?: Tag::create(['name' => $tagName]);
      $newTagList[] = $tag->id;
    }

    $taggable->tags()->sync($newTagList);

  }

}
