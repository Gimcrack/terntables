// extend the application views
_.extend( jApp.views, {

	collections : function() {

		_.extend( jApp.oG, {

			collections : new jGrid({
				table : 'collections',
				model : 'Collection',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-cubes',
					headerTitle : 'Manage Training Collections',
					helpText : "<strong>Note:</strong> Assign Training Resources to Collections. Assign Collections to Job Roles"
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"org",
					"resources",
					"requirements",
					"tags"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Parent Org",
					"Training Resources",
					"Training Requirements",
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

					"resources" : function( arr ) {
						return _.pluck( arr, 'name').join(', ');
					},

					"requirements" : function( arr ) {
						return _.pluck( arr, 'name').join(', ');
					},

					"org" : function(val) {
            var r = val,
								tmp = [];

						if ( !!r.parent ) {

							while( !!r.parent ) {
								tmp.unshift( r.parent.name );
								r = r.parent;
							}
						}

						tmp.push(val.name);

            return tmp.join('\\');
          }

				},
			})
		})
	}
});
