/**
 * outages.html.js
 *
 * outages view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			required : true,
			_label : 'Enter the name of the Operating System.',
			'data-validType' : 'Anything'
		},
		{
			name : 'servers',
      _label : 'What servers have this Operating System?',
			type : 'select',
			_optionssource : 'Server.id',
			_labelssource : 'Server.name',
      multiple : true
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.operatingSystems',
		{ // grid definition
			model : 'OperatingSystem',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-windows',
				headerTitle : 'Manage Operating Systems',
				helpText : "<strong>Note:</strong> Manage Operating Systems Here"
			},
			columns : [ 				// columns to query
				"id",
				"name",
        "servers",
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
        "Servers"
			],
			templates : { 				// html template functions
        servers : function(arr) {
          return _.get('name',arr,'fa-server','Server')
        }
			},
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},
		]
	)
})(jApp);
