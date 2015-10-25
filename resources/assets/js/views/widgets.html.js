// extend the application views
_.extend( jApp.views, {

	widgets : function() {

		_.extend( jApp.oG, {

			widgets : new jGrid({
				table : 'widgets',
				model : 'Widget',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-cubes',
					headerTitle : 'Manage Inventory',
					helpText : "<strong>Note:</strong> Manage Inventory Here"
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"product_id",
					"status",
					"quantity",
					"tags"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Product ID",
					"Status",
					"Quantity",
					"Tags"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"tags" : function() {
						var r = jApp.aG().currentRow;
						return _.pluck( r.tags, 'name').map( function(val) {
							return '<span style="margin:3px;" class="label label-default">' + val + '</span>';
						}).join('');
					}

				},
			})
		})
	}
});
