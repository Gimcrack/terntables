/**
 * maintenanceWindows.html.js
 *
 * applications view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'start_at',
			placeholder : 'YYYY-MM-DD HH:ii:ss',
			required : true,
			_label : 'When to start maintenance',
			'data-validType' : 'Anything'
		},
		{
			name : 'end_at',
			placeholder : 'YYYY-MM-DD HH:ii:ss',
			required : true,
			_label : 'When to end maintenance',
			'data-validType' : 'Anything'
		},
		{
			name : 'group_id',
			_label : 'What group\'s servers to target',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'server_scope',
			_label : 'What servers to target',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : [
				'test',
				'prod',
				'both',
			],
		},
		
	], fieldset_2__fields = [
		{
			name : 'approve_flag',
			_label : 'Approve Updates?',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : [ 'Yes','No' ],
			_optionssource : [ 1,0 ],
		},
		{
			name : 'install_flag',
			_label : 'Install Updates?',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : [ 'Yes','No' ],
			_optionssource : [ 1,0 ],
		},
		{
			name : 'reboot_flag',
			_label : 'Reboot Servers?',
			type : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_labelssource : [ 'Yes','No' ],
			_optionssource : [ 1,0 ],
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('maintenanceWindows',
		{ // grid definition
			model : 'MaintenanceWindow',
			columnFriendly : 'start_at',
			scope : 'active',
			gridHeader : {
				icon : 'fa-windows',
				headerTitle : 'Manage Maintenance Windows',
				helpText : "<strong>Note:</strong> Manage Maintenance Windows Here"
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
					toggleExpired : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle',
						label : 'Toggle Expired',
						fn : 'toggleExpired',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				custom : {
					markSelected : [
						{ label: 'Flag Selected Maintenance Windows', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markMaintenanceWindow( { 'inactive_flag' : 1 } );
							},
							label : 'As Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markMaintenanceWindow({ 'inactive_flag' : 0 })
							},
							label : 'As Not Inactive'
						},
					]
				},
			},
			columns : [ 				// columns to query
				"id",
				"start_at",
				"end_at",
				"group",
				"server_scope",
				"approve_flag",
				"install_flag",
				"reboot_flag",
				"inactive_flag",
			],
			headers : [ 				// headers for table
				"ID",
				"Start",
				"End",
				"Group",
				"Scope",
				"Approve",
				"Install",
				"Reboot",
				"Active",
			],
			templates : { 				// html template functions

				name : function( value ) {
					var r = jApp.activeGrid.currentRow, status, className, label = '';

					if ( !! +r.inactive_flag ) {
						label = '<div class="label-sm label label-warning">Inactive</div> ';
					}

					return label + _.nameButton( value, 'fa-cubes' );
				},

				group : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.group || '', 'fa-users','Group');
				},

				approve_flag : function(val) {
					return _.getFlag(val);
				},

				install_flag : function(val) {
					return _.getFlag(val);
				},

				reboot_flag : function(val) {
					return _.getFlag(val);
				},

				inactive_flag : function(val) {
					return _.getFlag( !!! val);
				},
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markMaintenanceWindow			: function( atts ) {
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
					var scope, temp = jApp.activeGrid.temp;

					if (typeof temp.hideInactive == 'undefined' || !!temp.hideInactive) {
						scope = 'active';
					}

					if (typeof temp.showExpired !== 'undefined' && !!temp.showExpired ) {
						scope = 'all';
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
				toggleExpired : function( ) {
					jApp.activeGrid.temp.showExpired = ( typeof jApp.activeGrid.temp.showExpired === 'undefined')
						? true : !jApp.activeGrid.temp.showExpired;
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
					label : 'Actions to perform',
					class : 'col-lg-5',
					fields : fieldset_2__fields
				}
		]
	)
})(jApp);
