/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. Administrators',
			_label : 'Group Name',
			required : true,
			'data-validType' : 'Anything',
		}, {
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		}, {
			name : 'modules',
			type : 'select',
			_label : 'Assign roles/permissions to this group',
			_labelssource : 'Module.role',
			_optionssource : 'Module.id',
			multiple : true,
		}
	], fieldset_2__fields = [
		{
			name : 'users',
			type : 'array',
			_label : 'What Users are in this Group?',
			fields : [
				{
					name : 'users',
					type : 'select',
					_label : 'Select Users',
					_labelssource : 'User.username',
					_optionssource : 'User.id',
					multiple : true
				}, {
					name : 'comment',
					placeholder : 'Comment',
				}, {
					name : 'primary_flag',
					type : 'select',
					_labelssource : 'Primary Group?|No|Yes',
					_optionssource : '|0|1',
					'data-no-bsms' : true
				}
			]
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.groups',
		{ // grid definition
			model : 'Group',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-users',
				headerTitle : 'Manage Groups',
				helpText : "<strong>Note:</strong> Manage Groups Here"
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"description",
				"users",
				"modules"
			],

			headers : [ 				// headers for table
				"ID",
				"Name",
				"Description",
				"Users",
				"Roles (Permissions)"
			],
		},
		[ // colparams
			{ // fieldset
				label : 'Group Information',
				helpText : 'Please fill out the following information about the group.',
				class : 'col-lg-5',
				fields : fieldset_1__fields
			},
			{	// fieldset
				class : 'col-lg-5',
				fields : fieldset_2__fields
			}
		]
	);

})(jApp)
