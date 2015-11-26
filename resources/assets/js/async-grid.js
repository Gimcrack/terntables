/**
 *  jApp.class.js - Custom Grid App container
 *
 *
 *  Defines the properties and methods of the
 *  custom app class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 */

'use strict';

;(function (window) {

  var jApp = function jApp() {

    var self = this;

    this.debug = true;

    if (this.debug) {
      console.warn('DEBUG MODE ON ');
      $.jStorage.flush();
    }

    this.oG = {
      admin: {}
      // extend this oG object with the individual page grid objects
    };

    this.views = {
      //extend this views object with individual page views
      admin: {}
    };

    this.grids = {
      admin: {}
    };

    this.activeGrid = {};

    this.openForms = [];

    /**
     * Placeholder for the colparams object
     * @type {Object}
     */
    this.colparams = {};

    /**
     * Convenience function to access the active grid object
     * @method function
     * @return {[type]} [description]
     */
    this.aG = function () {
      return this.activeGrid;
    };

    /**
     * Get the table from the corresponding model
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    this.model2table = function (model) {

      var RuleExceptions = {
        Person: 'people'
      };

      return RuleExceptions[model] == null ? (model + 's').toLowerCase() : RuleExceptions[model];
    };

    /**
     * Convenience function to access the $grid object
     * in the active grid
     * @method function
     * @return {[type]} [description]
     */
    this.tbl = function () {
      return this.activeGrid.DOM.$grid;
    };

    /**
     * Convenience function to access the options
     * of the active grid
     * @method function
     * @return {[type]} [description]
     */
    this.opts = function () {
      return this.activeGrid.options;
    };

    this.log = function (msg, force) {
      if (!!self.debug || !!self.force) {
        console.log(msg);
      }
    };
  };

  window.jApp = jApp;
})(window);

var jApp = new jApp();

/**
 *  jUtility.class.js - Custom Data Grid JS utility class
 *
 *  Contains helper functions used by jGrid
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, jApp
 *
 */

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
};

