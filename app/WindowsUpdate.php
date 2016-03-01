<?php

namespace App;

class WindowsUpdate extends Model
{
  /**
   * The database table that the model references
   *
   * @var string
   */
  protected $table = 'updates';

  /**
   * The column that identifies the model
   * @return [type] [description]
   */
  public function identifiableName()
  {
      return $this->title;
  }

  protected $searchableColumns = [
    'title' => 80,
    'description' => 20,
    'kb_article' => 30,
  ];

  /**
   * The mass assignable fields
   *
   * @var array
   */
  protected $fillable = [
      'title',
      'description',
      'kb_article',
  ];
}
