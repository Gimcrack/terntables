$.extend(true, jApp.colparams, {
	'Group' : [
		{ // fieldset
			label : 'Details',
			helptext : 'Please fill out the group details',
			class : 'col-lg-4',
			fields : [
				{
					name : 'name',
					placeholder : 'e.g. Administrators',
					_label : 'Group Name',
					_enabled : true,
					required : true,
					'data-validType' : 'Anything',
				}, {
					name : 'description',
					type : 'textarea',
					_label : 'Description',
					_enabled : true
				}, {
					name : 'modules',
					type : 'select',
					_label : 'Assign roles/permissions to this group',
					_enabled : true,
					_labelssource : 'Module.role',
					_optionssource : 'Module.id',
					multiple : true,
				}
			]
		}, {
			class : 'col-lg-8',
			fields : [
				{
					name : 'users',
					type : 'array',
					_label : 'Add Users to this Group',
					_enabled : true,
					fields : [
						{
							name : 'users',
							type : 'select',
							_labelssource : 'User.username',
							_optionssource : 'User.id',
							_enabled : true,
							multiple : true,
						}, {
							name : 'comment[]',
							placeholder : 'Optional Comment',
							_enabled : true,
						}
					]
				},
			]
		}
	]
});

// extend the application views
$.extend( true, jApp.views.admin, {

	groups : function() {

		$.extend( true, jApp.oG.admin, {

			groups : new jGrid({
				table : 'groups',
				model : 'Group',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-users',
					headerTitle : 'Manage Groups',
					helpText : "<strong>Note:</strong> Manage Groups Here"
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"users",
					"modules"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Users",
					"Module Access (Permissions)"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						return ('0000' + value).slice(-4);
					},

					"name" : function(value) {
						var r = jApp.aG().currentRow;
						return value.link( window.location.href.trim('/') + '/' + r.id );
					},

					"users" : function(arr) {
						return _.pluck(arr, 'username').join(', ');
					},

					"modules" : function(arr) {
						return _.pluck(arr, 'role').join(', ');
					},

				},
			})
		})
	}
});
