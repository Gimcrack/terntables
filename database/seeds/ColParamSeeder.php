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

        //empty table first
        ColParam::truncate();

        // col_params table
        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_enabled'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'onChange' => 'jApp.activeGrid.fn.updateColParamForm()'
        ,	'_label' => 'Enabled'
        ,	'_enabled' => 1
        ,	'data-ordering' => '0'
        ,	'data-fieldset' => '1'
        ,	'_optionsSource' => 'yes|no'
        ,	'_labelsSource' => 'Yes|No'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_firstlabel'
        ,	'placeholder' => 'Hint Text'
        ,	'_label' => 'First Label'
        ,	'_enabled' => 1
        ,	'data-ordering' => '30'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_firstoption'
        ,	'placeholder' => 'Dummy Value'
        ,	'_label' => 'First Options'
        ,	'_enabled' => 1
        ,	'data-ordering' => '31'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_label'
        ,	'placeholder' => 'Label'
        ,	'_label' => 'Prompt'
        ,	'_enabled' => 1
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_labels'
        ,	'_enabled' => 0
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_labelssource'
        ,	'placeholder' => 'List | Table.Column'
        ,	'_label' => 'Labels Source'
        ,	'_enabled' => 1
        ,	'data-ordering' => '32'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmFilterCol'
        ,	'placeholder' => 'Column Name'
        ,	'_label' => 'Linked Element Filter'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmID'
        ,	'placeholder' => '#ID of Select Element'
        ,	'_label' => 'Linked Select #ID'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmLabels'
        ,	'placeholder' => '[table].[column]'
        ,	'_label' => 'Linked Element Labels Source'
        ,	'_enabled' => 1
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_linkedElmOptions'
        ,	'placeholder' => '[table].[column]'
        ,	'_label' => 'Linked Element Options Source'
        ,	'_enabled' => 1
        ,	'data-ordering' => '4'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_options'
        ,	'_enabled' => 0
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_optionsfilter'
        ,	'placeholder' => 'Condition'
        ,	'_label' => 'Options Filter'
        ,	'_enabled' => 1
        ,	'data-ordering' => '34'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => '_optionssource'
        ,	'placeholder' => 'List | Table.Column'
        ,	'_label' => 'Options Source'
        ,	'_enabled' => 1
        ,	'data-ordering' => '33'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-validType-template'
        ,	'type' => 'select'
        ,	'onChange' => 'validType.value=this.value'
        ,	'_label' => 'Valid Type Preset'
        ,	'_enabled' => 1
        ,	'data-ordering' => '6'
        ,	'data-fieldset' => '2'
        ,	'_optionsSource' => '|Anything|file|Number|Integer|Email Address|Zip Code|Phone Number|US State|IPV4|base64|checkbox|radio|select|min>=[value]|max<=[value]|min_val>=[value]|max_val<=[value]|exact==[value]|between==[value],[value]|date_gt_[value]|date_lt_[value]|date_eq_['
        ,	'_labelsSource' => '--Choose--|Anything|file|Number|Integer|Email Address|Zip Code|Phone Number|US State|IPV4|base64|checkbox|radio|select|min>=[value]|max<=[value]|min_val>=[value]|max_val<=[value]|exact==[value]|between==[value],[value]|date_gt_[value]|date_lt_[value]'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'accept'
        ,	'placeholder' => 'File Type(s)'
        ,	'_label' => 'Accept'
        ,	'_enabled' => 1
        ,	'data-ordering' => '19'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'alt'
        ,	'placeholder' => 'Alternate Text'
        ,	'_label' => 'Alt'
        ,	'_enabled' => 1
        ,	'data-ordering' => '20'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'autocomplete'
        ,	'type' => 'select'
        ,	'_label' => 'Autocomplete'
        ,	'_enabled' => 1
        ,	'data-ordering' => '9'
        ,	'data-fieldset' => '1'
        ,	'_optionsSource' => '|on|off'
        ,	'_labelsSource' => '-Unspecified|On|Off'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'autofocus'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => '0'
        ,	'_label' => 'Autofocus?'
        ,	'_enabled' => 1
        ,	'data-ordering' => '13'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|autofocus'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'checked'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => 0
        ,	'_label' => 'Checked?'
        ,	'_enabled' => 1
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
        ,	'_enabled' => 1
        ,	'data-ordering' => '10'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-ordering'
        ,	'placeholder' => 'e.g. 1'
        ,	'_label' => 'Ordering'
        ,	'_enabled' => 1
        ,	'data-ordering' => '7'
        ,	'data-fieldset' => '1'
        ]);

        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'cols'
        ,	'placeholder' => 'Number of Columns'
        ,	'_label' => 'Cols'
        ,	'_enabled' => 1
        ,	'data-ordering' => '24'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'disabled'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => 0
        ,	'_label' => 'Disabled?'
        ,	'_enabled' => 1
        ,	'data-ordering' => '14'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|disabled'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-fieldset'
        ,	'placeholder' => 'e.g. 1|2|3'
        ,	'_label' => 'Fieldset'
        ,	'_enabled' => 1
        ,	'data-ordering' => '6'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'height'
        ,	'placeholder' => 'Pixels'
        ,	'_label' => 'Height'
        ,	'_enabled' => 1
        ,	'data-ordering' => '21'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'id'
        ,	'placeholder' => 'Element ID'
        ,	'_label' => 'ID'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'list'
        ,	'placeholder' => 'datalist_id'
        ,	'_label' => 'List'
        ,	'_enabled' => 1
        ,	'data-ordering' => '29'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'max'
        ,	'placeholder' => 'Number | Date'
        ,	'_label' => 'Max Value'
        ,	'_enabled' => 1
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
        ,	'_enabled' => 1
        ,	'data-ordering' => '27'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'min'
        ,	'placeholder' => 'Number | Date'
        ,	'_label' => 'Min Value'
        ,	'_enabled' => 1
        ,	'data-ordering' => '8'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'multiple'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => 0
        ,	'_label' => 'Multiple?'
        ,	'_enabled' => 1
        ,	'data-ordering' => '15'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|multiple'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'name'
        ,	'placeholder' => 'Element Name'
        ,	'_label' => 'Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'onChange'
        ,	'placeholder' => 'function or statement'
        ,	'_label' => 'onChange'
        ,	'_enabled' => 1
        ,	'data-ordering' => '12'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'onClick'
        ,	'placeholder' => 'function or statement'
        ,	'_label' => 'onClick'
        ,	'_enabled' => 1
        ,	'data-ordering' => '11'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'pattern'
        ,	'placeholder' => 'RegExp'
        ,	'_label' => 'Validation Pattern'
        ,	'_enabled' => 1
        ,	'data-ordering' => '10'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'placeholder'
        ,	'placeholder' => 'Hint Text'
        ,	'_label' => 'Placeholder'
        ,	'_enabled' => 1
        ,	'data-ordering' => '4'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'readonly'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => 0
        ,	'_label' => 'Readonly?'
        ,	'_enabled' => 1
        ,	'data-ordering' => '16'
        ,	'data-fieldset' => '3'
        ,	'_optionsSource' => '__OFF__|readonly'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'required'
        ,	'size' => '2'
        ,	'type' => 'select'
        ,	'value' => 0
        ,	'_label' => 'Required?'
        ,	'_enabled' => 1
        ,	'data-ordering' => '5'
        ,	'data-fieldset' => '2'
        ,	'_optionsSource' => '__OFF__|required'
        ,	'_labelsSource' => 'No|Yes'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'rows'
        ,	'placeholder' => 'Number of Rows'
        ,	'_label' => 'Rows'
        ,	'_enabled' => 1
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
        ,	'_enabled' => 1
        ,	'data-ordering' => '28'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'src'
        ,	'placeholder' => 'URL'
        ,	'_label' => 'Src'
        ,	'_enabled' => 1
        ,	'data-ordering' => '23'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'step'
        ,	'placeholder' => 'Interval Size'
        ,	'_label' => 'Step'
        ,	'_enabled' => 1
        ,	'data-ordering' => '9'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'tableName'
        ,	'type' => 'hidden'
        ,	'_enabled' => 1
        ,	'data-ordering' => '0'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'autofocus' => 0
        ,	'checked' => 0
        ,	'disabled' => 0
        ,	'id' => 'type'
        ,	'multiple' => 0
        ,	'name' => 'type'
        ,	'placeholder' => 'Element Type'
        ,	'readonly' => 0
        ,	'required' => 0
        ,	'type' => 'select'
        ,	'onChange' => 'jApp.activeGrid.fn.updateColParamForm()'
        ,	'class' => 'form-control'
        ,	'_label' => 'Type'
        ,	'_enabled' => 1
        ,	'data-ordering' => '0'
        ,	'data-fieldset' => '1'
        ,	'_optionsSource' => 'text|textarea|password|button|checkbox|file|hidden|image|radio|reset|select|submit|color|date|datetime|datetime-local|email|month|range|number|search|tel|time|url'
        ,	'_labelsSource' => 'text|textarea|password|button|checkbox|file|hidden|image|radio|reset|select|submit|color|date|datetime|datetime-local|email|month|range|number|search|tel|time|url'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-validType'
        ,	'placeholder' => 'Type | Choose Preset'
        ,	'_label' => 'Valid Type'
        ,	'_enabled' => 1
        ,	'data-ordering' => '6'
        ,	'data-fieldset' => '2'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'value'
        ,	'placeholder' => 'Element value'
        ,	'_label' => 'Value'
        ,	'_enabled' => 1
        ,	'data-ordering' => '5'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'data-viewName'
        ,	'placeholder' => 'e.g. vw_UserContact'
        ,	'_label' => 'View Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '10'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'width'
        ,	'placeholder' => 'Pixels'
        ,	'_label' => 'Width'
        ,	'_enabled' => 1
        ,	'data-ordering' => '22'
        ,	'data-fieldset' => '1'
        ]);


        ColParam::create([	'tableName' => 'col_params'
        ,	'name' => 'wrap'
        ,	'placeholder' => 'hard | soft'
        ,	'_label' => 'Wrap'
        ,	'_enabled' => 1
        ,	'data-ordering' => '26'
        ,	'data-fieldset' => '1'
        ]);

        // people colparams
        ColParam::create([	'tableName' => 'people'
        ,	'name' => 'name'
        ,	'placeholder' => 'e.g. John Smith'
        ,	'_label' => 'Full Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'people'
        ,	'name' => 'users'
        ,	'type' => 'select'
        ,	'_label' => 'Username(s)'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '3'
        , '_labelssource' => "User.username"
        , '_optionssource' => "User.id"
        , 'multiple' => 1
        ]);

        // users colparams
        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'username'
        ,	'placeholder' => 'e.g. jsmith'
        ,	'_label' => 'Username'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'email'
        ,	'placeholder' => 'email@domain.com'
        ,	'_label' => 'Email Address'
        ,	'_enabled' => 1
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Email Address'
        ]);

        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'people_id'
        ,	'type' => 'select'
        ,	'_label' => 'Contact Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'select'
        , '_firstlabel' => '-Choose-'
        , '_firstoption' => 0
        , '_labelssource' => "Person.name"
        , '_optionssource' => "Person.id"
        , 'multiple' => 0
        ]);

        ColParam::create([	'tableName' => 'users'
        ,	'name' => 'groups'
        ,	'type' => 'select'
        ,	'_label' => 'User Groups'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '3'
        , 'data-validType' => 'select'
        , '_labelssource' => "Group.name"
        , '_optionssource' => "Group.id"
        , 'multiple' => 1
        ]);

        // Groups colparams
        ColParam::create([	'tableName' => 'groups'
        ,	'name' => 'name'
        ,	'placeholder' => 'e.g. Administrators'
        ,	'_label' => 'Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'groups'
        ,	'name' => 'description'
        , 'type' => 'textarea'
        ,	'_label' => 'Description'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        ]);

        ColParam::create([	'tableName' => 'groups'
        ,	'name' => 'users'
        ,	'type' => 'select'
        ,	'_label' => 'Group Users'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '3'
        , 'data-validType' => 'select'
        , '_labelssource' => "User.username"
        , '_optionssource' => "User.id"
        , 'multiple' => 1
        ]);

        ColParam::create([	'tableName' => 'groups'
        ,	'name' => 'modules'
        ,	'type' => 'select'
        ,	'_label' => 'Group Modules'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '3'
        , 'data-validType' => 'select'
        , '_labelssource' => "Module.name"
        , '_optionssource' => "Module.id"
        , 'multiple' => 1
        ]);

        // Modules colparams
        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'name'
        ,	'placeholder' => 'e.g. Document'
        ,	'_label' => 'Model Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'role'
        ,	'placeholder' => 'e.g. Document Managers'
        ,	'_label' => 'Business Role'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'description'
        ,	'type' => 'textarea'
        ,	'_label' => 'Description'
        ,	'_enabled' => 1
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '1'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'create_enabled'
        , 'type' => 'select'
        ,	'_label' => 'Create Enabled'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '2'
        , '_optionssource' => '0|1'
        , '_labelssource' => 'No|Yes'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'read_enabled'
        , 'type' => 'select'
        ,	'_label' => 'Read Enabled'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '2'
        , '_optionssource' => '0|1'
        , '_labelssource' => 'No|Yes'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'update_enabled'
        , 'type' => 'select'
        ,	'_label' => 'Update Enabled'
        ,	'_enabled' => 1
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '2'
        , '_optionssource' => '0|1'
        , '_labelssource' => 'No|Yes'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'delete_enabled'
        , 'type' => 'select'
        ,	'_label' => 'Delete Enabled'
        ,	'_enabled' => 1
        ,	'data-ordering' => '4'
        ,	'data-fieldset' => '2'
        , '_optionssource' => '0|1'
        , '_labelssource' => 'No|Yes'
        ]);

        ColParam::create([	'tableName' => 'modules'
        ,	'name' => 'groups'
        ,	'type' => 'select'
        ,	'_label' => 'Module Groups'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '3'
        , 'data-validType' => 'select'
        , '_labelssource' => "Group.name"
        , '_optionssource' => "Group.id"
        , 'multiple' => 1
        ]);

        // documents colparams
        ColParam::create([	'tableName' => 'documents'
        ,	'name' => 'name'
        ,	'placeholder' => 'A unique name'
        ,	'_label' => 'Document Name'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        , 'data-validType' => 'Anything'
        ]);

        ColParam::create([	'tableName' => 'documents'
        ,	'name' => 'description'
        ,	'type' => 'textarea'
        ,	'_label' => 'Description'
        ,	'_enabled' => 1
        ,	'data-ordering' => '3'
        ,	'data-fieldset' => '1'
        , 'required' => 0
        ]);

        ColParam::create([	'tableName' => 'documents'
        ,	'name' => 'original_file'
        ,	'type' => 'file'
        ,	'_label' => 'Upload XML File'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '1'
        , 'required' => 1
        ]);

        ColParam::create([	'tableName' => 'documents'
        ,	'name' => 'people_id'
        ,	'type' => 'select'
        ,	'_label' => 'Document Owner'
        ,	'_enabled' => 1
        ,	'data-ordering' => '1'
        ,	'data-fieldset' => '3'
        , 'data-validType' => 'select'
        , '_labelssource' => "Person.name"
        , '_optionssource' => "Person.id"
        , 'multiple' => 0
        ]);

        ColParam::create([	'tableName' => 'documents'
        ,	'name' => 'tags'
        ,	'type' => 'select'
        ,	'_label' => 'Tags'
        ,	'_enabled' => 1
        ,	'data-ordering' => '2'
        ,	'data-fieldset' => '3'
        , 'data-validType' => 'select'
        , '_labelssource' => "Tag.name"
        , '_optionssource' => "Tag.id"
        , 'multiple' => 1
        ]);
    }
}
