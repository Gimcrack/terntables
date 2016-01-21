/**
 * admin.contacts.html.js
 *
 * admin.contacts view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. Document Manager',
			required : true,
			_label : 'Role Name',
			'data-validType' : 'Anything'
		},
		{
			name : 'model',
			placeholder : 'e.g. Document',
			required : true,
			_label : 'Model Name',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Descrption',
		},
	], fieldset_2__fields = [
		{
			name : 'create_enabled',
			type : 'select',
			_label : 'Create Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		},
		{
			name : 'read_enabled',
			type : 'select',
			_label : 'Read Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		},
		{
			name : 'update_enabled',
			type : 'select',
			_label : 'Update Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		},
		{
			name : 'delete_enabled',
			type : 'select',
			_label : 'Delete Enabled',
			_optionssource : '0|1',
			_labelssource : 'No|Yes'
		}
	], fieldset_3__fields = [
		{
			name : 'groups',
			type : 'select',
			_label : 'Apply This Role To What Groups?',
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
			multiple : true
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.roles',
	{
		model : 'Role',
		columnFriendly : 'name',
		gridHeader : {
			icon : 'fa-briefcase',
			headerTitle : 'Manage Roles &amp; Permissions',
			helpText : "<strong>Note:</strong> Setup Roles here."
		},
		columns : [ 				// columns to query
			"id",
			"name",
			"model",
			"permissions",
			"groups",
			"group_users"
		],
		headers : [ 				// headers for table
			"ID",
			"Business Role",
			"Model Name",
			"Permissions",
			"Groups",
			"Users",
		],
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : 'Permissions',
					class : 'col-lg-4',
					fields : fieldset_2__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-4',
					fields : fieldset_3__fields
				},
		]
	)

})(jApp);
