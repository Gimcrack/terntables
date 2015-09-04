// extend the application views
_.extend( jApp.views.admin, {
	
	logins : function() {
		
		_.extend( jApp.oG.admin, {
			
			logins : new jGrid({
			
				table : 'user',
				dbView : 'vw_UserContact',		// db table
				pkey : 'UserID',			// Primary Key Of Table
				tableFriendly : 'Login',
				columnFriendly : 'Username',
				gridHeader : {
					icon : 'fa-user',
					headerTitle : 'Manage Logins',
					helpText : "<strong>Note:</strong> \
						Each login must be assigned to a user for full functionality. \
							<a href='admin/users.html' data-script='true' class='ajaxy ajaxy-view'> \
								Manage Users <i class='fa fa-arrow-right fa-fw'></i> \
							</a>  \
							<a href='admin/groups.html' data-script='true' class='ajaxy ajaxy-view'> \
								Manage Groups <i class='fa fa-arrow-right fa-fw'></i> \
							</a>"
				},
				tableBtns : {
					new : {
						label : 'New Login',
					},
				},
				rowBtns : {
					custom : {
						resetPassword : { type : 'button', class : 'btn btn-warning', icon : 'fa-refresh', label : '', fn : 'resetPassword', title : 'Reset Password'  } // etc.
					}
				},
				columns : [ 				// columns to query
					"UserID",
					"Username",
					"FullName",
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Login Name",
					"Username",
				],	
				templates : { 				// html template functions
					
					"UserID" : function(value) { 
						var temp = '0000' + value;
						return temp.slice(-4);
					}, 
					
				},
				linkTables : [
					{ tables : { parent : 'User', child : 'Contact' }, childFriendlyName : 'FullName', multiple : false, required : true },
				],
				sortBy : 'Username',			// column to sort by
				rowsPerPage : 10,			// rows per page to display on grid
				pageNum	: 1,				// current page number to display	
				html : {
					resetPassword : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
				},
				formDefs : {
					resetPassword : {
						table : 'User',
						dataView : 'User',
						pkey : 'UserID',
						tableFriendly : 'User Password',
						atts : {
							name : 'frm_resetUser',
						},
						fieldset : {
							'legend' : 'Reset Password',
						},
						loadExternal : false,
						colParams : [
							{ type : 'hidden', readonly : 'readonly', name : 'UserID' },
							{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', validType : 'min>=6', _label : 'New Password', placeholder : '******' },
							{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', validType : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
						],
					}
				}, 
				fn : {
					resetPassword : function() {
						jApp.oG.admin.logins.action = 'resetPassword';
						// modal overlay
						jApp.oG.admin.logins.fn.overlay(2,'on');
						
						//setup target div
						var $target = jApp.oG.admin.logins.$().find('#div_resetFrm');
						jApp.oG.admin.logins.fn.setupTargetDiv($target);
					}, //end fn
				}

			})
	
		})
	}
});