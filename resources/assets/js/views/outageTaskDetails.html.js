/**
 * outageTaskDetails.html.js
 *
 * outage task details view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			_label : 'Task Name',
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
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
			name : 'outage_id',
			type : 'select',
			_label : 'Outage Date',
			_optionssource : 'Outage.id',
			_labelssource : 'Outage.outage_date',
			_firstoption : null,
			_firstlabel : '-Choose-',
			required : true,
			'data-validType' : 'select'
		},
		{
			name : 'person_id',
			type : 'select',
			_label : 'Assignee',
			_optionssource : 'Person.id',
			_labelssource : 'Person.name',
			_firstlabel : '-Unspecified-',
			_firstoption : null
		},
		{
			name : 'status',
			type : 'select',
			_label : 'Status',
			_optionssource : [
				'New',
				'Pending',
				'In Progress',
				'Complete',
				'Restarted',
				'Flagged',
				'Skipped',
				'Other'
			]
		},
		{
			name : 'notes',
			_label : 'Notes',
			type : 'textarea'
		}
	], fieldset_2__fields = [
		{
			name : 'task_type',
			_label : 'What type of Task is this?',
			type : 'select',
			_optionssource : [
				'-Choose-',
				'Server Task',
				'Application Task',
				'Database Task',
				'Other'
			],
			required : true,
			'data-validType' : 'select',
		},
		{
			name : 'server_id',
			type : 'select',
			_label : 'Perform this task on this server.',
			_labelssource : 'Server.name',
			_optionssource : 'Server.id',
			_firstoption : null,
			_firstlabel : '-N/A-'
		},
		{
			name : 'application_id',
			type : 'select',
			_label : 'Perform this task on this application.',
			_labelssource : 'Application.name',
			_optionssource : 'Application.id',
			_firstoption : null,
			_firstlabel : '-N/A-'
		},
		{
			name : 'database_id',
			type : 'select',
			_label : 'Perform this task on this database.',
			_labelssource : 'Database.name',
			_optionssource : 'Database.id',
			_firstoption : null,
			_firstlabel : '-N/A-'
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('outageTaskDetails',
		{ // grid definition
			model : 'OutageTaskDetail',
			filter : "status not in ('Complete','Skipped') and :show__only__my__groups:",
			refreshInterval : 12000,
			model_display : 'Task',
			columnFriendly : 'name',
			toggles : {
				ellipses : false
			},
			gridHeader : {
				icon : 'fa-check-square-o',
				headerTitle : 'Manage Outage Tasks',
				helpText : "<strong>Note:</strong> Only approved updates will be installed. <a href='approveUpdates'>Approve Updates</a>"
			},
			tableBtns : {
				custom : {
					showOnlyMine : {
						type : 'button',
						class : 'btn btn-success btn-toggle btn-showOnlyMine',
						icon : 'fa-toggle-off',
						label : 'Show Only My Tasks',
						fn : 'showOnlyMine',
						'data-order' : 97
					},
					showOnlyMyGroups : {
						type : 'button',
						class : 'btn btn-success active btn-toggle btn-showOnlyMyGroups',
						icon : 'fa-toggle-on',
						label : 'Show Only My Groups\' Tasks',
						fn : 'showOnlyMyGroups',
						'data-order' : 98
					},
					showOnlyAvailable : {
						type : 'button',
						class : 'btn btn-success btn-toggle btn-showOnlyAvailable',
						icon : 'fa-toggle-off',
						label : 'Show Only Available Tasks',
						fn : 'showOnlyAvailable',
						'data-order' : 99
					},
					toggleHidden : {
						type : 'button',
						class : 'btn btn-success btn-toggle',
						icon : 'fa-toggle-off',
						label : 'Toggle Hidden',
						fn : 'toggleHidden',
						'data-order' : 100
					},
				},
			},
			rowBtns : {
				custom : {
					assignToMe : {
						type : 'button',
						class : 'btn btn-primary',
						icon : 'fa-user',
						label : 'Assign Selected To Me...',
						fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.assignToMe( { 'person_id' : ':user__person__id:'} );
						},
					},

					markServers : [
						{ label: 'Set Selected Server Status...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer({ 'status' : 'Update Software'})
							},
							label : 'Update Agent Software'
						},
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
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
								e.preventDefault();
								jApp.activeGrid.fn.markServer( { 'status' : 'Abort Reboot'} );
							},
							label : 'As Cancel Reboot',
						},
					],

					markSelected : [
						{ label: 'Set Selected Tasks Status...', class: 'btn btn-primary', icon : 'fa-check-square-o' },
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'New'} );
							},
							label : 'As New'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Pending'} );
							},
							label : 'As Pending'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'In Progress'} );
							},
							label : 'As In Progress'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Restarted'} );
							},
							label : 'As Restarted'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Complete'} );
							},
							label : 'As Complete'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Skipped'} );
							},
							label : 'As Skipped'
						},
						{
							'data-multiple' : true,
							'data-permission' : 'update_enabled',
							type : 'button',
							fn : function(e) {
									e.preventDefault();
									jApp.activeGrid.fn.markOutageTask( { 'status' : 'Flagged'} );
							},
							label : 'As Flagged'
						},

					]
				},
			},
			columns : [ 				// columns to query
				"id",
				"name",
				"scope",
				"outage_date",
				"task_template",
				"assignee",
				"server_updated",
				"server_status",
				"updated_at_for_humans",
				"status",

			],
			headers : [ 				// headers for table
				"ID",
				"Task Name",
				"Scope",
				"Outage Date",
				"Task Template",
        "Assignee",
				"Server Modified",
				"Server Status",
				"Task Modified",
				"Task Status",
			],
			templates : { 				// html template functions



				inactive_flag : function(val) {
          return _.getFlag(val,'Yes','No');
        },

				assignee : function(val) {
					var r = jApp.activeGrid.currentRow;
					return _.get('name',r.assignee,'fa-male','Person');
				},

				task_template : function(val) {
					var r = jApp.activeGrid.currentRow;

					if ( r.outage_task == null ) return '';

					return _.get('name',r.outage_task,'fa-file-text-o','OutageTask');
				},

				outage_date : function() {
					var r = jApp.activeGrid.currentRow;
					return _.get('outage_date',r.outage,'fa-power-off','Outage');
				},

				scope : function() {
					var r = jApp.activeGrid.currentRow,
							ret = [];

					if ( !! r.server ) {
						ret.push(_.get('name',r.server,'fa-building-o','Server'));
					}

					if ( !! r.application ) {
						ret.push(_.get('name',r.application,'fa-cubes','Application') );
					}

					if ( !! r.database ) {
						ret.push( _.get('name',r.database,'fa-database','Database') );
					}

					ret.push('</table>');

					return ret.join(' ');
				},

				status : function(val) {
					var r = jApp.activeGrid.currentRow,
							notes = r.notes || '',
							label = val + ' ' + notes;

					switch(val) {
						case 'New' :
							return _.getLabel(label,'fa-circle-o','darkblue','white');

						case 'Pending' :
							return _.getLabel(label,'fa-pause','purple','white');

						case 'In Progress' :
							return _.getLabel(label,'fa-play','skyblue');

						case 'Restarted' :
							return _.getLabel(label,'fa-refresh','royalblue','white');

						case 'Complete' :
							return _.getLabel(label,'fa-check-square-o','lightgreen');

						case 'Skipped' :
							return _.getLabel(label,'fa-fast-forward','darkred','white');

						case 'Flagged' :
							return _.getLabel(label,'fa-flag','red','white');

					}
					return _.getLabel(label,'default');
				},

				server_status : function(val) {
					var r = jApp.activeGrid.currentRow,
							server = r.server,
							status = ( server != null ) ? server.status : ' ';

					return status || '';
				},

				server_updated : function(val) {
					var r = jApp.activeGrid.currentRow,
							server = r.server,
							updated = ( server != null ) ? server.updated_at_for_humans : ' ';

					return updated || '';
				},


			},
			fn : {

				/**
				 * Custom form bootup function
				 * @method function
				 * @return {[type]} [description]
				 */
				formBootup : function() {
					var frm = jUtility.$currentFormWrapper();
					console.log('running custom bootup function');
					frm.find('#server_id').closest('.form_element').hide();
					frm.find('#application_id').closest('.form_element').hide();
					frm.find('#database_id').closest('.form_element').hide();

					frm.find('#task_type').change( jApp.aG().fn.updateFormFields);

					jApp.aG().fn.updateFormFields();
				}, // end fn

				/**
				 * Custom getRowData callback function, runs after the row data is populated
				 * @method function
				 * @return {[type]} [description]
				 */
				getRowDataCallback : function() {
					console.log('running custom getRowData callback');
					jApp.aG().fn.updateFormFields();
				}, // end fn

				/**
				 * Update what form fields are visible
				 * @method function
				 * @return {[type]} [description]
				 */
				updateFormFields : function() {
					var frm = jUtility.$currentFormWrapper();

					if ( ! frm ) { return false; }

					switch( frm.find('#task_type').val()  ) {
						case 'Server Task' :
							frm.find('#server_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#application_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#database_id').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Application Task' :
							frm.find('#server_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#application_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#database_id').prop('disabled',true).closest('.form_element').hide();
							return true;

						case 'Database Task' :
							frm.find('#server_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#application_id').prop('disabled',true).closest('.form_element').hide();
							frm.find('#database_id').prop('disabled',false).closest('.form_element').show();
							return true;

						case 'Other' :
							frm.find('#server_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#application_id').prop('disabled',false).closest('.form_element').show();
							frm.find('#database_id').prop('disabled',false).closest('.form_element').show();
							return true;
					}
				}, // end fn

				/**
				 * Assign the selected tasks to me
				 * @method function
				 * @return {[type]} [description]
				 */
				assignToMe			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction(),
							success : jUtility.callback.submitCurrentForm,
							data : _.extend( { '_method' : 'patch', 'ids[]' : ids }, atts )
						});
					});
				}, // end fn

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

				markServer			: function( atts ) {
					jApp.aG().action = 'withSelectedUpdate';
					jUtility.withSelected('custom', function(ids) {
						jUtility.postJSON( {
							url : jUtility.getCurrentFormAction() + 'Servers',
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

					if (typeof temp.showHidden === 'undefined' || ! temp.showHidden) {
						filter.push("status not in ('Complete','Skipped')");
					}

					if (typeof temp.showOnlyAvailable !== 'undefined' && !! temp.showOnlyAvailable) {
						filter.push(":show__only__available:");
					}

					if (typeof temp.showOnlyMyGroups !== 'undefined' && !! temp.showOnlyMyGroups) {
						filter.push(":show__only__my__groups:");
					}

					if (typeof temp.showOnlyMine !== 'undefined' && !! temp.showOnlyMine) {
						filter.push("person_id = :user__person__id:");
					}

					jApp.activeGrid.dataGrid.requestOptions.data.filter = filter.join(' AND ');

				}, // end fn

				/**
				 * Show only my tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMine : function( ) {
					jApp.activeGrid.temp.showOnlyMine = ( typeof jApp.activeGrid.temp.showOnlyMine === 'undefined')
						? true : !jApp.activeGrid.temp.showOnlyMine;

					jApp.activeGrid.temp.showOnlyAvailable = false;
					jApp.activeGrid.temp.showOnlyMyGroups = false;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					$('.btn-showOnlyAvailable').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('.btn-showOnlyMyGroups').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}, //end fn

				/**
				 * Show only my groups' tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyMyGroups : function( ) {
					jApp.activeGrid.temp.showOnlyMyGroups = ( typeof jApp.activeGrid.temp.showOnlyMyGroups === 'undefined')
						? false : !jApp.activeGrid.temp.showOnlyMyGroups;

					jApp.activeGrid.temp.showOnlyMine = false;
					jApp.activeGrid.temp.showOnlyAvailable = false;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					$('.btn-showOnlyAvailable').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('.btn-showOnlyMine').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}, //end fn

				/**
				 * Show only available tasks
				 * @method function
				 * @return {[type]} [description]
				 */
				showOnlyAvailable : function( ) {
					jApp.activeGrid.temp.showOnlyAvailable = ( typeof jApp.activeGrid.temp.showOnlyAvailable === 'undefined')
						? true : !jApp.activeGrid.temp.showOnlyAvailable;

					jApp.activeGrid.temp.showOnlyMine = false;
					jApp.activeGrid.temp.showOnlyMyGroups = false;
					jApp.activeGrid.fn.updateGridFilter();
					jUtility.executeGridDataRequest();
					$(this).toggleClass('active').find('i').toggleClass('fa-toggle-on fa-toggle-off');
					$('.btn-showOnlyMine').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('.btn-showOnlyMyGroups').removeClass('active').find('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				}, //end fn

				/**
				 * Toggle inactive server visibility
				 * @method function
				 * @return {[type]} [description]
				 */
				toggleHidden : function( ) {
					jApp.activeGrid.temp.showHidden = ( typeof jApp.activeGrid.temp.showHidden === 'undefined')
						? true : !jApp.activeGrid.temp.showHidden;
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
					helpText : 'What should the task be performed on?',
					class : 'col-lg-8',
					fields : fieldset_2__fields
				},
		]
	)
})(jApp);
