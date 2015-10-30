// extend the application views
_.extend( jApp.views, {

	requirements : function() {

		_.extend( jApp.oG, {

			requirements : new jGrid({
				table : 'requirements',
				model : 'Requirement',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-tasks',
					headerTitle : 'Manage Training Requirements',
					helpText : "<strong>Note:</strong> Assign training collections to requirements, and requirements to job roles."
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"org",
					"collections",
					"jobroles",
					"tags"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Parent Org",
					"Training Collections",
					"Assigned Job Roles",
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

					"collections" : function( arr ) {
						return _.pluck( arr, 'name').join(', ');
					},

					"jobroles" : function( arr ) {
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
