;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('serverServices',
		{ // grid definition
			model : 'ServerService',
			refreshInterval : 17000,
			columnFriendly : 'name',
			filter : 'ignored_flag = 0',
			scope : 'automatic',
			gridHeader : {
				icon : 'fa-gears',
				headerTitle : 'Server Services',
				helpText : "<strong>Note:</strong> These values are auto-populated by the Server Agent. "
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
			},
			tableBtns : {
				custom : {
					toggleRunning : {
						type : 'button',
						class : 'btn btn-success btn-toggle active',
						icon : 'fa-toggle-on',
						label : 'Toggle Running',
						fn : 'toggleRunning',
						'data-order' : 100
					},
					toggleNonAuto : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Non-Auto',
						fn : 'toggleNonAuto',
						'data-order' : 101
					},
					toggleIgnored : {
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
				startService : {
					'data-multiple' : true,
					'data-permission' : 'update_enabled',
					type : 'button',
					fn : function(e) {
						e.preventDefault();
						bootbox.confirm('Are you sure you want to start the services on the selected servers?', function( response ) {
							if ( !!response ) {
								jApp.activeGrid.fn.markService( { 'command' : 'start' } );
							}
						});
					},
					label : 'Start Selected...',
					icon : 'fa-play',
					class : 'btn btn-primary',
				},
				markSelected : [
					{ label: 'Modify Selected Services', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							bootbox.confirm('Are you sure you want to ignore the services on the selected servers?', function( response ) {
								if ( !!response ) {
									jApp.activeGrid.fn.markService( { 'ignored_flag' : 1} );
								}
							});
						},
						label : 'Ignore Selected...'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markService( { 'ignored_flag' : 0} )
						},
						label : 'Don\'t Ignore Selected...'
					},
				]
			},
			fn : {

				toggleRunning : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideRunning = ( !!! temp.hideRunning );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				   
				toggleNonAuto : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideNonAuto = ( !!! temp.hideNonAuto );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn  
				    
				toggleIgnored : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.showIgnored = ( !!! temp.showIgnored );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markService			: function( atts ) {
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
					var filter = [], temp = jApp.activeGrid.temp, scope = 'automatic', data = jApp.activeGrid.dataGrid.requestOptions.data;

					if ( !! temp.hideNonAuto ) {
						scope = 'active';
					}

					if ( !! temp.hideRunning ) {
						scope = 'offline';
					}

					if ( ! temp.showIgnored ) {
						filter.push('ignored_flag = 0');
					}

					data.scope = scope;
					data.filter = filter.join(' AND ');

				}, // end fn  
			
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"server_name",
				"start_mode",
				"status",
				"command",
				"updated_at_for_humans",
			],
			headers : [ 				// headers for table
				"ID",
				"Service",
				"Server",
				"Start Mode",
				"Status",
				"Action",
				"Last Update"
			],
			templates : { 				// html template functions

				name : function(val) 
				{
					var r = jApp.activeGrid.currentRow;

					if ( !! r.ignored_flag )
					{
						return _.nameButton( val,  jApp.opts().gridHeader.icon) + _.getFlag(r.ignored_flag, 'Ignored', '', 'danger');
					}

					return _.nameButton( val,  jApp.opts().gridHeader.icon);

					
				},

				server_name : function()
				{
					var r = jApp.activeGrid.currentRow;
						server = r.server;

					if ( server == null )
					{
						return '';
					}

					return _.nameButton( server.name, 'fa-building-o') + _.getFlag(server.production_flag, 'Prod', 'Test', 'primary','success');
				},

				status : function( val )
				{
					switch( val.toLowerCase() )
					{
						case 'running' :
							return _.getFlag(1,'Running',null,'success');

						case 'starting' :
							return _.getFlag(1,'Starting',null,'warning');

						case 'stopped' :
							return _.getFlag(1,'Stopped',null,'danger');

						default :
							return _.getFlag(1,val,null,'info');
					}
				}
			},
		},
		[ ]
	)
})(jApp);
