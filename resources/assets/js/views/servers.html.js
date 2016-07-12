/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. msb01sql',
			required : true,
			_label : 'Enter the Server hostname',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'cname',
			type : 'textarea',
			_label : 'Enter any CNAME(s) (aliases) for this server.',
		},
		{
			name : 'ip',
			_label : 'IP Address',
			//required : true,
			'data-validType' : 'IPV4'
		},

	],

	fieldset_2__fields = [
		{
			name : 'group_id',
			_label : 'What Group "owns" this Server?',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'inactive_flag',
			_label : 'Is this server inactive?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'production_flag',
			_label : 'Is this a production server?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'windows_updatable_flag',
			_label : 'Does this server require Windows Updates?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'operating_system_id',
			_label : 'Operating System',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_optionssource : 'OperatingSystem.id',
			_labelssource : 'OperatingSystem.name',
			_firstlabel : '-Choose-',
			_firstoption : null
		},
	],

	fieldset_3__fields = [
		{
			name : 'people',
			type : 'array',
			_label : 'Server Contacts',
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
			name : 'applications',
			type : 'array',
			_label : 'Server Applications',
			fields : [
				{
					name : 'applications',
					type : 'select',
					_label : 'Select Applications',
					_labelssource : 'Application.name',
					_optionssource : 'Application.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'-Select Server Type-',
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
			_label : 'Server Databases',
			fields : [
				{
					name : 'databases',
					type : 'select',
					_label : 'Select Databases',
					_labelssource : 'Database.hostname,name',
					_optionssource : 'Database.id',
					multiple : true
				}, {
					name : 'server_type',
					type : 'select',
					_optionssource : [
						'-Select Server Type-',
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
	jApp.addView('servers',
		{ // grid definition
			model : 'Server',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-building-o',
				headerTitle : 'Manage Servers',
				helpText : "<strong>Note:</strong> Manage Servers Here"
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
					toggleProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Non-Production',
						fn : 'toggleNonProd',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Flag Selected Servers', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
						},
						label : 'Update Agent Software',
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer( { 'inactive_flag' : 1} );
						},
						label : 'As Inactive'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'inactive_flag' : 0})
						},
						label : 'As Not Inactive'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'production_flag' : 1})
						},
						label : 'As Production'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'production_flag' : 0})
						},
						label : 'As Not Production'
					}
				]
			},
			columns : [ 				// columns to query
				"id",
				"serverName",
				"owner_name",
				"os",
				"ip",
				"people",
				//"applications",
				//"databases",
				'tags',
				'status',
				"software_version"
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"OS",
				"IP",
				"Contacts",
				//"Apps",
				//"Databases",
				"Tags",
				"Status",
				"Agent"
			],
			templates : { 				// html template functions

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				applications : function(arr) {
					return _.get('name', arr, 'fa-cubes', 'Application');
				},

				databases : function(arr) {
					return _.get('name', arr, 'fa-database', 'Database');
				},

				os : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.operating_system, 'fa-windows','OperatingSystem');
				},

				ip : function( val ) {
					
					if ( ! val.length )
					{
						return '';
					}

					var ip = _.map( val.split('.'), function(part) { return ('   ' + part).slice(-3) }).join('.');
					
					return  `<div class="pull-right">${ip}</div>`;
				}

			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markServer			: function( atts ) {
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

					if (typeof temp.hideNonProd !== 'undefined' && !!temp.hideNonProd) {
						filter.push('production_flag = 1');
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

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleNonProd : function( ) {
					jApp.activeGrid.temp.hideNonProd = ( typeof jApp.activeGrid.temp.hideNonProd === 'undefined')
						? true : !jApp.activeGrid.temp.hideNonProd;
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
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-4',
					fields : fieldset_2__fields
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-5',
					fields : fieldset_3__fields
				},
		]
	)
})(jApp);
