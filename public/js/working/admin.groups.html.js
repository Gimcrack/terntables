// extend the application views
_.extend( jApp.views.admin, {

	groups : function() {

		_.extend( jApp.oG.admin, {

			groups : new jGrid({
				table : 'groups',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-users',
					headerTitle : 'Manage Groups',
					helpText : "<strong>Note:</strong> Manage Groups Here"
				},
				tableBtns : {
					new : {
						label : 'New Group',
					},
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"users",
					"created_at",
					"updated_at",
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Users",
					"Created Date",
					"Changed Date",
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"users" : function(arr) {
						return _.pluck(arr, 'name').join(', ');
					},

					"created_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					},

					"updated_at" : function(value) {
						return date('Y-m-d', strtotime(value));
					}

				},
				linkTables : [
						{
							selectName : 'users',
							selectLabel : 'Users',
							model : 'User',
							valueColumn : 'id',
							labelColumn : 'name'
						}
				],
				rowsPerPage : 10,			// rows per page to display on grid
				pageNum	: 1,				// current page number to display
			})
		})
	}
});
