/**
 * admin.operatingSystems.html.js
 *
 * operating systems view definition
 */
;(function(jApp) {
	/**
	 * Setup the form fields
	 */
	var fieldset_1__fields = [
		{
			name : 'name',
			placeholder : 'A unique name',
			required : true,
			_label : 'Enter the name of the Document.',
			'data-validType' : 'Anything'
		},
		{
			name : 'description',
			type : 'textarea',
			_label : 'Description',
		},
		{
			name : 'original_file',
			type : 'file',
			_label : 'Upload XML File',
		},
		{
			name : 'person_id',
			type : 'select',
			_label : 'Document Owner',
			_firstlabel : '-Choose-',
			_firstoption : null,
			_labelssource : 'Person.name',
			_optionssource : 'Person.id',
			required : true,
			'data-validType' : 'select'
		},
		{
			name : 'tags',
      _label : 'Tags',
			type : 'tokens',
			_optionssource : 'Tag.id',
			_labelssource : 'Tag.name',
      multiple : true
		},
	];

	/**
	 * Add the view
	 */
	jApp.addView('documents',
	{
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

			"owner" : function(value) {
				var r = jApp.aG().currentRow;
				return _.get('name',r.owner,'fa-male','Person');
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
				return  "<a title=\"" + value + "\" href=\"documents/" + r.id + "/pdf\" target=\"_blank\">" + v + '</a>';
			},

		},
	},
		[ // colparams
				{ // fieldset
					label : 'Details',
					helpText : 'Please fill out the form',
					class : 'col-lg-3',
					fields : fieldset_1__fields
				},
		]
	)
})(jApp);
