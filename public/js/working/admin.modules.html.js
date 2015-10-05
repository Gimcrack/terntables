// extend the application views
_.extend( jApp.views.admin, {

	modules : function() {

		_.extend( jApp.oG.admin, {

			modules : new jGrid({
				table : 'modules',
				model : 'Module',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-users',
					headerTitle : 'Manage Modules',
					helpText : "<strong>Note:</strong> Manage Modules Here"
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"groups",
          "users"
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Groups",
          "Users",
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"groups" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"users" : function(arr) {
            return _.compact(_.flatten(_.map(  jApp.aG().currentRow.groups, function(row, i) {
							return (row.users.length) ? _.map(row.users, function(user, i) { return user.username } ) : false
						} ))).join(', ');
					},

					"created_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					},

					"updated_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					}

				}
			})
		})
	}
});