;(function (window, $, jApp) {

  'use strict';

  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if ($(this).prop('disabled')) return false;

      if (!!$(this).attr('data-tokens')) {
        jApp.log($(this).tokenInput("get"));
        return o[this.name] = _.pluck($(this).tokenInput("get"), 'name');
      }

      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  var jUtility = {

    /**
     * Set AJAX Defaults
     * @method function
     * @return {[type]} [description]
     */
    setAjaxDefaults: function setAjaxDefaults() {
      $.ajaxSetup({
        headers: {
          'X-XSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });
      jApp.log('4.1 Ajax Defaults Set');
    }, // end fn

    /**
     * Get the default grid options
     * @method function
     * @return {[type]} [description]
     */
    getDefaultOptions: function getDefaultOptions() {
      /**
       * Default Options
       * @type {Object}
       */
      return {

        /**
         * Form Definitions
         */
        formDefs: {},

        /**
         * Event Bindings
         * @type {Object}
         */
        bind: {},

        /**
         * Function definitions
         * @type {Object}
         */
        fn: {},

        /**
         * Toggles - true/false switches
         * @type {Object}
         */
        toggles: {

          /**
           * Data is editable
           * @type {Boolean} default true
           */
          editable: true,

          /**
           * Show the 'new' button
           * @type {Boolean} default true
           */
          'new': true,

          /**
           * Show the 'edit' button
           * @type {Boolean} default true
           */
          edit: true,

          /**
           * Show the 'delete' buton
           * @type {Boolean} default true
           */
          del: true,

          /**
           * Show the sort buttons above each header
           * @type {Boolean} default true
           */
          sort: true,

          /**
           * Autoupdate the grid data automatically
           * @type {Boolean} default true
           */
          autoUpdate: true,

          /**
           * Auto-paginate the grid data
           * @type {Boolean} default true
           */
          paginate: true,

          /**
           * Enable the filter text boxes above each header
           * @type {Boolean} default true
           */
          headerFilters: true,

          /**
           * Display the header filters above each header
           */
          displayHeaderFilters: false,

          /**
           * Collapse the row menu
           * @type {Boolean} default true
           */
          collapseMenu: true,

          /**
           * Cache the grid data for faster load times
           * @type {Boolean} default false
           */
          caching: false,

          /**
           * Show the ellipsis ... and readmore buttons
           * @type {Boolean} default true
           */
          ellipses: true,

          /**
           * Checkout records before editing
           * @type {Boolean} default true
           */
          checkout: true,

          /**
           * Close form window after saving
           * @type {Boolean} default true
           */
          closeOnSave: true,

          /**
           * remove all rows when updating data
           * @type {Boolean}
           */
          removeAllRows: false
        },

        /**
         * General Grid Options
         */

        /**
         * If jApp.opts().toggles.autoUpdate, interval to autorefresh data in ms
         * @type {Number} default 602000
         */
        refreshInterval: 602000,

        /**
         * jQuery DOM target
         * @type {String} default '.table-responsive'
         */
        target: '.table-responsive', // htmlTable target

        /**
         * Data request options
         */

        /**
         * URL of JSON resource (grid data)
         * @type {String}
         */
        url: jApp.opts().runtimeParams.table + '/json', // url of JSON resource

        /**
         * Database table name of grid data
         * @type {String}
         */
        table: '', // db table (for updates / inserts)

        /**
         * Primary key of table
         * @type {String}
         */
        pkey: 'id',

        /**
         * Where clause of data query
         * @type {String}
         */
        filter: '', // where clause for query

        /**
         * db columns to show
         * @type {Array}
         */
        columns: [], // columns to query

        /**
         * Friendly headers for db columns
         * @type {Array}
         */
        headers: [], // headers for table

        /**
         * Data Presentation options
         */

        /**
         * Pagination - Rows per page
         * @type {Number} default 10
         */
        rowsPerPage: 10,

        /**
         * Pagination - Starting page number
         * @type {Number} default 1
         */
        pageNum: 1,

        /**
         * The friendly name of the table e.g. Users
         * @type {String}
         */
        tableFriendly: '', // friendly name of table

        /**
         * The column containing the friendly name of each row e.g. username
         * @type {String}
         */
        columnFriendly: '', // column containing friendly name of each row

        /**
         * The text shown when deleting a record
         * @type {String}
         */
        deleteText: 'Deleting',

        /**
         * html attributes to apply to individual columns
         * @type {Array}
         */
        cellAtts: [], // column attributes

        /**
         * html templates
         * @type {Array}
         */
        templates: [], // html templates

        /**
         * Max cell length in characters, if toggles.ellipses
         * @type {Number} default 38
         */
        maxCellLength: 38,

        /**
         * Max column length in pixels
         * @type {Number} default 450
         */
        maxColWidth: 450,

        /**
         * Bootstrap Multiselect Default Options
         * @type {Object}
         */
        bsmsDefaults: {
          //buttonContainer : '<div class="btn-group" />',
          enableCaseInsensitiveFiltering: true,
          includeSelectAllOption: true,
          maxHeight: 185,
          numberDisplayed: 1,
          dropUp: true
        },

        /**
         * Header Options
         * @type {Object}
         */
        gridHeader: {
          icon: 'fa-dashboard',
          headerTitle: 'Manage',
          helpText: false
        },

        /**
         * Disabled Form Elements - e.g. password
         * @type {Array}
         */
        disabledFrmElements: [],

        /**
         * Table buttons appear in the table menu below the header
         * @type {Object}
         */
        tableBtns: {

          tableMenu: {
            type: 'button',
            'class': 'btn btn-success btn-tblMenu',
            id: 'btn_table_menu_heading',
            icon: 'fa-table',
            label: '&nbsp;',
            'data-order': 0
          },

          /**
           * Refresh Button
           * @type {Object}
           */
          refresh: {
            type: 'button',
            name: 'btn_refresh_grid',
            'class': 'btn btn-success btn-refresh',
            icon: 'fa-refresh',
            label: 'Refresh',
            'data-order': 1
          },

          /**
           * New Button
           * @type {Object}
           */
          'new': {
            type: 'button',
            'class': 'btn btn-success btn-new',
            id: 'btn_edit',
            icon: 'fa-plus-circle',
            label: 'New',
            'data-permission': 'create_enabled',
            'data-order': 2
          },

          /**
           * Header Filters Button
           * @type {Object}
           */
          headerFilters: {
            type: 'button',
            'class': 'btn btn-success btn-headerFilters btn-toggle',
            id: 'btn_toggle_header_filters',
            icon: 'fa-filter',
            label: 'Filter Rows',
            'data-order': 3
          },

          /**
           * Define custom buttons here. Custom buttons may also be defined at runtime.
           * @type {Object}
           */
          custom: {
            // visColumns : [
            //   { icon : 'fa-bars fa-rotate-90', label : ' Visible Columns' },
            // ],

          },

          /**
           * Table status
           * @type {Object}
           */
          tableStatus: {
            type: 'button',
            'class': 'btn btn-tableStatus',
            id: 'btn_table_status',
            icon: '',
            label: '',
            'data-order': 9999
          }
        },

        /**
         * Row buttons appear in each row of the grid
         * @type {Object}
         */
        rowBtns: {

          /**
           * The row menu heading. Displayed when an item is checked.
           * @type {Object}
           */
          rowMenu: {
            type: 'button',
            'class': 'btn btn-primary btn-rowMenu',
            id: 'btn_row_menu_heading',
            icon: 'fa-check-square-o',
            label: '&nbsp;'
          },

          /**
           * Clear Selected Button
           * @type {Object}
           */
          clearSelected: {
            type: 'button',
            'class': 'btn btn-primary btn-clear',
            id: 'btn_clear',
            icon: 'fa-square-o',
            label: 'Clear Selection'
          },

          /**
           * Edit Button
           * @type {Object}
           */
          edit: {
            type: 'button',
            'class': 'btn btn-primary btn-edit',
            id: 'btn_edit',
            icon: 'fa-pencil',
            label: 'Edit ...',
            'data-permission': 'update_enabled',
            'data-multiple': false
          },

          /**
           * Delete Button
           * @type {Object}
           */
          del: {
            type: 'button',
            'class': 'btn btn-primary btn-delete',
            id: 'btn_delete',
            icon: 'fa-trash-o',
            label: 'Delete ...',
            //title : 'Delete Record ...',
            'data-permission': 'delete_enabled'
          },

          /**
           * Define custom buttons here. Custom buttons may also be defined at runtime.
           * @type {Object}
           */
          custom: {
            //custom : { type : 'button' } // etc.
          }
        },

        /**
         * With Selected Buttons appear in the dropdown menu of the header
         * @type {Object}
         */
        withSelectedBtns: {

          /**
           * Delete Selected ...
           * @type {Object}
           */
          del: {
            type: 'button',
            'class': 'li-red',
            id: 'btn_delete',
            icon: 'fa-trash-o',
            label: 'Delete Selected ...',
            fn: 'delete',
            'data-permission': 'delete_enabled'
          },

          /**
           * Define custom buttons here. Custom buttons may also be defined at runtime.
           * @type {Object}
           */
          custom: {
            //custom : { type : 'button' } // etc.
          }
        },

        /**
         * linktables define the relationships between tables
         * @type {Array}
         */
        linkTables: []

      }; // end defaults
    }, // end fn

    arrayAddRow: function arrayAddRow() {
      var $btn = $(this),
          $container = $(this).closest('.array-field-container'),
          $table = $(this).closest('.table'),
          $tr = $(this).closest('tr'),
          params = $container.data('colparams'),
          $tr_new = jUtility.oCurrentForm().fn.populateFieldRow(params);

      if (params.max != null && +$table.find('tr').length - 1 === params.max) {
        return jUtility.msg.warning('This field requires at most ' + params.max + ' selections.');
      }

      $table.find('.btn-array-add').remove();

      $table.append($tr_new);

      // rename inputs so they all have unique names
      // $table.find('tr').each( function( i, elm ) {
      //   $(elm).find(':input').each( function(ii, ee) {
      //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
      //   });
      // });

      jUtility.formBootup();
    }, // end fn

    arrayRemoveRow: function arrayRemoveRow() {
      var $btn = $(this),
          $container = $(this).closest('.array-field-container'),
          $table = $(this).closest('.table'),
          $tr = $(this).closest('tr'),
          params = $container.data('colparams'),
          $btn_add = $table.find('.btn-array-add').detach();

      if (params.min != null && +$table.find('tr').length - 1 === params.min) {
        $table.find('tr:last-child').find('td:last-child').append($btn_add);
        return jUtility.msg.warning('This field requires at least ' + params.min + ' selections.');
      }

      $tr.remove();

      // rename inputs so they all have unique names
      // $table.find('tr').each( function( i, elm ) {
      //   $(elm).find(':input').each( function(ii, ee) {
      //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
      //   });
      // });

      $table.find('tr:last-child').find('td:last-child,th:last-child').append($btn_add);
    }, // end fn

    /**
     * Get users permissions
     * @method function
     * @return {[type]} [description]
     */
    getPermissions: function getPermissions(model) {
      model = model != null ? model : jApp.opts().model;

      var storeKey = model + '_permissions';

      if (!!$.jStorage.get(storeKey, false)) {
        return jUtility.callback.getPermissions($.jStorage.get(storeKey));
      }

      jApp.log('0.1 - Getting Permissions from server');

      var requestOptions = {
        url: '/getPermissions/' + model,
        success: function success(response) {
          $.jStorage.set(storeKey, response, { TTL: 60000 * 60 * 24 });
          jApp.log($.jStorage.getTTL(storeKey));

          jUtility.callback.getPermissions(response);
          jUtility.buildMenus();
        }
      };

      jApp.log(requestOptions.url);

      jUtility.getJSON(requestOptions);
    }, // end fn

    /**
     * Check permission on the button parameters
     * @method function
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    isPermission: function isPermission(params) {
      if (params['data-permission'] == null) return true;
      return !!jApp.activeGrid.permissions[params['data-permission']];
    }, // end fn

    /**
     * Calculate where the grid should be positioned
     * @return {[type]} [description]
     */
    calculateGridPosition: function calculateGridPosition() {
      if (typeof $('.colHeaders').offset() === 'undefined') {
        return false;
      };
      return {
        marginTop: +$('.colHeaders').height() + $('.colHeaders').offset().top,
        height: +$(window).height() - 95 - $('.colHeaders').offset().top
      };
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   withSelected
     *  @action - The action to perform
     *
     *  When one or more rows are checked,
     *  this defines the various options
     *  that are available and the actions
     *  that are performed.
     **  **  **  **  **  **  **  **  **  **/
    withSelected: function withSelected(action, callback) {
      console.log('clicked');
      !!jUtility.numInvisibleItemsChecked() ? jUtility.confirmInvisibleCheckedItems(action, callback) : jUtility.withSelectedAction(action, callback, true);
    }, // end fn

    /**
     * With selected actions
     * @param  {[type]}   action   [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   $cid     [description]
     * @return {[type]}            [description]
     */
    withSelectedAction: function withSelectedAction(action, callback, includeHidden) {
      var $cid = jUtility.getCheckedItems(includeHidden);

      if (!$cid.length) {
        return jUtility.msg.warning('Nothing selected.');
      }

      switch (action) {
        // DELETE SELECTED
        case 'delete':
          jApp.aG().action = 'withSelectedDelete';
          bootbox.confirm("Are you sure you want to delete " + $cid.length + " items?", function (response) {
            if (!!response) {
              jUtility.postJSON({
                url: jUtility.getCurrentFormAction(),
                success: jUtility.callback.submitCurrentForm,
                data: { '_method': 'delete', 'ids[]': $cid }
              });
            }
          });
          break;

        case 'custom':
          return typeof callback === 'function' ? callback($cid) : console.warn('callback is not a valid function');
          break;

        default:
          console.warn(action + ' is not a valid withSelected action');
          break;
      }
    }, //end fn

    /**
     * Get the action of the current form
     * @method function
     * @return {[type]} [description]
     */
    getCurrentFormAction: function getCurrentFormAction() {
      switch (jApp.aG().action) {
        case 'edit':
        case 'delete':
          return jApp.opts().table + '/' + jUtility.getCurrentRowId();
          break;

        case 'withSelectedDelete':
          return jApp.opts().table;
          break;

        case 'withSelectedUpdate':
          return jApp.opts().table + '/massUpdate';
          break;

        case 'resetPassword':
          return 'resetPassword/' + jUtility.getCurrentRowId();
          break;

        default:
          return jUtility.oCurrentForm().options.table; //jApp.opts().table;
          break;
      }
    }, // end fn

    /**
     * [function description]
     * @method function
     * @param  {[type]} action [description]
     * @return {[type]}        [description]
     */
    actionHelper: function actionHelper(action) {
      jApp.aG().action = action;
      if (jUtility.needsCheckout()) {
        jUtility.checkout(jUtility.getCurrentRowId());
      } else {
        jUtility.setupFormContainer();
      }
    }, // end fn

    /**
     * Clear the current form
     * @method function
     * @return {[type]} [description]
     */
    resetCurrentForm: function resetCurrentForm() {
      try {
        jUtility.$currentForm().clearForm();
        jUtility.$currentForm().find(':input:not("[type=button]"):not("[type=submit]"):not("[type=reset]"):not("[type=radio]"):not("[type=checkbox]")').each(function (i, elm) {
          if (!!$(elm).attr('data-static')) {
            return false;
          }

          //$(elm).data("DateTimePicker").remove();
          $(elm).val('');
          if ($(elm).hasClass('bsms')) {
            $(elm).data('jInput').fn.multiselect();
            $(elm).multiselect('refresh');
          }
        });
      } catch (e) {
        console.warn(e);
        return false;
      }
    }, // end fn

    /**
     * Refresh and rebuild the current form
     * @method function
     * @return {[type]} [description]
     */
    refreshCurrentForm: function refreshCurrentForm() {
      jApp.aG().store.flush();
      jUtility.oCurrentForm().fn.getColParams();
    }, // end fn

    /**
     * Maximize the current form
     * @method function
     * @return {[type]} [description]
     */
    maximizeCurrentForm: function maximizeCurrentForm() {
      try {

        if (jApp.openForms.length) {
          jApp.openForms.last().wrapper.find('button').prop('disabled', true);
        }

        jApp.openForms.push({
          wrapper: jUtility.$currentFormWrapper().addClass('max'),
          obj: jUtility.oCurrentForm(),
          $: jUtility.$currentForm(),
          action: jApp.aG().action,
          model: jUtility.oCurrentForm().model
        });
      } catch (e) {
        console.warn(e);
        return false;
      }
    }, // end fn

    /**
     * Close the current form
     * @method function
     * @return {[type]} [description]
     */
    closeCurrentForm: function closeCurrentForm() {
      try {
        var oTgt = jApp.openForms.pop();

        jApp.aG().action = jApp.openForms.length ? jApp.openForms.last().action : '';

        jUtility.msg.clear();

        oTgt.wrapper.removeClass('max').find('.formContainer').css('height', '');
        oTgt.$.clearForm();

        if (!jApp.openForms.length) {
          jUtility.turnOffOverlays();
        } else {

          jApp.openForms.last().wrapper.find('button').prop('disabled', false).end().find('.btn-refresh').trigger('click');
        }
      } catch (ignore) {}
    }, // end fn

    /**
     * Set focus on the current form
     * @method function
     * @return {[type]} [description]
     */
    setCurrentFormFocus: function setCurrentFormFocus() {
      jUtility.$currentFormWrapper().find(":input:not([type='hidden']):not([type='button'])").eq(0).focus();
    }, // end fn

    /**
     * Get the current form row data for the current row
     * @method function
     * @return {[type]} [description]
     */
    getCurrentFormRowData: function getCurrentFormRowData() {
      if (jApp.aG().action === 'new') return false;
      var url = jUtility.getCurrentRowDataUrl();

      jUtility.oCurrentForm().fn.getRowData(url, jUtility.callback.updateDOMFromRowData);
    }, //end fn

    /**
     * Get the data url of the current row
     * @method function
     * @return {[type]} [description]
     */
    getCurrentRowDataUrl: function getCurrentRowDataUrl() {
      if (typeof jApp.opts().rowDataUrl !== 'undefined') {
        return jApp.opts().rowDataUrl;
      }
      return jApp.opts().table + '/' + jUtility.getCurrentRowId() + '/json';
    }, //end fn

    /**
     * Toggle a button to prevent it being clicked multiple times
     * @method function
     * @return {[type]} [description]
     */
    toggleButton: function toggleButton($btn) {
      if ($btn.prop('disabled')) {
        $btn.prop('disabled', false).removeClass('disabled').html($btn.attr('data-original-text'));
      } else {
        $btn.attr('data-original-text', $btn.html()).prop('disabled', true).addClass('disabled').html('<i class="fa fa-spinner fa-pulse"></i>');
      }
    }, // end fn

    /**
     * Submit the current form
     * @method function
     * @return {[type]} [description]
     */
    submitCurrentForm: function submitCurrentForm($btn) {
      var requestOptions = {
        url: jUtility.getCurrentFormAction(),
        data: jUtility.oCurrentForm().fn.getFormData(),
        success: jUtility.callback.submitCurrentForm,
        //fail : console.warn,
        always: function always() {
          jUtility.toggleButton($btn);
        }
      };

      jUtility.msg.clear();

      if (!!jUtility.$currentForm()) {
        var oValidate = new validator(jUtility.$currentForm());
        if (oValidate.errorState) {
          return false;
        }
      }

      // turn off the button to avoid multiple clicks;
      jUtility.toggleButton($btn);

      jUtility.postJSON(requestOptions);
    }, // end fn

    /**
     * Save the current form and leave open
     * @method function
     * @return {[type]} [description]
     */
    saveCurrentForm: function saveCurrentForm() {
      jApp.opts().closeOnSave = false;
      jUtility.submitCurrentForm($(this));
    }, // end fn

    /**
     * Save the current form and close
     * @method function
     * @return {[type]} [description]
     */
    saveCurrentFormAndClose: function saveCurrentFormAndClose() {

      jApp.opts().closeOnSave = true;
      jUtility.submitCurrentForm($(this));
      //jUtility.toggleRowMenu;
    }, // end fn

    /**
     * Kill pending ajax request
     * @method function
     * @param  {[type]} requestName [description]
     * @return {[type]}             [description]
     */
    killPendingRequest: function killPendingRequest(requestName) {
      try {
        jApp.aG().dataGrid.requests[requestName].abort();
      } catch (e) {
        // nothing to abort
      }
    }, //end fn

    /**
     * Set instance options
     * @method function
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    setOptions: function setOptions(options) {
      jApp.aG().options = $.extend(true, jApp.opts(), options);
      jApp.log('1.1 Options Set');
      return jApp.aG();
    }, //end fn

    /**
     * Set up the visible columns menu for the table menu
     * @method function
     * @return {[type]} [description]
     */
    setupVisibleColumnsMenu: function setupVisibleColumnsMenu() {
      if (typeof jApp.aG().temp.visibleColumnsMenuSetup === 'undefined' || jApp.aG().temp.visibleColumnsMenuSetup === false) {
        // visible columns
        _.each(jApp.opts().columns, function (o, i) {
          if (i < jApp.opts().headers.length) {
            jApp.opts().tableBtns.custom.visColumns.push({
              icon: 'fa-check-square-o',
              label: jApp.opts().headers[i],
              fn: function fn() {
                jUtility.DOM.toggleColumnVisibility($(this));
              }, 'data-column': o
            });
          }
        });

        jApp.aG().temp.visibleColumnsMenuSetup = true;
      } else {
        return false;
      }
    }, //end fn

    /**
     * Does the form need confirmation
     * @method function
     * @return {[type]} [description]
     */
    isConfirmed: function isConfirmed() {
      var conf = jUtility.$currentFormWrapper().find('#confirmation');
      if (!!conf.length && conf.val().toString().toLowerCase() !== 'yes') {
        jUtility.msg.warning('Type yes to continue');
        return false;
      }
      return true;
    }, //end fn

    /**
     * Initialize scrollbar
     * @method function
     * @return {[type]} [description]
     */
    initScrollbar: function initScrollbar() {
      $('.table-grid').perfectScrollbar();
    }, //end fn

    /**
     * Is autoupdate enabled
     * @method function
     * @return {[type]} [description]
     */
    isAutoUpdate: function isAutoUpdate() {
      return !!jApp.opts().toggles.autoUpdate;
    }, //end fn

    /**
     * Is data caching enabled
     * @method function
     * @return {[type]} [description]
     */
    isCaching: function isCaching() {
      return !!jApp.opts().toggles.caching;
    }, // end fn

    /**
     * Is record checkout enabled
     * @method function
     * @return {[type]} [description]
     */
    isCheckout: function isCheckout() {
      return !!jApp.opts().toggles.checkout && jUtility.isEditable();
    }, // end fn

    /**
     * Is the grid data editable
     * @method function
     * @return {[type]} [description]
     */
    isEditable: function isEditable() {
      return !!jApp.opts().toggles.editable;
    }, //end fn

    /**
     * Are ellipses enabled
     * @method function
     * @return {[type]} [description]
     */
    isEllipses: function isEllipses() {
      return !!jApp.opts().toggles.ellipses;
    }, // end fn

    /**
     * Is a form container maximized
     * @method function
     * @return {[type]} [description]
     */
    isFormOpen: function isFormOpen() {
      return !!jApp.aG().$().find('.div-form-panel-wrapper.max').length;
    }, // end fn

    /**
     * Is pagination enabled
     * @method function
     * @return {[type]} [description]
     */
    isPagination: function isPagination() {
      return !!jApp.opts().toggles.paginate;
    }, // end fn

    /**
     * Is sorting by column enabled
     * @method function
     * @return {[type]} [description]
     */
    isSort: function isSort() {
      return !!jApp.opts().toggles.sort;
    }, // end fn

    /**
     * Is toggle mine enabled
     * @method function
     * @return {[type]} [description]
     */
    isToggleMine: function isToggleMine() {
      return window.location.href.indexOf('/my') !== -1;
    }, // end fn

    /**
     * Is header filters enabled
     * @method function
     * @return {[type]} [description]
     */
    isHeaderFilters: function isHeaderFilters() {
      return !!jApp.opts().toggles.headerFilters;
    }, // end fn

    /**
     * Are header filters currently displayed
     * @method function
     * @return {[type]} [description]
     */
    isHeaderFiltersDisplay: function isHeaderFiltersDisplay() {
      return !!jApp.opts().toggles.headerFiltersDisplay;
    }, // end fn

    /**
     * Is the button with name 'key' enabled
     * @method function
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    isButtonEnabled: function isButtonEnabled(key) {
      return typeof jApp.opts().toggles[key] === 'undefined' || !!jApp.opts().toggles[key];
    }, //end fn

    /**
     * Is data cache available
     * @method function
     * @return {[type]} [description]
     */
    isDataCacheAvailable: function isDataCacheAvailable() {
      return jUtility.isCaching() && !!jApp.aG().store.get('data_' + jApp.opts().table, false);
    }, // end fn

    /**
     * Are there errors in the response
     * @method function
     * @return {[type]} [description]
     */
    isResponseErrors: function isResponseErrors(response) {
      return typeof response.errors !== 'undefined' && !!response.errors;
    }, // end fn

    /**
     * Does the form exist
     * @param  {[type]} key [description]
     * @return {[type]}          [description]
     */
    isFormExists: function isFormExists(key) {
      return typeof jApp.aG().forms['$' + key] !== 'undefined' || typeof jApp.aG().forms['o' + key.ucfirst()] !== 'undefined' || typeof jApp.aG().forms[key] !== 'undefined';
    }, // end fn

    /**
     * Get error message from response
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getErrorMessage: function getErrorMessage(response) {
      return typeof response.message !== 'undefined' ? response.message : 'There was a problem completing your request.';
    }, //end fn

    /**
     * The row needs to be checked out
     * @method function
     * @return {[type]} [description]
     */
    needsCheckout: function needsCheckout() {
      return jUtility.isCheckout() && (jApp.aG().action === 'edit' || jApp.aG().action === 'delete');
    }, //end fn

    /**
     * The row needs to be checked in
     * @method function
     * @return {[type]} [description]
     */
    needsCheckin: function needsCheckin() {
      return jUtility.needsCheckout();
    }, //end fn

    /**
     * Get current row id
     * @method function
     * @return {[type]} [description]
     */
    getCurrentRowId: function getCurrentRowId() {
      return jUtility.getCheckedItems(true);
    }, //end fn

    /**
     * Display unload warning if a form is open
     * @method function
     * @return {[type]} [description]
     */
    unloadWarning: function unloadWarning() {
      if (jUtility.isFormOpen()) {
        return 'You have unsaved changes.';
      }
    }, // end fn

    /**
     * Update the total pages of the grid
     * @method function
     * @return {[type]} [description]
     */
    updateTotalPages: function updateTotalPages() {
      jApp.aG().dataGrid.pagination.totalPages = Math.ceil(jApp.aG().dataGrid.data.length / jApp.aG().dataGrid.pagination.rowsPerPage);
    }, // end fn

    /**
     * Update pagination of the grid
     * @method function
     * @return {[type]} [description]
     */
    updatePagination: function updatePagination() {
      //pagination
      if (jUtility.isPagination()) {
        jUtility.updateTotalPages();
        jUtility.setupBootpag();
        jUtility.setupRowsPerPage();
      } else {
        jUtility.hideBootpag();
      }
    }, // end fn

    /**
     * Setup bootpag pagination controls
     * @method function
     * @return {[type]} [description]
     */
    setupBootpag: function setupBootpag() {
      jApp.tbl().find('.paging').empty().show().bootpag({
        total: jApp.aG().dataGrid.pagination.totalPages,
        page: jApp.opts().pageNum,
        maxVisible: 20
      }).on("page", function (event, num) {
        jUtility.DOM.page(num);
      });
    }, // end fn

    /**
     * setup/update rows per page controls
     * @method function
     * @return {[type]} [description]
     */
    setupRowsPerPage: function setupRowsPerPage() {
      jApp.tbl().find('[name=RowsPerPage]').off('change.rpp').on('change.rpp', function () {
        jApp.tbl().find('[name=RowsPerPage]').val($(this).val());
        jUtility.DOM.rowsPerPage($(this).val());
      }).parent().show();
    }, // end fn

    /**
     * Hide bootpag pagination controls
     * @method function
     * @return {[type]} [description]
     */
    hideBootpag: function hideBootpag() {
      jApp.tbl().find('.paging').hide();
      jApp.tbl().find('[name=RowsPerPage]').parent().hide();
    }, // end fn

    /**
     * Setup header filters
     * @method function
     * @return {[type]} [description]
     */
    setupHeaderFilters: function setupHeaderFilters() {
      if (jUtility.isHeaderFilters()) {
        jUtility.DOM.headerFilterDeleteIcons();
      }
      if (jUtility.isHeaderFiltersDisplay()) {
        jUtility.DOM.showHeaderFilters();
      } else {
        jUtility.DOM.hideHeaderFilters();
      }
    }, // end fn

    /**
     * Setup the table sort buttons
     * @method function
     * @return {[type]} [description]
     */
    setupSortButtons: function setupSortButtons() {
      if (jUtility.isSort()) {
        jApp.aG().$().find('.tbl-sort').show();
      } else {
        jApp.aG().$().find('.tbl-sort').hide();
      }
    }, // end fn

    /**
     * Toggle Delete Icon Visibility
     * @method function
     * @param  {[type]} $elm [description]
     * @return {[type]}      [description]
     */
    toggleDeleteIcon: function toggleDeleteIcon($elm) {
      if (!!$elm.val().toString().trim()) {
        $elm.next('.deleteicon').show();
      } else {
        $elm.next('.deleteicon').hide();
      }
    }, //end fn

    /**
     * setTimeout helper
     * @method function
     * @param  {[type]}   o.key   [description]
     * @param  {Function} o.fn    [description]
     * @param  {[type]}   o.delay [description]
     * @return {[type]}         [description]
     */
    timeout: function timeout(o) {
      try {
        clearTimeout(jApp.aG().dataGrid.timeouts[o.key]);
      } catch (ignore) {}

      jApp.aG().dataGrid.timeouts[o.key] = setTimeout(o.fn, o.delay);
    }, //end fn

    /**
     * setInterval helper
     * @method function
     * @param  {[type]}   o.key   [description]
     * @param  {Function} o.fn    [description]
     * @param  {[type]}   o.delay [description]
     * @return {[type]}         [description]
     */
    interval: function interval(o) {
      try {
        clearInterval(jApp.aG().dataGrid.intervals[o.key]);
      } catch (ignore) {}

      jApp.aG().dataGrid.intervals[o.key] = setInterval(o.fn, o.delay);
    }, //end fn

    /**
     * Update Grid from cached data
     * @method function
     * @return {[type]} [description]
     */
    updateGridFromCache: function updateGridFromCache() {
      jUtility.callback.update(jUtility.getCachedGridData());
      jUtility.DOM.togglePreloader(true);
      jUtility.buildMenus();
    }, // end fn

    /**
     * Retrieve cached data
     * @method function
     * @return {[type]} [description]
     */
    getCachedGridData: function getCachedGridData() {
      return jApp.aG().store.get('data_' + jApp.opts().table);
    }, // end fn

    /**
     * get JSON
     * @method function
     * @param  {[type]} requestOptions [description]
     * @return {[type]}                [description]
     */
    getJSON: function getJSON(requestOptions) {

      var opts = $.extend(true, {
        url: null,
        data: {},
        success: function success() {},
        fail: function fail() {},
        always: jUtility.callback.displayResponseErrors,
        complete: function complete() {}
      }, requestOptions);

      jApp.log('6.5 ajax options set, executing ajax request');
      return $.getJSON(opts.url, opts.data, opts.success).fail(opts.fail).always(opts.always).complete(opts.complete);
    }, // end fn

    /**
     * Prepare form data
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    prepareFormData: function prepareFormData(data) {
      var fd = new FormData();

      _.each(data, function (value, key) {
        fd.append(key, value);
      });

      return fd;
    }, // end fn

    /**
     * post JSON
     * @method function
     * @param  {[type]} requestOptions [description]
     * @return {[type]}                [description]
     */
    postJSON: function postJSON(requestOptions) {

      // if ( typeof requestOptions.data.append !== 'function' ) {
      //   requestOptions.data = jUtility.prepareFormData( requestOptions.data || {} );
      // }

      var opts = $.extend(true, {
        url: null,
        data: {},
        success: function success() {},
        fail: function fail() {},
        always: jUtility.callback.displayResponseErrors,
        complete: function complete() {}
      }, requestOptions);

      return $.ajax({
        url: opts.url,
        data: opts.data,
        success: opts.success,
        type: 'POST',
        dataType: 'json'
      }). //processData : false,
      //contentType : false
      fail(opts.fail).always(opts.always).complete(opts.complete);
    }, // end fn

    /**
     * Execute the grid data request
     * @method function
     * @return {[type]} [description]
     */
    executeGridDataRequest: function executeGridDataRequest() {
      jApp.log('6.3 Setting up options for the data request');
      var params = $.extend(true, jApp.aG().dataGrid.requestOptions, {
        success: jUtility.callback.update,
        fail: jUtility.gridDataRequestCallback.fail,
        always: jUtility.gridDataRequestCallback.always,
        complete: jUtility.gridDataRequestCallback.complete
      }),
          r = jApp.aG().dataGrid.requests;

      // show the preloader
      jUtility.DOM.activityPreloader('show');

      // execute the request
      jApp.log('6.4 Executing ajax request');
      r.gridData = jUtility.getJSON(params);
    }, //end fn

    /**
     * Turn off modal overlays
     * @method function
     * @return {[type]} [description]
     */
    turnOffOverlays: function turnOffOverlays() {
      jUtility.DOM.overlay(1, 'off');
      jUtility.DOM.overlay(2, 'off');
    }, //end fn

    /**
     * Attempt to locate jQuery target
     * @method function
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
    locateTarget: function locateTarget(target, scope) {
      // first look in the grid scope,
      // then the document scope,
      // then look through the window object
      // to see if the target is a member
      // of the global scope e.g. $(window)
      if (typeof scope === 'undefined') {
        return jApp.aG().$().find(target) || $(target) || $(window[target]);
      } else {
        return jApp.aG().$().find(target, scope) || $(target, scope) || $(window[target], scope);
      }
    }, //end fn

    /**
     * Process the event bindings for the grid
     * @method function
     * @return {[type]} [description]
     */
    processGridBindings: function processGridBindings() {
      var events, target, fn, event;

      _.each(jApp.opts().events.grid, function (events, target) {
        _.each(events, function (fn, event) {
          if (typeof fn === 'function') {
            jUtility.setCustomBinding(target, fn, event);
          }
        });
      });
    }, //end fn

    /**
     * Process the event bindings for the form
     * @method function
     * @return {[type]} [description]
     */
    processFormBindings: function processFormBindings() {
      var events, target, fn, event;

      _.each(jApp.opts().events.form, function (events, target) {
        _.each(events, function (fn, event) {
          jUtility.setCustomBinding(target, fn, event, '.div-form-panel-wrapper', 'force');
        });
      });
    }, //end fn

    /**
     * Set up a custom event binding
     * @method function
     * @param  {[type]}   event [description]
     * @param  {Function} fn    [description]
     * @return {[type]}         [description]
     */
    setCustomBinding: function setCustomBinding(target, fn, event, scope, force) {
      var eventKey = event + '.custom-' + $.md5(fn.toString()),
          $scope = typeof scope === 'undefined' ? $(document) : $(scope),
          scope = typeof scope === 'undefined' ? 'document' : scope;
      force = typeof force === 'undefined' ? false : !!force;

      if (event === 'boot') {
        return typeof fn === 'function' ? fn() : false;
      }

      // we cannot use event bubbling for scroll
      // events, we must use capturing
      if (event !== 'scroll') {
        if (!!$(window[target]).length) {
          jApp.log('Found target within global scope ' + target);
          jApp.log('Binding event ' + eventKey + ' to target ' + target);
          $(window[target]).off(eventKey).on(eventKey, fn);
        } else if (!jUtility.isEventDelegated(target, eventKey, scope) || force) {
          jApp.log('Binding event ' + event + ' to target ' + target + ' within scope ' + scope);
          $scope.undelegate(target, eventKey).delegate(target, eventKey, fn);
          jUtility.eventIsDelegated(target, eventKey, scope);
        }
      } else {
        document.addEventListener(event, fn, true);
      }
    }, // end fn

    /**
     * Has the event been delegated for the target?
     * @method function
     * @param  {[type]} target   [description]
     * @param  {[type]} eventKey [description]
     * @return {[type]}          [description]
     */
    isEventDelegated: function isEventDelegated(target, eventKey, scope) {
      return _.indexOf(jApp.aG().delegatedEvents, scope + '-' + target + '-' + eventKey) !== -1;
    }, // end fn

    /**
     * Mark event delegated
     * @method function
     * @param  {[type]} target   [description]
     * @param  {[type]} eventKey [description]
     * @param  {[type]} scope    [description]
     * @return {[type]}          [description]
     */
    eventIsDelegated: function eventIsDelegated(target, eventKey, scope) {
      return jApp.aG().delegatedEvents.push(scope + '-' + target + '-' + eventKey);
    }, // end fn

    /**
     * Form boot up function
     * @method function
     * @return {[type]} [description]
     */
    formBootup: function formBootup() {
      jUtility.$currentFormWrapper()
      //reset validation stuff
      .find('.has-error').removeClass('has-error').end().find('.has-success').removeClass('has-success').end().find('.help-block').hide().end().find('.form-control-feedback').hide().end()

      //multiselects
      .find('select').addClass('bsms').end().find('.bsms').each(function (i, elm) {
        $(elm).data('jInput').fn.multiselect().fn.multiselectRefresh();
      }).end().find('[data-tokens]').each(function () {
        if (typeof $(this).data('tokenFieldSource') != 'null') {
          $(this).tokenfield({
            autocomplete: {
              source: $(this).data('tokenFieldSource'),
              delay: 300
            },
            showAutoCompleteOnFocus: false,
            tokens: $(this).val() || []
          });
          $(this).data('tokenFieldSource', null);
        }
        // var val = $(this).data('value').split('|') || []
        // $(this).tokenfield( 'setTokens', val );
      }).end().find('[_linkedElmID]').change();
    }, //end fn

    /**
     * Load event bindings for processing
     * @method function
     * @return {[type]} [description]
     */
    loadBindings: function loadBindings() {
      // form bindings
      jApp.opts().events.form = $.extend(true, {
        // the bind function will assume the scope is relative to the current form
        // unless the key is found in the global scope
        // boot functions will be automatically called at runtime
        "[data-validType='Phone Number']": {
          keyup: function keyup() {
            $(this).val(formatPhone($(this).val()));
          }
        },

        "[data-validType='Zip Code']": {
          keyup: function keyup() {
            $(this).val(formatZip($(this).val()));
          }
        },

        "[data-validType='SSN']": {
          keyup: function keyup() {
            var This = $(this);
            setTimeout(function () {
              This.val(formatSSN(jApp.aG().val()));
            }, 200);
          }
        },

        "[data-validType='color']": {
          keyup: function keyup() {
            $(this).css('background-color', $(this).val());
          }
        },

        "[data-validType='Number']": {
          change: function change() {
            $(this).val(formatNumber($(this).val()));
          }
        },

        "[data-validType='Integer']": {
          change: function change() {
            $(this).val(formatInteger($(this).val()));
          }
        },

        "[data-validType='US State']": {
          change: function change() {
            $(this).val(formatUC($(this).val()));
          }
        },

        "button.close, .btn-cancel": {
          click: function click() {
            if (jUtility.needsCheckin()) {
              console.log('checking in record');
              jUtility.checkin(jUtility.getCurrentRowId());
            } else {
              console.log('closing current form');
              jUtility.closeCurrentForm();
            }
          }
        },

        ".btn-go": {
          click: jUtility.saveCurrentFormAndClose
        },

        ".btn-save": {
          click: jUtility.saveCurrentForm
        },

        ".btn-reset": {
          click: jUtility.resetCurrentForm
        },

        ".btn-refreshForm": {
          click: jUtility.refreshCurrentForm
        },

        ".btn-array-add": {
          click: jUtility.arrayAddRow
        },

        ".btn-array-remove": {
          click: jUtility.arrayRemoveRow
        },

        "input": {
          keyup: function keyup(e) {
            e.preventDefault();
            if (e.which === 13) {
              if (jUtility.isConfirmed()) {
                jUtility.saveCurrentFormAndClose();
              }
            } else if (e.which === 27) {
              jUtility.closeCurrentForm();
            }
          }
        },

        "#confirmation": {
          keyup: function keyup() {
            if ($(this).val().toString().toLowerCase() === 'yes') {
              jUtility.$currentForm().find('.btn-go').removeClass('disabled');
            } else {
              jUtility.$currentForm().find('.btn-go').addClass('disabled');
            }
          }
        },

        "[_linkedElmID]": {
          change: function change() {
            var This = $(this),
                $col = This.attr('_linkedElmFilterCol'),
                $id = This.val(),
                $labels = This.attr('_linkedElmLabels'),
                $options = This.attr('_linkedElmOptions'),
                oFrm = jUtility.oCurrentForm(),
                oElm = oFrm.fn.getElmById(This.attr('_linkedElmID'));

            // set data to always expire;
            oElm.fn.setTTL(-1);
            oElm.jApp.opts().hideIfNoOptions = true;
            oElm.jApp.opts().cache = false;

            oElm.fn.attr({
              '_optionsFilter': $col + '=' + $id,
              '_firstoption': 0,
              '_firstlabel': '-Other-',
              '_labelsSource': $labels,
              '_optionsSource': $options
            });

            oElm.fn.initSelectOptions(true);
          }
        }

      }, jApp.opts().events.form);

      // grid events
      jApp.opts().events.grid = $.extend(true, {
        // the bind function will assume the scope is relative to the grid
        // unless the key is found in the global scope
        // boot functions will be automatically called at runtime
        window: {
          resize: function resize() {
            jUtility.timeout({
              key: 'resizeTimeout',
              fn: jUtility.DOM.updateColWidths,
              delay: 500
            });
          },

          beforeunload: jUtility.unloadWarning
        },

        ".table-grid": {
          "scroll": function scroll() {
            jUtility.timeout({
              key: 'tableGridScroll',
              fn: jUtility.DOM.pageWrapperScrollHandler,
              delay: 300
            });
          }
        },

        ".header-filter": {
          keyup: function keyup() {
            jUtility.toggleDeleteIcon($(this));

            jUtility.timeout({
              key: 'applyHeaderFilters',
              fn: jUtility.DOM.applyHeaderFilters,
              delay: 300
            });
          },

          boot: jUtility.DOM.applyHeaderFilters
        },

        ".tbl-sort": {
          click: function click() {
            var $btn, $btnIndex, $desc;

            //button
            $btn = $(this);
            //index
            $btnIndex = $btn.closest('.table-header').index() + 1;

            //tooltip
            $btn.attr('title', $btn.attr('title').indexOf('Descending') !== -1 ? 'Sort Ascending' : 'Sort Descending').attr('data-original-title', $btn.attr('title')).tooltip({ delay: 300 });

            //ascending or descending
            $desc = $btn.find('i').hasClass('fa-sort-amount-desc');

            //other icons
            jApp.tbl().find('.tbl-sort i.fa-sort-amount-desc').removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc').end().find('.tbl-sort.btn-primary').removeClass('btn-primary');

            //btn style
            $btn.addClass('btn-primary');

            //icon
            $btn.find('i').removeClass($desc ? 'fa-sort-amount-desc' : 'fa-sort-amount-asc').addClass($desc ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc');

            jApp.tbl().find('.table-body .table-row').show();

            // perform the sort on the table rows
            jUtility.DOM.sortByCol($btnIndex, $desc);
          }
        },

        "[title]": {
          boot: function boot() {
            $('[title]').tooltip({ delay: 300 });
          }
        },

        ".btn-readmore": {
          click: function click() {
            $(this).toggleClass('btn-success btn-warning');
            $(this).siblings('.readmore').toggleClass('active');
          }
        },

        "[name=RowsPerPage]": {
          change: function change() {
            jApp.tbl().find('[name=RowsPerPage]').val($(this).val());
            jUtility.DOM.rowsPerPage($(this).val());
          },
          boot: function boot() {
            if (jUtility.isPagination()) {
              $('[name=RowsPerPage]').parent().show();
            } else {
              $('[name=RowsPerPage]').parent().hide();
            }
          }
        },

        ".deleteicon": {
          boot: function boot() {
            $(this).remove();
          },
          click: function click() {
            $(this).prev('input').val('').focus().trigger('keyup');
            jUtility.DOM.applyHeaderFilters();
          }
        },

        ".chk_all": {
          change: function change() {
            jApp.aG().$().find('.chk_cid').prop('checked', $(this).prop('checked'));
            $('.chk_cid').eq(0).change();
          }
        },

        ".chk_cid": {
          change: function change() {
            var $chk_all,
                // $checkall checkbox
            $checks,
                // $checkboxes
            total_num,
                // total checkboxes
            num_checked,
                // number of checkboxes checked

            $chk_all = jApp.tbl().find('.chk_all');
            $checks = jApp.tbl().find('.chk_cid');
            total_num = $checks.length;
            num_checked = jApp.tbl().find('.chk_cid:checked').length;

            jUtility.DOM.updateRowMenu(num_checked);

            // set the state of the checkAll checkbox
            $chk_all.prop('checked', total_num === num_checked ? true : false).prop('indeterminate', num_checked > 0 && num_checked < total_num ? true : false);
          }
        },

        ".btn-new": {
          click: function click() {
            jUtility.actionHelper('new');
          }
        },

        ".btn-edit": {
          click: function click() {
            jUtility.actionHelper('edit');
          }
        },

        ".btn-headerFilters": {
          click: jUtility.DOM.toggleHeaderFilters
        },

        ".btn-delete": {
          click: function click() {
            jUtility.withSelected('delete');
          }
        },

        ".btn-clear": {
          click: function click() {
            jApp.aG().$().find('.chk_cid').prop('checked', false);
            $('.chk_cid').eq(0).change();
          }
        },

        ".btn-refresh": {
          click: function click() {
            $(this).addClass('disabled').delay(2000).removeClass('disabled');
            jUtility.updateAll();
          }
        },

        // ".btn-showMenu" : {
        //   click : jUtility.DOM.toggleRowMenu
        // },

        ".table-body": {
          mouseover: function mouseover() {
            $(this).focus();
          }
        }

      }, // ".table-body .table-row" : {
      //   mouseover : function() {
      //     var $tr = $(this);
      //
      //     clearTimeout(jApp.aG().dataGrid.intervals.cancelRowMenuUpdate);
      //     jApp.aG().dataGrid.intervals.moveRowMenu = setTimeout( function() {
      //       jApp.tbl().find('.btn-showMenu').removeClass('hover');
      //       if (jApp.tbl().find('.rowMenu').hasClass('expand') === false) {
      //         jApp.tbl().find('.btn-showMenu').removeClass('active');
      //       }
      //       $tr.find('.btn-showMenu').addClass('hover');
      //
      //     }, 250 );
      //   },
      //
      //   mouseout : function() {
      //
      //     var $tr = $(this);
      //     clearTimeout(jApp.aG().dataGrid.intervals.moveRowMenu);
      //     jApp.aG().dataGrid.intervals.cancelRowMenuUpdate = setTimeout( function() {
      //       jApp.tbl().find('.btn-showMenu').removeClass('hover');
      //       if (!jApp.tbl().find('.rowMenu').hasClass('expand')) {
      //         $tr.find('.btn-showMenu').removeClass('active');
      //       }
      //       jApp.tbl().find('.rowMenu').removeClass('active');
      //     }, 100 );
      //   }
      // }

      jApp.opts().events.grid);
    }, //end fn

    /**
     * Load Form Definitions
     * @method function
     * @return {[type]} [description]
     */
    loadFormDefinitions: function loadFormDefinitions() {
      jApp.opts().formDefs = $.extend(true, {}, {

        editFrm: {
          model: jApp.opts().model,
          table: jApp.opts().table,
          pkey: jApp.opts().pkey,
          tableFriendly: jApp.opts().tableFriendly,
          atts: { method: 'PATCH' },
          disabledElements: jApp.opts().disabledFrmElements
        },

        newFrm: {
          model: jApp.opts().model,
          table: jApp.opts().table,
          pkey: jApp.opts().pkey,
          tableFriendly: jApp.opts().tableFriendly,
          atts: { method: 'POST' },
          disabledElements: jApp.opts().disabledFrmElements
        },

        colParamFrm: {
          table: 'col_params',
          pkey: 'colparam_id',
          tableFriendly: 'Column Parameters',
          btns: [],
          atts: {
            name: 'frm_element_editor'
          },
          fieldset: {
            'legend': '3. Edit Column Parameters'
          }
        }
      }, jApp.opts().formDefs);
    }, //end fn

    /**
     * Grid data request callback methods
     * @type {Object}
     */
    gridDataRequestCallback: {
      /**
       * Grid data request failed
       * @method function
       * @return {[type]} [description]
       */
      fail: function fail() {
        console.warn('update grid data failed, it may have been aborted');
      }, //end fn

      /**
       * Always execute after grid data request
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      always: function always(response) {
        jUtility.callback.displayResponseErrors(response);
        if (jUtility.isCaching()) {
          jApp.aG().store.set('data_' + jApp.opts().table, response);
        }
        jUtility.DOM.togglePreloader(true);
        jUtility.buildMenus();
      }, // end fn

      /**
       * Grid data request completed
       * @method function
       * @return {[type]} [description]
       */
      complete: function complete() {
        jUtility.DOM.activityPreloader('hide');
      } }, // end fn
    // end callbacks

    /**
     * Clear countdown interval
     * @method function
     * @return {[type]} [description]
     */
    clearCountdownInterval: function clearCountdownInterval() {
      try {
        clearInterval(jApp.aG().dataGrid.intervals.countdownInterval);
      } catch (e) {
        // do nothing
      }
    }, // end fn

    /**
     * Set the countdown interval
     * @method function
     * @return {[type]} [description]
     */
    setCountdownInterval: function setCountdownInterval() {
      jUtility.clearCountdownInterval();
      jApp.aG().dataGrid.intervals.countdownInterval = setInterval(jUtility.updateCountdown, 1000);
    }, // end fn

    /**
     * Clear the get checked out records interval
     * @method function
     * @return {[type]} [description]
     */
    clearGetCheckedOutRecordsIntevrval: function clearGetCheckedOutRecordsIntevrval() {
      try {
        clearInterval(jApp.aG().dataGrid.intervals.getCheckedOutRecords);
      } catch (e) {
        // do nothing
      }
    }, // end fn

    /**
     * Set the get checked out records interval
     * @method function
     * @return {[type]} [description]
     */
    setGetCheckedOutRecordsInterval: function setGetCheckedOutRecordsInterval() {
      if (jUtility.isCheckout()) {
        jUtility.clearGetCheckedOutRecordsIntevrval();
        jApp.aG().dataGrid.intervals.getCheckedOutRecords = setInterval(jUtility.getCheckedOutRecords, 10000);
      }
    }, // end fn

    /**
     * Update countdown
     * @method function
     * @return {[type]} [description]
     */
    updateCountdown: function updateCountdown() {
      if (jUtility.isFormOpen()) {
        return false;
      }

      var txt = 'Refreshing in ';
      txt += jApp.aG().dataGrid.intervals.countdownTimer > 0 ? Math.floor(jApp.aG().dataGrid.intervals.countdownTimer / 1000) : 0;
      txt += 's';

      jApp.tbl().find('button#btn_table_status').text(txt);
      jApp.aG().dataGrid.intervals.countdownTimer -= 1000;

      if (jApp.aG().dataGrid.intervals.countdownTimer <= -1000) {
        jUtility.updateAll();
      }
    }, // end fn

    /**
     * Initialize countdown timer value
     * @method function
     * @return {[type]} [description]
     */
    initCountdown: function initCountdown() {
      jApp.aG().dataGrid.intervals.countdownTimer = jApp.opts().refreshInterval - 2000;
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   ellipsis
     *
     *  Truncates cells that are too long
     *  according to the maxCellLength grid
     *  option. Adds a read-more button to
     *  any cells that are truncated.
     **  **  **  **  **  **  **  **  **  **/
    ellipsis: function ellipsis(txt) {
      var $rdMr, $dtch, $btn, $truncated, $e;

      $btn = $('<button/>', {
        'class': 'btn btn-success btn-xs btn-readmore pull-right',
        'type': 'button' }).html(' . . . ');

      $e = $('<div/>').html(txt);

      if ($e.text().length > jApp.opts().maxCellLength) {
        // look for child html elements
        if ($e.find(':not(i)').length > 0) {
          $rdMr = $('<span/>', { 'class': 'readmore' });

          while ($e.text().length > jApp.opts().maxCellLength) {
            // keep detaching html elements until the cell length is
            // within allowable limits

            // store detached element
            $dtch = !!$e.find(':not(i)').last().parent('h4').length ? $e.find(':not(i)').last().parent().detach() : $e.find(':not(i)').last().detach();

            // append the detached element to the readmore span
            $rdMr.html($rdMr.html() + ' ').append($dtch);

            // clean up the element html of extra whitespace
            $e.html($e.html().replace(/(\s*)?\,*(\s*)?$/ig, ''));
          }

          $e.append($rdMr).prepend($btn);
        } // end if

        // all text, no child html elements in the cell
        else {
            // place the extra text in the readmore span
            $rdMr = $('<span/>', { 'class': 'readmore' }).html($e.html().substr(jApp.opts().maxCellLength));

            // truncate the visible text in the cell
            $truncated = $e.html().substr(0, jApp.opts().maxCellLength);

            $e.empty().append($truncated).append($rdMr).prepend($btn);
          } // end else
      } // end if

      return $e.html();
    }, // end fn

    /**
     * Set up HTML templates
     * @method function
     * @return {[type]} [description]
     */
    setupHtmlTemplates: function setupHtmlTemplates() {
      /**
       *   HTML TEMPLATES
       *
       *  Place large html templates here.
       *  These are rendered with
       *  the method jUtility.render.
       *
       *  Parameters of the form {@ParamName}
       *  are expanded by the render function
       */
      jApp.aG().html = $.extend(true, {}, {

        // main grid body
        tmpMainGridBody: '<div class="row">\n                            <div class="col-lg-12">\n                              <div class="panel panel-info panel-grid panel-grid1">\n                                <div class="panel-heading">\n                                  <h1 class="page-header"><i class="fa {@icon} fa-fw"></i><span class="header-title"> {@headerTitle} </span></h1>\n                                  <div class="alert alert-warning alert-dismissible helpText" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> {@helpText} </div>\n                                </div>\n                                <div class="panel-body grid-panel-body">\n                                  <div class="table-responsive">\n                                    <div class="table table-bordered table-grid">\n                                      <div class="table-head">\n                                        <div class="table-row table-menu-row">\n                                          <div class="table-header table-menu-header" style="width:100%">\n                                            <div class="btn-group btn-group-sm table-btn-group">  </div>\n                                          </div>\n                                        </div>\n                                        <div style="display:none" class="table-row table-rowMenu-row"></div>\n                                        <div class="table-row tfilters" style="display:none">\n                                          <div style="width:10px;" class="table-header">&nbsp;</div>\n                                          <div style="width:175px;" class="table-header" align="right"> <span class="label label-info filter-showing"></span> </div>\n                                        </div>\n                                      </div>\n                                      <div class="table-body" id="tbl_grid_body">\n                                        <!--{$tbody}-->\n                                      </div>\n                                      <div class="table-foot">\n                                        <div class="row">\n                                          <div class="col-md-3">\n                                            <div style="display:none" class="ajax-activity-preloader pull-left"></div>\n                                            <div class="divRowsPerPage pull-right">\n                                              <select style="width:180px;display:inline-block" type="select" name="RowsPerPage" id="RowsPerPage" class="form-control">\n                                                <option value="10">10</option>\n                                                <option value="15">15</option>\n                                                <option value="25">25</option>\n                                                <option value="50">50</option>\n                                                <option value="100">100</option>\n                                                <option value="10000">All</option>\n                                              </select>\n                                            </div>\n                                          </div>\n                                          <div class="col-md-9">\n                                            <div class="paging"></div>\n                                          </div>\n                                        </div>\n                                      </div>\n                                      <!-- /. table-foot -->\n                                    </div>\n                                  </div>\n                                  <!-- /.table-responsive -->\n                                </div>\n                                <!-- /.panel-body -->\n                              </div>\n                              <!-- /.panel -->\n                            </div>\n                            <!-- /.col-lg-12 -->\n                          </div>\n                          <!-- /.row -->',

        // check all checkbox template
        tmpCheckAll: '<label for="chk_all" class="btn btn-default pull-right"> <input id="chk_all" type="checkbox" class="chk_all" name="chk_all"> </label>',

        // header filter clear text button
        tmpClearHeaderFilterBtn: '<span class="fa-stack fa-lg"><i class="fa fa-circle-thin fa-stack-2x"></i><i class="fa fa-remove fa-stack-1x"></i></span>',

        // filter showing ie Showing X / Y Rows
        tmpFilterShowing: '<i class="fa fa-filter fa-fw"></i>{@totalVis} / {@totalRows}',

        // table header sort button
        tmpSortBtn: '<button rel="{@ColumnName}" title="{@BtnTitle}" class="btn btn-sm btn-default {@BtnClass} tbl-sort pull-right" type="button"> <i class="fa fa-sort-{@faClass} fa-fw"></i> </button>',

        // form templates
        forms: {

          // Edit Form Template
          editFrm: '<div id="div_editFrm" class="div-btn-edit min div-form-panel-wrapper">\n                      <div class="frm_wrapper">\n                        <div class="panel panel-blue">\n                          <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-pencil fa-fw"></i> <span class="spn_editFriendlyName">{@Name}</span> [Editing] </div>\n                          <div class="panel-overlay" style="display:none"></div>\n                          <div class="panel-body">\n                            <div class="row side-by-side">\n                              <div class="side-by-side editFormContainer formContainer"> </div>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>',

          // New Form Template
          newFrm: '<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper">\n                      <div class="frm_wrapper">\n                        <div class="panel panel-green">\n                          <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div>\n                          <div class="panel-overlay" style="display:none"></div>\n                          <div class="panel-body">\n                            <div class="row side-by-side">\n                              <div class="side-by-side newFormContainer formContainer"> </div>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>',

          // New Form Template
          newOtherFrm: '<div id="div_newFrm" class="div-btn-new min div-form-panel-wrapper">\n                          <div class="frm_wrapper">\n                            <div class="panel panel-info">\n                              <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-plus fa-fw"></i> New: <span class="spn_editFriendlyName">{@tableFriendly}</span> </div>\n                              <div class="panel-overlay" style="display:none"></div>\n                              <div class="panel-body">\n                                <div class="row side-by-side">\n                                  <div class="side-by-side newOtherFormContainer formContainer"> </div>\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n                        </div>',

          // Delete Form Template
          deleteFrm: '<div id="div_deleteFrm" class="div-btn-delete min div-form-panel-wrapper">\n                        <div class="frm_wrapper">\n                          <div class="panel panel-red">\n                            <div class="panel-heading"> <button type="button" class="close" aria-hidden="true">×</button> <i class="fa fa-trash-o fa-fw"></i> <span class="spn_editFriendlyName"></span> : {@deleteText} </div>\n                            <div class="panel-overlay" style="display:none"></div>\n                            <div class="panel-body">\n                              <div class="row side-by-side">\n                                <div class="delFormContainer formContainer"></div>\n                              </div>\n                            </div>\n                          </div>\n                          </form>\n                        </div>\n                      </div>',

          // Colparams Form Template
          colParamFrm: '<div id="div_colParamFrm" class="div-btn-other min div-form-panel-wrapper">\n                          <div class="frm_wrapper">\n                            <div class="panel panel-lblue">\n                              <div class="panel-heading"> <button type="button" class="close" aria-hidden="true" data-original-title="" title="">×</button> <i class="fa fa-gear fa-fw"></i> <span class="spn_editFriendlyName">Form Setup</span> </div>\n                              <div class="panel-overlay" style="display:none"></div>\n                              <div class="panel-body" style="padding:0 0px !important;">\n                                <div class="row side-by-side">\n                                  <div class="col-lg-3 tbl-list"></div>\n                                  <div class="col-lg-2 col-list"></div>\n                                  <div class="col-lg-7 param-list">\n                                    <div class="side-by-side colParamFormContainer formContainer"> </div>\n                                  </div>\n                                </div>\n                              </div>\n                              <div class="panel-heading"> <input type="button" class="btn btn-success btn-save" id="btn_save" value="Save"> <button type="reset" class="btn btn-warning btn-reset" id="btn_reset">Reset</button> <input type="button" class="btn btn-warning btn-refreshForm" id="btn_refresh" value="Refresh Form"> <input type="button" class="btn btn-danger btn-cancel" id="btn_cancel" value="Cancel"> </div>\n                            </div>\n                          </div>\n                        </div>'
        }
      }, jApp.opts().html);

      jApp.log('2.1 HTML Templates Done');
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   render
     *
     *  @str   (string) containing
     *  		multiline text
     *
     *  @params (obj) contains key/value pairs
     *  		  defining parameters that
     *  		  will be interpolated in
     *  		  the returned text
     *
     *  returns the interpolated text
     **  **  **  **  **  **  **  **  **  **/
    render: function render(str, params) {
      var ptrn, key, val;

      //if (typeof params !== 'object') return '';

      _.each(params, function (val, key) {
        ptrn = new RegExp('\{@' + key + '\}', 'gi');
        str = str.replace(ptrn, val);
      });

      return str.replace(/\{@.+\}/gi, '');
    }, //end fn

    /**  **  **  **  **  **  **  **  **  **
     *   interpolate
     *
     *  @value (str) string to be interpolated
     *
     *  @return (str) the interpolated string
     *
     *  recursively processes the input value and
     *  replaces parameters of the form
     *  {@ParamName} with the corresponding
     *  value from the JSON data. Uses the
     *  replace callbak jUtility.replacer.
     *
     *  e.g. {@ParamName} -> jApp.aG().dataGrid.data[row][ParamName]
     **  **  **  **  **  **  **  **  **  **/
    interpolate: function interpolate(value) {
      return value.replace(/\{@(\w+)\}/gi, jUtility.replacer);
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   replacer - RegExp replace callback
     *
     *  @match 	(str) the match as defined
     *  			by the RegExp pattern
     *  @p1	  	{str} the partial match as
     *  			defined by the first
     *  			capture group
     *  @offset	(int) the offset where the
     *  			match was found in @string
     *  @string	(str) the original string
     *
     *  @return	(str) the replacement string
     **  **  **  **  **  **  **  **  **  **/
    replacer: function replacer(match, p1, offset, string) {
      return jApp.aG().currentRow[p1];
    }, // end fn

    /**
     * Get the rows that match the header filter text
     * @method function
     * @return {[type]} [description]
     */
    getHeaderFilterMatchedRows: function getHeaderFilterMatchedRows() {
      var columnOffset = jUtility.isEditable() ? 3 : 2,
          currentColumn,
          currentMatches,
          matchedRows = [],
          targetString;

      //iterate through header filters and apply each
      jApp.tbl().find('.header-filter').filter(function () {
        return !!$(this).val().toString().trim().length;
      }).each(function (i) {

        // calculate the 1-indexed index of the current column
        currentColumn = +1 + $(this).parent().index();

        jApp.log('The current column is' + currentColumn);

        // set the target string for the current column
        // note: using a modified version of $.contains that is case-insensitive
        targetString = ".table-row .table-cell:nth-child(" + currentColumn + "):contains('" + $(this).val() + "')";

        // find the matched rows in the current column
        currentMatches = jApp.tbl().find(targetString).parent().map(function (i, obj) {
          return $(obj).index();
        }).get();

        // if matchedRows is non-empty, find the intersection of the
        // matched rows and the current rows - ie the rows that match
        // all of the criteria processed so far.
        matchedRows = !matchedRows.length ? currentMatches : _.intersection(matchedRows, currentMatches);
      });

      return matchedRows;
    }, //end fn

    /**
     * Sets the rows that are visible
     * @param  {array} visibleRows [indexes of the visible rows]
     * @return {[type]}             [description]
     */
    setVisibleRows: function setVisibleRows(visibleRows) {
      // show appropriate rows
      jApp.tbl().find('.table-body .table-row').hide().filter(function (i) {
        return _.indexOf(visibleRows, i) !== -1;
      }).show();
    }, // end fn

    /**
     * Are Header Filters Non-empty
     * @method function
     * @return {[type]} [description]
     */
    areHeaderFiltersNonempty: function areHeaderFiltersNonempty() {
      return !!jApp.tbl().find('.header-filter').filter(function () {
        return !!this.value;
      }).length;
    }, //end fn

    /**  **  **  **  **  **  **  **  **  **
     *   prepareValue
     *
     *  @value 	(str) the column value as
     *  		specified in the JSON
     *  		data
     *  @column (str) the column name as
     *  		specified in the JSON
     *  		data
     *
     *  @return (str) the prepared value
     *
     *  prepares the value for display in
     *  the DOM, applying a template
     *  function if applicable.
     **  **  **  **  **  **  **  **  **  **/
    prepareValue: function prepareValue(value, column) {
      var template;

      if (value == null) {
        value = '';
      }

      if (value.toString().toLowerCase() === 'null') {
        return '';
      }

      if (typeof jApp.opts().templates[column] === 'function') {
        template = jApp.opts().templates[column];
        value = template(value);
      }

      if (value.toString().trim() === '') {
        return '';
      }

      if (value.toString().indexOf('|') !== -1) {
        value = value.replace(/\|/gi, ', ');
      }

      if (jUtility.isEllipses()) {
        value = jUtility.ellipsis(value);
      }

      return value;
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   deltaData
     *
     *  @prev (obj) previous state of object
     *  @now  (obj) current state of object
     *
     *  computes and returns the difference
     *  between two objects
     **  **  **  **  **  **  **  **  **  **/
    deltaData: function deltaData(prev, now) {
      var changes = {},
          prop,
          c;
      $.each(now, function (i, row) {
        if (typeof prev[i] === 'undefined') {
          changes[i] = row;
        } else {
          $.each(row, function (prop, value) {
            if (prev[i][prop] !== value) {
              if (typeof changes[i] === 'undefined') {
                changes[i] = {};
              }
              changes[i][prop] = value;
            }
          });
        }
      });
      if ($.isEmptyObject(changes)) {
        return false;
      }
      return changes;
    }, // end fn

    /**
     * Checkout record
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    checkout: function checkout(id) {
      jUtility.getJSON({
        url: '/checkout/_' + jApp.opts().model + '_' + id,
        success: jUtility.callback.checkout
      });
    }, // end fn

    /**
     * Checkin record
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    checkin: function checkin(id) {
      jUtility.getJSON({
        url: '/checkin/_' + jApp.opts().model + '_' + id,
        success: jUtility.callback.checkin,
        always: function always() {/* ignore */}
      });
    }, // end fn

    /**
     * Get all checked out records
     * @return {[type]} [description]
     */
    getCheckedOutRecords: function getCheckedOutRecords() {
      jUtility.getJSON({
        url: '/checkedout/_' + jApp.opts().model,
        success: jUtility.callback.getCheckedOutRecords
      });
    }, // end fn

    /**
     * Set initial parameters
     * @method function
     * @return {[type]} [description]
     */
    setInitParams: function setInitParams() {
      var ag = jApp.aG();

      /**
       * Placeholders
       */
      ag = $.extend(ag, {
        action: 'new',
        store: $.jStorage,
        currentRow: {},
        permissions: {},
        dataGrid: {

          // pagination parameters
          pagination: {
            totalPages: -1,
            rowsPerPage: $.jStorage.get('pref_rowsPerPage', ag.options.rowsPerPage)
          },

          // ajax requests
          requests: [],

          // request options
          requestOptions: {
            url: ag.options.url,
            data: {
              filter: ag.options.filter,
              filterMine: 0
            }
          },

          // intervals
          intervals: {},

          // timeouts
          timeouts: {},

          // grid data
          data: {},

          // data delta (i.e. any differences in the data)
          delta: {}
        }, // end dataGrid

        DOM: {
          $grid: false,
          $currentRow: false,
          $tblMenu: false,
          $rowMenu: $('<div/>', { 'class': 'btn-group btn-group-sm rowMenu', style: 'position:relative !important' })
        },

        forms: {},
        linkTables: [],
        temp: {}

      });

      jApp.log('3.1 Initial Params Set');
    }, // end fn

    /**
     * Get checked items
     * @method function
     * @return {[type]} [description]
     *
     *  $cid = self.DOM.$grid.find('.chk_cid:checked').map( function(i,elm) {
       return $(elm).closest('.table-row').attr('data-identifier');
     }).get(); jUtility.withSelectedAction(action,callback, $cid);
     */
    getCheckedItems: function getCheckedItems(includeHidden) {
      var selector = !!includeHidden ? '.chk_cid:checked' : '.chk_cid:checked:visible';

      return $('.table-grid').find(selector).map(function (i, elm) {
        return $(elm).closest('.table-row').attr('data-identifier');
      }).get();
    }, // end fn

    /**
     * Are any invisible items checked
     * @method function
     * @return {[type]} [description]
     */
    numInvisibleItemsChecked: function numInvisibleItemsChecked() {
      return jApp.tbl().find('.chk_cid:checked:not(:visible)').length;
    }, // end fn

    /**
     * Determine if invisible checked items
     *  should be included in the operation
     * @method function
     * @return {[type]} [description]
     */
    confirmInvisibleCheckedItems: function confirmInvisibleCheckedItems(action, _callback) {
      bootbox.dialog({
        message: "There are  " + jUtility.numInvisibleItemsChecked() + " items which are checked and are currently not displayed. Include hidden items in the operation?",
        title: "Include Hidden Checked Items?",
        buttons: {
          yes: { label: "Include Hidden Items", className: "btn-primary", callback: function callback() {
              return jUtility.withSelectedAction(action, _callback, true);
            } },
          no: { label: "Do Not Include Hidden Items", className: "btn-warning", callback: function callback() {
              return jUtility.withSelectedAction(action, _callback, false);
            } },
          cancel: { label: "Cancel Operation", className: "btn-danger", callback: function callback() {
              dialog.modal('hide');
            } }
        }
      });
    }, // end fn

    /**
     * Initialize the grid template
     * @method function
     * @return {[type]} [description]
     */
    initializeTemplate: function initializeTemplate() {
      jUtility.DOM.emptyPageWrapper();
      jApp.log('5.1 Page Wrapper Emptied');
      jUtility.DOM.initGrid();
      jApp.log('5.2 Grid Initialized');
    },

    /**
     * Setup grid intervals
     * @method function
     * @return {[type]} [description]
     */
    setupIntervals: function setupIntervals() {
      if (jUtility.isAutoUpdate()) {
        jUtility.setCountdownInterval();

        if (jUtility.isCheckout()) {
          jUtility.setGetCheckedOutRecordsInterval();
        }
      }
    },

    /**
     * Build all grid menus
     * @method function
     * @return {[type]} [description]
     */
    buildMenus: function buildMenus() {
      jUtility.DOM.clearMenus();

      //jUtility.setupVisibleColumnsMenu();
      jUtility.DOM.buildBtnMenu(jApp.opts().tableBtns, jApp.aG().DOM.$tblMenu, true);
      jUtility.DOM.buildBtnMenu(jApp.opts().rowBtns, jApp.aG().DOM.$rowMenu, false);
      //jUtility.DOM.buildLnkMenu( jApp.opts().withSelectedBtns, jApp.aG().DOM.$withSelectedMenu );

      jUtility.DOM.attachRowMenu();
    }, // end fn

    /**
     * Build all grid forms
     * @method function
     * @return {[type]} [description]
     */
    buildForms: function buildForms() {
      jUtility.loadFormDefinitions();

      _.each(jApp.opts().formDefs, function (o, key) {
        jUtility.DOM.buildForm(o, key);
      });
    },

    /**  **  **  **  **  **  **  **  **  **
     *   linkTables
     *
     *  iterates through the linktable
     *  definitions in the options and
     *  adds the appropriate elements to the
     *  forms
     **  **  **  **  **  **  **  **  **  **/
    linkTables: function linkTables() {
      var oLT;
      _.each(jApp.opts().linkTables, function (o, key) {
        o.callback = jUtility.callback.linkTables;
        oLT = new jLinkTable(o);
      });
    }, // end fn

    /**
     * Sets up the countdown that displays
     *  the time remaining until the next
     *  refresh
     * @return {[type]} [description]
     */
    countdown: function countdown() {
      if (!jUtility.isAutoUpdate()) {
        return false;
      }

      jUtility.clearCountdownInterval();
      jUtility.initCountdown();
      jUtility.setCountdownInterval();
    }, // end fn

    /**
     * Update all the grids currently on the page
     * @return {[type]} [description]
     */
    updateAll: function updateAll() {
      jUtility.getGridData();
    }, //end fn

    /**
     * get the grid data
     * @method function
     * @param  {[type]} preload [description]
     * @return {[type]}         [description]
     */
    getGridData: function getGridData(preload) {
      // show the preload if needed
      if (!!preload) {
        jUtility.DOM.togglePreloader();
        jUtility.setupIntervals();
      }

      jApp.log('6.1 Starting Countdown timer');
      // start the countdown timer
      jUtility.countdown();

      // kill the pending request if it's still going
      jUtility.killPendingRequest('gridData');

      // use cached copy, if available
      if (jUtility.isDataCacheAvailable()) {
        jApp.log('6.2 Updating grid from cache');
        setTimeout(jUtility.updateGridFromCache(), 100);
      } else {
        jApp.log('6.2 Executing data request');
        jUtility.executeGridDataRequest();
      }
    }, // end fn

    /**  **  **  **  **  **  **  **  **  **
     *   oCurrentForm
     *
     *  returns the currently active form
     *  or false if the current action is
     *  a non-standard action.
     *
     *  @return jForm (obj) || false
     *
     **  **  **  **  **  **  **  **  **  **/
    oCurrentForm: function oCurrentForm() {
      var key;

      if (!!(key = _.findKey(jApp.aG().forms, function (o, key) {
        if (key.indexOf('o') !== 0) return false;
        return key.toLowerCase().indexOf(jApp.aG().action.toString().toLowerCase()) !== -1;
      }))) {
        return jApp.aG().forms[key];
      } else {
        console.warn('There is no valid form associated with the current action');
        return false;
      }
    },

    /**  **  **  **  **  **  **  **  **  **
     *   $currentForm
     *
     *  returns the currently active form
     *  jQuery handle or false if the current
     *  action is a non-standard action.
     *
     *  @return jQuery (obj) || false
     *
     **  **  **  **  **  **  **  **  **  **/
    $currentForm: function $currentForm() {
      try {
        return jUtility.oCurrentForm().$();
      } catch (e) {
        console.warn('No current form object found');
        return false;
      }
    },

    /**  **  **  **  **  **  **  **  **  **
     *   $currentFormWrapper
     *
     *  returns the currently active form
     *  wrapper jQuery handle or false
     *  if the current action is a non-
     *  standard action.
     *
     *  @return jQuery (obj) || false
     *
     **  **  **  **  **  **  **  **  **  **/
    $currentFormWrapper: function $currentFormWrapper() {
      try {
        return jUtility.$currentForm().closest('.div-form-panel-wrapper');
      } catch (e) {
        console.warn('No current form wrapper found');
        return false;
      }
    },

    /**  **  **  **  **  **  **  **  **  **
     *   bind
     *
     *  binds event handlers to the various
     *  DOM elements.
     **  **  **  **  **  **  **  **  **  **/
    bind: function bind() {
      jUtility.setupBootpag();
      jUtility.setupSortButtons();
      jUtility.turnOffOverlays();
      jUtility.loadBindings();
      jUtility.setupHeaderFilters();
      jUtility.processGridBindings();
      jUtility.processFormBindings();
    }, // end bind fn

    /**  **  **  **  **  **  **  **  **  **
     *   setupFormContainer
     *
     *  When a rowMenu button is clicked,
     *  this function sets up the
     *  corresponding div
     **  **  **  **  **  **  **  **  **  **/
    setupFormContainer: function setupFormContainer() {
      jUtility.DOM.overlay(2, 'on');
      jApp.aG().hideOverlayOnError = false;
      jUtility.resetCurrentForm();
      jUtility.maximizeCurrentForm();
      jUtility.setCurrentFormFocus();
      jUtility.formBootup();
      jUtility.getCurrentFormRowData();
    }, // end fn

    /**
     * Messaging functions
     * @type {Object}
     */
    msg: {

      /**
       * Clear all messages
       * @method function
       * @return {[type]} [description]
       */
      clear: function clear() {
        $.noty.closeAll();
      }, // end fn

      /**
       * Show a message
       * @method function
       * @param  {[type]} message [description]
       * @param  {[type]} type    [description]
       * @return {[type]}         [description]
       */
      show: function show(message, type) {
        var n = noty({
          layout: 'bottomLeft',
          text: message,
          type: type || 'info',
          dismissQueue: true,
          timeout: 3000
        });
      },

      /**
       * Display a success message
       * @method function
       * @param  {[type]} message [description]
       * @return {[type]}         [description]
       */
      success: function success(message) {
        jUtility.msg.show(message, 'success');
      }, // end fn

      /**
       * Display a error message
       * @method function
       * @param  {[type]} message [description]
       * @return {[type]}         [description]
       */
      error: function error(message) {
        jUtility.msg.show(message, 'error');
      }, // end fn

      /**
       * Display a warning message
       * @method function
       * @param  {[type]} message [description]
       * @return {[type]}         [description]
       */
      warning: function warning(message) {
        jUtility.msg.show(message, 'warning');
      } },

    // end fn

    /**
     * DOM Manipulation Functions
     * @type {Object}
     */
    DOM: {

      /**
       * Hide header filters
       * @method function
       * @return {[type]} [description]
       */
      hideHeaderFilters: function hideHeaderFilters() {
        jApp.aG().$().find('.table-head .tfilters').hide();
        $('#btn_toggle_header_filters').removeClass('active');
      }, // end fn

      /**
       * Show header filters
       * @method function
       * @return {[type]} [description]
       */
      showHeaderFilters: function showHeaderFilters() {
        jUtility.DOM.headerFilterDeleteIcons();
        jApp.aG().$().find('.table-head .tfilters').show();
        $('#btn_toggle_header_filters').addClass('active');
      }, // end fn

      /**
       * Updates the grid when there is
       * or is not any data
       * @method function
       * @return {[type]}              [description]
       */

      dataEmptyHandler: function dataEmptyHandler() {
        $('.table-cell.no-data').remove();
        $('<div/>', { 'class': 'table-cell no-data' }).html('<div class="alert alert-warning"> <i class="fa fa-fw fa-warning"></i> I did not find anything matching your query.</div>').appendTo(jApp.tbl().find('#tbl_grid_body'));
        jUtility.DOM.updateColWidths();
      }, // end fn

      /**
       * Updates the grid when is or is not errors
       * in the response
       * @method function
       * @param  {Boolean} isDataEmpty [description]
       * @return {[type]}              [description]
       */
      dataErrorHandler: function dataErrorHandler() {
        $('.table-cell.no-data').remove();
        $('<div/>', { 'class': 'table-cell no-data' }).html('<div class="alert alert-danger"> <i class="fa fa-fw fa-warning"></i> There was an error retrieving the data.</div>').appendTo(jApp.tbl().find('#tbl_grid_body'));
        jUtility.DOM.updateColWidths();
      }, // end fn

      /**
       * Update the header title
       * @param  {[type]} newTitle [description]
       * @return {[type]}          [description]
       */
      updateHeaderTitle: function updateHeaderTitle(newTitle) {
        jApp.opts().gridHeader.headerTitle = newTitle;
        jApp.tbl().find('span.header-title').html(newTitle);
      }, // end fn

      /**
       * Toggle column visibility
       * @param  {[type]} elm [description]
       * @return {[type]}     [description]
       */
      toggleColumnVisibility: function toggleColumnVisibility(elm) {
        var col = elm.data('column'),
            i = +elm.closest('li').index() + 2;

        if (elm.find('i').hasClass('fa-check-square-o')) {
          elm.find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
          jApp.tbl().find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i + '), .table-body .table-cell:nth-child(' + i + ')').hide();
        } else {
          elm.find('i').addClass('fa-check-square-o').removeClass('fa-square-o');
          jApp.tbl().find('.table-head .table-row:not(:first-child) .table-header:nth-child(' + i + '), .table-body .table-cell:nth-child(' + i + ')').show();
        }

        jUtility.DOM.updateColWidths();
      }, //end fn

      /**  **  **  **  **  **  **  **  **  **
       *   rowsPerPage
       *
       *  @rowsPerPage (int) hide the preloader
       *
       *  show/hide the preload animation
       **  **  **  **  **  **  **  **  **  **/
      rowsPerPage: function rowsPerPage(_rowsPerPage) {
        if (isNaN(_rowsPerPage)) return false;

        jApp.aG().store.set('pref_rowsPerPage', _rowsPerPage);
        jApp.opts().pageNum = 1;
        jApp.aG().dataGrid.pagination.rowsPerPage = Math.floor(_rowsPerPage);
        jUtility.updatePagination();
        jUtility.DOM.page(1);
        jUtility.DOM.updateColWidths();
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   preload
       *
       *  @hide (bool) hide the preloader
       *
       *  show/hide the preload animation
       **  **  **  **  **  **  **  **  **  **/
      togglePreloader: function togglePreloader(hide) {
        if (typeof hide === 'undefined') {
          hide = false;
        }

        if (!hide) {
          jApp.tbl().css('background', 'url("/images/tbody-preload.gif") no-repeat center 175px rgba(0,0,0,0.15)').find('[name=RowsPerPage],[name=q]').prop('disabled', true).end().find('.table-body').css('filter', 'blur(1px) grayscale(100%)').css('-webkit-filter', 'blur(2px) grayscale(100%)').css('-moz-filter', 'blur(2px) grayscale(100%)');
          //.find('.table-cell, .table-header').css('border','1px solid transparent').css('background','none');
        } else {
            jApp.tbl().css('background', '').find('[name=RowsPerPage],[name=q]').prop('disabled', false).end().find('.table-body').css('filter', '').css('-webkit-filter', '').css('-moz-filter', '');
            //.find('.table-cell, .table-header').css('border','').css('background','');
          }
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   page
       *
       *  @pageNum (int) the new page number
       *  				to display
       *
       *  jumps to the desired page number
       **  **  **  **  **  **  **  **  **  **/
      page: function page(pageNum) {
        var first, last;

        jUtility.DOM.togglePreloader();

        if (isNaN(pageNum)) return false;
        pageNum = Math.floor(pageNum);

        jApp.opts().pageNum = pageNum;
        first = +((pageNum - 1) * jApp.aG().dataGrid.pagination.rowsPerPage);
        last = +(first + jApp.aG().dataGrid.pagination.rowsPerPage);
        jApp.tbl().find('.table-body .table-row').hide().slice(first, last).show();

        // set col widths
        setTimeout(jUtility.DOM.updateColWidths, 100);
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   updatePanelHeader
       *
       *  @text	(string) text to display
       *
       *  updates the text display in the
       *  header of the form wrapper
       *
       **  **  **  **  **  **  **  **  **  **/
      updatePanelHeader: function updatePanelHeader(text) {
        jUtility.$currentFormWrapper().find('.spn_editFriendlyName').html(text);
      }, // end fn

      /**
       * Remove rows from the DOM that do not have corresponding data
       * @param  {[type]} all [description]
       * @return {[type]}     [description]
       */
      removeRows: function removeRows(all) {
        var identifiers = _.pluck(jApp.aG().dataGrid.data, jApp.opts().pkey);

        if (typeof all !== 'undefined' && all) {
          jApp.tbl().find('.table-body .table-row').remove();
        } else {
          //--jApp.aG().DOM.$rowMenu.detach();

          jApp.tbl().find('.table-row[data-identifier]').filter(function (i, row) {
            return _.indexOf(identifiers, $(row).attr('data-identifier')) === -1;
          }).remove();
        }
      }, // end fn

      /**
       * Apply the header filters
       * @method function
       * @return {[type]} [description]
       */
      applyHeaderFilters: function applyHeaderFilters() {
        var matchedRows = [];

        jApp.log('Applying Header Filters');

        if (!jUtility.areHeaderFiltersNonempty()) {
          return jUtility.DOM.removeHeaderFilters();
        }

        jUtility.DOM.hidePaginationControls();

        jApp.log('Getting matched rows');
        matchedRows = jUtility.getHeaderFilterMatchedRows();

        jUtility.setVisibleRows(matchedRows);

        jApp.tbl().find('.filter-showing').html(jUtility.render(jApp.aG().html.tmpFilterShowing, {
          'totalVis': matchedRows.length,
          'totalRows': jApp.tbl().find('.table-body .table-row').length
        }));

        // update column widths
        jUtility.DOM.updateColWidths();
      }, // end fn

      /**
       * Remove the header filters
       * @method function
       * @return {[type]} [description]
       */
      removeHeaderFilters: function removeHeaderFilters() {
        if (jUtility.isPagination()) {
          jUtility.DOM.showPaginationControls();
          jUtility.DOM.updateFilterText('');
          jUtility.DOM.page(jApp.opts().pageNum);
        }
      }, // end fn

      /**
       * Update the Showing x/x filter text
       * @method function
       * @param  {[type]} text [description]
       * @return {[type]}      [description]
       */
      updateFilterText: function updateFilterText(text) {
        jApp.tbl().find('.filter-showing').html(text);
      }, // end fn

      /**
       * Show the pagination controls
       * @method function
       * @return {[type]} [description]
       */
      showPaginationControls: function showPaginationControls() {
        jApp.tbl().find('.divRowsPerPage, .paging').show();
      }, // end fn

      /**
       * Hide the pagination controls
       * @method function
       * @return {[type]} [description]
       */
      hidePaginationControls: function hidePaginationControls() {
        jApp.tbl().find('.divRowsPerPage, .paging').hide();
      }, // end fn

      /**
       * Header Filter Delete Icons
       * @method function
       * @return {[type]} [description]
       */
      headerFilterDeleteIcons: function headerFilterDeleteIcons() {
        if (!$('.table-header .deleteicon').length) {
          jApp.log('Adding header filter delete icons');
          $('.header-filter').after($('<span/>', { 'class': 'deleteicon', 'style': 'display:none' }).html(jUtility.render(jApp.aG().html.tmpClearHeaderFilterBtn)));
        } else {
          jApp.log('Delete icons already added');
        }
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   sortByCol
       *
       *  @colNum (int) the 1-indexed html
       *  			column to sort by
       *
       *  @desc 	(bool) sort descending
       *
       *  sorts the table rows in the DOM
       *  according the the input column
       *  and direction (asc default)
       **  **  **  **  **  **  **  **  **  **/
      sortByCol: function sortByCol(colNum, desc) {
        var $col;

        if (typeof colNum === 'undefined' && typeof jApp.aG().temp.sortOptions === 'undefined') {
          return false;
        }

        if (typeof colNum === 'undefined') {
          colNum = jApp.aG().temp.sortOptions.colNum;
          desc = jApp.aG().temp.sortOptions.desc;
        } else {
          jApp.aG().temp.sortOptions = { colNum: colNum, desc: desc };
        }

        //col
        $col = jApp.tbl().find('.table-body .table-row .table-cell:nth-child(' + colNum + ')').map(function (i, elm) {
          return [[$(elm).text().toLowerCase(), $(elm).parent()]];
        }).sort(function (a, b) {

          if (jQuery.isNumeric(a[0]) && jQuery.isNumeric(b[0])) {
            return a[0] - b[0];
          }

          if (a[0] > b[0]) {
            return 1;
          }

          if (a[0] < b[0]) {
            return -1;
          }

          // a must be equal to b
          return 0;
        });

        // iterate through col
        $.each($col, function (i, elm) {
          var $e = $(elm[1]);

          // detach the row from the DOM
          $e.detach();

          // attach the row in the correct order
          !desc ? jApp.tbl().find('.table-body').append($e) : jApp.tbl().find('.table-body').prepend($e);
        });

        // go to the appropriate page to refresh the view
        jUtility.DOM.page(jApp.opts().pageNum);

        // apply header filters
        jUtility.DOM.applyHeaderFilters();
      }, // end fn

      /**
       * Hide or show the activity preloader
       * @method function
       * @param  {[type]} action [description]
       * @return {[type]}        [description]
       */
      activityPreloader: function activityPreloader(action) {
        if (action !== 'hide') {
          $('.ajax-activity-preloader').show();
        } else {
          $('.ajax-activity-preloader').hide();
        }
      }, //end fn

      /**
       * Empty the page wrapper div
       * @method function
       * @return {[type]} [description]
       */
      emptyPageWrapper: function emptyPageWrapper() {
        $('#page-wrapper').empty();
      }, //end fn

      /**
       * Toggle header filters
       * @method function
       * @return {[type]} [description]
       */
      toggleHeaderFilters: function toggleHeaderFilters() {
        jApp.log('headerFilters toggled');

        jApp.opts().toggles.headerFiltersDisplay = !jApp.opts().toggles.headerFiltersDisplay;

        if ($('.tfilters:visible').length) {
          jUtility.DOM.hideHeaderFilters();
        } else {
          jUtility.DOM.showHeaderFilters();
        }

        jUtility.DOM.updateColWidths();
      }, //end fn

      /**
       * Update the grid position
       * @return {[type]} [description]
       */
      updateGridPosition: function updateGridPosition() {
        var p = jUtility.calculateGridPosition();
        if (!p) return false;

        $('.grid-panel-body').css({ 'marginTop': p.marginTop }).find('.table').css({ 'height': p.height });

        $('.table-grid').perfectScrollbar('update');
      }, // end fn

      /**
       * Handles the page wrapper after scrolling
       * @return {[type]} [description]
       */
      pageWrapperScrollHandler: function pageWrapperScrollHandler() {

        var pw = $('#page-wrapper'),
            isScrolled = pw.hasClass('scrolled'),
            offsetTop = $('.table-body').offset().top,
            lowerBound = 150,
            upperBound = 180;

        if (!isScrolled && offsetTop < lowerBound) {
          pw.addClass('scrolled');
          jUtility.DOM.updateGridPosition();
        } else if (isScrolled && offsetTop > upperBound) {
          pw.removeClass('scrolled');
          jUtility.DOM.updateGridPosition();
        }
      }, // end fn

      /**
       * Clear the column widths
       * @return {[type]} [description]
       */
      clearColumnWidths: function clearColumnWidths() {
        $('.grid-panel-body .table-row').find('.table-cell, .table-header').css('width', '');
      }, //end fn

      /**
       * Update column widths
       * @method function
       * @return {[type]} [description]
       */
      updateColWidths: function updateColWidths() {
        var headerRowIndex = 3,
            bottomOffset = 0;

        jUtility.DOM.updateGridPosition();
        jUtility.setupSortButtons();

        jUtility.DOM.clearColumnWidths();

        // perfect scrollbar
        $('.table-grid').perfectScrollbar('update');

        jApp.opts().maxColWidth = +350 / 1920 * +$(window).innerWidth();

        //visible columns
        var visCols = +$('.table-head .table-row.colHeaders').find('.table-header:visible').length - 1;

        for (var ii = 1; ii <= visCols; ii++) {

          var colWidth = Math.max.apply(Math, $('.grid-panel-body .table-row').map(function (i) {
            return $(this).find('.table-cell:visible,.table-header-text:visible').eq(ii).innerWidth();
          }).get());

          if (+colWidth > jApp.opts().maxColWidth && ii < visCols) {
            colWidth = jApp.opts().maxColWidth;
          }

          if (ii == visCols) {
            colWidth = +$(window).innerWidth() - $('.table-head .table-row.colHeaders').find('.table-header:visible').slice(0, -1).map(function (i) {
              return $(this).innerWidth();
            }).get().reduce(function (p, c) {
              return p + c;
            }) - 40;
          }

          var nindex = +ii + 1;

          // set widths of each cell
          $('.grid-panel-body .table-row:not(.tr-no-data) .table-cell:visible:nth-child(' + nindex + '),' + '.grid-panel-body .table-row:not(.tr-no-data) .table-header:nth-child(' + nindex + ')').css('width', +colWidth + 14);
        }

        //hide preload mask
        jUtility.DOM.togglePreloader(true);
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   moveRowMenu
       *
       *  @tr - target table row element
       *
       *  Moves the row menu to the target
       **  **  **  **  **  **  **  **  **  **/
      moveRowMenu: function moveRowMenu($tr) {
        // jApp.aG().DOM.$rowMenu.detach().appendTo( $tr.find('.table-cell .rowMenu-container').eq(0) );
      }, // end fn

      /**
       * Attach Row Menu To The DOM
       * @method function
       * @return {[type]} [description]
       */
      attachRowMenu: function attachRowMenu() {
        $('.table-rowMenu-row').empty().append(jApp.aG().DOM.$rowMenu.wrap('<div class="table-header"></div>').parent());
      }, //end fn

      /**
       * Update the row menu
       * @method function
       * @return {[type]} [description]
       */
      updateRowMenu: function updateRowMenu(num_checked) {
        switch (num_checked) {
          case 0:
            jUtility.DOM.toggleRowMenu(false);

            break;

          case 1:
            jUtility.DOM.toggleRowMenu(true);
            jUtility.DOM.toggleRowMenuItems(false);
            break;

          default:
            jUtility.DOM.toggleRowMenu(true);
            jUtility.DOM.toggleRowMenuItems(true);
            break;
        }
      }, // end fn

      /**
       * Toggle Row Menu Items
       * @method function
       * @param  {[type]} hideNonMultiple [description]
       * @return {[type]}                 [description]
       */
      toggleRowMenuItems: function toggleRowMenuItems(disableNonMultiple) {
        if (disableNonMultiple) {
          $('.table-row.table-rowMenu-row .btn[data-multiple=false]').addClass('disabled').prop('disabled', true);
        } else {
          var p = jApp.aG().permissions;
          $('.table-row.table-rowMenu-row .btn').each(function () {
            if ($(this).attr('data-permission') == null || !!p[$(this).attr('data-permission')]) {
              $(this).removeClass('disabled').prop('disabled', false);
            }
          });
        }
      }, //end fn

      /**
       * Toggle Row Menu visibility
       * @method function
       * @return {[type]} [description]
       */
      toggleRowMenu: function toggleRowMenu(on) {
        if (on != null) {
          $('.table-row.table-rowMenu-row').toggle(on);
          $('.table-row.table-menu-row').toggle(!on);
        } else {
          $('.table-row.table-rowMenu-row').toggle();
          $('.table-row.table-menu-row').toggle();
        }
        jUtility.DOM.updateColWidths();
      }, // end fn

      /**
       * Reset row menu to non-expanded state
       * @method function
       * @return {[type]} [description]
       */
      resetRowMenu: function resetRowMenu() {
        //$('.btn-showMenu').removeClass('rotate');
        //jApp.aG().DOM.$rowMenu.removeClass('expand');
      }, // end fn

      /**
       * Initialize grid
       * @method function
       * @return {[type]} [description]
       */
      initGrid: function initGrid() {
        var id = jApp.opts().table + '_' + Date.now();

        jApp.aG().DOM.$grid = $('<div/>', { id: id }).html(jUtility.render(jApp.aG().html.tmpMainGridBody, jApp.opts().gridHeader)).find('select#RowsPerPage').val(jApp.aG().dataGrid.pagination.rowsPerPage).end().appendTo('#page-wrapper');

        jApp.aG().DOM.$tblMenu = jApp.aG().DOM.$grid.find('.table-btn-group');

        if (!jApp.opts().gridHeader.helpText) {
          jApp.tbl().find('.helpText').hide();
        }
      }, // end fn

      /**
       * iterates through changed data and updates the DOM
       * @method function
       * @return {[type]} [description]
       */
      updateGrid: function updateGrid() {
        // init vars
        var appendTR = false,
            appendTD = false;

        if (!!jApp.aG().dataGrid.delta[0] && jApp.aG().dataGrid.delta[0][jApp.opts().pkey] === 'NoData') {
          var tr = $('<div/>', { 'class': 'table-row tr-no-data' }).append($('<div/>', { 'class': 'table-cell' }).html('No Data'));

          jApp.tbl().find('.table-body').empty().append(tr);
          return false;
        }

        // iterate through the changed data
        $.each(jApp.aG().dataGrid.delta, function (i, oRow) {

          jApp.tbl().find('.table-body .tr-no-data').remove();

          // save the current row.
          jApp.aG().currentRow = jApp.aG().dataGrid.data[i];

          // find row in the table if it exists
          var tr = jApp.tbl().find('.table-row[data-identifier="' + oRow[jApp.opts().pkey] + '"]');

          // try the json key if you can't find the row by the pkey
          if (!tr.length) tr = jApp.tbl().find('.table-row[data-jsonkey=' + i + ']');

          // create the row if it does not exist
          if (!tr.length) {
            tr = $('<div/>', { 'class': 'table-row', 'data-identifier': oRow[jApp.opts().pkey], 'data-jsonkey': i });
            appendTR = true;

            if (jUtility.isEditable()) {

              var td_chk = $('<div/>', { 'class': 'table-cell', "nowrap": "nowrap", "style": "position:relative;" });
              //var td_chk = $('<div/>', { 'class' : 'table-cell', "nowrap" : "nowrap" } );
              if (!!jApp.opts().cellAtts['*']) {
                $.each(jApp.opts().cellAtts['*'], function (at, fn) {
                  td_chk.attr(at, fn());
                });
              }

              var collapseMenu = '';

              var tdCheck = !!oRow[jApp.opts().pkey] ? '<input type="checkbox" class="chk_cid" name="cid[]" />' : '';

              var lblCheck = '<label class="btn btn-default pull-right lbl-td-check" style="margin-left:20px;"> ' + tdCheck + '</label>';

              td_chk.html(collapseMenu + lblCheck + '<div class="rowMenu-container"></div> \
                      </div>&nbsp;');
              tr.append(td_chk);
            }
          } else {
            // update the row data- attributes
            tr.attr('data-identifier', oRow[jApp.opts().pkey]).attr('data-jsonkey', i);

            var td_chk = tr.find('.table-cell').eq(0);
            // update the attributes on the first cell
            if (!!jApp.opts().cellAtts['*']) {
              $.each(jApp.opts().cellAtts['*'], function (at, fn) {
                td_chk.attr(at, fn());
              });
            }
          }

          // iterate through the columns
          //$.each( jApp.aG().currentRow, function(key, value) {
          $.each(jApp.opts().columns, function (i, key) {

            // get the value of the current key
            var value = jApp.aG().currentRow[key];

            // determine if the column is hidden
            if (_.indexOf(jApp.opts().hidCols, key) !== -1) {
              return false;
            }

            // find the cell if it exists
            var td = tr.find('.table-cell[data-identifier="' + key + '"]');

            // create the cell if needed
            if (!td.length) {
              td = $('<div/>', { 'class': 'table-cell', 'data-identifier': key });
              appendTD = true;
            }

            // set td attributes
            if (!!jApp.opts().cellAtts['*']) {
              $.each(jApp.opts().cellAtts['*'], function (at, fn) {
                td.attr(at, fn());
              });
            }

            if (!!jApp.opts().cellAtts[key]) {
              $.each(jApp.opts().cellAtts[key], function (at, fn) {
                td.attr(at, fn());
              });
            }

            // prepare the value
            value = jUtility.prepareValue(value, key);

            if (td.html().trim() !== value.trim()) {
              // set the cell value
              td.html(value).addClass('changed');
            }

            // add the cell to the row if needed
            if (appendTD) {
              tr.append(td);
            }
          }); // end each

          // add the row if needed
          if (appendTR) {
            jApp.tbl().find('.table-body').append(tr);
          }
        }); // end each

        // reset column widths
        jUtility.DOM.updateColWidths();

        // animate changed cells

        // .stop()
        // .css("background-color", "#FFFF9C")
        // .animate({ backgroundColor: 'transparent'}, 1500, function() { $(this).removeAttr('style');  } );

        setTimeout(function () {
          jApp.tbl().find('.table-cell.changed').removeClass('changed');
        }, 2000);

        jUtility.countdown();
        jUtility.DOM.page(jApp.opts().pageNum);

        // deal with the row checkboxes
        jApp.tbl().find('.table-row').filter(':not([data-identifier])').find('.lbl-td-check').remove() // remove the checkbox if there is no primary key for the row
        .end().end().filter('[data-identifier]') // add the checkbox if there is a primary key for the row
        .each(function (i, elm) {
          if (jUtility.isEditable() && $(elm).find('.lbl-td-check').length === 0) {
            $('<label/>', { 'class': 'btn btn-default pull-right lbl-td-check', style: 'margin-left:20px' }).append($('<input/>', { type: 'checkbox', 'class': 'chk_cid', name: 'cid[]' })).appendTo($(elm));
          }
        });

        jApp.tbl().find('.table-body .table-row, .table-head .table-row:last-child').each(function (i, elm) {
          if ($(elm).find('.table-cell,.table-header').length < 4) {
            $('<div/>', { 'class': 'table-cell' }).appendTo($(elm));
          }
        });

        jApp.tbl().find('.table-head .table-row:nth-child(2)').each(function (i, elm) {
          if ($(elm).find('.table-cell,.table-header').length < 3) {
            $('<div/>', { 'class': 'table-cell' }).appendTo($(elm));
          }
        });

        // process pagination
        jUtility.updatePagination();
      },

      /**
       * Clear the menus so they can be rebuilt
       * @method function
       * @return {[type]} [description]
       */
      clearMenus: function clearMenus() {
        jApp.aG().DOM.$tblMenu.find('.btn:not(.btn-toggle)').remove();
        jApp.aG().DOM.$rowMenu.empty();
        //jApp.aG().DOM.$withSelectedMenu.empty();
      }, // end fn

      /**
       * Build a menu
       * @method function
       * @param  {obj} collection 	collection of menu options to iterate over
       * @param  {jQuery} target    DOM target for new buttons/links
       * @param  {string} type 			buttons | links
       */
      buildMenu: function buildMenu(collection, target, type, order) {
        var o, key, oo, kk, btn;

        if (typeof type === 'undefined') {
          type = 'buttons';
        }

        //build menu
        _.each(collection, function (o, key) {
          if (!!o.ignore) return false;
          if (jUtility.isButtonEnabled(key)) {
            if (key === 'custom') {
              _.each(o, function (oo, kk) {
                if (!!oo.ignore) return false;

                if (jUtility.isPermission(oo)) {
                  jApp.log('Button enabled : ' + kk);
                  delete oo.disabled;
                } else {
                  jApp.log('Button disabled : ' + kk);
                  oo.disabled = true;
                }

                if (type == 'buttons') {
                  jUtility.DOM.createMenuButton(oo).appendTo(target);
                } else {
                  jUtility.DOM.createMenuLink(oo).appendTo(target);
                }
              });
            } else {

              if (jUtility.isPermission(o)) {
                jApp.log('Button enabled : ' + key);
                delete o.disabled;
              } else {
                jApp.log('Button disabled : ' + key);
                o.disabled = true;
              }

              //jApp.log(o);
              if (type == 'buttons') {
                jUtility.DOM.createMenuButton(o).clone().appendTo(target);
              } else {
                jUtility.DOM.createMenuLink(o).appendTo(target);
              }
            }
          }
        });

        //sort buttons by data-order
        if (!!order) {
          var btns = target.find('.btn');

          btns.detach().sort(function (a, b) {
            var an = +a.getAttribute('data-order'),
                bn = +b.getAttribute('data-order');

            if (an > bn) return 1;
            if (an < bn) return -1;
            return 0;
          }).appendTo(target);
        }
      }, //end fn

      /**
       * Build a button menu
       * @method function
       */
      buildBtnMenu: function buildBtnMenu(collection, target, order) {
        jUtility.DOM.buildMenu(collection, target, 'buttons', order);
      }, //end fn

      /**
       * Build a link menu
       * @method function
       */
      buildLnkMenu: function buildLnkMenu(collection, target, order) {
        jUtility.DOM.buildMenu(collection, target, 'links', order);
      }, // end fn

      /**
       * Helper function to create menu links
       * @method function
       * @param  {obj} o html parameters of the link
       * @return {jQuery obj}
       */
      createMenuLink: function createMenuLink(o) {
        var $btn, $btn_a, $btn_choice, $ul;

        $btn_choice = $('<a/>', { href: 'javascript:void(0)', 'data-permission': o['data-permission'] != null ? o['data-permission'] : '' });

        //add the icon
        if (!!o.icon) {
          $btn_choice.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + o.icon }));
        }
        // add the label
        if (!!o.label) {
          $btn_choice.append($('<span/>').html(o.label));
        }

        // disable/enable the button
        if (o.disabled === true) {
          $btn_choice.prop('disabled', true).addClass('disabled');
        } else {
          $btn_choice.prop('disabled', false).removeClass('disabled');
        }

        // add the click handler
        if (!!o.fn) {
          if (typeof o.fn === 'string') {
            if (o.fn !== 'delete') {
              $btn_choice.off('click.custom').on('click.custom', function () {
                jApp.aG().withSelectedButton = $(this);
                jUtility.withSelected('custom', jApp.aG().fn[o.fn]);
              });
            } else {
              $btn_choice.off('click.custom').on('click.custom', function () {
                jApp.aG().withSelectedButton = $(this);
                jUtility.withSelected('delete', null);
              });
            }
          } else if (typeof o.fn === 'function') {
            $btn_choice.off('click.custom').on('click.custom', function () {
              jApp.aG().withSelectedButton = $(this);
              jUtility.withSelected('custom', o.fn);
            });
          }
        }

        // add the html5 data
        if (!!o.data) {
          _.each(o.data, function (v, k) {
            $btn_choice.attr('data-' + k, v);
          });
        }

        return $('<li/>', { 'class': o['class'], title: o.title }).append($btn_choice);
      }, // end fn

      /**
       * Helper function to create menu buttons
       * @method function
       * @param  {obj} o html parameters of the button
       * @return {jQuery obj}
       */
      createMenuButton: function createMenuButton(params) {
        var $btn, $btn_a, $btn_choice, $ul;

        if (typeof params[0] === 'object') {
          // determine if button is a dropdown menu
          $btn = $('<div/>', { 'class': 'btn-group btn-group-sm' });
          // params[0] will contain the dropdown toggle button
          $btn_a = $('<a/>', {
            type: 'button',
            'class': params[0]['class'] + ' dropdown-toggle',
            href: '#',
            'data-toggle': 'dropdown'
          });

          // add the icon if applicable
          if (!!params[0].icon) {
            $btn_a.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + params[0].icon }));
          }
          // add the label if applicable
          if (!!params[0].label) {
            $btn_a.append($('<span/>').html(params[0].label));
          }
          // add the click handler, if applicable
          if (typeof params[0].fn !== 'undefined') {
            if (typeof params[0].fn === 'string') {
              $btn_a.off('click.custom').on('click.custom', jApp.aG().fn[params[0].fn]);
            } else if (typeof params[0].fn === 'function') {
              $btn_a.off('click.custom').on('click.custom', params[0].fn);
            }
          }
          // add the dropdown if there are multiple options
          if (params.length > 1) {
            $btn_a.append($('<span/>', { 'class': 'fa fa-caret-down' }));
            $btn.append($btn_a);
            $ul = $('<ul/>', { 'class': 'dropdown-menu' });

            _.each(params, function (o, key) {
              if (key == 0) return false;
              var signature = 'btn_' + Array(26).join((Math.random().toString(36) + '000000000000000000000').slice(2, 18)).slice(0, 25);

              $btn_choice = $('<a/>', $.extend(true, { 'data-permission': '' }, _.omit(o, 'fn'), { href: '#', 'data-signature': signature }));

              // disable/enable the button
              if (o.disabled === true) {
                $btn_choice.prop('disabled', true).addClass('disabled');
              } else {
                $btn_choice.prop('disabled', false).removeClass('disabled');
              }

              //add the icon
              if (!!o.icon) {
                $btn_choice.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + o.icon }));
              }
              // add the label
              if (!!o.label) {
                $btn_choice.append($('<span/>').html(o.label));
              }

              // add the click handler
              if (!!o.fn) {
                if (typeof o.fn === 'string') {
                  $(document).delegate('a[data-signature=' + signature + ']', 'click.custom', jApp.aG().fn[o.fn]);
                } else if (typeof o.fn === 'function') {
                  $(document).delegate('a[data-signature=' + signature + ']', 'click.custom', o.fn);
                }
              }

              $btn_choice.wrap('<li></li>').parent().appendTo($ul);
            });

            $btn.append($ul);
          } else {
            $btn.append($btn_a);
          }
        } else {
          // generate a random, unique button signature
          var signature = 'btn_' + Array(26).join((Math.random().toString(36) + '000000000000000000000').slice(2, 18)).slice(0, 25);

          $btn = $('<button/>', _.omit(params, ['fn'])).attr('data-signature', signature);

          //add ignore flag for toggle buttons
          if ($btn.hasClass('btn-toggle')) {
            params.ignore = true;
          }
          if (!!params.icon) {
            $btn.append($('<i/>', { 'class': 'fa fa-fw fa-lg ' + params.icon }));
          }
          if (!!params.label) {
            $btn.append($('<span/>').html(params.label));
          }
          if (!!params.fn) {
            if (typeof params.fn === 'string') {
              $(document).delegate('button[data-signature=' + signature + ']', 'click.custom', jApp.aG().fn[params.fn]);
            } else if (typeof params.fn === 'function') {
              $(document).delegate('button[data-signature=' + signature + ']', 'click.custom', params.fn);
            }
          }
          // disable/enable the button
          if (params.disabled === true) {
            $btn.prop('disabled', true).addClass('disabled');
          } else {
            $btn.prop('disabled', false).removeClass('disabled');
          }
        }

        return $btn;
      }, // end fn

      /**
       * Build form
       * @method function
       * @param  {[type]} params [description]
       * @param  {[type]} key    [description]
       * @return {[type]}        [description]
       */
      buildForm: function buildForm(params, key, htmlKey, tableFriendly) {
        var $frmHandle = '$' + key,
            oFrmHandle = 'o' + key.ucfirst(),
            oFrm;

        htmlKey = htmlKey != null ? htmlKey : key;

        // make sure the form template exists
        if (typeof jApp.aG().html.forms[htmlKey] === 'undefined') return false;

        // create form object
        jApp.aG().forms[oFrmHandle] = oFrm = new jForm(params);

        // create form container
        jApp.aG().forms[$frmHandle] = $('<div/>', { 'class': 'gridFormContainer' }).html(jUtility.render(jApp.aG().html.forms[htmlKey], { tableFriendly: tableFriendly || jApp.opts().model })).find('.formContainer').append(oFrm.fn.handle()).end().appendTo(jApp.aG().$());
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   overlay
       *
       *  Controls the modal overlays
       **  **  **  **  **  **  **  **  **  **/
      overlay: function overlay(which, action) {
        var $which = which == 1 ? '#modal_overlay' : '#modal_overlay2';
        if (action == 'on') {
          $($which).show();
        } else {
          $($which).hide();
        }
      },

      /**
       * Setup Grid Headers
       * @method function
       * @return {[type]} [description]
       */
      setupGridHeaders: function setupGridHeaders() {
        // init vars
        var appendTH = false,
            theaders,
            tfilters,
            btn,
            isActive,
            self = jApp.aG();

        // find the header row
        theaders = self.DOM.$grid.find('.table-head .table-row.colHeaders');

        // create the header row if needed
        if (!theaders.length) {
          tfilters = self.DOM.$grid.find('.table-row.tfilters');
          theaders = $('<div/>', { 'class': 'table-row colHeaders' });
          appendTH = true;

          // Append the check all checkbox
          if (jUtility.isEditable()) {
            theaders.append($('<div/>', { 'class': 'table-header table-header-text' }).html(jUtility.render(self.html.tmpCheckAll)));
          }

          // create header for this column if needed
          $.each(self.options.headers, function (i, v) {
            // determine if the current column is the active sortBy column
            isActive = self.options.columns[i] === self.options.sortBy ? true : false;

            // render the button
            btn = jUtility.render(self.html.tmpSortBtn, {
              'ColumnName': self.options.columns[i],
              'BtnClass': isActive ? 'btn-primary' : '',
              'faClass': isActive ? 'amount-desc' : 'amount-asc',
              'BtnTitle': isActive ? 'Sort Descending' : 'Sort Ascending'
            });

            // append the header
            theaders.append($('<div/>', { 'class': 'table-header table-header-text' }).html(btn + v));

            if (i > 0) {
              // skip the id column
              tfilters.append($('<div/>', { 'class': 'table-header', 'style': 'position:relative' }).append($('<input/>',
              //tfilters.append( $('<div/>', { 'class' : 'table-header'}).append( $('<input/>',
              {
                'rel': self.options.columns[i],
                'id': 'filter_' + self.options.columns[i],
                'name': 'filter_' + self.options.columns[i],
                'class': 'header-filter form-control',
                'style': 'width:100%',
                'placeholder': self.options.headers[i]
              })));
            }
          });

          self.DOM.$grid.find('.table-head').append(theaders);
          self.DOM.$grid.find('.paging').parent().attr('colspan', self.options.headers.length - 2);
          //self.DOM.$grid.find('.with-selected-menu').append( self.DOM.$withSelectedMenu.find('li') );
        }
      }

    }, // end DOM fns

    /**  **  **  **  **  **  **  **  **  **
    *   CALLBACK
    *
    *  Defines the callback functions
    *  used by the various AJAX calls
    **  **  **  **  **  **  **  **  **  **/
    callback: {

      /**
       * Process the result of the form submission
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      submitCurrentForm: function submitCurrentForm(response) {
        if (jUtility.isResponseErrors(response)) {
          jUtility.msg.error(jUtility.getErrorMessage(response));
        } else {
          jUtility.msg.success('Operation Completed Successfully!');
          if (jApp.opts().closeOnSave) {
            if (jUtility.needsCheckin()) {
              jUtility.checkin(jUtility.getCurrentRowId());
            } else {
              jUtility.closeCurrentForm();
            }
          }
          jUtility.getGridData();
          jUtility.DOM.resetRowMenu();
        }
      }, // end fn

      /**  **  **  **  **  **  **  **  **  **
       *   update
       *
       *  @response (obj) The JSON object
       *  returned by the ajax request
       *
       *  processes the result of the AJAX
       *  request
       **  **  **  **  **  **  **  **  **  **/
      update: function update(response) {
        jApp.log('6.6 data received. processing...');

        jUtility.DOM.setupGridHeaders();

        $('.table-cell.no-data').remove();

        if (jUtility.isResponseErrors(response)) {
          return jUtility.DOM.dataErrorHandler();
        }

        if ($.isEmptyObject(response)) {
          return jUtility.DOM.dataEmptyHandler();
        }

        // init vars
        var appendTH = false,
            theaders,
            tfilters,
            btn,
            isActive,
            self = jApp.aG();

        // detect changes in data;
        self.dataGrid.delta = !$.isEmptyObject(self.dataGrid.data) ? jUtility.deltaData(self.dataGrid.data, response) : response;

        // merge the changes into self.dataGrid.data
        if (!!self.dataGrid.delta) {
          self.dataGrid.data = response;
        } else {
          // abort if no changes in the data
          return false;
        }

        // remove all rows, if needed
        if (self.options.removeAllRows) {
          jUtility.DOM.removeRows(true);
        }

        // show the preloader, then update the contents
        jUtility.DOM.togglePreloader();

        // update the DOM
        jUtility.DOM.updateGrid();

        // remove the rows that may have been removed from the data
        jUtility.DOM.removeRows();
        jUtility.buildMenus();
        jUtility.DOM.togglePreloader(true);
        self.options.removeAllRows = false;

        if (!self.loaded) {
          // custom init fn
          if (self.fn.customInit && typeof self.fn.customInit === 'function') {
            self.fn.customInit();
          }
          self.loaded = true;
        }

        // adjust column widths
        jUtility.DOM.updateColWidths();

        // adjust permissions
        jUtility.callback.getPermissions(jApp.aG().permissions);

        // perform sort if needed
        jUtility.DOM.sortByCol();
      }, // end fn

      /**
       * Update panel header from row data
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      updateDOMFromRowData: function updateDOMFromRowData(response) {
        var data = response,
            self = jApp.aG();
        self.rowData = response;
        //jUtility.DOM.updatePanelHeader( data[ self.options.columnFriendly ] );
      }, // end fn

      /**
       * Check out row
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      checkout: function checkout(response) {
        if (!jUtility.isResponseErrors(response)) {
          jUtility.msg.success('Record checked out for editing.');
          jUtility.setupFormContainer();
          jUtility.getCheckedOutRecords();
        }
      }, //end fn

      /**
       * Check in row
       * @method function
       * @return {[type]} [description]
       */
      checkin: function checkin(response) {
        if (jUtility.isResponseErrors(response)) {
          jUtility.msg.warning(jUtility.getErrorMessage(response));
        }
        jUtility.getCheckedOutRecords();
        jUtility.closeCurrentForm();
      }, //end fn

      /**
       * Display response errors
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      displayResponseErrors: function displayResponseErrors(response) {
        if (jUtility.isResponseErrors(response)) {
          jUtility.msg.clear();
          jUtility.msg.error(jUtility.getErrorMessage(response));
        }
      }, //end fn

      /**
       * Get Checked out records
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      getCheckedOutRecords: function getCheckedOutRecords(response) {
        /**
         * To do
         */

        var $tr,
            $i = $('<i/>', { 'class': 'fa fa-lock fa-fw checkedOut' }),
            self = jApp.aG();

        self.DOM.$grid.find('.chk_cid').parent().removeClass('disabled').show();
        self.DOM.$grid.find('.rowMenu-container').removeClass('disabled');
        self.DOM.$grid.find('.checkedOut').remove();

        _.each(response, function (o, key) {

          if (!!o && !!o.lockable_id) {
            $tr = $('.table-row[data-identifier="' + o.lockable_id + '"]');

            $tr.find('.chk_cid').parent().addClass('disabled').hide().closest('.table-cell').append($('<span/>', { 'class': 'btn btn-default btn-danger pull-right checkedOut' }).html($i.prop('outerHTML')).clone().attr('title', 'Locked By ' + o.user.person.name));
            $tr.find('.rowMenu-container').addClass('disabled').find('.rowMenu.expand').removeClass('expand');
          }
        });
      }, //end fn

      /**
       * Process the grid link tables
       * @method function
       * @param  {[type]} colParams [description]
       * @return {[type]}           [description]
       */
      linkTables: function linkTables(colParams) {
        var self = jApp.aG();

        // add the colParams to the linkTable store
        self.linkTables = _.union(self.linkTables, colParams);

        // count the number of completed requests
        if (!self.linkTableRequestsComplete) {
          self.linkTableRequestsComplete = 1;
        } else {
          self.linkTableRequestsComplete++;
        }

        // once all linkTable requests are complete, apply the updates to the forms
        if (self.linkTableRequestsComplete == self.options.linkTables.length) {
          // update the edit form
          self.forms.oEditFrm.options.colParamsAdd = self.linkTables;
          self.forms.oEditFrm.fn.processColParams();
          self.forms.oEditFrm.fn.processBtns();

          // update the new form
          self.forms.oNewFrm.options.colParamsAdd = self.linkTables;
          self.forms.oNewFrm.fn.processColParams();
          self.forms.oNewFrm.fn.processBtns();
        }
      }, //end fn

      /**
       * Show or hide controls based on permissions.
       * @method function
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      getPermissions: function getPermissions(response) {

        jApp.log('Setting activeGrid permissions');
        jApp.activeGrid.permissions = response;

        jApp.log(jApp.aG().permissions);

        _.each(response, function (value, key) {
          jApp.log('12.1 Setting Permission For ' + key + ' to ' + value);
          if (value !== 1) {
            $('[data-permission=' + key + ']').remove();
          }
        });
      } } };

  // add it to the global scope
  // end fn

  // end callback defs

  window.jUtility = jUtility;
})(window, $, jApp);

/**
 *  jForm.class.js - Custom Form JS class
 *
 *  Defines the properties and methods of the
 *  custom form class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, underscore.js, jStorage.js
 */

// jquery function for clearing a form of all its values
$.fn.clearForm = function () {
  return this.each(function () {
    if (!!$(this).prop('disabled') || !!$(this).prop('readonly')) return false;

    var type = this.type,
        tag = this.tagName.toLowerCase();
    if (tag == 'form') return $(':input', this).clearForm();
    if (type == 'text' || type == 'password' || tag == 'textarea') this.value = '';else if (type == 'checkbox' || type == 'radio') this.checked = false;else if (tag == 'select') this.selectedIndex = !!$(this).prop('multiple') ? -1 : 0;
    $(this).psiblings('.form-control-feedback').removeClass('glyphicon-remove').removeClass('glyphicon-ok').hide();
    $(this).closest('.form_element').removeClass('has-error').removeClass('has-success');
  });
};

// javascript closure
;(function (window, $, jQuery) {

  'use strict';

  var jForm = function jForm(options) {
    /**  **  **  **  **  **  **  **  **  **
    	 *   VARS
    	 **  **  **  **  **  **  **  **  **  **/

    // alias this
    var self = this;

    this.$frm = false;
    this.store = $.jStorage;
    this.submitted = false;

    /**  **  **  **  **  **  **  **  **  **
     *   DEFAULT OPTIONS
     *
     *  Set the default options for the
     *  instance here. Any values specified
     *  at runtime will overwrite these
     *  values.
     **  **  **  **  **  **  **  **  **  **/

    this.options = {
      // form setup
      model: '',
      table: '',
      atts: { // form html attributes
        'method': 'POST',
        'action': '',
        'role': 'form',
        'onSubmit': 'return false',
        'name': false,
        'enctype': 'multipart/form-data'
      },
      hiddenElms: false,
      wrap: '',
      btns: false,
      fieldset: false,
      disabledElements: [],
      /* colParams - 	accept, alt, autocomplete, autofocus, checked, cols,
      				disabled, form, formaction, formenctype, formmethod,
      				formnovalidate, formtarget, height, id, list, max,
      				maxlength, min, multiple, name, pattern, placeholder,
      				readonly, required, rows, size, src, step, type, data-validType,
      				value, width, wrap, onClick, onChange, class, _labels,
      				_options, _firstlabel, _firstoption, _label, _enabled,
      				viewName, data-ordering, fieldset, _optionsSource, _labelsSource,
      				_optionsFilter, _linkedElmID, _linkedElmOptions,
      				_linkedElmLabels, _linkedElmFilterCol
      */
      colParams: {},
      colParamsAdd: [], // storage container for additional colParams such as from linkTables
      loadExternal: true, // load external colParams e.g. from a db
      ttl: 30, // TTL for external data (mins)
      tableFriendly: '', // friendly name of table e.g. Application
      layout: 'standard' // standard (three-column layout) | single (one-col layout)
    };

    // set the runtime values for the options
    $.extend(true, this.options, options);

    // set up the callback functions
    $.extend(true, this.callback, options.callback);

    // alias for attributes container
    var oAtts = this.options.atts;

    // set default values
    if (!this.options.fieldset) {
      this.options.fieldset = {
        'legend': self.options.tableFriendly + ' Details',
        'id': 'fs_details'
      };
    }

    // set the default buttons, if not present
    if (!this.options.btns) {
      this.options.btns = [{ type: 'button', 'class': 'btn btn-primary btn-formMenu', id: 'btn_form_menu_heading', value: '<i class="fa fa-fw fa-bars"></i>' }, { type: 'button', 'class': 'btn btn-primary btn-go', id: 'btn_go', value: '<i class="fa fa-fw fa-floppy-o"></i> Save &amp; Close' }, { type: 'button', 'class': 'btn btn-primary btn-reset', id: 'btn_reset', value: '<i class="fa fa-fw fa-refresh"></i> Reset' }, { type: 'button', 'class': 'btn btn-primary btn-cancel', id: 'btn_cancel', value: '<i class="fa fa-fw fa-times"></i> Cancel' }];
    }

    // set the default name for the form, if not present
    if (!this.options.atts.name) {
      this.options.atts.name = 'frm_edit' + this.options.tableFriendly;
    }

    // set the default hidden elements if not present
    if (!this.options.hiddenElms) {
      // setup the hidden elements
      this.options.hiddenElms = [{ atts: { 'type': 'hidden', 'readonly': 'readonly', 'name': '_method', 'value': options.atts.method, 'data-static': true } }];
    }

    // container for jQuery DOM elements
    this.DOM = {
      $prnt: $('<div/>'),
      $frm: false,
      $fs: false
    };

    this.oInpts = {};
    this.DOM.$Inpts = $('<div/>');
    this.rowData = {};
    this.readonlyFields = [];

    /**  **  **  **  **  **  **  **  **  **
     *   HTML TEMPLATES
     *
     *  Place large html templates here
     *  as functions. These are rendered with
     *  the method self.fn.render.
     *
     *  Parameters of the form {@ParamName}
     *  are expanded by the render function
     **  **  **  **  **  **  **  **  **  **/
    this.html = {}; // end html templates

    // create shortcut to the form
    this.$ = function () {
      return this.DOM.$frm;
    };

    /**  **  **  **  **  **  **  **  **  **
    	 *   FUNCTION DEFS
    	 **  **  **  **  **  **  **  **  **  **/
    this.fn = {
      _init: function _init() {
        var inpt, hdn;

        // create the form
        self.DOM.$frm = $('<form/>', oAtts).wrap(self.options.wrap);

        // add the fieldset if we are not loading external col params
        if (!self.options.loadExternal) {
          self.DOM.$frm.append($('<fieldset/>', self.options.fieldset).append($('<legend/>').html(self.options.fieldset.legend)));
        }

        // add the inputs to the DOM
        self.DOM.$frm.append(self.DOM.$Inpts);

        // append the form to the parent container
        self.DOM.$prnt.append(!!self.DOM.$frm.parents().length ? self.DOM.$frm.parents().last() : self.DOM.$frm);

        // create and append the hidden elements
        _.each(self.options.hiddenElms, function (o, key) {
          inpt = new jInput(o);
          self.oInpts[o.atts.name] = inpt;
          self.DOM.$Inpts.append(inpt.fn.handle());
          if (o.atts.readonly === 'readonly') {
            self.readonlyFields.push(o.atts.name);
          }
        });

        // get the colParams
        if (!!self.options.loadExternal) {
          // get the colparams from an external json source
          self.fn.getColParams();
        } else {
          // colparams must be specified locally, so process them
          self.fn.processColParams();
          self.fn.processBtns();
        }
      }, // end fn

      /**
       * Get the form data as a FormData object
       * @method function
       * @return {[type]} [description]
       */
      getFormData: function getFormData() {
        // var data = new FormData;
        //
        // _.each( self.$().serializeObject(), function(value,name) {
        //   data.append(name, value);
        // });
        //
        // self.$().find('input[type=file]').each( function(i, elm) {
        //     jApp.log('adding files to the FormData object');
        //
        //     jApp.log( elm.files );
        //
        //     _.each( elm.files, function( o ) {
        //       jApp.log( 'Adding ' + elm.name );
        //       jApp.log( o );
        //
        //       data.append( elm.name, o );
        //     });
        // })

        return self.$().serialize();
      }, // end fn

      handle: function handle() {
        return self.DOM.$prnt;
      }, // end fn

      $fieldset: function $fieldset() {
        return self.DOM.$frm.find('fieldset');
      }, //end fn

      getElmById: function getElmById(id) {
        id = id.replace('#', '');

        return self.oInpts[id];
      },

      render: function render(params) {
        var tmp = self.DOM.$prnt.prop('outerHTML');

        if (!!params && !$.isEmptyObject(params)) {
          for (key in params) {
            ptrn = new RegExp('\{@' + key + '\}', 'gi');
            tmp = tmp.replace(ptrn, params[key]);
          }
        }
        return tmp;
      }, //end fn

      addElements: function addElements(arr) {
        self.options.colParamsAdd = _.union(self.options.colParamsAdd, arr);
      }, //end fn

      getColParams: function getColParams() {
        jApp.log('A. Getting external colparams');
        self.options.colParams = jApp.colparams[self.options.model];
        jApp.log(self.options.colParams);

        //process the colParams;
        self.fn.processExternalColParams();

        //add the buttons
        self.fn.processBtns();
      }, //end fn

      preFilterColParams: function preFilterColParams(unfilteredParams) {
        return _.filter(unfilteredParams, function (o) {
          if (o == null) return false;
          if (typeof o._enabled == 'undefined') return false;
          if (o._enabled == false) return false;
          if (_.indexOf(self.options.disabledElements, o.name) !== -1) return false;

          return _.omit(o, function (value, key, object) {
            return value == null || value == 'null' || value.toString().toLowerCase() == '__off__' || +value == 0 || value == false;
          });
        });
      }, // end fn

      getRowData: function getRowData(url, callback) {

        $('.panel-overlay').show();

        $.getJSON(url, {}, self.callback.getRowData).fail(function () {
          console.error('There was a problem getting the row data');
        }).always(function (response) {
          if (typeof callback !== 'undefined' && typeof callback === 'function') {
            callback(response);
          } else if (typeof callback !== 'undefined' && typeof callback === 'string' && typeof self.fn[callback] !== 'undefined' && typeof self.fn[callback] === 'function') {
            self.fn[callback](response);
          }
          //console.log('Got the row data');
          //console.log(response);
        });
      }, //end fn

      /**
       * Process externally loaded column parameters
       * @method function
       * @return {[type]} [description]
       */
      processExternalColParams: function processExternalColParams() {
        _.each(self.options.colParams, function (o, index) {
          self.fn.processFieldset(o, index);
        });
      }, // end fn

      /**
       * Process fieldset
       * @method function
       * @param  {[type]} o     [description]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      processFieldset: function processFieldset(o, index) {

        jApp.log('A. Processing the fieldset');
        jApp.log(o);
        //create the fieldset
        var $fs = $('<div/>', {
          'class': o['class']
        });

        // add the label, if necessary
        if (o.label != null) {
          $fs.append($('<legend/>').html(o.label));
        }

        // add the helptext if necessary
        if (o.helpText != null) {
          $fs.append($('<div/>', { 'class': 'alert alert-info' }).html(o.helpText));
        }

        // add the fields
        _.each(self.fn.preFilterColParams(o.fields), function (oo) {
          self.fn.processField(oo, $fs);
        });

        // add the fieldset to the DOM
        self.DOM.$Inpts.append($fs);
      }, // end fn

      /**
       * Process form field from parameters
       * @method function
       * @param  {[type]} params [description]
       * @param  {[type]} target [description]
       * @return {[type]}        [description]
       */
      processField: function processField(params, target) {
        var inpt;

        jApp.log('B. Processing Field');
        jApp.log(params);

        // check if the type is array
        if (params.type == 'array') return self.fn.processArrayField(params, target);

        inpt = new jInput({ atts: params });
        self.oInpts[params.name] = inpt;
        target.append(inpt.fn.handle());
        if (params.readonly === 'readonly') self.readonlyFields.push(params.name);
      }, // end fn

      /**
       * Process array field from parameters
       * @method function
       * @param  {[type]} params [description]
       * @param  {[type]} target [description]
       * @return {[type]}        [description]
       */
      processArrayField: function processArrayField(params, target) {
        var $container = $('<div/>', { 'class': 'array-field-container alert alert-info' }).data('colparams', params),
            $table = $('<table/>', { 'class': 'table' }),
            $label = $('<label/>').html(params._label),
            $tr,
            $th,
            $td,
            inpt,
            hidNames = [];

        _.each(params.fields, function (o) {
          o['data-name'] = o.name;
          hidNames.push(o.name.replace('[]', ''));
        });

        console.log(hidNames);

        // build up the table
        $table.append([
        // first row - array label
        $('<tr/>').append([$('<th/>', { colspan: 100 }).append($label), $('<th/>').html('&nbsp;')])]);

        // append the inputs

        // second row - column headers
        // $('<tr/>').append(
        //   _.map( params.headers, function( header ) {
        //       return $('<th/>').html( header );
        //   })
        //
        // ).append(
        //   [
        //       $('<th/>'),
        //   ]
        // ),

        // third row - inputs

        if (params.min != null) {
          for (var ii = +params.min - 1; ii >= 0; ii--) {
            $table.append(self.fn.populateFieldRow(params, ii));
          }
        } else {
          $table.append(self.fn.populateFieldRow(params));
        }

        // append the table to the container
        $container.append($table);

        // rename inputs so they all have unique names
        // $table.find('tr').each( function( i, elm ) {
        //   $(elm).find(':input').each( function(ii, ee) {
        //     $(ee).attr('name', $(ee).attr('data-name') + '_' + i)
        //   });
        // });

        // append the container to the target
        target.append($container);

        var hid = {
          name: params.name + '_extra_columns',
          type: 'hidden',
          value: hidNames.join()
        };

        var oHid = new jInput({ atts: hid });
        self.oInpts[hid.name] = oHid;
        target.append(oHid.fn.handle());
      }, // end fn

      /**
       * Populate a row with the field inputs
       * @method function
       * @param  {[type]} params [description]
       * @return {[type]}        [description]
       */
      populateFieldRow: function populateFieldRow(params, index) {
        var $td,
            $btn_add = $('<button/>', { type: 'button', 'class': 'btn btn-primary btn-array-add' }).html('<i class="fa fa-fw fa-plus"></i>'),
            $btn_remove = $('<button/>', { type: 'button', 'class': 'btn btn-danger btn-array-remove' }).html('<i class="fa fa-fw fa-trash-o"></i>'),
            index = typeof index === 'undefined' ? 0 : index;

        return $('<tr/>').append(_.map(params.fields, function (oo) {
          var $td = $('<td/>');

          self.fn.processField(oo, $td);

          return $td;
        })).append([$('<td/>').append([$btn_remove, index === 0 ? $btn_add : null])]);
      }, // end fn

      processColParams: function processColParams() {
        self.DOM.$Inpts.find('.fs, .panel-heading').remove();

        if (self.options.layout === 'standard') {

          self.DOM.$Inpts.append($('<div/>', { 'class': 'fs col-lg-4' }));
          self.DOM.$Inpts.append($('<div/>', { 'class': 'fs col-lg-4' }));
          self.DOM.$Inpts.append($('<div/>', { 'class': 'fs col-lg-4' }));
        } else {
          self.DOM.$Inpts.append($('<div/>', { 'class': 'fs' }));
        }

        // process static or dynamically loaded colParams
        _.each(_.sortBy(self.options.colParams, function (o) {
          return !isNaN(o['data-ordering']) ? +o['data-ordering'] : 1000;
        }), function (o, key) {
          var inpt, eq;
          if (!!o && !!o.name && _.indexOf(self.options.disabledElements, o.name) === -1) {

            eq = !!o['data-fieldset'] ? Number(o['data-fieldset']) - 1 : 0;
            inpt = new jInput({ atts: o });
            self.oInpts[o.name] = inpt;
            self.DOM.$Inpts.find('.fs').eq(self.options.layout === 'standard' ? eq : 0).append(inpt.fn.handle());
            if (o.readonly === 'readonly') {
              self.readonlyFields.push(o.name);
            }
          }
        });

        //console.log('Now adding the colParamsAdd : ' + self.options.colParamsAdd.length);
        // process additional colParams that may have come from linkTables
        _.each(_.sortBy(self.options.colParamsAdd, function (o) {
          return !isNaN(o['data-ordering']) ? +o['data-ordering'] : 1000;
        }), function (o, key) {
          var inpt, eq;
          if (!!o && !!o.name && _.indexOf(self.options.disabledElements, o.name) === -1) {

            eq = !!o['data-fieldset'] ? Number(o['data-fieldset']) - 1 : 0;
            inpt = new jInput({ atts: o });
            self.oInpts[o.name] = inpt;
            self.DOM.$Inpts.find('.fs').eq(self.options.layout === 'standard' ? eq : 0).append(inpt.fn.handle());
            if (o.readonly === 'readonly') {
              self.readonlyFields.push(o.name);
            }
          }
        });

        if (self.options.layout === 'standard') {
          // set fieldset classes
          if (self.DOM.$Inpts.find('.fs').eq(1).find('div').length === 0) {
            self.DOM.$Inpts.find('.fs').eq(1).removeClass('col-lg-4').end().eq(0).removeClass('col-lg-4').addClass('col-lg-8');
          } else {
            self.DOM.$Inpts.find('.fs').eq(1).addClass('col-lg-4').end().eq(0).addClass('col-lg-4').removeClass('col-lg-8');
          }
        }

        // handle linked Elements
        self.$().find('[_linkedElmID]').off('change.linkedelm').on('change.linkedelm', function () {
          //console.log( 'Setting up linked Element' );
          var This = $(this),
              $col = This.attr('_linkedElmFilterCol'),
              $id = This.val(),
              $labels = This.attr('_linkedElmLabels'),
              $options = This.attr('_linkedElmOptions'),
              oElm = self.fn.getElmById(This.attr('_linkedElmID')),
              atts;

          //console.log(This.attr('name'));
          //console.log($id);
          //console.log(oElm);

          // set data to always expire;
          oElm.fn.setTTL(-1);
          oElm.options.hideIfNoOptions = true;
          oElm.options.cache = false;

          if (typeof $id === 'string') {
            $id = "'" + $id + "'";
          }
          if (typeof $id === 'object') {
            $id = _.map($id, function (elm) {
              return "'" + elm + "'";
            });
          }

          atts = {
            '_optionsFilter': $col + ' in (' + $id + ')',
            '_labelsSource': $labels,
            '_optionsSource': $options,
            'getExtData': true
          };

          if (!oElm.fn.attr('multiple') || oElm.fn.attr('multiple') != 'multiple') {
            atts = _.extend(atts, { '_firstoption': 0, '_firstlabel': '-Other-' });
          }

          oElm.fn.attr(atts);

          oElm.fn.initSelectOptions(true);
        }).change();
      }, //end fn

      /**
       * Add the form buttons
       * @method function
       * @return {[type]} [description]
       */
      processBtns: function processBtns() {
        var btnPanel = $('<div/>', { 'class': 'panel-btns header' }),
            btnFooter = $('<div/>', { 'class': 'panel-btns footer' });

        _.each(self.options.btns, function (o, key) {
          if (o.type === 'button') {
            var inpt = $('<button/>', o).html(o.value);
          } else {
            var inpt = $('<input/>', o);
          }

          btnPanel.append(inpt);
          btnFooter.append(inpt.clone());
        });

        self.DOM.$Inpts.append([btnPanel, btnFooter]);
      }, //end fn

      submit: function submit() {

        self.fn.toggleSubmitted();

        $.ajax({
          //dataType : 'json',
          method: 'POST',
          url: self.options.atts.action,
          data: self.$().serialize(),
          success: self.callback.submit
        }).done(self.fn.toggleSubmitted);
      }, //end fn

      toggleSubmitted: function toggleSubmitted() {
        if (!self.submitted) {
          self.submitted = true;
          //self.oElms['btn_go'].fn.disable();
        } else {
            self.submitted = false;
            //self.oElms['btn_go'].fn.enable();
          }
      }

    }; // end fns

    // alias the submit function
    this.submit = this.fn.submit;

    this.callback = {

      getRowData: function getRowData(response) {
        var oInpt, $inpt;

        if (typeof response[0] !== 'undefined') {
          response = response[0];
        }

        self.rowData = response;

        self.DOM.$frm.clearForm();

        _.each(response, function (value, key) {
          jApp.log('Setting up input ' + key);
          jApp.log(value);

          if (typeof self.oInpts[key] === 'undefined' || typeof self.oInpts[key].$ !== 'function') {
            jApp.log('No input associated with this key.');
            return false;
          }

          oInpt = self.oInpts[key];
          $inpt = oInpt.$();

          // enable the input
          oInpt.fn.enable();

          if (value != null && value.indexOf('|') !== -1 && key !== '_labelssource' && key !== '_optionssource') {
            value = value.split('|');
          }

          if (typeof value === 'object' && !!_.pluck(value, 'name').length && typeof $inpt.attr('data-tokens') !== 'undefined') {
            $inpt.tokenfield('setTokens', _.pluck(value, 'name'));
          } else if (typeof value === 'object' && !!_.pluck(value, 'id').length) {
            oInpt.fn.val(_.pluck(value, 'id'));
          } else {
            oInpt.fn.val(value);
          }
          if (oInpt.options.atts.type === 'select') {
            $inpt.multiselect('refresh').change();
          }
        });

        self.DOM.$frm.find('.bsms').multiselect('refresh');
        $('.panel-overlay').hide();
      },

      // do something with the response
      submit: function submit(response) {
        console.log(response);
      }
    }; // end fns

    // initialize
    this.fn._init();
  }; // end jForm declaration

  window.jForm = jForm; // add to global scope
})(window, $, jQuery);

/* jshint ignore:start */
/**  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **
 *
 *  jInput.class.js - Custom Form Input JS class
 *
 *  Defines the properties and methods of the
 *  custom input class.
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 *  Created: 		4/20/15
 *  Last Updated: 	4/20/15
 *
 *  Prereqs: 	jQuery, underscore.js, jStorage.js
 *
 *  Changelog:
 *   4-20-15	Created the jInput class
 *
 *   4-30-15	Added the feedback icon container and help block container
 */
// javascript closure
/* jshint ignore:end */
;(function (window, $) {

  'use strict';

  var jInput = function jInput(options) {
    /**  **  **  **  **  **  **  **  **  **
    	 *   VARS
    	 **  **  **  **  **  **  **  **  **  **/

    // alias this
    var self = this;
    this.store = $.jStorage;
    this.readonly = false;

    /**  **  **  **  **  **  **  **  **  **
     *   DEFAULT OPTIONS
     *
     *  Set the default options for the
     *  instance here. Any values specified
     *  at runtime will overwrite these
     *  values.
     **  **  **  **  **  **  **  **  **  **/

    this.options = {
      // html attributes
      atts: {
        'type': 'text',
        'class': 'form-control'
      },

      // DOM presentation options
      parent: $('<div/>', { 'class': 'form_element has-feedback' }),

      // wrap - wrap the label and input elements with something e.g. <div></div>
      wrap: false,

      // separator - separate the label and input elements
      separator: true,

      // external data for options, etc.
      extData: false,

      // TTL for external data (mins)
      ttl: 10,

      // cache options locally
      cache: true,

      // hide if no options
      hideIfNoOptions: false,

      // multiselect defaults
      bsmsDefaults: { // bootstrap multiselect default options
        //buttonContainer : '<div class="btn-group" />',
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
        maxHeight: 185,
        numberDisplayed: 1,
        dropUp: true
      }

    }; // end options

    // set the runtime values for the options
    $.extend(true, this.options, { atts: { 'id': this.options.atts.name } }, options);

    this.readonly = this.options.atts.readonly === 'readonly' ? true : false;

    // alias to attributes object
    var oAtts = self.options.atts;

    oAtts.name = Number(oAtts.multiple) || oAtts.multiple === true || oAtts.multiple === 'multiple' ? oAtts.name.replace('[]', '') + '[]' : oAtts.name;

    /**  **  **  **  **  **  **  **  **  **
    	 *   ALLOWABLE ATTRIBUTES BY INPUT TYPE
    	 **  **  **  **  **  **  **  **  **  **/
    this.allowedAtts = {
      date: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
      datetime: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
      'datetime-local': ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
      month: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
      time: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],
      week: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'readOnly', 'required', 'step', 'type', 'value'],

      url: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
      text: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
      tokens: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
      search: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],

      number: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'placeholder', 'readOnly', 'required', 'step', 'type', 'value'],
      range: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'max', 'min', 'name', 'step', 'type', 'value'],

      password: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'maxLength', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],

      button: ['autofocus', 'defaultValue', 'disabled', 'form', 'name', 'type', 'value'],
      reset: ['autofocus', 'defaultValue', 'disabled', 'form', 'name', 'type', 'value'],
      submit: ['autofocus', 'defaultValue', 'disabled', 'form', 'name', 'type', 'value'],

      radio: ['autofocus', 'checked', 'defaultChecked', 'defaultValue', 'disabled', 'form', 'name', 'required', 'type', 'value'],
      checkbox: ['autofocus', 'checked', 'defaultChecked', 'defaultValue', 'disabled', 'form', 'indeterminate', 'name', 'required', 'type', 'value'],

      file: ['accept', 'autofocus', 'defaultValue', 'disabled', 'files', 'form', 'multiple', 'name', 'required', 'type', 'value'],

      hidden: ['defaultValue', 'form', 'name', 'type', 'value', 'readonly'],

      image: ['alt', 'autofocus', 'defaultValue', 'disabled', 'form', 'height', 'name', 'src', 'type', 'value', 'width'],

      select: ['disabled', 'form', 'multiple', 'name', 'size', 'type', 'value', '_linkedElmID', '_linkedElmFilterCol', '_linkedElmLabels', '_linkedElmOptions'],

      textarea: ['autofocus', 'cols', 'defaultValue', 'disabled', 'form', 'maxLength', 'name', 'placeholder', 'readOnly', 'required', 'rows', 'type', 'value', 'wrap'],

      color: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'name', 'type', 'value'],

      email: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'multiple', 'name', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value'],
      tel: ['autocomplete', 'autofocus', 'defaultValue', 'disabled', 'form', 'list', 'maxLength', 'pattern', 'placeholder', 'readOnly', 'required', 'size', 'type', 'value']
    }; // end allowable attributes

    /**  **  **  **  **  **  **  **  **  **
    	 *   ALLOWABLE COLPARAMS BY INPUT TYPE
    	 **  **  **  **  **  **  **  **  **  **/
    this.allowedColParams = {
      radio: ['_labelssource', '_optionssource', '_optionsfilter'],
      select: ['_firstoption', '_firstlabel', '_labelssource', '_optionssource', '_optionsfilter']
    }; // end allowable attributes

    /**  **  **  **  **  **  **  **  **  **
    	 *   DISALLOWABLE COLPARAMS BY INPUT TYPE
    	 **  **  **  **  **  **  **  **  **  **/
    this.disallowedColParams = {
      hidden: ['_label', 'onClick', 'onChange']
    }; // end allowable attributes

    /**  **  **  **  **  **  **  **  **  **
    	 *   GLOBAL HTML ATTRIBUTES TO ALLOW
    	 **  **  **  **  **  **  **  **  **  **/
    this.globalAtts = ['accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden', 'id', 'lang', 'lang', 'spellcheck', 'style', 'tabindex', 'title', 'translate', 'data-validType', 'readonly', 'required', 'onClick', 'onChange', 'form'];

    this.globalColParams = ['_enabled', '_label', 'data-fieldset', 'data-ordering', 'data-validType-template', 'type'];

    /**  **  **  **  **  **  **  **  **  **
    	 *   DOM ELEMENTS
    	 *
    	 *  These placeholders get replaced
    	 *  by their jQuery handles
    	 **  **  **  **  **  **  **  **  **  **/
    this.DOM = {
      $prnt: false,
      $inpt: false,
      $lbl: false
    };

    this.$ = function () {
      return self.DOM.$inpt;
    };

    /**  **  **  **  **  **  **  **  **  **
    	 *   FUNCTION DEFS
    	 **  **  **  **  **  **  **  **  **  **/
    this.fn = {

      _init: function _init() {
        var $br = !!self.options.separator ? $('<br/>') : false;
        self.type = oAtts.type;

        //set the parent element
        self.DOM.$prnt = self.options.parent;

        //create the label
        if (self.type !== 'hidden') {
          self.DOM.$lbl = $('<label/>', { 'for': oAtts.id }).html(oAtts._label).wrap(self.options.wrap);
        }

        //create the input element
        switch (self.type) {
          case 'textarea':
            self.DOM.$inpt = $('<textarea/>', self.fn.getAtts()).wrap(self.options.wrap);
            break;

          case 'select':
            self.DOM.$inpt = $('<select/>', self.fn.getAtts()).wrap(self.options.wrap);
            self.fn.initSelectOptions();
            break;

          case 'tokens':
            jApp.log('Tokens Attributes');
            jApp.log($.extend(true, self.fn.getAtts(), { type: 'text', 'data-tokens': true, 'data-url': self.fn.getExtUrl('tokens') }));
            self.DOM.$inpt = $('<input/>', $.extend(true, self.fn.getAtts(), { type: 'text', 'data-tokens': true, 'data-url': self.fn.getExtUrl('tokens') }));
            self.fn.getExtOptions();
            break;

          case 'radio':
          case 'checkbox':
            oAtts._options = [];
            oAtts._labels = [];
            // determine if we are loading options from an external source (db)
            if (typeof oAtts._labelssource !== 'undefined' && oAtts._labelssource.indexOf('.') !== -1) {
              self.options.extData = true;
              self.fn.getExtOptions();
            } else {
              // options are loaded locally
              if (typeof oAtts._labelssource !== 'undefined' && typeof oAtts._optionssource !== 'undefined') {
                oAtts._options = oAtts._optionssource.split('|');
                oAtts._labels = !!oAtts._labelssource ? oAtts._labelssource.split('|') : oAtts._optionssource.split('|');
              }
            }

            // shift off the first elements of the labels and options arrays and create the first radio element
            var firstOpt = typeof oAtts._options[0] !== 'undefined' ? oAtts._options[0] : false;
            var firstLbl = typeof oAtts._labels[0] !== 'undefined' ? oAtts._labels[0] : false;

            // set the attributes of the first element
            var atts = _.extend(self.fn.getAtts(), {
              'value': firstOpt,
              'checked': _.indexOf(oAtts.value, firstOpt) !== -1 ? 'checked' : '',
              'id': oAtts.name + '_0'
            });

            // add the first element
            self.DOM.$inpt = $('<label/>', { 'class': 'form-control' }).append($('<input/>', atts)).append($('<div/>', { style: 'width:200px' }).html(firstLbl)).wrap('<div class="radio-group"></div>');

            //iterate through the remaining options
            _.each(oAtts._options, function (v, k) {
              if (k > 0) {
                // skip the first one
                var lbl = oAtts._labels[k];
                var atts = _.extend(self.fn.getAtts(), {
                  'value': v,
                  'checked': _.indexOf(oAtts.value, v) !== -1 ? 'checked' : false,
                  'id': oAtts.name + '_' + k
                });

                // add the radio options
                self.DOM.$inpt.after($('<label/>', { 'class': 'form-control' }).append($('<input/>', atts)).append($('<div/>', { style: 'width:200px' }).html(lbl)));
              }
            }); // end each

            break;

          case 'button':
            self.DOM.$inpt = $('<button/>', self.fn.getAtts()).html(oAtts.value).wrap(self.options.wrap);
            break;

          default:
            self.DOM.$inpt = $('<input/>', self.fn.getAtts()).wrap(self.options.wrap);
            break;
        }

        // assign a reference to the jInput object to the DOM element
        self.DOM.$inpt.data('jInput', self);

        //bind change handler to keep this object updated
        self.DOM.$inpt.off('change.jInput').on('change.jInput', function () {
          oAtts.value = $(this).val();
        });

        //append the label, if applicable
        if (!!self.DOM.$lbl && self.type !== 'hidden' && oAtts._label != null) {
          self.DOM.$prnt.append(!!self.DOM.$lbl.parents().length ? self.DOM.$lbl.parents().last() : self.DOM.$lbl);
        }

        //append the separator, if applicable
        if (!!self.options.separator && self.type !== 'hidden' && oAtts._label != null) {
          self.DOM.$prnt.append($br.clone());
        }

        //append the input
        self.DOM.$prnt.append(!!self.DOM.$inpt.parents().length ? self.DOM.$inpt.parents().last() : self.DOM.$inpt);

        //append the feedback icon container and help block
        self.DOM.$prnt.append($('<i/>', { 'class': 'form-control-feedback glyphicon', style: 'display:none' }));
        self.DOM.$prnt.append($('<small/>', { 'class': 'help-block', style: 'display:none' }));

        //update reference to $inpt for radio groups
        if (self.type === 'radio') {
          self.DOM.$inpt = self.DOM.$prnt.find('[name=' + oAtts.name + ']');
        }

        //place in DOM
        //self.DOM.$prnt.appendTo('body');
      }, // end fn

      getAtts: function getAtts() {
        var gblAtts = self.globalAtts;
        var stdAtts = self.allowedAtts[self.type];
        var allowedAttributes = _.union(stdAtts, gblAtts);

        //console.log( 'allowed attributes ' + oAtts.name );
        //console.log( allowedAttributes );

        var filteredAtts = _.pick(oAtts, function (value, key) {
          if (typeof value === 'undefined' || typeof value === 'object' || !value || value == '__OFF__' || value == '__off__' || _.indexOf(allowedAttributes, key) === -1 && key.indexOf('data-') === -1) {
            //console.log(key + ' not allowed for ' + oAtts.name);
            return false;
          } else {
            //console.log(key + ' allowed for ' + oAtts.name);
            return true;
          }
        });
        //console.log(filteredAtts);
        return filteredAtts;
      },

      hide: function hide() {
        self.DOM.$prnt.hide();
        return self.fn;
      },

      show: function show() {
        self.DOM.$prnt.show();
        return self.fn;
      },

      disable: function disable() {
        if (oAtts.type !== 'hidden') {
          self.DOM.$inpt.prop('disabled', true);
          self.DOM.$inpt.addClass('disabled');
        }
        return self.fn;
      },

      enable: function enable() {
        self.DOM.$inpt.prop('disabled', false);
        self.DOM.$inpt.removeClass('disabled');
        return self.fn;
      },

      setTTL: function setTTL(ttl) {
        self.store.setTTL(ttl);
      }, //end fn

      /**
       * Initialize the select options
       * @param  {[type]} refresh [description]
       * @return {[type]}         [description]
       */
      initSelectOptions: function initSelectOptions(refresh) {

        //console.log('Initializing Select Options');
        //console.log(oAtts);

        self.refreshAfterLoadingOptions = !!refresh ? true : false;

        // local data
        if (oAtts._optionssource != null && oAtts._optionssource.indexOf('|') !== -1) {
          jApp.log(' - local options data - ');
          self.options.extData = false;
          oAtts._options = oAtts._optionssource.split('|');
          oAtts._labels = !!oAtts._labelssource ? oAtts._labelssource.split('|') : oAtts._optionssource.split('|');
          self.fn.buildOptions();
        }
        // external data
        else if (oAtts._optionssource != null && oAtts._optionssource.indexOf('.') !== -1) {
            jApp.log(' - external options data -');
            self.options.extData = true;
            //console.log('Getting External Options');
            self.fn.getExtOptions();
          }
      }, // end fn

      /**
       * Get the external url of the options
       * @return {[type]} [description]
       */
      getExtUrl: function getExtUrl(type) {
        var model, lbl, opt, tmp;

        type = type != null ? type : oAtts.type;

        tmp = oAtts._labelssource.split('.');
        self.model = model = tmp[0]; // db table that contains option/label pairs
        lbl = tmp[1]; // db column that contains labels
        opt = oAtts._optionssource.split('.')[1];
        //where = ( !!oAtts._optionsFilter && !!oAtts._optionsFilter.length ) ? oAtts._optionsFilter : '1=1';

        switch (type) {
          case 'select':
            return "/selopts/_" + model + "_" + opt + "_" + lbl;
            break;

          default:
            return "/tokenopts/_" + model + "_" + opt + "_" + lbl;
            break;
        }
      }, // end fn

      getModel: function getModel() {
        var tmp = oAtts._optionssource.split('.');
        return tmp[0];
      }, // end fn

      /**
       * Retrieve external options
       * @param  {[type]}   force    [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      getExtOptions: function getExtOptions(force, callback) {
        console.log('getting external options');
        self.options.extData = true;

        force = typeof force !== 'undefined' ? force : false;

        // use the copy in storage if available;
        if (!force && self.options.cache && !!self.store.get('selectOptions_' + self.options.atts.name, false)) {
          //console.log('using local copy of options');
          return self.fn.buildOptions(JSON.parse(self.store.get('selectOptions_' + self.options.atts.name)));
        }

        var url, data;

        url = self.fn.getExtUrl();
        data = {};

        self.buildOptionsCallback = callback;

        //console.log('executing request for external options');
        $.getJSON(url, data, self.fn.buildOptions).always(function () {
          if (self.options.cache) {
            self.store.setTTL('selectOptions_' + self.options.atts.name, 1000 * 60 * self.options.ttl); // expire in 10 mins.
          }
        });
      },

      buildOptions: function buildOptions(data) {
        // load JSON data if applicable
        if (data != null) {
          self.JSON = data;
        }

        if (oAtts.type === 'select') {
          self.fn.populateSelectOptions();
        } else {
          self.fn.populateTokensOptions();
        }
      },

      populateTokensOptions: function populateTokensOptions() {
        jApp.log('--- Building TokenField Input ---');
        jApp.log(self.JSON);

        self.DOM.$inpt.data('tokenFieldSource', _.pluck(self.JSON, 'name'));
      }, //end fn

      populateSelectOptions: function populateSelectOptions() {

        // grab the external data if applicable
        if (self.options.extData) {
          oAtts._labels = _.pluck(self.JSON, 'label');
          oAtts._options = _.pluck(self.JSON, 'option');

          if (self.options.cache) {
            self.store.set('selectOptions_' + self.options.atts.name, JSON.stringify(self.JSON));
          }
        }

        // hide if empty options
        if ((!oAtts._options || !oAtts._options.length) && !!self.options.hideIfNoOptions) {
          //console.log('Hiding the element because there are no options ' + oAtts.name)
          return self.fn.disable().hide();
        } else {
          self.fn.enable().show();
        }

        // remove all options
        self.DOM.$inpt.find('option').remove();

        // append first option if applicable
        if (!!oAtts._firstlabel) {
          var firstOption = !!oAtts._firstoption ? oAtts._firstoption : '';
          self.DOM.$inpt.append($('<option/>', { value: firstOption }).html(oAtts._firstlabel));
        }

        // iterate over the label/value pairs and build the options
        _.each(oAtts._options, function (v, k) {
          self.DOM.$inpt.append(
          // determine if the current value is currently selected
          _.indexOf(oAtts.value, v) !== -1 || !!self.$().attr('data-value') && _.indexOf(self.$().attr('data-value').split('|'), v) !== -1 ? $('<option/>', { value: v, 'selected': 'selected' }).html(oAtts._labels[k]) : $('<option/>', { value: !!v ? v : '' }).html(oAtts._labels[k]));
        });

        // remove the unneeded data-value attribute
        self.$().removeAttr('data-value');

        // call the callback if applicable
        if (typeof self.buildOptionsCallback === 'function') {
          self.buildOptionsCallback();
          delete self.buildOptionsCallback;
        }
      }, // end fn

      attr: function attr(key, value) {
        if (typeof key === 'object') {
          //console.log( 'Setting the attrs' );
          //console.log(key);
          _.each(key, function (v, k) {
            oAtts[k] = v;
          });
          //console.log(oAtts);
          self.fn.refresh();
        } else if (!!value) {
          self.options.atts[key] = value;
          self.fn.refresh();
        } else {
          return oAtts[key];
        }
      },

      val: function val(value) {

        if (!!value) {
          if (typeof value !== 'object') {
            if (oAtts.name == '_labelssource' || oAtts.name == '_optionssource') {
              value = value.replace(/\,/gi, '|');
            }
            self.$().attr('data-value', value);
            return self.fn.attr('value', [value]);
          } else {
            self.$().attr('data-value', value.join('|'));
            return self.fn.attr('value', value);
          }
        }

        switch (self.type) {
          case 'radio':
          case 'checkbox':
            return $.map(self.DOM.$prnt.find(':checked'), function (elm, i) {
              return $(elm).val();
            });
            break;

          default:
            return self.DOM.$inpt.val();
            break;
        }
      },

      refresh: function refresh() {
        _.each(self.fn.getAtts(), function (v, k) {
          if (k !== 'type') {
            // cannot refresh type
            self.DOM.$inpt.attr(k, v);
          }
        });

        self.DOM.$inpt.val(oAtts.value);
      },

      render: function render() {
        return self.DOM.$prnt.prop('outerHTML');
      },

      handle: function handle() {
        return self.DOM.$prnt;
      },

      multiselectDestroy: function multiselectDestroy() {
        self.$().multiselect('destroy');
      }, // end fn

      multiselectRefresh: function multiselectRefresh() {
        if (!self.options.extData) {
          return false;
        }

        $(this).prop('disabled', true).find('i').addClass('fa-spin');

        self.$().attr('data-tmpVal', self.$().val() || '').val('').multiselect('refresh');
        //.multiselect('disable');

        self.fn.getExtOptions(true, function () {
          jUtility.$currentForm().find('.btn.btn-refresh').prop('disabled', false).find('i').removeClass('fa-spin').end().end().find('[data-tmpVal]').each(function (i, elm) {
            $(elm).val($(elm).attr('data-tmpVal')).multiselect('enable').multiselect('refresh').multiselect('rebuild').removeAttr('data-tmpVal');

            //.data('jInput').fn.multiselect();
          });
        });
      }, // end fn

      /**
       * Add button and refresh button for multiselect elements
       * @return {[type]} [description]
       */
      multiselectExtraButtons: function multiselectExtraButtons() {
        if (!self.options.extData) return self;

        // make an add button, if the model is not the same as the current form
        if (self.fn.getModel() !== jApp.opts().model) {

          var frmDef = {
            table: jApp.model2table(self.fn.getModel()),
            pkey: 'id',
            tableFriendly: self.fn.getModel(),
            atts: { method: 'POST' }
          },
              key = 'new' + self.fn.getModel() + 'Frm';

          if (!jUtility.isFormExists(key)) {
            console.log('building the form: ' + key);
            jUtility.DOM.buildForm(frmDef, key, 'newOtherFrm', self.fn.getModel());
            jUtility.processFormBindings();
          }

          var $btnAdd = $('<button/>', {
            type: 'button',
            'class': 'btn btn-primary btn-add',
            title: 'Add ' + self.fn.getModel()
          }).html('<i class="fa fa-fw fa-plus"></i> ' + self.fn.getModel() + ' <i class="fa fa-fw fa-external-link"></i>').off('click.custom').on('click.custom', function () {

            jUtility.actionHelper('new' + self.fn.getModel() + 'Frm');
          });

          self.DOM.$prnt.find('.btn-group .btn-add').remove().end().find('.btn-group').append($btnAdd);
        }

        var $btnRefresh = $('<button/>', {
          type: 'button',
          'class': 'btn btn-primary btn-refresh',
          title: 'Refresh Options'
        }).html('<i class="fa fa-fw fa-refresh"></i>').off('click.custom').on('click.custom', self.fn.multiselectRefresh);

        self.DOM.$prnt.find('.btn-group .btn-refresh').remove().end().find('.btn-group').prepend($btnRefresh);

        return self;
      }, // end fn

      /**
       * Multiselect handler
       * @return {[type]} [description]
       */
      multiselect: function multiselect() {
        self.$().multiselect(self.options.bsmsDefaults).multiselect('refresh');
        self.fn.multiselectExtraButtons();
        return self;
      }
    };

    // initialize
    this.fn._init();
  }; // end jInput declaration

  window.jInput = jInput; // add to global scope
})(window, $);

