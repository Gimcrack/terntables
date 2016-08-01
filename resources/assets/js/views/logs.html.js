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

		tableBtns : {
			custom : {
				toggleUnimportant : {
					type : 'button',
					class : 'btn btn-success active btn-toggle btn-toggleUnimportant',
					icon : 'fa-toggle-on',
					label : 'Toggle Low-Importance Entries',
					fn : 'toggleUnimportant',
					'data-order' : 100
				}
			}
		},

		rowBtns : {
			updateSelected : {
				'data-multiple' : true,
				'data-permission' : 'update_enabled',
				class: 'btn btn-primary',
				type : 'button',
				icon : 'fa-bell-slash-o',
				label : 'Silence Notifications...',
				fn : function(e) {
					e.preventDefault();
					bootbox.prompt('How many hours should the selected entries be silenced for?', function( response ) {
						if ( ! isNaN(response) ) {
							jApp.activeGrid.fn.silenceNotifications({ 'hours' : response });
						} else {
							bootbox.alert('Please enter a numeric value for hours.');
						}
					});
				},
				'data-order' : 100
			}
		},

		fn : {
			toggleUnimportant : function() {
				var temp = jApp.activeGrid.temp, 
					data = jApp.activeGrid.dataGrid.requestOptions.data;

				temp.hideUnimportant = ( !!! temp.hideUnimportant );

				data.scope = ( temp.hideUnimportant ) ? 'important' : 'all';

				jUtility.executeGridDataRequest();

				$(this).toggleClass('active')
					.find('i').toggleClass('fa-toggle-on fa-toggle-off');
			},

			silenceNotifications : function( data ) {
				jApp.aG().action = 'withSelectedUpdate';
				jUtility.withSelected('custom', function(ids) {
					jUtility.postJSON( {
						url : jUtility.getCurrentFormAction(),
						success : jUtility.callback.submitCurrentForm,
						data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, data )
					});
				});
			},
		},
		
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

			level_name : function(val) {
				var r = jApp.activeGrid.currentRow;

				return r.level + " " + val;
			},

			id : function(val) {
				return val;
			}
		},
	},
		[]
	);

})(jApp)
