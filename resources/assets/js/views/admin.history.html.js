// // extend the application views
// _.extend( jApp.views.admin, {
//
// 	history : function() {
//
// 		_.extend( jApp.oG.admin, {
//
// 			history : new jGrid({
//
// 				table : 'AuditHistory',
// 				dbView : 'vw_AuditHistory',		// db table
// 				schema : 'admin',
// 				pkey : 'TimeStamp',			// Primary Key Of Table
// 				tableFriendly : 'History',
// 				columnFriendly : 'TimeStamp',
// 				gridHeader : {
// 					icon : 'fa-calendar',
// 					headerTitle : 'View Audit History',
// 					//helpText : false,
// 				},
// 				toggles : {
// 					new : false,
// 					edit : false,
// 					del : false,
// 					editable : false,
// 					ellipses : false,
// 				},
// 				columns : [ 				// columns to query
// 					"TimeStamp",
// 					"ContactName",
// 					"QueryAction",
// 					"TableName",
// 					"PkeyID",
// 					"FormattedChangeSummary",
// 				],
// 				hidCols : [					// columns to hide
//
// 				],
// 				headers : [ 				// headers for table
// 					"TS",
// 					"Contact",
// 					"Action",
// 					"Table",
// 					"Record ID",
// 					"Changes",
// 				],
// 				templates : { 				// html template functions
//
// 					"TimeStamp" : function(value) {
// 						return value.slice(0,-8);
// 					},
//
// 					/*
// 					"ChangeSummary" : function(value) {
// 						return value.replace(/\n/gi,"<br>");
// 					} */
//
// 				},
// 				sortBy : 'TimeStamp',	// column to sort by
// 				rowsPerPage : 10,			// rows per page to display on grid
// 				pageNum	: 1,				// current page number to display
// 			})
//
// 		})
// 	}
// });
