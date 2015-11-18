// extend the application views
$.extend( true, jApp.views.admin, {

	users : function() {

		$.extend( true, jApp.oG.admin, {

			users : new jGrid({
				table : 'users',
				model : 'User',
				columnFriendly : 'username',
				gridHeader : {
					icon : 'fa-user',
					headerTitle : 'Manage Users',
					helpText : "<strong>Note:</strong> Manage Users Here"
				},
				rowBtns : {
					custom : {
						resetPassword : { 'data-multiple' : false, 'data-permission' : 'update_enabled', type : 'button', class : 'btn btn-primary', icon : 'fa-refresh', label : 'Password Reset ...', fn : 'resetPassword'  } // etc.
					}
				},
				columns : [ 				// columns to query
					"id",
					"username",
					"name",
					"email",
					"groups",
					"modules",
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Username",
					"Name",
					"Email",
					"Groups",
					"Access (Permissions)",
				],
				templates : { 				// html template functions

					"id" : function(value) {
						return ('0000' + value).slice(-4);
					},

					"username" : function(value) {
						var r = jApp.aG().currentRow;
						return value.link( window.location.href.trim('/') + '/' + r.id );
					},

					"name" : function() {
						var o = jApp.aG().currentRow;
						return ( !! o.person && o.person.name != null) ? o.person.name : '';
					},

					"email" : function(value) {
						return value.link( 'mailto:' + value );
					},

					"groups" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"modules" : function(arr) {
						return _.compact(_.flatten(_.map(  jApp.aG().currentRow.groups, function(row, i) {
							return (row.modules.length) ? _.map(row.modules, function(o, ii ) { return o.role + ' (' + o.name + ')' }) : false
						} ))).join(', ');
						//return _.pluck(arr, 'name').join(', ');
					},

					"created_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					},

					"updated_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					}

				},
				html : {
					forms : {
						resetPassword : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
					},
				},
				formDefs : {
					resetPassword : {
						table : 'User',
						pkey : 'id',
						tableFriendly : 'User Password',
						atts : { method : 'PATCH' },
						fieldset : {
							'legend' : 'Reset Password',
						},
						loadExternal : false,
						colParams : [
							{ type : 'hidden', readonly : 'readonly', name : 'ContactID' },
							{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', 'data-validType' : 'min>=6', _label : 'New Password', placeholder : '******' },
							{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', 'data-validType' : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
						],
					}
				},
				fn : {
					resetPassword : function() {
						jUtility.actionHelper('resetPassword');
					}, //end fn
				}
			})
		})
	}
});
