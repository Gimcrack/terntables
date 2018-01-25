/**
 * admin.groups.html.js
 *
 * admin.groups view definition
 */
;(function(jApp) {

	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'username',
			placeholder : 'e.g. jsmith',
			required : true,
			_label : 'Username',
			'data-validType' : 'Anything'
		},{
			name : 'email',
			placeholder : 'email@domain.com',
			required : true,
			_label : 'Email Address',
			'data-validType' : 'Email Address'
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('profile',
	{
		model : 'Profile',
		columnFriendly : 'username',
		toggles : {
			new : false,
			del : false,
		},
		gridHeader : {
			icon : 'fa-user',
			headerTitle : 'My Profile',
			helpText : "<strong>Note:</strong> Manage your user accounts here"
		},
		rowBtns : {
			custom : {
				resetPassword : { 'data-multiple' : false, 'data-permission' : 'read_enabled', type : 'button', class : 'btn btn-primary', icon : 'fa-refresh', label : 'Password Reset ...', fn : 'resetPassword'  } // etc.
			}
		},
		columns : [ 				// columns to query
			"id",
			"username",
			"person_name",
			"email",
			"groups",
			"profile_group_roles",
		],
		headers : [ 				// headers for table
			"ID",
			"Username",
			"Name",
			"Email",
			"Groups",
			"Roles",
		],
		html : {
			forms : {
				resetPassword : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
			},
		},
		templates : {
			groups : function(arr) {
        return _.get('name', arr, 'fa-users');
      },

			person_name : function() {
				var r = jApp.activeGrid.currentRow;

				return _.get('name', r.person || '','fa-male','Person');
			},
		},
		formDefs : {
			resetPassword : {
				table : 'User',
				pkey : 'id',
				tableFriendly : 'User Password',
				atts : { method : 'PATCH' },
				//loadExternal : false, // treat it like an externally loaded form, but specify params locally
				colParams : [{
					label : 'Reset Password',
					helpText : 'Specify a new password then confirm it to continue.',
					class : 'col-lg-3',
					fields : [
						{ type : 'hidden', readonly : 'readonly', name : 'ContactID' },
						{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', 'data-validType' : 'min>=6', _label : 'New Password', placeholder : '******' },
						{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', 'data-validType' : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
					]
				}],
			}
		},
		fn : {
			resetPassword : function() {
				jUtility.actionHelper('resetPassword');
			}, //end fn
		}
	},
		[ // colparams
			{ // fieldset
				label : 'User',
				helpText : 'Update your information here',
				class : 'col-lg-3',
				fields : fieldset_1__fields
			}
		]
	);

})(jApp)
