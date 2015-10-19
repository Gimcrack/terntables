// extend the application views
$.extend(true, jApp.views, {

	documents : function() {

		$.extend(true, jApp.oG, {

			documents : new jGrid({
				table : 'documents',
				model : 'Document',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-file-text-o',
					headerTitle : 'GIS Documents',
					helpText : 'Note: Create, Update, and Manage GIS documents here.'
				},
				toggles : {
					ellipses : false
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"raw_file_path",
					"parsed_file_path",
					"owner",
					"status",
					"tags"
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Title",
					"Description",
					"Original File",
					"Parsed File",
					"Owner",
					"Status",
					"Tags"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"owner" : function(value) {
						var r = jApp.aG().currentRow;
						return ( r.owner != null ) ? r.owner.name : '';
					},

					"name" : function(value) {
						var r = jApp.aG().currentRow;
						return  "<a href=\"documents/" + r.id + "\" >" + value + '</a>';
					},

					"raw_file_path" : function(value) {
						var r = jApp.aG().currentRow, v;
						if (value.length > 30) {
							v = value.substring(0,30) + '...';
						}
						return  "<a title=\"" + value + "\" href=\"documents/" + r.id + "/raw\" target=\"_blank\">" + v + '</a>';
					},

					"parsed_file_path" : function(value) {
						var r = jApp.aG().currentRow, v;
						if (value.length > 30) {
							v = value.substring(0,30) + '...';
						}
						return  "<a title=\"" + value + "\" href=\"documents/" + r.id + "/raw\" target=\"_blank\">" + v + '</a>';
					},

					"tags" : function() {
						var r = jApp.aG().currentRow;
						return _.pluck( r.tags, 'name').map( function(val) {
							return '<div style="margin:3px;" class="label label-info">' + val + '</div>';
						}).join('');
					}

				},
			})
		})
	}
});
