// extend the application views
_.extend( jApp.views, {

	jobroles : function() {

		_.extend( jApp.oG, {

			jobroles : new jGrid({
				table : 'jobroles',
				model : 'JobRole',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-briefcase',
					headerTitle : 'Manage Job Roles',
					helpText : "<strong>Note:</strong> Here you can manage your company job roles."
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"occupant",
					"manager_flag",
					"manager_id",
					"org_id",
					"tags"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Occupant",
					"Is Manager",
					"Reports To",
					"Parent Org",
					"Tags"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"name" : function(value) {
						var r = jApp.aG().currentRow;
						return value.link( window.location.href.trim('/') + '/' + r.id );
					},

					"occupant" : function() {
						var r = jApp.aG().currentRow;

						if ( !r.occupant ) { return '<div class="label label-danger">Vacant</label>' }

						return r.occupant.name;
					},

					"manager_flag" : function(value) {
						return !!(value*1) ?
						'<div class="label label-success">Yes</div>' :
						'<div class="label label-danger">No</div>';
					},

					"manager_id" : function() {
						var r = jApp.aG().currentRow,
								tmp;

						if ( !r.manager ) { return 'N/A'}

						return ( !!r.manager.occupant ) ?
							r.manager.name + ' (' + r.manager.occupant.name + ')' :
							r.manager.name + ' ( -Vacant- )';
					},

					"tags" : function() {
						var r = jApp.aG().currentRow;
						return _.pluck( r.tags, 'name').map( function(val) {
							return '<span style="margin:3px;" class="label label-default">' + val + '</span>';
						}).join('');
					},

          "org_id" : function() {
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
