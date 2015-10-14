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
					headerTitle : 'Documents',
					helpText : 'Note: Create, Update, and Manage documents here.'
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"raw_file_path",
					"parsed_file_path",
					"owner",
				],
				hidCols : [					// columns to hide

				],
				headers : [ 				// headers for table
					"ID",
					"Title",
					"Description",
					"Original File",
					"Parsed File",
					"Owner"
				],
				templates : { 				// html template functions

					"id" : function(value) {
						var temp = '0000' + value;
						return temp.slice(-4);
					},

					"owner" : function(value) {
						var r = jApp.aG().currentRow;
						return ( typeof r.owner !== 'undefined' ) ? r.owner.username : '';
					},

				},
			})
		})
	}
});
