// extend the application views
_.extend( jApp.views.admin, {

	groups : function() {

		_.extend( jApp.oG.admin, {

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
