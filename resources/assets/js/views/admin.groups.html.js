// extend the application views
_.extend( jApp.views.admin, {
	
	groups : function() {
		
		_.extend( jApp.oG.admin, {
			
			groups : new jGrid({
			
				table : 'group',
				dbView : 'vw_GroupContact',		// db table
				pkey : 'GroupID',			// Primary Key Of Table
				tableFriendly : 'Group',
				columnFriendly : 'GroupName',
				gridHeader : {
					icon : 'fa-users',
					headerTitle : 'Manage Groups',
					helpText : "<strong>Note:</strong> Groups organize users by functional group and control permissions. \
								<a href='admin/users.html' data-script='true' class='ajaxy ajaxy-view'>Manage Users <i class='fa fa-arrow-right fa-fw'></i></a> "
				},
				tableBtns : {
					new : {
						label : 'New Group',
					},
				},
				rowBtns : {
					custom : {
						//resetPassword : { type : 'button', class : 'btn btn-warning', icon : 'fa-refresh', label : '', fn : 'resetPassword'  } // etc.
					}
				},
				columns : [ 				// columns to query
					"GroupID",
					"GroupName",
					"ContactNames",
				],
				hidCols : [					// columns to hide
					"UserIDs",
					"GroupIDs",
					"ManagerID"
				],
				headers : [ 				// headers for table
					"ID",
					"Name",
					"Members",
				],	
				templates : { 				// html template functions
					
					"GroupID" : function(value) { 
						var temp = '0000' + value;
						return temp.slice(-4);
					}, 
					
				},
				linkTables : [
					{ tables : { parent : 'Group', child : 'Contact' }, childFriendlyName : 'FullName' },
					//{ tables : { parent : 'Group', child : 'Project' }, childFriendlyName : 'ProjectName' },
				],
				sortBy : 'GroupName',			// column to sort by
				rowsPerPage : 10,			// rows per page to display on grid
				pageNum	: 1,				// current page number to display	
			})
		})
	}
});