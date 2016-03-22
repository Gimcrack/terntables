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
			required : true,
			_label : 'Service Name',
			'data-validType' : 'Anything',
			placeholder : 'e.g. Windows Update'
		},
		{
			name : 'server_name',
			type : 'select',
			_optionssource : 'Server.name',
			_labelssource : 'Server.name',
			_firstlabel : "-All-",
			_firstoption : "All",
			_label : 'Server',
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.notificationExemptions',
	{
		model : 'NotificationExemption',
		columnFriendly : 'name',
		toggles : {
			ellipses : false
		},
		gridHeader : {
			icon : 'fa-bell-slash-o',
			headerTitle : 'Notification Exceptions',
			helpText : "<strong>Note:</strong> Notifications will not be sent for these services on the specified servers."
		},
		columns : [ 				// columns to query
			"id",
			"name",
			"server_name",
		],
		headers : [ 				// headers for table
			"ID",
			"Service",
			"Server",
		],
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},
		]
	)

})(jApp);
