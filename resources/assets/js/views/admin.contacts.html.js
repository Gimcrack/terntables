//define the colparams for the view
$.extend(true, jApp.colparams, {
		'Person' : [
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-4',
					fields : [
						{
							name : 'name',
							placeholder : 'e.g. John Smith',
							required : true,
							_label : 'Enter the person\'s full name',
							_enabled : true,
							'data-validType' : 'Anything'
						}
					]
				},

				{ // fieldset
					label : ' ',
					class : 'col-lg-8',
					fields : [
						{
							name : 'users',
							type : 'select',
							_label : 'Associate one or more Usernames with this Person',
							_enabled : true,
							_labelssource : 'User.username',
							_optionssource : 'User.id',
							multiple : true
						}
					]
				}
		]
});

// extend the application views
$.extend( true, jApp.views.admin, {

	contacts : function() {

		$.extend( true, jApp.oG.admin, {

			contacts : new jGrid({
				table : 'people',
				model : 'Person',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-user',
					headerTitle : 'Manage Contacts',
					helpText : "<strong>Note:</strong> Manage Contacts Here"
				},
				columns : [ 				// columns to query
					"id",
					"name",
          "users",
					"groups"
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
          "Username(s)",
					"Groups"
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

					"groups" : function(arr) {
						return _.compact(_.flatten(_.map(  jApp.aG().currentRow.users, function(row, i) {
							return (row.groups.length) ? _.pluck(row.groups,'name') : false
						} ))).join(', ');
						//return _.pluck(arr, 'name').join(', ');
					}

				}
			})
		})
	}
});
