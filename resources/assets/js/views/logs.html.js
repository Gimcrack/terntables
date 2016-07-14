/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('logs',
	{	
		model : 'LogEntry',
		columnFriendly : 'reported_at',
		toggles : {
			new : false,
			edit : false,
			del : false,
		},
		gridHeader : {
			icon : 'fa-list-alt',
			headerTitle : 'Logs',
			helpText : "Most recent shown first"
		},
		refreshInterval : 22000,
		
		columns : [ 				// columns to query
			"id",
			"level_name",
			"channel",
			"loggable_type",
			"message",
			"updated_at_for_humans",

		],
		headers : [ 				// headers for table
			"ID",
			"Level",
			"Channel",
			"Source",
			"Message",
			"Date Reported",
		],

		templates : {

			loggable_type : function(val) {
				var r = jApp.activeGrid.currentRow;

				return val.split('\\').slice(1).join(':') + ':' + r.loggable.name;
			},

			id : function(val) {
				return val;
			}
		},
	},
		[]
	);

})(jApp)
