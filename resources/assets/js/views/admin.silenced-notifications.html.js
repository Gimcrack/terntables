;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'expires_at',
			required : true,
			type : 'datetime-local',
			_label : 'When should the silenced notification expire?',
		},
	]

	/**
	 * Add the view
	 */
	jApp.addView('admin.silencedNotifications',
		{ // grid definition
			model : 'SilencedNotification',
			columnFriendly : 'id',
			refreshInterval : 62000,
			gridHeader : {
				icon : 'fa-bell-slash-o',
				headerTitle : 'Silenced Notifications',
				helpText : "<strong>Note:</strong> Notifications will not be sent for these items."
			},
			toggles : {
				new : false,
			},
			tableBtns : {
				custom : {
					
				},
			},
			rowBtns : {
				

			},
			fn : {				   
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
				"loggable",
				"expired_flag",
				"expires_at",
				"expires_at_for_humans",
			],
			headers : [ 				// headers for table
				"ID",
				"Source",
				"Expired?",
				"Expires",
				"Expires",
			],
			templates : { 				// html template functions

				expires_at : function(val) {
					return val.replace('T','  ');
				},		
						
				expired_flag : function(val) {
					return _.getFlag(val,'Yes','No','danger','success');
				},

				loggable : function(val) {
					var r = jApp.activeGrid.currentRow,
						server = ( r.server != null ) ? r.server.name + ':' : '';

					return _.nameButton( r.loggable_type.split('\\').slice(1).join(':') + ':' + server + r.loggable.name,  jApp.opts().gridHeader.icon );
				},

			},
		},
		[ 
			// colparams
			{ // fieldset
				label : 'Details',
				helpText : 'Please fill out the form',
				class : 'col-lg-5',
				fields : fieldset_1__fields
			},
		]
	)
})(jApp);
