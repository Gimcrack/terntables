// extend the application views
$.extend(true, jApp.views, {

	profile : function() {

		$.extend(true, jApp.oG, {

			profile : new jGrid({
				table : 'users',
				model : 'User',
				columnFriendly : 'username',
				gridHeader : {
					icon : 'fa-user',
					headerTitle : 'My Profile',
					helpText : 'Manage your profile information and password here.'
				},
				disabledFrmElements : [
					'people_id',
					'groups'
				],
				rowDataUrl : 'users/json',
				toggles : {
					new : false,
					del : false,
					sort : false,
					autoUpdate : false,
					paginate : false,
					withSelected : false,
					headerFilters : false,
				},
				rowBtns : {
					custom : {
						resetPassword : { type : 'button', class : 'btn btn-primary', icon : 'fa-refresh', label : 'Reset Password', fn : 'resetPassword', title : 'Reset Password'  } // etc.
					}
				},
				columns : [ 				// columns to query
					"id",
					"username",
					"name",
					"email",
					"groups",
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Username",
					"Name",
					"Email",
					"Groups",
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"name" : function() {
						var o = jApp.aG().currentRow;
						return o.person.name;
					},

					"email" : function(value) {
						return '<a href="mailto:' + value + '" >' + value + '</a>';
					},

					"groups" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"modules" : function(arr) {
						return _.compact(_.flatten(_.map(  jApp.aG().currentRow.groups, function(row, i) {
							return (row.modules.length) ? _.pluck(row.modules,'name') : false
						} ))).join(', ');
						//return _.pluck(arr, 'name').join(', ');
					},

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