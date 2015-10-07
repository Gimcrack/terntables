// extend the application views
_.extend( jApp.views.admin, {

	modules : function() {

		_.extend( jApp.oG.admin, {

			modules : new jGrid({
				table : 'modules',
				model : 'Module',
				columnFriendly : 'name',
				tableBtns : {
					new : {
						label : 'New Access Control'
					}
				},
				gridHeader : {
					icon : 'fa-lock',
					headerTitle : 'Access Control',
					helpText : "<strong>Note:</strong> Setup access controls here."
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"permissions",
					"groups",
          "users"
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
					"Permissions",
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

					"permissions" : function() {
						var row = jApp.aG().currentRow,
								p = [];

						if ( !!Number(row.create_enabled) ) p.push('Create');
						if ( !!Number(row.read_enabled )) p.push('Read');
						if ( !!Number(row.update_enabled) ) p.push('Update');
						if ( !!Number(row.delete_enabled) ) p.push('Delete');

						return p.join(', ');
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
