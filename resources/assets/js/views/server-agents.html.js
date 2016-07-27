/**
 * servers.html.js
 *
 * servers view definition
 */
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
				
				toggleUpToDate : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideUpToDate = ( !!! temp.hideUpToDate );
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

					data.scope = scope;

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
					var r = jApp.activeGrid.currentRow;

					return _.nameButton( r.server.name,  jApp.opts().gridHeader.icon ) + _.getFlag(r.server.production_flag, 'Prod', 'Test', 'primary','success');
				},

				server_status : function(val) {
					var r = jApp.activeGrid.currentRow;

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
