/**
 * applications.html.js
 *
 * applications view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. Abra',
			required : true,
			_label : 'Enter the Application name',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'inactive_flag',
			type : 'select',
			_label : 'Is the application inactive?',
			_optionssource : '0|1',
			_labelssource : 'No|Yes',
		},
		{
			name : 'group_id',
			_label : 'What Group "owns" this Application?',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
	], fieldset_2__fields = [
		{
			name : 'people',
			type : 'array',
			_label : 'Application Contacts',
			fields : [
				{
					name : 'people',
					type : 'select',
					_label : 'Select Contacts',
					_labelssource : 'Person.name',
					_optionssource : 'Person.id',
					multiple : true
				}, {
					name : 'contact_type',
					type : 'select',
					_optionssource : [
						'Primary',
						'Secondary',
						'Other',
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'servers',
			type : 'array',
			_label : 'Application Servers',
			fields : [
				{
					name : 'servers',
					type : 'select',
					_label : 'Select Servers',
					_labelssource : 'Server.name',
					_optionssource : 'Server.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'Primary Application Server',
						'Secondary Application Server',
						'Primary Database Server',
						'Secondary Database Server',
						'Primary Report Server',
						'Secondary Report Server',
						'Primary Web Server',
						'Secondary Web Server',
						'Primary DR Server',
						'Secondary DR Server',
						'Test Application Server',
						'Test Report Server',
						'Test Database Server',
						'Test Web Server',
						'Other'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'databases',
			type : 'array',
			_label : 'Application Databases',
			fields : [
				{
					name : 'databases',
					type : 'select',
					_label : 'Select Databases',
					_labelssource : 'Database.hostname,name',
					_optionssource : 'Database.id',
					multiple : true
				}, {
					name : 'database_type',
					type : 'select',
					_optionssource : [
						'Production Database',
						'Test Database',
						'Development Database',
						'Reporting Database'
						,'DR Database'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'tags[]',
			multiple : true,
			type : 'tokens',
			_label : 'Tags',
			_labelssource : 'Tag.name',
			_optionssource : 'Tag.id',
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('applications',
		{ // grid definition
			model : 'Application',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-cubes',
				headerTitle : 'Manage Applications',
				helpText : "<strong>Note:</strong> Manage Applications Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				custom : {
					markSelected : [
						{ label: 'Flag Selected Applications', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markApplication( { 'inactive_flag' : 1} );
							},
							label : 'As Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markApplication({ 'inactive_flag' : 0})
							},
							label : 'As Not Inactive'
						},
					]
				},
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"owner_name",
				"description",
				"people",
				"servers",
				'tags',
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"Description",
				"Contacts",
				"Servers",
				"Tags"
			],
			templates : { 				// html template functions

				name : function( value ) {
					var r = jApp.activeGrid.currentRow, status, className, label = '';

					if ( !! +r.inactive_flag ) {
						label = '<div class="label-sm label label-warning">Inactive</div> ';
					}

					return label + _.nameButton( value, 'fa-cubes' );
				},

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner || '', 'fa-users','Group');
				},

				servers : function(arr) {
					return _.get('name', arr, 'fa-server', 'Server' );
				},
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markApplication			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.hideInactive !== 'undefined' && !!temp.hideInactive) {
						filter.push('inactive_flag = 0');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleInactive : function( ) {
					jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
						? true : !jApp.activeGrid.temp.hideInactive;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
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
