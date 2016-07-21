/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {
	/**
	 * Add the view
	 */
	jApp.addView('updates',
		{ // grid definition
			model : 'WindowsUpdateServer',
			columnFriendly : 'name',
			filter : 'inactive_flag = 0 and :show__only__my__groups:',
			gridHeader : {
				icon : 'fa-building-o',
				headerTitle : 'Install Windows Updates',
				helpText : "<strong>Note:</strong> Only approved updates will be installed. <a href='approveUpdates'>Approve Updates</a>"
			},
			toggles : {
				new : false,
				edit : false,
				del : false
			},
			refreshInterval : 17000,
			tableBtns : {
				custom : {
					showOnlyMyGroups : {
						type : 'button',
						class : 'btn btn-success active btn-toggle btn-showOnlyMyGroups',
						icon : 'fa-toggle-on',
						label : 'Show Only My Groups\' Servers',
						fn : 'showOnlyMyGroups',
						'data-order' : 98
					},
					toggleUnupdatable : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Servers With No Updates',
						fn : 'toggleUnupdatable',
						'data-order' : 99
					},
					toggleProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Production',
						fn : 'toggleProduction',
						'data-order' : 101
					},
					toggleNonProduction : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Non-Production',
						fn : 'toggleNonProduction',
						'data-order' : 102
					},

				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Set Selected Server Status...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
						},
						label : 'Update Agent Software'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Start Agent'})
						},
						label : 'Start Agent Service'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Look For Updates'})
						},
						label : 'As Look For Updates'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								bootbox.confirm('Are you sure you want to begin installing updates on these servers?', function(response) {
				          if (!!response) {
				            jApp.activeGrid.fn.markServer( { 'status' : 'Ready For Updates'} );
				          }
				        });

						},
						label : 'As Ready For Updates'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer({ 'status' : 'Idle'})
						},
						label : 'As Not Ready For Updates'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							bootbox.confirm('Are you sure you want reboot these servers?', function(response) {
								if (!!response) {
									jApp.activeGrid.fn.markServer( { 'status' : 'Ready For Reboot'} );
								}
							});
						},
						label : 'As Ready For Reboot'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markServer( { 'status' : 'Abort Reboot'} );
						},
						label : 'As Cancel Reboot',
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"serverName",
				"owner_name",
				"os",
				"ip",
				"status",
				"approved_updates",
				"new_updates",
				"software_version",
				"agent_status",
				"updated_at_for_humans"
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"OS",
				"IP",
				"Status",
				"Approved Updates",
				"New Updates",
				"Agent Version",
				"Agent Status",
				"Updated"
			],
			templates : { 				// html template functions

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				os : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.operating_system, 'fa-windows','OperatingSystem');
				},

				ip : function( val ) {
					return _.map( val.split('.'), function(part) { return ('000' + part).slice(-3) }).join('.');
				},

				agent_status : function(val) {
					if ( val == null ) return "";

					status = ( val == 'Running' ) ? 1 : 0;

					return _.getFlag(status, 'Running', 'Stopped', 'success', 'danger' );
				},

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
					var filter = [], temp = jApp.activeGrid.temp, scope = 'all', data = jApp.activeGrid.dataGrid.requestOptions.data;


					filter.push('inactive_flag = 0');


					switch( true ) {
						case ( ! temp.hideProduction && ! temp.hideNonProduction ) :
							scope = 'all';
						break;

						case ( ! temp.hideProduction && !! temp.hideNonProduction ) :
							scope = 'production';
						break;

						case ( !! temp.hideProduction && ! temp.hideNonProduction ) :
							scope = 'nonproduction';
						break;

						case ( !! temp.hideProduction && !! temp.hideNonProduction ) :
							scope = 'none';
						break;
					}

					if ( typeof temp.showOnlyMyGroups === 'undefined' || !! temp.showOnlyMyGroups )
					{
						filter.push(':show__only__my__groups:');
					}

					data.filter = filter.join(' AND ');
					data.scope = scope;
					data.showUnupdatable = ( !! temp.showUnupdatable ) ? 1 : 0;

				}, // end fn

				toggleProduction : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideProduction = ( !!! temp.hideProduction );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleNonProduction : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideNonProduction = ( !!! temp.hideNonProduction );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleUnupdatable : function( ) {
					var temp = jApp.activeGrid.temp;
					temp.showUnupdatable = ( !!! temp.showUnupdatable );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				/**
				 * Show only my groups' tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMyGroups : function( ) {
					var temp = jApp.activeGrid.temp;

					if ( typeof temp.showOnlyMyGroups === 'undefined' )
					{
						temp.showOnlyMyGroups = true;
					}

					temp.showOnlyMyGroups = ( !!! temp.showOnlyMyGroups );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[]
	)
})(jApp);
