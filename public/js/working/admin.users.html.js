// extend the application views
_.extend( jApp.views.admin, {

	users : function() {

		_.extend( jApp.oG.admin, {

			users : new jGrid({
				url : '/admin/users/json',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-user',
					headerTitle : 'Manage Users',
					helpText : "<strong>Note:</strong> Manage Users Here"
				},
				tableBtns : {
					new : {
						label : 'New User',
					},
				},
				rowBtns : {
					custom : {
						resetPassword : { type : 'button', class : 'btn btn-warning', icon : 'fa-refresh', label : '', fn : 'resetPassword', title : 'Reset Password'  } // etc.
					}
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"email",
					"username",
					"groups",
					"created_at",
					"updated_at",

				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
					"Email",
					"Username",
					"Groups",
					"Created Date",
					"Changed Date",
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"email" : function(value) {
						return '<a href="mailto:' + value + '" >' + value + '</a>';
					},

					"groups" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					}

				},
				linkTables : [

				],
				sortBy : 'EmailLink',			// column to sort by
				rowsPerPage : 10,			// rows per page to display on grid
				pageNum	: 1,				// current page number to display
				html : {
					resetPassword : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
				},
				formDefs : {
					resetPassword : {
						table : 'User',
						dataView : 'dbo.lk_UserContact',
						pkey : 'ContactID',
						tableFriendly : 'User Password',
						atts : {
							name : 'frm_resetUser',
						},
						fieldset : {
							'legend' : 'Reset Password',
						},
						loadExternal : false,
						colParams : [
							{ type : 'hidden', readonly : 'readonly', name : 'ContactID' },
							{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', validType : 'min>=6', _label : 'New Password', placeholder : '******' },
							{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', validType : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
						],
					}
				},
				fn : {
					resetPassword : function() {
						jApp.oG.admin.users.action = 'resetPassword';
						// modal overlay
						jApp.oG.admin.users.fn.overlay(2,'on');

						//setup target div
						var $target = jApp.oG.admin.users.$().find('#div_resetFrm');
						jApp.oG.admin.users.fn.setupTargetDiv($target);
					}, //end fn
				}
			})
		})
	}
});
