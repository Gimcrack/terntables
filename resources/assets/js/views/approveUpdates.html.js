/**
 * servers.html.js
 *
 * servers view definition
 */
;(function(jApp) {
	/**
	 * Add the view
	 */
	jApp.addView('approveUpdates',
		{ // grid definition
			model : 'UpdateDetail',
			filter : 'installed_flag = 0 and hidden_flag = 0',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-windows',
				headerTitle : 'Approve Pending Windows Updates',
				helpText : "<strong>Note:</strong> You may approve or hide updates here. Updates will not be installed until the server status is set to Ready For Updates. <a href='/oit/updates'>Install Updates</a>"
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
				ellipses : false
			},
			refreshInterval : 62000,
			tableBtns : {
				custom : {
					toggleApproved : {
						type : 'button',
						class : 'btn btn-success active btn-toggle',
						icon : 'fa-toggle-on',
						label : 'Toggle Approved',
						fn : 'toggleApproved',
						'data-order' : 100
					},
					toggleInstalled : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Installed',
						fn : 'toggleInstalled',
						'data-order' : 101
					},
					toggleHidden : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Hidden',
						fn : 'toggleHidden',
						'data-order' : 101
					},
					// toggleProduction : {
					// 	type : 'button',
					// 	class : 'btn btn-success active btn-toggle',
					// 	icon : 'fa-toggle-on',
					// 	label : 'Toggle Non-Production',
					// 	fn : 'toggleNonProd',
					// 	'data-order' : 100
					// },
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Mark Selected Updates', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markUpdate( { 'approved_flag' : 1 } );
						},
						label : 'As Approved'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markUpdate({ 'approved_flag' : 0 })
						},
						label : 'As Not Approved'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markUpdate({ 'hidden_flag' : 1 })
						},
						label : 'As Hidden'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markUpdate({ 'hidden_flag' : 0 })
						},
						label : 'As Not Hidden'
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"hostname",
				"title",
				"kb_article",
				"status",
				"updated_at_for_humans"
				// "approved_flag",
				// "installed_flag",
				// "downloaded_flag",
				// "hidden_flag",
			],
			headers : [ 				// headers for table
				"ID",
				"Server",
				"Title",
				"KB Article",
				"Status",
				"Last Modified"
				// "Approved?",
				// "Installed?",
				// "Downloaded?",
				// "Hidden?",
			],
			templates : { 				// html template functions

				status : function() {
					var r = jApp.activeGrid.currentRow,
							ret = '';

					ret += _.getFlag(r.hidden_flag,'Hidden','Not Hidden','danger','success');
					ret += _.getFlag(r.downloaded_flag,'Downloaded','Not Downloaded');
					ret += _.getFlag(r.approved_flag,'Approved','Not Approved');
					ret += _.getFlag(r.installed_flag,'Installed', 'Not Installed');

					return ret;
				},

				kb_article : function(val) {
					var url = 'https://support.microsoft.com/en-us/kb/' + val.replace('KB','');

					return _.link( '<a target="_blank" href="' + url + '">' + val + '</a>', null, true );
				},

				approved_flag : function(val) {
					return _.getFlag(val);
				},

				installed_flag : function(val) {
					return _.getFlag(val);
				},

				downloaded_flag : function(val) {
					return _.getFlag(val);
				},

				hidden_flag : function(val) {
					return _.getFlag(val);
				},

			},

			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markUpdate			: function( atts ) {
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
					var filter = [], temp = jApp.activeGrid.temp;

					if (typeof temp.hideApproved !== 'undefined' && !!temp.hideApproved) {
						filter.push('approved_flag = 0');
					}

					if (typeof temp.hideHidden === 'undefined' || !!temp.hideHidden) {
						filter.push('hidden_flag = 0');
					}

					if (typeof temp.hideInstalled === 'undefined' || !!temp.hideInstalled) {
						filter.push('installed_flag = 0');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				toggleApproved : function( ) {
					jApp.activeGrid.temp.hideApproved = ( typeof jApp.activeGrid.temp.hideApproved === 'undefined')
						? true : !jApp.activeGrid.temp.hideApproved;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleHidden : function( ) {
					jApp.activeGrid.temp.hideHidden = ( typeof jApp.activeGrid.temp.hideHidden === 'undefined')
						? false : !jApp.activeGrid.temp.hideHidden;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn

				toggleInstalled : function( ) {
					jApp.activeGrid.temp.hideInstalled = ( typeof jApp.activeGrid.temp.hideInstalled === 'undefined')
						? false : !jApp.activeGrid.temp.hideInstalled;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		}
	)
})(jApp);