/**  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **  **
 *
 *  jLinkTable.class.js - Aysnc Grid LinkTable Class
 *
 *  Matsu Borough IT Dashboard
 *
 *  Defines the properties and methods of the
 *  custom LinkTable Class.
 *
 *  Jeremy Bloomstrom | jeremy.bloomstrom@matsugov.us
 *  Programmer Analyst
 *  Matsu Borough IT
 *
 *  Created: 		5/1/15
 *  Last Updated: 	4/20/15
 *
 *  Prereqs: 	jQuery, jStorage.js
 *
 *  Changelog:
 *   5-1-15		Created the class
 *
 */
// javascript closure
;(function (window, jQuery, $, jInput, jForm, jApp) {

  'use strict';

  var jLinkTable = function jLinkTable(options) {
    /**  **  **  **  **  **  **  **  **  **
    	 *   VARS
    	 **  **  **  **  **  **  **  **  **  **/

    // alias this
    var self = this;
    this.store = $.jStorage;
    this.form = {};
    this.linkTable = '';
    this.colParams = [];

    /**  **  **  **  **  **  **  **  **  **
     *   DEFAULT OPTIONS
     *
     *  Set the default options for the
     *  instance here. Any values specified
     *  at runtime will overwrite these
     *  values.
     **  **  **  **  **  **  **  **  **  **/

    this.options = {

      oFrm: {},

      // the name of the input element
      selectLabel: '',
      selectName: '',

      // the eloquent model name, value column and label column
      model: '',
      valueColumn: '',
      labelColumn: '',

      // whether to allow multiple
      multiple: true,

      // whether the value is required
      required: false,

      // html attributes
      atts: {
        'type': 'text',
        'class': 'form-control'
      },

      // external data for tables, etc.
      extData: false,

      // TTL for external data (mins)
      ttl: 60 * 60000,

      // callback for the completed colParams
      callback: alert

    }; // end options

    // set the runtime values for the options
    $.extend(true, this.options, options);

    /**  **  **  **  **  **  **  **  **  **
    	 *   FUNCTION DEFS
    	 **  **  **  **  **  **  **  **  **  **/
    this.fn = {

      _init: function _init() {
        self.colParams = [{
          type: 'select',
          name: self.options.selectName,
          multiple: self.options.multiple,
          _label: self.options.selectLabel,
          _optionssource: self.options.model + '.' + self.options.valueColumn,
          _labelssource: self.options.model + '.' + self.options.labelColumn,
          _firstlabel: !!self.options.multiple ? false : '--Choose--',
          _firstoption: !!self.options.multiple ? false : '0',
          required: !!self.options.required ? 'required' : '__OFF__',
          'data-validType': !!self.options.required ? 'select' : '__OFF__',
          'data-fieldset': 3,
          'data-ordering': 3
        }];
      } };

    // end fn
    // initialize
    this.fn._init();

    // callback the processed result
    this.options.callback(this.colParams);
  }; // end jInput declaration

  window.jLinkTable = jLinkTable; // add to global scope
})(window, jQuery, $, jInput, jForm, jApp);

