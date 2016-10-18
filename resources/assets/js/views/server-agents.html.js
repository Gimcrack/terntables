;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('admin.serverAgents',
	{ // grid definition
		model : 'ServerAgent',
		columnFriendly : 'version',
		refreshInterval : 17000,
		gridHeader : {
			icon : 'fa-gears',
			headerTitle : 'Server Agents',
			helpText : "<strong>Note:</strong> These values are auto-populated by the Service Monitor. "
		},
		toggles : {
			new : false,
			edit : false,
			del : false,
			ellipses : false,
		},
		tableBtns : {
			custom : {
				toggleUpToDate : {
					type : 'button',
					class : 'btn btn-success btn-toggle active',
					icon : 'fa-toggle-on',
					label : 'Toggle Up To Date',
					fn : 'toggleUpToDate',
					'data-order' : 99
				},
				toggleRunning : {
					type : 'button',
					class : 'btn btn-success btn-toggle active',
					icon : 'fa-toggle-on',
					label : 'Toggle Running',
					fn : 'toggleRunning',
					'data-order' : 100
				},
			},
		},
		rowBtns : {
			updateSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-gears',
				label : 'Update Agent Software...',
				fn : function(e) {
					e.preventDefault();
					bootbox.confirm('Are you sure you want to update the agent on the selected servers?', function( response ) {
						if ( !!response ) {
							jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
						}
					});
				},
				'data-order' : 100
			},
			updateSql : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-gears',
				label : 'Update Sql Server Info...',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Refresh SQL Server'});
				},
				'data-order' : 100
			},
			runSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-play',
				label : 'Start Agent Service',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Start Agent'});
				},
				'data-order' : 100
			},
			stopSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-stop',
				label : 'Stop Agent Service',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Stop Agent'});
				},
				'data-order' : 100
			},
			restartSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-refresh',
				label : 'Restart Agent Service...',
				fn : function(e) {
					e.preventDefault();
					bootbox.confirm('Are you sure you want to restart the agent on the selected servers?', function( response ) {
						if ( !!response ) {
							jApp.activeGrid.fn.markServer({ 'status' : 'Restart Agent'});
						}
					});
				},
				'data-order' : 100
			},
			refreshServices : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-gears',
				label : 'Refresh Services',
				fn : function(e) {
					e.preventDefault();
					jApp.activeGrid.fn.markServer({ 'status' : 'Refresh Services'});
				},
				'data-order' : 100
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
			
			toggleUpToDate : function( ) {
				var temp = jApp.activeGrid.temp;

				temp.hideUpToDate = ( !!! temp.hideUpToDate );
				jApp.activeGrid.fn.updateGridFilter();
				jUtility.executeGridDataRequest();
				$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
			}, //end fn
			
			toggleRunning : function( ) {
				var temp = jApp.activeGrid.temp;

				temp.hideRunning = ( !!! temp.hideRunning );
				jApp.activeGrid.fn.updateGridFilter();
				jUtility.executeGridDataRequest();
				$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
			}, //end fn
			   
			/**
			 * Update the grid filter with the current values
			 * @method function
			 * @return {[type]} [description]
			 */
			updateGridFilter : function() {
				var filter = [], temp = jApp.activeGrid.temp, scope = 'all', data = jApp.activeGrid.dataGrid.requestOptions.data;

				if ( !! temp.hideUpToDate ) {
					scope = 'outdated';
				}

				if ( !! temp.hideRunning ) {
					filter.push( "status <> 'Running'" );
				}

				data.scope = scope;
				data.filter = filter.join(' AND ');

			}, // end fn  
		},
		columns : [ 				// columns to query
			"id",
			"server_name",
			"server_status",
			"version",
			"status",
		],
		headers : [ 				// headers for table
			"ID",
			"Agent",
			"Server Status",
			"Version",
			"Status",
		],
		templates : { 				// html template functions

			server_name : function(val) {
				var r = jApp.activeGrid.currentRow,
					server = r.server;

				if ( r.server_id == null || r.server_id < 1 )
				{
					return "";
				}

				return _.nameButton( r.server.name,  jApp.opts().gridHeader.icon ) + _.getFlag(r.server.production_flag, 'Prod', 'Test', 'primary','success');
			},

			server_status : function(val) {
				var r = jApp.activeGrid.currentRow;

				if ( r.server_id == null || r.server_id < 1 )
				{
					return "";
				}

				return r.server.status + ' <em>' + r.server.updated_at_for_humans + '</em>';
			},

			status : function(val) {
				var r = jApp.activeGrid.currentRow,
					status = ( val == 'Running' ) ? 1 : 0;

				return _.getFlag(status, 'Running', 'Stopped', 'success', 'danger' ) + ' <em>' + r.updated_at_for_humans + '</em>';
			},

		},
	},
		[ ]
	)
})(jApp);
