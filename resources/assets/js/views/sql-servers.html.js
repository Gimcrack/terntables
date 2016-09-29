/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('databaseInstances',
		{ // grid definition
			model : 'DatabaseInstance',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-database',
				headerTitle : 'Manage Sql Servers',
				helpText : "<strong>Note:</strong> These values are auto-populated by the agent. "
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
			},
			rowBtns : {
				updateSelected : {
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
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"server_name",
				"owner_name",
				"sql_product",
				"sql_edition",
				"sql_version",
				"memory",
				"processors",
				"server_status",
				"updated_at_for_humans"
			],
			headers : [ 				// headers for table
				"ID",
				"Instance Name",
				"Server",
				"Owner",
				"Sql Product",
				"Edition",
				"Version",
				"Sql Ram Min-Max (OS Total)",
				"Logical CPUs",
				"Server Status",
				"Updated"
			],
			templates : { 				// html template functions

				name : function(val) {
					var r = jApp.activeGrid.currentRow;

					return _.nameButton( r.server.name + '\\' + val,  jApp.opts().gridHeader.icon ) + _.getFlag(r.server.production_flag, 'Prod', 'Test', 'primary','success');
				},

				sql_product : function(val) {
					return val.replace('Microsoft ','');
				},

				sql_edition : function(val) {
					return val.replace(' Edition','');
				},

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				server_name : function( val ) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.server, 'fa-building-o', 'Server');
				},

				server_status : function() {
					var r = jApp.activeGrid.currentRow;
					return r.server.status;
				},

				memory : function() {
					var r = jApp.activeGrid.currentRow,
						os_min = 1024,
						bg = '#80E02C';

					if ( r.total_memory > 4096 && r.total_memory < 16384 ) os_min = 2048;
					if ( r.total_memory >= 16384 ) os_min = 4096;

					if ( ( r.total_memory - r.max_memory ) <= os_min ) bg = '#f0ad4e';
					if ( r.total_memory <= r.max_memory ) bg = '#d9534f';
					
					return '<div style="padding: 0 6px; width:100%;height:100%;background:' + bg + '">' + 
						r.min_memory + '-' + r.max_memory + ' (' + r.total_memory + ')</div>';
				}

			},
		},
		[ ]
	)
})(jApp);