/**
 *  jGrid.class.js - Custom Data Grid JS class
 *
 *  Defines the properties and methods of the
 *  custom grid class. This version asynchronously
 *  keeps the grid updated by receiving JSON data
 *  from the server
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *  Released under the MIT license
 *
 *  Prereqs: 	jQuery, underscore.js,
 *  					jInput, jForm, $.validator
 *  			  	jApp, jUtility
 */

;(function (window, jQuery, $, jInput, jForm, jApp, jUtility) {

  'use strict';

  /**
   * jGrid instance constructor
   * @method function
   * @param  {object} options
   * @return /jGrid         	jGrid instance
   */
  var jGrid = function jGrid(options) {

    var self = jApp.activeGrid = this;

    /**
     * Alias handle to the grid
     * @method function
     * @return {[type]} [description]
     */
    this.$ = function () {
      return self.DOM.$grid;
    };

    /**
     * Declare Options vars
     * @type {Object}
     */
    this.options = {
      formDefs: {},
      bind: {},
      events: {},
      fn: {},
      toggles: {},
      bsmsDefaults: {},
      gridHeader: {},
      tableBtns: {},
      rowBtns: {},
      withSelectedBtns: {},
      runtimeParams: options
    }; // end options

    /**
     * HTML Templates
     * @type {Object}
     */
    this.html = {};

    /**
     * Container for events once they have been delegated to avoid collisions
     * @type {Array}
     */
    this.delegatedEvents = [];

    /**
     * Class Methods
     * @type {Object}
     */
    this.fn = {

      /**
       * init the instance
       * @method function
       * @return {[type]} [description]
       */
      _init: function _init() {

        jApp.log('1. Setting Options');
        jUtility.setOptions($.extend(true, {}, jUtility.getDefaultOptions(), { tableBtns: { 'new': { label: 'New ' + options.model } } }, options));

        jApp.log('2. Setting up html templates');
        jUtility.setupHtmlTemplates();

        jApp.log('3. Setting up initial parameters');
        jUtility.setInitParams();

        jApp.log('0. Get User Permissions');
        jUtility.getPermissions(options.model);

        jApp.log('4. Setting Ajax Defaults');
        jUtility.setAjaxDefaults();

        jApp.log('5. Initializing Template');
        jUtility.initializeTemplate();

        jApp.log('6. Getting grid data');
        jUtility.getGridData();

        jApp.log('7. Setting up intervals');
        jUtility.setupIntervals();

        jApp.log('8. Building Menus');
        jUtility.buildMenus();

        jApp.log('9. Building Forms');
        jUtility.buildForms();

        jApp.log('10. Setting up bindings');
        jUtility.bind();

        jApp.log('11. Setting up link tables');
        jUtility.linkTables();

        // toggle the mine button if needed
        // if ( jUtility.isToggleMine() ) {
        // 	self.fn.toggleMine();
        // }

        jUtility.getCheckedOutRecords();
        jUtility.initScrollbar();
      } }; // end fn defs

    // add any functions to this.fn
    // end fn
    this.fn = $.extend(true, this.fn, options.fn);

    // initialize
    this.fn._init();
  }; // end jGrid

  window.jGrid = jGrid;
})(window, jQuery, $, jInput, jForm, jApp, jUtility);
//# sourceMappingURL=async-grid.js.map
