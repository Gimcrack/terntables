/**
 * outagetasks.html.js
 *
 * outage tasks view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			required : true,
			_label : 'Enter a name for this Outage Task.',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'task_type',
			_label : 'Task Type',
			type : 'select',
			_optionssource : [
				'-Choose-',
				'Server Task',
				'Application Task',
				'Database Task',
				'Other'
			],
			required : true,
			'data-validType' : 'select'
		},
		{
			name : 'inactive_flag',
			_label : 'Is this Task inactive?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		}
	], fieldset_2__fields = [
		{
			name : 'group_id',
			_label : 'What Group "owns" this Task?',
			type : 'select',
			required : true,
			'data-validType' : 'select',
			_firstlabel : '-Choose-',
			_firstoption : -1,
			_optionssource : 'Group.id',
			_labelssource : 'Group.name',
		},
		{
			name : 'outages',
			type : 'select',
			_label : 'What Outages should this task be assigned to?',
			_labelssource : 'Outage.outage_date',
			_optionssource : 'Outage.id',
			multiple : true
		},
	], fieldset_3__fields = [
		{
			name : 'people',
			type : 'select',
			_label : 'This task may be assigned to these people.',
			_labelssource : 'Person.name',
			_optionssource : 'Person.id',
			multiple : true
		},
		{
			name : 'servers',
			type : 'select',
			_label : 'This task may be performed on these servers.',
			_labelssource : 'Server.name',
			_optionssource : 'Server.id',
			multiple : true
		},
		{
			name : 'applications',
			type : 'select',
			_label : 'This task may be performed on these applications.',
			_labelssource : 'Application.name',
			_optionssource : 'Application.id',
			multiple : true
		},
		{
			name : 'databases',
			type : 'select',
			_label : 'This task may be performed on these databases.',
			_labelssource : 'Database.name',
			_optionssource : 'Database.id',
			multiple : true
		},
		{
			name : 'groups',
			type : 'select',
			_label : 'This task may be performed on objects owned by these groups.',
			_labelssource : 'Group.name',
			_optionssource : 'Group.id',
			multiple : true
		},
		{
			name : 'operatingSystems',
			type : 'select',
			_label : 'This task may be performed on servers with these operating systems.',
			_labelssource : 'OperatingSystem.name',
			_optionssource : 'OperatingSystem.id',
			multiple : true
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('outageTasks',
		{ // grid definition
			model : 'OutageTask',
			filter : 'inactive_flag = 0',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-tasks',
				headerTitle : 'Manage Outage Tasks',
				helpText : "<strong>Note:</strong> Manage Outage Tasks Here"
			},
			tableBtns : {
				custom : {
					toggleInactive : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Inactive',
						fn : 'toggleInactive',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				markSelected : [
					{ label: 'Flag Selected Outage Task', class: 'btn btn-primary', icon : 'fa-check-square-o' },
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markOutageTask( { 'inactive_flag' : 1} );
						},
						label : 'As Inactive'
					},
					{
						'data-multiple' : true,
						'data-permission' : 'update_enabled',
						type : 'button',
						fn : function(e) {
							e.preventDefault();
							jApp.activeGrid.fn.markOutageTask({ 'inactive_flag' : 0})
						},
						label : 'As Not Inactive'
					},
				]
			},
			columns : [ 				// columns to query
				"id",
				"name",
        "owner",
				"task_type",
				"inactive_flag"
			],
			headers : [ 				// headers for table
				"ID",
				"Task name",
        "Owner",
				"Task Type",
				"Inactive?"
			],
			templates : { 				// html template functions

        inactive_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        }
			},
			fn : {
				/**
				 * Mark selected applications as inactive/active
				 * @method function
				 * @return {[type]} [description]
				 */
				markOutageTask			: function( atts ) {
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

					if (typeof temp.showInactive === 'undefined' || ! temp.showInactive) {
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
					jApp.activeGrid.temp.showInactive = ( typeof jApp.activeGrid.temp.showInactive === 'undefined')
						? true : !jApp.activeGrid.temp.showInactive;
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
				{ // fieldset
					label : '',
					helpText : '',
					class : 'col-lg-4',
					fields : fieldset_2__fields
				},
				{ // fieldset
					label : 'Task Scope',
					helpText : 'You may optionally limit the scope that this task will apply to.',
					class : 'col-lg-5',
					fields : fieldset_3__fields
				},
		]
	)
})(jApp);
