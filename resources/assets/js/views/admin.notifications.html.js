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
			name : 'person_id',
			type : 'select',
			required : true,
			_labelssource : 'Person.name',
			_optionssource : 'Person.id',
			_firstoption : null,
			_firstlabel : '-Choose-',
			_label : 'Contact Name',
			'data-validType' : 'select'
		},
		{
			name : 'notifications_enabled',
			type : 'select',
			_optionssource : [
				"None",
				"Email",
				"Text",
				"Both"
			],
			_firstlabel : "-Choose-",
			_firstoption : null,
			required : true,
			_label : 'Notifications Enabled',
			'data-validType' : 'select'
		},
		{
			name : 'email',
			type : 'textarea',
			_label : 'Enter Email Address, One Per Line',
		},
		{
			name : 'phone_number',
			type : 'textarea',
			_label : 'Enter Mobile Numbers, One Per Line',
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.notifications',
	{
		model : 'Notification',
		columnFriendly : 'name',
		toggles : {
			ellipses : false
		},
		gridHeader : {
			icon : 'fa-bell-o',
			headerTitle : 'Manage Notifications',
			helpText : "<strong>Note:</strong> Set up who will receive notifications."
		},
		columns : [ 				// columns to query
			"id",
			"person",
			"notifications_enabled",
			"email",
			"phone_number",
		],
		headers : [ 				// headers for table
			"ID",
			"Person",
			"Notifications",
			"Email",
			"Phone",
		],
		templates : {
			person : function() {
				var r = jApp.activeGrid.currentRow;
				return _.get('name',r.person,'fa-male','Person');
			},
			email : function( val ) {
				return val;
			}
		},
		fn : {
			/**
			 * Mark selected applications as inactive/active
			 * @method function
			 * @return {[type]} [description]
			 */
			markNotification			: function( atts ) {
				jApp.aG().action = 'withSelectedUpdate';
				jUtility.withSelected('custom', function(ids) {
					jUtility.postJSON( {
						url : jUtility.getCurrentFormAction(),
						success : jUtility.callback.submitCurrentForm,
						data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
					});
				});
			}, // end fn
		},

		rowBtns : {
			markSelected : [
				{ label: 'Enabled Notifications...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'Both'})
					},
					label : 'Email &amp; Text'
				},
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'Email'})
					},
					label : 'Email Only'
				},
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'Text'})
					},
					label : 'Text Only'
				},
				{
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						jApp.activeGrid.fn.markNotification({ 'notifications_enabled' : 'None'})
					},
					label : 'None'
				},

			]
		}
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
