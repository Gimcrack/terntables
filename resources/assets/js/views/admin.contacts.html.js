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
			placeholder : 'e.g. John Smith',
			required : true,
			_label : 'Enter the person\'s full name',
			'data-validType' : 'Anything'
		}
	], fieldset_2__fields = [
		{
			name : 'users',
			type : 'array',
			_label : 'Associate one or more Usernames with this Person',
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
					_labelssource : 'Primary Username?|No|Yes',
					_optionssource : '|0|1',
					'data-no-bsms' : true
				}
			]
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.contacts',
		{ // grid definition
			model : 'Person',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-male',
				headerTitle : 'Manage Contacts',
				helpText : "<strong>Note:</strong> Manage Contacts Here"
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"users",
				"user_groups"
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Username(s)",
				"Groups"
			],
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-5',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-5',
					fields : fieldset_2__fields
				}
		]
	)

})(jApp);
