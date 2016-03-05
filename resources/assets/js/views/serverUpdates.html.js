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
			filter : 'inactive_flag = 0',
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
				]
			},
			columns : [ 				// columns to query
				"id",
				"serverName",
				"owner_name",
				"os",
				"ip",
				"status",
				"pending_updates",
				"updated_at_for_humans"
				//'tags',
			],
			headers : [ 				// headers for table
				"ID",
				"Name",
				"Owner",
				"OS",
				"IP",
				"Status",
				"Pending Updates",
				"Updated"
			],
			templates : { 				// html template functions

				owner_name : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.owner, 'fa-users','Group');
				},

				pending_updates : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('title', r.updates);
				},

				os : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name', r.operating_system, 'fa-windows','OperatingSystem');
				},

				ip : function( val ) {
					return _.map( val.split('.'), function(part) { return ('000' + part).slice(-3) }).join('.');
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

				/**
				 * Update the grid filter with the current values
				 * @method function
				 * @return {[type]} [description]
				 */
				updateGridFilter : function() {
					var filter = [], temp = jApp.activeGrid.temp, scope = 'all';


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

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');
					jApp.activeGrid.dataGrid.requestOptions.data.scope = scope;

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
			}
		},
		[]
	)
})(jApp);
