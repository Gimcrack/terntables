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
					"Modules"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"users" : function(arr) {
						return _.pluck(arr, 'username').join(', ');
					},

					"modules" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

				},
			})
		})
	}
});
