<?php

namespace App;

use App\Model;

class Outage extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'outages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      'outage_date',
      'complete_flag'
    ];

    /**
     * The column that identifies the model
     * @return [type] [description]
     */
    public function identifiableName()
    {
        return $this->outage_date;
    }

    /**
     * An Outage may have many Outage Tasks
     * @method OutageTasks
     */
    public function outageTasks()
    {
      return $this->belongsToMany('App\OutageTask')->withTimestamps();
    }

}
