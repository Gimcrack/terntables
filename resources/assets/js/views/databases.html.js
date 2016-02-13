/**
 * databases.html.js
 *
 * databases view definition
 */

;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'e.g. LogosDB',
			required : true,
			_label : 'Enter the Database name',
			'data-validType' : 'Anything'
		},
		{
			name : 'server_id',
			type : 'select',
			_label : 'Select the Primary Database Host Server',
			required : true,
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : 'Server.name',
			_optionssource : 'Server.id'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'ha_strategy',
			type : 'textarea',
			_label : 'High Availability Strategy',
		},
		{
			name : 'dr_strategy',
			type : 'textarea',
			_label : 'Disaster Recovery Strategy',
		},
		{
			name : 'upgrade_readiness',
			type : 'textarea',
			_label : 'SQL Server Upgrade Readiness',
		},
	],

	fieldset_2__fields = [
		{
			name : 'rpo',
			type : 'select',
			_label : 'Recovery Point Objective',
			_optionssource : [
				'-Unspecified-',
				'15 Min',
				'1 Hour',
				'1 Day',
				'1 Week'
			]
		},
		{
			name : 'rto',
			type : 'select',
			_label : 'Recovery Time Objective',
			_optionssource : [
				'-Unspecified-',
				'15 Min',
				'1 Hour',
				'1 Day',
				'1 Week'
			]
		},
		{
			name : 'production_flag',
			type : 'select',
			_label : 'Is this database in production ( say yes for prod reporting databases)?',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'inactive_flag',
			type : 'select',
			_label : 'Is this database inactive?',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'ignore_flag',
			type : 'select',
			_label : 'Ignore this database?',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
	],

	fieldset_3__fields = [
		{
			name : 'servers',
			type : 'array',
			_label : 'All Database Servers (Include the Primary Host Server)',
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
						'Primary Host Server',
						'Secondary Host Server',
						'Primary DR Server',
						'Secondary DR Server',
						'Reporting Server',
						'Other'
					],
					'data-no-bsms' : true
				}
			]
		},
		{
			name : 'people',
			type : 'array',
			_label : 'Database Contacts',
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
			_label : 'Database Applications',
			fields : [
				{
					name : 'applications',
					type : 'select',
					_label : 'Select Applications',
					_labelssource : 'Application.name',
					_optionssource : 'Application.id',
					multiple : true
				}, {
					name : 'database_type',
					type : 'select',
					_optionssource : [
						'Production Database',
						'Test Database',
						'Development Database',
						'Reporting Database',
						'DR Database'
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
		 * @method addView
		 * @param  {[type]} 'databases' [description]
		 * @param  {[type]} jGridDef    [description]
		 * @param  {[type]} [           					{        						label                  :             'Details' [description]
		 * @param  {[type]} helpText    :             'Please                      fill          out       the           form' [description]
		 * @param  {[type]} class       :             'col-lg-5'                   [description]
		 * @param  {[type]} fields      :             fieldset_1__fields					}     [description]
		 * @param  {[type]} {           						label   :                            '             '         [description]
		 * @param  {[type]} class       :             'col-lg-5'                   [description]
		 * @param  {[type]} fields      :             fieldset_2__fields					}			] [description]
		 */
		jApp.addView('databases',
		{
				model : 'Database',
				columnFriendly : 'name',
				filter : 'ignore_flag = 0',
				gridHeader : {
					icon : 'fa-database',
					headerTitle : 'Manage Databases',
					helpText : "<strong>Note:</strong> Manage Databases Here"
				},
				toggles : {
					ellipses : false
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
						toggleNonProd: {
							type : 'button',
							class : 'btn btn-success active btn-toggle',
							icon : 'fa-toggle-on',
							label : 'Toggle Non-Production',
							fn : 'toggleNonProd',
							'data-order' : 101
						},
						toggleIgnored: {
							type : 'button',
							class : 'btn btn-success btn-toggle',
							icon : 'fa-toggle-off',
							label : 'Toggle Ignored',
							fn : 'toggleIgnored',
							'data-order' : 102
						},
					},
				},
				rowBtns : {
					custom : {
						markSelected : [
							{ label: 'Flag Selected Databases', class: 'btn btn-primary', icon : 'fa-check-square-o' },
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
										e.preventDefault();
										jApp.activeGrid.fn.markDatabase( { 'inactive_flag' : 1} );
								},
								label : 'As Inactive'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'inactive_flag' : 0})
								},
								label : 'As Not Inactive'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'production_flag' : 1})
								},
								label : 'As Production'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'production_flag' : 0})
								},
								label : 'As Not Production'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'ignore_flag' : 1})
								},
								label : 'As Ignored'
							},
							{
								'data-multiple' : true,
								'data-permission' : 'update_enabled',
								type : 'button',
								fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markDatabase({ 'ignore_flag' : 0})
								},
								label : 'As Not Ignored'
							}
						]
					}
				},
				columns : [ 				// columns to query
					"id",
					"databaseName",
					"host_name",
					"description",
					"people",
					"applications",
					"servers",
					'tags',
				],
				headers : [ 				// headers for table
					"ID",
					"Database",
					"Host",
					"Description",
					"Contacts",
					"Applications",
					"Servers",
					"Tags"
				],
				templates : { 				// html template functions

					host_name : function(value) {
						return _.get('host.name','fa-server');
					},

					rpo : function(value) {
						var r = jApp.aG().currentRow,
							rpo = ( r.rpo != null ) ? r.rpo : '-',
							rto = ( r.rto != null ) ? r.rto : '-';

						return rpo + ' / ' + rto;
					},

					production_flag : function(value) {
						_.getFlag(value,'Production','Test','danger','success');
					},

					applications : function(arr) {
						return _.get('name', arr, 'fa-windows', 'Application' );
					},

					servers : function(arr) {
						return _.get('name', arr, 'fa-server', 'Server' );
					},

				},
				fn : {
					/**
					 * Mark selected databases
					 * @method function
					 * @return {[type]} [description]
					 */
					markDatabase			: function( atts ) {
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

						if (typeof temp.showIgnored === 'undefined' || !temp.showIgnored) {
							filter.push('ignore_flag = 0');
						}

						jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

					}, // end fn

					/**
					 * Toggle inactive visibility
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
					 * Toggle non-production visibility
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

					/**
					 * Toggle ignored visibility
					 * @method function
					 * @return {[type]} [description]
					 */
					toggleIgnored : function( ) {
						jApp.activeGrid.temp.showIgnored = ( typeof jApp.activeGrid.temp.showIgnored === 'undefined')
							? true : !jApp.activeGrid.temp.showIgnored;
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
			]);

})(jApp);
