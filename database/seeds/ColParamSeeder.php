<?php

use Illuminate\Database\Seeder;
use App\ColParam;

class ColParamSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Eloquent::unguard();
        // col_params table
        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_enabled'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'onChange' => 'jApp.activeGrid.fn.updateColParamForm()'
        ,	'_label' => 'Enabled'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '0'
        ,	'data-fieldset' => '1'
        ,	'_optionsSource' => 'yes|no'
        ,	'_labelsSource' => 'Yes|No'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_firstlabel'
        ,	'placeholder' => 'Hint Text'
        ,	'_label' => 'First Label'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '30'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_firstoption'
        ,	'placeholder' => 'Dummy Value'
        ,	'_label' => 'First Options'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '31'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_label'
        ,	'placeholder' => 'Label'
        ,	'_label' => 'Prompt'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_labels'
        ,	'_enabled' => 'no'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_labelssource'
        ,	'placeholder' => 'List | Table.Column'
        ,	'_label' => 'Labels Source'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '32'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmFilterCol'
        ,	'placeholder' => 'Column Name'
        ,	'_label' => 'Linked Element Filter'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmID'
        ,	'placeholder' => '#ID of Select Element'
        ,	'_label' => 'Linked Select #ID'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmLabels'
        ,	'placeholder' => '[table].[column]'
        ,	'_label' => 'Linked Element Labels Source'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmOptions'
        ,	'placeholder' => '[table].[column]'
        ,	'_label' => 'Linked Element Options Source'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '4'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_options'
        ,	'_enabled' => 'no'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_optionsfilter'
        ,	'placeholder' => 'Condition'
        ,	'_label' => 'Options Filter'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '34'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_optionssource'
        ,	'placeholder' => 'List | Table.Column'
        ,	'_label' => 'Options Source'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '33'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-validType-template'
        ,	'type' => 'select'
        ,	'onChange' => 'validType.value=this.value'
        ,	'_label' => 'Valid Type Preset'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '6'
        ,	'data-fieldset' => '2'
        ,	'_optionsSource' => '|Anything|file|Number|Integer|Email Address|Zip Code|Phone Number|US State|IPV4|base64|checkbox|radio|select|min>=[value]|max<=[value]|min_val>=[value]|max_val<=[value]|exact==[value]|between==[value],[value]|date_gt_[value]|date_lt_[value]|date_eq_['
        ,	'_labelsSource' => '--Choose--|Anything|file|Number|Integer|Email Address|Zip Code|Phone Number|US State|IPV4|base64|checkbox|radio|select|min>=[value]|max<=[value]|min_val>=[value]|max_val<=[value]|exact==[value]|between==[value],[value]|date_gt_[value]|date_lt_[value]'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'accept'
        ,	'placeholder' => 'File Type(s)'
        ,	'_label' => 'Accept'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '19'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'alt'
        ,	'placeholder' => 'Alternate Text'
        ,	'_label' => 'Alt'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '20'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'autocomplete'
        ,	'type' => 'select'
        ,	'_label' => 'Autocomplete'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '9'
        ,	'data-fieldset' => '1'
        ,	'_optionsSource' => '|on|off'
        ,	'_labelsSource' => '-Unspecified|On|Off'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'autofocus'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '__OFF__'
        ,	'_label' => 'Autofocus?'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '13'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|autofocus'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'checked'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '__OFF__'
        ,	'_label' => 'Checked?'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '17'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|checked'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'class'
        ,	'placeholder' => 'CSS Class'
        ,	'value' => 'form-control'
        ,	'_label' => 'Class'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '10'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-ordering'
        ,	'placeholder' => 'e.g. 1'
        ,	'_label' => 'Ordering'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '7'
        ,	'data-fieldset' => '1'
        ]);

        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'cols'
        ,	'placeholder' => 'Number of Columns'
        ,	'_label' => 'Cols'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '24'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'disabled'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '__OFF__'
        ,	'_label' => 'Disabled?'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '14'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|disabled'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-fieldset'
        ,	'placeholder' => 'e.g. 1|2|3'
        ,	'_label' => 'Fieldset'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '6'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'height'
        ,	'placeholder' => 'Pixels'
        ,	'_label' => 'Height'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '21'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'id'
        ,	'placeholder' => 'Element ID'
        ,	'_label' => 'ID'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'list'
        ,	'placeholder' => 'datalist_id'
        ,	'_label' => 'List'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '29'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'max'
        ,	'placeholder' => 'Number | Date'
        ,	'_label' => 'Max Value'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '7'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'maxlength'
        ,	'placeholder' => 'Num Characters'
        ,	'step' => '1.000000'
        ,	'type' => 'number'
        ,	'data-validType' => 'Integer'
        ,	'_label' => 'Max Length'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '27'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'min'
        ,	'placeholder' => 'Number | Date'
        ,	'_label' => 'Min Value'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '8'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'multiple'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '__OFF__'
        ,	'_label' => 'Multiple?'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '15'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|multiple'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'name'
        ,	'placeholder' => 'Element Name'
        ,	'_label' => 'Name'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'onChange'
        ,	'placeholder' => 'function or statement'
        ,	'_label' => 'onChange'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '12'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'onClick'
        ,	'placeholder' => 'function or statement'
        ,	'_label' => 'onClick'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '11'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'pattern'
        ,	'placeholder' => 'RegExp'
        ,	'_label' => 'Validation Pattern'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '10'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'placeholder'
        ,	'placeholder' => 'Hint Text'
        ,	'_label' => 'Placeholder'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '4'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'readonly'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '__OFF__'
        ,	'_label' => 'Readonly?'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '16'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|readonly'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'required'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '__OFF__'
        ,	'_label' => 'Required?'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '5'
        ,	'data-fieldset' => '2'
        ,	'_optionsSource' => '__OFF__|required'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'rows'
        ,	'placeholder' => 'Number of Rows'
        ,	'_label' => 'Rows'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '25'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'size'
        ,	'placeholder' => 'Select Size | Num Characters'
        ,	'step' => '1.000000'
        ,	'type' => 'number'
        ,	'data-validType' => 'Integer'
        ,	'_label' => 'Size'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '28'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'src'
        ,	'placeholder' => 'URL'
        ,	'_label' => 'Src'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '23'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'step'
        ,	'placeholder' => 'Interval Size'
        ,	'_label' => 'Step'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '9'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'tableName'
        ,	'type' => 'hidden'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '0'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'autofocus' => '__OFF__'
        ,	'checked' => '__OFF__'
        ,	'disabled' => '__OFF__'
        ,	'id' => 'type'
        ,	'multiple' => '__OFF__'
        ,	'name' => 'type'
        ,	'placeholder' => 'Element Type'
        ,	'readonly' => '__OFF__'
        ,	'required' => '__OFF__'
        ,	'type' => 'select'
        ,	'onChange' => 'jApp.activeGrid.fn.updateColParamForm()'
        ,	'class' => 'form-control'
        ,	'_label' => 'Type'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '0'
        ,	'data-fieldset' => '1'
        ,	'_optionsSource' => 'text|textarea|password|button|checkbox|file|hidden|image|radio|reset|select|submit|color|date|datetime|datetime-local|email|month|range|number|search|tel|time|url'
        ,	'_labelsSource' => 'text|textarea|password|button|checkbox|file|hidden|image|radio|reset|select|submit|color|date|datetime|datetime-local|email|month|range|number|search|tel|time|url'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-validType'
        ,	'placeholder' => 'Type | Choose Preset'
        ,	'_label' => 'Valid Type'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '6'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'value'
        ,	'placeholder' => 'Element value'
        ,	'_label' => 'Value'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '5'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-viewName'
        ,	'placeholder' => 'e.g. vw_UserContact'
        ,	'_label' => 'View Name'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '10'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'width'
        ,	'placeholder' => 'Pixels'
        ,	'_label' => 'Width'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '22'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'wrap'
        ,	'placeholder' => 'hard | soft'
        ,	'_label' => 'Wrap'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '26'
        ,	'data-fieldset' => '1'
        ]);

        // users colparams
        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'name'
        ,	'placeholder' => 'e.g. John Smith'
        ,	'_label' => 'Name'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'username'
        ,	'placeholder' => 'e.g. jsmith'
        ,	'_label' => 'Username'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'email'
        ,	'placeholder' => 'email@domain.com'
        ,	'_label' => 'Email Address'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Email Adress'
        ]);

        // Groups colparams
        ColParam::create([	'tableName' => 'groups'
        ,	'name' => 'name'
        ,	'placeholder' => 'e.g. Administrators'
        ,	'_label' => 'Name'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'groups'
        ,	'name' => 'description'
        , 'type' => 'textarea'
        ,	'_label' => 'Description'
        ,	'_enabled' => 'yes'
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        ]);

    }
}
