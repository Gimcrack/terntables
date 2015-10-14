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
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Name",
          "Username(s)"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

          "users" : function() {
            var o = jApp.aG().currentRow;

            return _.pluck(o.users, 'username').join(', ');
          }

				}
			})
		})
	}
});
