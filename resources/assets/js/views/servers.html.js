// extend the application views
$.extend( true, jApp.views, {

	servers : function() {

		$.extend( true, jApp.oG, {

			servers : new jGrid({
				table : 'servers',
				model : 'Server',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-server',
					headerTitle : 'Manage Servers',
					helpText : "<strong>Note:</strong> Manage Servers Here"
				},
				tableBtns : {
					custom : {
						toggleInactive : {
	            type : 'button',
	            class : 'btn btn-success active btn-toggle',
	            icon : 'fa-toggle-on',
	            label : 'Toggle Inactive',
							fn : 'toggleInactive',
							'data-order' : 100
	          },
						toggleNonProd: {
	            type : 'button',
	            class : 'btn btn-success active btn-toggle',
	            icon : 'fa-toggle-on',
	            label : 'Toggle Non-Production',
							fn : 'toggleNonProd',
							'data-order' : 101
	          },
					},
				},
				rowBtns : {
					markSelected : [
						{ label: 'Flag Selected Servers', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markServer( { 'inactive_flag' : 1} );
							},
							label : 'As Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'inactive_flag' : 0})
							},
							label : 'As Not Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'production_flag' : 1})
							},
							label : 'As Production'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'production_flag' : 0})
							},
							label : 'As Not Production'
						}
					]
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"ip",
					"people",
					"applications",
					'tags',
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Hostname (CNAME)",
					"Description",
					"IP Address",
					"Contacts",
					"Applications",
					"Tags"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						return ('0000' + value).slice(-4);
					},

					"production_flag" : function(value) {
						return ( +value == 1 ) ?
							'<span style="margin:3px;" class="label label-primary">Production</span>' :
							'<span style="margin:3px;" class="label label-success">Test/Dev</span>';
					},

					"name" : function(value) {
						var r = jApp.aG().currentRow, flags = [], cname = '';

						if (r.cname != null && r.cname.trim() != '') {
							cname = ' (' + r.cname + ')';
						}

						if ( +r.inactive_flag == 1 ) {
							flags.push('<div class="label label-danger label-sm" style="margin-right:3px">Inactive</div>');
						}

						if ( +r.production_flag == 1 ) {
							flags.push('<div class="label label-primary label-sm" style="margin-right:3px">Prod</div>');
						}

						return flags.join(' ') + value.toUpperCase().link( window.location.href.trim('/') + '/' + r.id ) + cname;
					},

					"tags" : function() {
						var r = jApp.aG().currentRow;
						return _.pluck( r.tags, 'name').map( function(val) {
							return '<span style="margin:3px;" class="label label-default">' + val + '</span>';
						}).join('');
					},

					"applications" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"people" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"created_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					},

					"updated_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					}

				},
				fn : {
					/**
					 * Mark selected servers as inactive
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
						var filter = [], temp = jApp.activeGrid.temp;

						if (typeof temp.hideInactive !== 'undefined' && !!temp.hideInactive) {
							filter.push('inactive_flag = 0');
						}

						if (typeof temp.hideNonProd !== 'undefined' && !!temp.hideNonProd) {
							filter.push('production_flag = 1');
						}

						jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

					}, // end fn

					/**
					 * Toggle inactive server visibility
					 * @method function
					 * @return {[type]} [description]
					 */
					toggleInactive : function( ) {
						jApp.activeGrid.temp.hideInactive = ( typeof jApp.activeGrid.temp.hideInactive === 'undefined')
							? true : !jApp.activeGrid.temp.hideInactive;
						jApp.activeGrid.fn.updateGridFilter();
						jUtility.executeGridDataRequest();
						$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					}, //end fn

					/**
					 * Toggle non-production server visibility
					 * @method function
					 * @return {[type]} [description]
					 */
					toggleNonProd : function( ) {
						jApp.activeGrid.temp.hideNonProd = ( typeof jApp.activeGrid.temp.hideNonProd === 'undefined')
							? true : !jApp.activeGrid.temp.hideNonProd;
						jApp.activeGrid.fn.updateGridFilter();
						jUtility.executeGridDataRequest();
						$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					}, //end fn
				}
			})
		})
	}
});
