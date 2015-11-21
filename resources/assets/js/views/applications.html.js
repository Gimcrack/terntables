// extend the application views
$.extend( true, jApp.views, {

	applications : function() {

		$.extend( true, jApp.oG, {

			applications : new jGrid({
				table : 'applications',
				model : 'Application',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-windows',
					headerTitle : 'Manage Applications',
					helpText : "<strong>Note:</strong> Manage Applications Here"
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
					},
				},
				rowBtns : {
					markSelected : [
						{ label: 'Flag Selected Applications', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markApplication( { 'inactive_flag' : 1} );
							},
							label : 'As Inactive'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markApplication({ 'inactive_flag' : 0})
							},
							label : 'As Not Inactive'
						},
					]
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"people",
					"servers",
					'tags',
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Contacts",
					"Servers",
					"Tags"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						return ('0000' + value).slice(-4);
					},

					"name" : function(value) {
						var r = jApp.aG().currentRow, flags = [];

						if ( +r.inactive_flag == 1 ) {
							flags.push('<div class="label label-danger label-sm" style="margin-right:3px">Inactive</div>');
						}

						return flags.join(' ') + value.toUpperCase().link( window.location.href.trim('/') + '/' + r.id );
					},

					"tags" : function() {
						var r = jApp.aG().currentRow;
						return _.pluck( r.tags, 'name').map( function(val) {
							return '<span style="margin:3px;" class="label label-default">' + val + '</span>';
						}).join('');
					},

					"people" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"servers" : function(arr) {
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
					 * Mark selected applications as inactive/active
					 * @method function
					 * @return {[type]} [description]
					 */
					markApplication			: function( atts ) {
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
				}
			})
		})
	}
});
