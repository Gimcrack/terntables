// extend the application views
_.extend( jApp.views.admin, {
	
	modules : function() {
		
		_.extend( jApp.oG.admin, {
			
			modules : new jGrid({
			
				table : 'Module',
				dbView : 'vw_ModuleContact',		// db table
				pkey : 'ModuleID',			// Primary Key Of Table
				tableFriendly : 'Module',
				columnFriendly : 'ModuleName',
				gridHeader : {
					icon : 'fa-cube',
					headerTitle : 'Manage Modules',
					helpText : "<strong>Note:</strong> \
						Modules divide the site into functional components. \
							"
				},
				tableBtns : {
					new : {
						label : 'New Module',
					},
				},
				columns : [ 				// columns to query
					"ModuleID",
					"ModuleName",
					"Description",
					"ContactNames"
				],
				hidCols : [					// columns to hide
					
				],
				headers : [ 				// headers for table
					"ID",
					"Module Name",
					"Description",
					"Users",
				],	
				templates : { 				// html template functions
					
					"ModuleID" : function(value) { 
						var temp = '0000' + value;
						return temp.slice(-4);
					}, 
					
				},
				linkTables : [
					{ tables : { parent : 'Module', child : 'Contact' }, childFriendlyName : 'FullName' },
					//{ tables : { parent : 'Server', child : 'Contact' }, childFriendlyName : 'FullName' },
					//{ tables : { parent : 'Database', child : 'Application' }, childFriendlyName : 'ApplicationName' },
				],
				sortBy : 'ModuleName',	// column to sort by
				rowsPerPage : 10,			// rows per page to display on grid
				pageNum	: 1,				// current page number to display	
			})
	
		})
	}
});