// extend the application views
_.extend( jApp.views, {

	orgs : function() {

		_.extend( jApp.oG, {

			orgs : new jGrid({
				table : 'orgs',
				model : 'Org',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-building-o',
					headerTitle : 'Manage Orgs',
					helpText : "<strong>Note:</strong> Manage Orgs here."
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"parent_id",
					"tags"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Parent Org",
					"Tags"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						return ('0000' + value).slice(-4);
					},

					"name" : function(value) {
						var r = jApp.aG().currentRow;
						return value.link( window.location.href.trim('/') + '/' + r.id );
					},

					"tags" : function() {
						var r = jApp.aG().currentRow;
						return _.pluck( r.tags, 'name').map( function(val) {
							return '<span style="margin:3px;" class="label label-default">' + val + '</span>';
						}).join('');
					},

          "parent_id" : function() {
            var r = jApp.aG().currentRow,
								tmp = [];

						if ( !r.parent ) { return 'N/A'}

						while( !!r.parent ) {
							tmp.unshift( r.parent.name );
							r = r.parent;
						}

            return tmp.join('\\');
          }

				},
			})
		})
	}
});
