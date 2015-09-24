<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ColParam extends Model
{

    /**
     * The database table used by the model
     *
     * @var string
     */
    protected $table = 'col_params';

    protected $primaryKey = 'colparam_id';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
      	'tableName'
      ,	'name'
      ,	'_label'
      ,	'_enabled'
      ,	'type'
      ,	'value'
      ,	'id'
      ,	'placeholder'
      ,	'class'
      ,	'onClick'
      ,	'onChange'
      ,	'data-validType'
      ,	'data-validType-template'
      ,	'data-ordering'
      ,	'data-fieldset'
      ,	'data-viewName'
      ,	'accept'
      ,	'alt'
      ,	'src'
      ,	'list'
      ,	'pattern'
      ,	'wrap'
      ,	'autocomplete'
      ,	'autofocus'
      ,	'checked'
      ,	'disabled'
      ,	'multiple'
      ,	'readonly'
      ,	'required'
      ,	'size'
      ,	'maxlength'
      ,	'cols'
      ,	'rows'
      ,	'height'
      ,	'width'
      ,	'max'
      ,	'min'
      ,	'step'
      ,	'_firstlabel'
      ,	'_firstoption'
      ,	'_labelssource'
      ,	'_optionssource'
      ,	'_linkedElementID'
      ,	'_linkedElementOptions'
      ,	'_linkedElementLabels'
      ,	'_linkedElementFilterCol'
    ];


    public function getDisabledAttribute($value)
    {
      return (int) $value;
    }

    public function getAutocompleteAttribute($value)
    {
      return (int) $value;
    }

    public function getAutofocusAttribute($value)
    {
      return (int) $value;
    }

    public function getCheckedAttribute($value)
    {
      return (int) $value;
    }

    public function getColparamIdAttribute($value)
    {
      return (int) $value;
    }

    public function getMultipleAttribute($value)
    {
      return (int) $value;
    }

    public function getReadonlyAttribute($value)
    {
      return (int) $value;
    }

    public function getRequiredAttribute($value)
    {
      return (int) $value;
    }

}
