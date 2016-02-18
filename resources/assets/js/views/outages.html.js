/**
 * outages.html.js
 *
 * outages view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'outage_date',
			required : true,
			_label : 'Enter the date of the Outage.',
			'data-validType' : 'date_gt_2016-01-01'
		},
		{
			name : 'complete_flag',
      _label : 'Is this Outage complete?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'tasks',
			_label : 'What tasks should be peformed during this Outage?',
			type : 'select',
			_optionssource : 'OutageTask.id',
			_labelssource : 'OutageTask.name',
			multiple : true,
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('outages',
		{ // grid definition
			model : 'Outage',
			columnFriendly : 'name',
			filter : 'complete_flag = 0',
			gridHeader : {
				icon : 'fa-power-off',
				headerTitle : 'Manage Outages',
				helpText : "<strong>Note:</strong> Manage Outage Dates Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Complete',
						fn : 'toggleComplete',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Flag Selected Outage', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markOutage( { 'complete_flag' : 1} );
						},
						label : 'As Complete'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markOutage({ 'complete_flag' : 0})
						},
						label : 'As Not Complete'
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"outage_date",
        "complete_flag",
			],
			headers : [ 				// headers for table
				"ID",
				"Outage Date",
        "Complete?"
			],
			templates : { 				// html template functions
        outage_date : function(val) {
          return _.nameButton(val,'fa-power-off');
        },

        complete_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        }
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markOutage			: function( atts ) {
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

					if (typeof temp.showComplete === 'undefined' || ! temp.showComplete) {
						filter.push('complete_flag = 0');
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleComplete : function( ) {
					jApp.activeGrid.temp.showComplete = ( typeof jApp.activeGrid.temp.showComplete === 'undefined')
						? true : !jApp.activeGrid.temp.showComplete;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
				}, //end fn
			}
		},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},
		]
	)
})(jApp);
