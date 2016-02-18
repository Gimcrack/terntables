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
			_label : 'Enter a name for this Task.',
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
			name : 'inactive_flag',
			_label : 'Is this Task inactive?',
			type : 'select',
			_optionssource : ['0','1'],
			_labelssource : ['No','Yes'],
		},
		{
			name : 'scope_to_outages',
			type : 'select',
			_label : 'What Outages should this task be assigned to?',
			_labelssource : 'Outage.outage_date',
			_optionssource : 'Outage.id',
			multiple : true
		}
	], fieldset_2__fields = [
		{
			name : 'assign_to_people',
			type : 'select',
			_label : 'This task may be assigned to these people.',
			_labelssource : 'Person.name',
			_optionssource : 'Person.id',
			multiple : true
		},
		{
			name : 'assign_to_groups',
			type : 'select',
			_label : 'This task may be assigned to members of these groups.',
			_labelssource : 'Group.name',
			_optionssource : 'Group.id',
			multiple : true
		},
		{
			name : 'scope_to_servers',
			type : 'select',
			_label : 'This task will be performed on these servers.',
			_labelssource : 'Server.name',
			_optionssource : 'Server.id',
			multiple : true
		},
		{
			name : 'scope_to_applications',
			type : 'select',
			_label : 'This task will be performed on these applications.',
			_labelssource : 'Application.name',
			_optionssource : 'Application.id',
			multiple : true
		},
		{
			name : 'scope_to_databases',
			type : 'select',
			_label : 'This task will be performed on these databases.',
			_labelssource : 'Database.name',
			_optionssource : 'Database.id',
			multiple : true
		},
		{
			name : 'scope_to_groups',
			type : 'select',
			_label : 'This task will be performed on Servers/Applications/Databases owned by these groups.',
			_labelssource : 'Group.name',
			_optionssource : 'Group.id',
			multiple : true
		},
		{
			name : 'scope_to_operating_systems',
			type : 'select',
			_label : 'This task will be limited to servers with these operating systems.',
			_labelssource : 'OperatingSystem.name',
			_optionssource : 'OperatingSystem.id',
			multiple : true
		},
		{
			name : 'scope_to_production_servers',
			type : 'select',
			_label : 'This task will be limited to the selected server types.',
			_labelssource : [ '-All-','Production Only','Non-Production Only' ],
			_optionssource : ['0','1','2'],
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('outageTasks',
		{ // grid definition
			model : 'OutageTask',
			filter : 'inactive_flag = 0',
			toggles : {
				ellipses : false
			},
			model_display : 'Template',
			columnFriendly : 'name',
			gridHeader : {
				icon : 'fa-tasks',
				headerTitle : 'Manage Outage Tasks Templates',
				helpText : "<strong>Note:</strong> Manage Outage Task Templates Here"
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
				"inactive_flag",
				"scope"
			],
			headers : [ 				// headers for table
				"ID",
				"Task Name",
        "Owner",
				"Task Type",
				"Inactive?",
				"Scope"
			],
			templates : { 				// html template functions

        inactive_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        },

				owner : function(val) {
					return _.get('name',val,'fa-users','Group');
				},

				scope : function() {
					var r = jApp.activeGrid.currentRow,
							ret = ['<table class="table-striped">'];

					if ( !! r.assign_to_groups && !!r.assign_to_groups.length ) {
						ret.push('<tr>');
						ret.push('<td>Assignable Groups</td>');
						ret.push('<td>' +  _.get('name',r.assign_to_groups,'fa-users','Group') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.assign_to_people && !!r.assign_to_people.length ) {
						ret.push('<tr>');
						ret.push('<td>Assignable People</td>');
						ret.push('<td>' +  _.get('name',r.assign_to_people,'fa-male','Person') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_outages && !!r.scope_to_outages.length ) {
						ret.push('<tr>');
						ret.push('<td>Outages</td>');
						ret.push('<td>' +  _.get('outage_date',r.scope_to_outages,'fa-power-off','Outage') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_servers && !!r.scope_to_servers.length ) {
						ret.push('<tr>');
						ret.push('<td>Servers</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_servers,'fa-server','Server') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_applications && !!r.scope_to_applications.length ) {
						ret.push('<tr>');
						ret.push('<td>Applications</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_applications,'fa-cubes','Application') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_databases && !!r.scope_to_databases.length ) {
						ret.push('<tr>');
						ret.push('<td>Databases</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_databases,'fa-database','Database') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_operating_systems && !!r.scope_to_operating_systems.length ) {
						ret.push('<tr>');
						ret.push('<td>Operating Systems</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_operating_systems,'fa-windows','OperatingSystem') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_groups && !!r.scope_to_groups.length ) {
						ret.push('<tr>');
						ret.push('<td>Objects Owned By Groups</td>');
						ret.push('<td>' +  _.get('name',r.scope_to_groups,'fa-users','Group') + '</td>' );
						ret.push('</tr>');
					}

					if ( !! r.scope_to_production_servers ) {
						var tmp = ( r.scope_to_production_servers == '2' ) ? 'Non-Production Only' : 'Production Only'
						ret.push('<tr>');
						ret.push('<td>Type</td>');
						ret.push('<td>' +  tmp + '</td>' );
						ret.push('</tr>');
					}

					ret.push('</table>');

					return ret.join(' ');
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
					label : 'Task Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : fieldset_1__fields
				},
				{ // fieldset
					label : 'Task Scope',
					helpText : 'You may optionally limit the scope that this task will apply to.',
					class : 'col-lg-8',
					fields : fieldset_2__fields
				},
		]
	)
})(jApp);
