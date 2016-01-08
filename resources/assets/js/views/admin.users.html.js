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
		},{
			name : 'people_id',
			type : 'select',
			_label : 'Contact Name',
			_firstlabel : '-Choose-',
			_firstoption : 0,
			_labelssource : "Person.name",
			_optionssource : "Person.id",
			'data-validType' : 'select'
		}
	], fieldset_2__fields = [
		{
			name : 'groups',
			type : 'array',
			_label : 'Associate one or more Groups with this User',
			fields : [
				{
					name : 'groups[]',
					type : 'select',
					required : true,
					_firstlabel : 'None selected',
					_firstoption : -1,
					_labelssource : 'Group.name',
					_optionssource : 'Group.id',
					'data-validType' : 'select',
				},
				{
					name : 'comment',
					placeholder : 'Comment',
				},
				{
					name : 'primary_flag',
					type : 'select',
					_labelssource : 'Primary Group?|No|Yes',
					_optionssource : '|0|1',
					'data-no-bsms' : true
				}
			]
		}
	];

	/**
	 * Add the view
	 */
	jApp.addView('admin.users',
	{
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
			"person_name",
			"email",
			"groups",
			"group_modules",
		],
		headers : [ 				// headers for table
			"ID",
			"Username",
			"Name",
			"Email",
			"Groups",
			"Access (Permissions)",
		],
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
				label : 'User Details',
				helpText : 'Please fill out the User information',
				class : 'col-lg-5',
				fields : fieldset_1__fields
			},
			{	// fieldset
				class : 'col-lg-5',
				fields : fieldset_2__fields
			}
		]
	);

})(jApp)
