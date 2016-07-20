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
				helpText : "<strong>Note:</strong> Manage Sql Servers Here"
			},
			toggles : {
				new : false,
				edit : false,
				delete : false,
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
				"Updated"
			],
			templates : { 				// html template functions

				name : function(val) {
					var r = jApp.activeGrid.currentRow;

					return _.nameButton( r.server.name + '\\' + val,  jApp.opts().gridHeader.icon );
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

				memory : function() {
					var r = jApp.activeGrid.currentRow;
					return r.min_memory + '-' + r.max_memory + ' (' + r.total_memory + ')';
				}

			},
		},
		[ ]
	)
})(jApp);
