;(function(jApp) {

	/**
	 * Add the view
	 */
	jApp.addView('serverDisks',
		{ // grid definition
			model : 'ServerDisk',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-files-o',
				headerTitle : 'Server Disks',
				helpText : "<strong>Note:</strong> These values are auto-populated by the Service Monitor. "
			},
			toggles : {
				new : false,
				edit : false,
				del : false,
			},
			tableBtns : {
				custom : {
					
				},
			},
			rowBtns : {

			},
			fn : {
							
				toggleUpToDate : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideUpToDate = ( !!! temp.hideUpToDate );
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
				
				toggleRunning : function( ) {
					var temp = jApp.activeGrid.temp;

					temp.hideRunning = ( !!! temp.hideRunning );
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

					if ( !! temp.hideRunning ) {
						filter.push( "status <> 'Running'" );
					}

					data.scope = scope;
					data.filter = filter.join(' AND ');

				}, // end fn  
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"server_name",
				"free_pct",
				"free_gb",
				"used_gb",
				"size_gb",
				"updated_at_for_humans"
			],
			headers : [ 				// headers for table
				"ID",
				"Disk",
				"Server",
				"Percent Free",
				"Free (GB)",
				"Used (GB)",
				"Total (GB)",
				"Last Checkin"
			],
			templates : { 				// html template functions

				name : function(val) 
				{
					var r = jApp.activeGrid.currentRow;

					return _.nameButton( val + ' [' + r.label + ']',  jApp.opts().gridHeader.icon);
				},

				free_pct : function()
				{
					var r = jApp.activeGrid.currentRow,
						free = (r.free_gb / r.size_gb),
						bg = '#80E02C';

					switch(true) {
						case (free < .005) : 	bg = '#FE2C2B'; break;
						case (free < .01 ) :	bg = '#EB472B'; break;
						case (free < .05 ) :	bg = '#D26A2B'; break;
						case (free < .1  ) :	bg = '#BC8A2C'; break;
						case (free < .2  ) :	bg = '#A6AA2C'; break;
						case (free < .3  ) :	bg = '#9EB52C'; break;
						case (free < .4  ) :	bg = '#98BF2C'; break;
						case (free < .5  ) :	bg = '#87D42C'; break;
					}

					return '<div data-free="' + free + '" style="padding: 3px; text-align:right; width:100%;height:100%;background:' + bg + '">' + Math.round( 10000 * free ) / 100 + '</div>';
				},

				used_gb : function(val) 
				{
					return '<div class="pull-right">' + val*1 + '</div>';
				},

				free_gb : function(val) 
				{
					return '<div class="pull-right">' + val*1 + '</div>';
				},

				size_gb : function(val) 
				{
					return '<div class="pull-right">' + val*1 + '</div>';
				},

				server_name : function()
				{
					var r = jApp.activeGrid.currentRow,
						server = r.server;

					if ( server == null )
					{
						return '';
					}

					return _.nameButton( server.name, 'fa-building-o') + _.getFlag(server.production_flag, 'Prod', 'Test', 'primary','success');
				}
			},
		},
		[ ]
	)
})(jApp);
