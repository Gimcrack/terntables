// extend the application views
_.extend( jApp.views, {

	resources : function() {

		_.extend( jApp.oG, {

			resources : new jGrid({
				table : 'resources',
				model : 'Resource',
				columnFriendly : 'name',
				gridHeader : {
					icon : 'fa-cube',
					headerTitle : 'Manage Training Resources',
					helpText : "<strong>Note:</strong> Assign Training Resources to Collections."
				},
				rowBtns : {
					btnAttachments : {
						icon : 'fa-paperclip',
						'data-multiple' : false,
						'data-permission' : 'update_enabled',
						type : 'button',
						class : 'btn btn-primary',
						label : 'Manage Attachments ...',
						fn : 'manageAttachments'
					}
				},
				columns : [ 				// columns to query
					"id",
					"name",
					"description",
					"org",
					"collections",
					"attachments",
					"tags"
				],

				headers : [ 				// headers for table
					"ID",
					"Name",
					"Description",
					"Parent Org",
					"Training Collections",
					"Attachments",
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

					"attachments" : function( arr ) {
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
				html : {
					forms : {
						manageAttachments : '<div id="div_resetFrm" class="div-btn-reset min div-form-panel-wrapper"> <div class="frm_wrapper"> <div class="panel panel-yellow"> <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-refresh fa-fw"></i> Reset Password </div> <div class="panel-overlay" style="display:none"></div> <div class="panel-body"> <div class="row side-by-side formContainer"></div> </div> </div> </div> </div>'
					},
				},
				formDefs : {
					manageAttachments : {
						table : 'User',
						pkey : 'id',
						tableFriendly : 'User Password',
						atts : { method : 'PATCH' },
						fieldset : {
							'legend' : 'Reset Password',
						},
						loadExternal : false,
						colParams : [
							{ type : 'hidden', readonly : 'readonly', name : 'ContactID' },
							{ type : 'password', name : 'Password1', id : 'Password1', required : 'required', 'data-validType' : 'min>=6', _label : 'New Password', placeholder : '******' },
							{ type : 'password', name : 'Password2', id : 'Password2', required : 'required', 'data-validType' : 'field==#Password1', _label : 'Confirm Password', placeholder : '******' },
						],
					}
				},
				fn : {
					manageAttachments : function() {
						alert('coming soon');
						//jUtility.actionHelper('resetPassword');
					}, //end fn
				}
			})
		})
	}
});
