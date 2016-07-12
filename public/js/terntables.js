;(function(window) { 

  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//"
      + window.location.hostname
      + (window.location.port ? ':' + window.location.port : '');
  }

  if (!Array.prototype.last){
     Array.prototype.last = function(){
         return this[this.length - 1];
     };
  }

  _.findKeyWhere = function(list, properties){
      var k;
      var filter = _.matches(properties);
      _.some(list, function(value, key){
          return filter(value) && (k = key);
      });
      return k;
  };

  $.fn.serializeObject = function() {
     var o = {};
     var a = this.serializeArray();
     $.each(a, function() {
         if ($(this).prop('disabled')) return false;

         if ( !!$(this).attr('data-tokens') ) {
           jApp.log($(this).tokenInput('get'));
           o[this.name] = _.pluck( $(this).tokenInput('get'), 'name');
           return o;
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

  $.fn.clearForm = function() {
   return this.each(function() {
     if ( !!$(this).prop('disabled') || !!$(this).prop('readonly') ) return false;

   var type = this.type, tag = this.tagName.toLowerCase();
     if (tag == 'form')
       return $(':input',this).clearForm();
     if (type == 'text' || type == 'password' || tag == 'textarea')
       this.value = '';
     else if (type == 'checkbox' || type == 'radio')
       this.checked = false;
     else if (tag == 'select')
        this.selectedIndex = (!!$(this).prop('multiple')) ? -1 : 0;
   $(this).psiblings('.form-control-feedback').removeClass('glyphicon-remove').removeClass('glyphicon-ok').hide();
   $(this).closest('.form_element').removeClass('has-error').removeClass('has-success');
   });
  };

  $.fn.psiblings = function(search) {
      // Get the current element's siblings
      var siblings = this.siblings(search);

      if (siblings.length != 0) { // Did we get a hit?
          return siblings.eq(0);
      }

      // Traverse up another level
      var parent = this.parent();
      if (parent === undefined || parent.get(0).tagName.toLowerCase() == 'body') {
          // We reached the body tag or failed to get a parent with no result.
          // Return the empty siblings tag so as to return an empty jQuery object.
          return siblings;
      }
      // Try again
      return parent.psiblings(search);
  };

  String.prototype.ucfirst = function() {
      return this.toString().charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.ucwords = function() {
      return this.toString().replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  };
  
})(window);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

//get jApp
var jApp = require('./jApp/jApp.class');
global.jApp = new jApp();

// get jUtility
global.jUtility = require('./jUtility/jUtility.class');

// get jInput
global.jInput = require('./jInput/jInput.class');

// get jForm
global.jForm = require('./jForm/jForm.class');

// get jGrid
global.jGrid = require('./jGrid/jGrid.class');

// test form
global.editFrm = {
      model: 'Group',
      table: 'groups',
      pkey: 'id',
      tableFriendly: 'Group',
      atts: { method: 'PATCH' }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./jApp/jApp.class":45,"./jForm/jForm.class":48,"./jGrid/jGrid.class":49,"./jInput/jInput.class":62,"./jUtility/jUtility.class":81}],2:[function(require,module,exports){
/**
 *  jquery.validator.js - Custom Form Validation JS class
 *
 *  Client-side form validation class
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 */
'use strict';
module.exports = function(frm) {

		//initialize values
		this.errMsg = {
			'Anything'		: 'Please enter something.',
			'file' 			: 'Please select a file.',
			'Number' 		: 'Please enter a number.',
			'Integer' 		: 'Please enter an integer.',
			'Email Address' : 'Please enter an email address.',
			'Zip Code'		: 'Please enter a valid 5-digit or 9-digit US zip code.',
			'Phone Number'	: 'Please enter a valid 10-digit phone number.',
			'US State'		: 'Please enter a valid US State abbreviation.',
			'Credit Card'	: 'Please enter a valid credit card number.',
			'IPV4'			: 'Please enter a valid IPV4 IP address',
			'base64'		: 'Please enter a valid base64 encoded string.',
			'SSN'			: 'Please enter a valid social security number.',
			'color'			: 'Please emter a valid 6-digit hex color code or color keyword.',
			'checkbox'		: 'Please check the box',
			'radio'			: 'Please check one of the options.',
			'select'		: 'Please select a value from the dropdown.',
			'min>='			: 'Field value must be at least [val] characters long.',
			'max<='			: 'Field value must be at most [val] characters long.',
			'min_val>='		: 'Field value must be >= [val].',
			'max_val<='		: 'Field value must be <= [val].',
			'exact=='		: 'Field value must be exactly [val] characters long.',
			'between=='		: 'Field value must be between [val]',
			'date_gt_'		: 'Date must be after [val].',
			'date_lt_'		: 'Date must be before [val].',
			'date_eq_'		: 'Date must match [val]',
			'datetime_gt_'	: 'Date and Time must be after [val].',
			'datetime_lt_'	: 'Date and Time must be before [val].',
			'datetime_eq_'	: 'Date and Time must match [val]',
			'field=='		: 'Field must match [val]',
			'default'		: 'Please correct this field.'
		};

		this.regExp = {
			'Anything'		: /^.+$/,
			'file'			: /^.+$/,
			'Number' 		: /^[0-9.]+$/,
			'Integer'		: /^[0-9]+$/,
			'Email Address' : /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+.)+([a-zA-Z0-9]{2,4})+$/,
			'Zip Code' 		: /^\d{5}([\-]\d{4})?$/,
			'Phone Number'	: /^\(?(\d{3})\)?[\- ]?(\d{3})[\- ]?(\d{4})$/,
			'IPV4'			: /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/,
			'base64'		: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
			'SSN'			: /^\d{3}-\d{2}-\d{4}$/,
			'color'			: /^#[0-9A-F]{6}$/i

		};

		//this.frm = frm;
		this.$frm = frm;
		this.$elms = this.$frm.find('[data-validType]');
		this.errorState = false;
		this.errorClass = 'has-error';
		this.validClass = 'has-success';


		//declare vars
		var self = this;
		var $frm = this.$frm;
		var elm_valid;
		var checkedFields = [];

		// declare functions
		this.fn = {

			/**  **  **  **  **  **  **  **  **  **
			 *   validateForm
			 *
			 *  Iterates through all the form
			 *  elements with a data-validType defined
			 *
			 **  **  **  **  **  **  **  **  **  **/
			validateForm : function() {
				// reset errorState
				self.errorState = false;
				$.noty.closeAll()

				$.each(self.$elms, function($i,elm) {
					console.log('validating ' + $(elm).attr('name'));
					if ($.inArray( $(elm).attr('name'), checkedFields) === -1) {
						elm_valid = self.fn.validateField( $(elm) );
						if ( elm_valid ) { // field is valid
							console.log('valid ' + $(elm).attr('name'));
							self.fn.removeError( $(elm) );
						}
					}
					else {
						console.log($(elm).attr('name') + ' has been checked already.');
					}
				});

				if (self.errorState === true) {
					var n = noty( {
						text: '<strong>Error </strong> Please correct the errors before continuing.',
						layout: 'top',
						type: 'error',
						//timeout: 5000
					});
				}
			}, //end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   validateField
			 *
			 *  Checks element value against
			 *  valid pattern and determines
			 *  if it validates.
			 *
			 **  **  **  **  **  **  **  **  **  **/
			validateField : function($elm) {

				var cats  = $elm.attr('data-validType').split(', ');
				var type = $elm.attr('type');
				var elmValid = false;
				var val = $.isArray( $elm.val() ) ? $elm.val() : !! $elm.val() ? $elm.val().trim() : '';
				var required = $elm.attr('required') != 'required' ? false : true;

				// check some conditions before validating input: if element is disabled or blank and not required, then return valid
				if ( $elm.prop('disabled') || $elm.hasClass('disabled') || ( !required && !val ) ) {
					return true;
				}

				$.each(cats, function(i,cat) {
					console.log('Testing element data-validType=' + cat);
					switch (cat) {

						case 'Anything' :
						case 'file' :
						case 'Number' :
						case 'Integer' :
						case 'Email Address' :
						case 'Zip Code' :
						case 'Phone Number' :
						case 'IPV4' :
						case 'base64' :
						case 'SSN' :
							elmValid = Boolean( val.match( self.regExp[cat] ) || ( !required && !val ) );
						break;

						case 'color' :
							var colorNames = [
								// Colors start with A
								'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure',
								// B
								'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood',
								// C
								'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan',
								// D
								'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta',
								'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue',
								'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray',
								'dimgrey', 'dodgerblue',
								// F
								'firebrick', 'floralwhite', 'forestgreen', 'fuchsia',
								// G
								'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey',
								// H
								'honeydew', 'hotpink',
								// I
								'indianred', 'indigo', 'ivory',
								// K
								'khaki',
								// L
								'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
								'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
								'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen',
								'linen',
								// M
								'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
								'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
								'mistyrose', 'moccasin',
								// N
								'navajowhite', 'navy',
								// O
								'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid',
								// P
								'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink',
								'plum', 'powderblue', 'purple',
								// R
								'red', 'rosybrown', 'royalblue',
								// S
								'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue',
								'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue',
								// T
								'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise',
								// V
								'violet',
								// W
								'wheat', 'white', 'whitesmoke',
								// Y
								'yellow', 'yellowgreen'
							];

							elmValid = Boolean( val.match( self.regExp[cat] ) || $.inArray(val,colorNames) != -1 || ( !required && !val ) );
						break;

						case 'Credit Card' :
							if (/[^0-9-\s]+/.test(val)) {
								return false;
							}
							val = val.replace(/\D/g, '');

							// Validate the card number based on prefix (IIN ranges) and length
							var cards = {
								AMERICAN_EXPRESS: {
									length: [15],
									prefix: ['34', '37']
								},
								DINERS_CLUB: {
									length: [14],
									prefix: ['300', '301', '302', '303', '304', '305', '36']
								},
								DINERS_CLUB_US: {
									length: [16],
									prefix: ['54', '55']
								},
								DISCOVER: {
									length: [16],
									prefix: ['6011', '622126', '622127', '622128', '622129', '62213',
											 '62214', '62215', '62216', '62217', '62218', '62219',
											 '6222', '6223', '6224', '6225', '6226', '6227', '6228',
											 '62290', '62291', '622920', '622921', '622922', '622923',
											 '622924', '622925', '644', '645', '646', '647', '648',
											 '649', '65']
								},
								JCB: {
									length: [16],
									prefix: ['3528', '3529', '353', '354', '355', '356', '357', '358']
								},
								LASER: {
									length: [16, 17, 18, 19],
									prefix: ['6304', '6706', '6771', '6709']
								},
								MAESTRO: {
									length: [12, 13, 14, 15, 16, 17, 18, 19],
									prefix: ['5018', '5020', '5038', '6304', '6759', '6761', '6762', '6763', '6764', '6765', '6766']
								},
								MASTERCARD: {
									length: [16],
									prefix: ['51', '52', '53', '54', '55']
								},
								SOLO: {
									length: [16, 18, 19],
									prefix: ['6334', '6767']
								},
								UNIONPAY: {
									length: [16, 17, 18, 19],
									prefix: ['622126', '622127', '622128', '622129', '62213', '62214',
											 '62215', '62216', '62217', '62218', '62219', '6222', '6223',
											 '6224', '6225', '6226', '6227', '6228', '62290', '62291',
											 '622920', '622921', '622922', '622923', '622924', '622925']
								},
								VISA: {
									length: [16],
									prefix: ['4']
								}
							};

							var type, i;
							loop1:
							for (type in cards) {
								loop2:
								for (i in cards[type].prefix) {
									if (value.substr(0, cards[type].prefix[i].length) === cards[type].prefix[i]     // Check the prefix
										&& $.inArray(value.length, cards[type].length) !== -1)                      // and length
									{
										elmValid = true;
										break loop1;
									}
								}
							}

						break;


						case 'US State'	:
							var stateAbbrevs = ["AL","AK","AS","AZ","AR",
												"CA","CO","CT","DE","DC",
												"FM","FL","GA","GU","HI",
												"ID","IL","IN","IA","KS",
												"KY","LA","ME","MH","MD",
												"MA","MI","MN","MS","MO",
												"MT","NE","NV","NH","NJ",
												"NM","NY","NC","ND","MP",
												"OH","OK","OR","PW","PA",
												"PR","RI","SC","SD","TN",
												"TX","UT","VT","VI","VA",
												"WA","WV","WI","WY"];
							elmValid = Boolean( $.inArray(val.toUpperCase(), stateAbbrevs) !== -1 );
						break;

						case 'checkbox' :
							var min = Number( $elm.attr('min') );
							var max = Number( $elm.attr('max') );
							var numSelected = Number( $frm.find('input[name="' + $elm.attr('name') + '"]').filter(':checked').length );
							if (!min && !max) {
								elmValid = Boolean( !!numSelected || !required );
								self.errMsg.checkbox = 'Please check the box.';
							} else {

								console.log
								console.log('selected ' + numSelected);
								if (min > 0 && max > 0) {
									if ( min==max ) {
										elmValid = Boolean( numSelected === min );
										self.errMsg.checkbox = (min == 1) ? 'Please check an option.' : 'Please check exactly ' + min + ' options.';
									}
									else {
										elmValid = Boolean( numSelected >= min && numSelected <= max);
										self.errMsg.checkbox = 'Please check ' + min + '-' + max + ' options.';
									}
								} else if (min > 0) {
									elmValid = Boolean( numSelected >= min );
									self.errMsg.checkbox = 'Please check at least ' + min + ' options.';
								} else if (max > 0) {
									elmValid = Boolean( numSelected <= max );
									self.errMsg.checkbox = 'Please check at most ' + max + ' options.';
								}
							}

						break;

						case 'radio' :
							var name = $elm.attr('name');
							elmValid = Boolean(!required || $frm.find('[name='+name+']:checked').length > 0 );
						break;

						case 'select' :
							var min = Number( $elm.attr('min') );
							var max = Number( $elm.attr('max') );

							if (!min && !max) {
								elmValid = Boolean(!required || Number($elm.prop('selectedIndex') ) );
								self.errMsg.select = 'Please select a value from the dropdown.';
							}
							else {
								var numSelected = $elm.find('option').filter(':selected').length;
								console.log('selected ' + numSelected);
								if (min > 0 && max > 0) {
									if ( min==max ) {
										elmValid = Boolean( numSelected === min );
										self.errMsg.select = (min == 1) ? 'Please select a value from the dropdown.' : 'Please select exactly ' + min + ' values from the dropdown';
									}
									else {
										elmValid = Boolean( numSelected >= min && numSelected <= max);
										self.errMsg.select = 'Please select ' + min + '-' + max + ' values from the dropdown';
									}
								} else if (min > 0) {
									elmValid = Boolean( numSelected >= min );
									self.errMsg.select = 'Please select at least ' + min + ' values from the dropdown';
								} else if (max > 0) {
									elmValid = Boolean( numSelected <= max );
									self.errMsg.select = 'Please select at most ' + max + ' values from the dropdown';
								}
							}

						break;

						default :

							// minimum characters.
							if (cat.indexOf('min>=') != -1) {
								var min_chars = Number(cat.replace('min>=',''));
								elmValid = Boolean(val.length >= min_chars);
							}

							// maxiumum characters.
							else if (cat.indexOf('max<=') != -1) {
								var max_chars = Number(cat.replace('max<=',''));
								elmValid = required ? Boolean(val.length <= max_chars && val.length > 0) : Boolean(val.length <= max_chars);
							}

							// minimum value.
							else if (cat.indexOf('min_val>=') != -1) {
								var min_val = Number(cat.replace('min_val>=',''));
								elmValid = Boolean( Number(val ) >= min_val);
							}

							// maximum value.
							else if (cat.indexOf('max_val<=') != -1) {
								var max_val = Number(cat.replace('max_val<=',''));
								elmValid = required ? Boolean( Number(val) <= max_val && val.length > 0) : Boolean( Number(val) <= max_val);
							}

							// exact number of characters.
							else if (cat.indexOf('exact==') != -1) {
								var ex_chars = Number(cat.replace('exact==','') );
								elmValid = Boolean(val.length == ex_chars);
							}

							// between two values
							else if (cat.indexOf('between==') != -1) {
								var lo_hi = cat.replace('between==','');
								var lo = Number( lo_hi.split(',')[0] );
								var hi = Number( lo_hi.split(',')[1] );
								var $val = Number(val);
								elmValid = Boolean( $val >= lo && $val <= hi);
							}

							// field must be equal/greater/less than date.
							else if (cat.indexOf('date_gt_') != -1 || cat.indexOf('date_lt_') != -1 || cat.indexOf('date_eq_') != -1 ) {
								var yr,mo,da,hr,mn,date2midnight,date1midnight,date1,date1_val;
								var date2 = cat.replace('date_gt_','').replace('date_lt_','').replace('date_eq_','');
								console.log(date2);
								var date2_val = ( $frm.find(date2).length > 0 ) ? $frm.find(date2).val().trim() : date2.trim();

								switch(date2_val) {
									case 'today' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = today.getDate();
										hr = "00";
										mn = "00";
									break;

									case 'yesterday' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()-1);
										hr = "00";
										mn = "00";
									break;

									case 'tomorrow' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()+1);
										hr = "00";
										mn = "00";
									break;

									default :
										yr = date2_val.substr(0,4);
										mo = Number(date2_val.substr(5,2)-1);
										da = date2_val.substr(8,2);
										hr = "00";
										mn = "00";
									break;
								}

								// Calculate date2 - YYYY-MM-DD HH:II
								date2 = Date.UTC(yr,mo,da,hr,mn);
								console.log(date2midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);

								date1_val = val;
								// Calculate date1
								yr = date1_val.substr(0,4);
								mo = Number(date1_val.substr(5,2)-1);
								da = date1_val.substr(8,2);
								hr = "00";
								mn = "00";
								date1 = Date.UTC(yr,mo,da,hr,mn);
								console.log(date1midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);


								var date2_required = ( $frm.find(date2).length == 0 || $frm.find(date2).attr('required') != 'required' ) ? false : true;
								if (cat.indexOf('_gt_') !== -1 ) {
									// >
									elmValid = Boolean(date1 > date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else if (cat.indexOf('_lt_') !== -1 ) {
									// <
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else {
									// ==

									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) );
								}

								//elmValid = $is_gt ? Boolean(date1 > date2 || ( $frm.find(date2).attr('required') != 'required' && String(val.trim()) != '' && String( date2_val.trim() ) == '') ) : Boolean(date2 > date1 || ( $frm.find(date2).attr('required') != 'required' && String( val.trim() ) != '' && String( date2_val.trim() ) == '') );
							}

							// field must be equal/greater/less than date with time.
							else if (cat.indexOf('datetime_gt_') != -1 || cat.indexOf('datetime_lt_') != -1 || cat.indexOf('datetime_eq_') != -1 ) {
								var yr,mo,da,hr,mn,date2midnight,date1midnight,date1,date1_val;
								var date2 = cat.replace('datetime_gt_','').replace('datetime_lt_','').replace('datetime_eq_','');
								console.log(date2);
								var date2_val = ( $frm.find(date2).length > 0 ) ? $frm.find(date2).val().trim() : date2.trim();

								switch(date2_val) {
									case 'today' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = today.getDate();
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									case 'yesterday' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()-1);
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									case 'tomorrow' :
										var today = new Date();
										yr = today.getFullYear();
										mo = today.getMonth();
										da = Number(today.getDate()+1);
										hr = today.getHours();
										mn = today.getMinutes();
									break;

									default :
										yr = date2_val.substr(0,4);
										mo = Number(date2_val.substr(5,2)-1);
										da = date2_val.substr(8,2);
										hr = date2_val.substr(11,2);
										mn = date2_val.substr(14,2);
									break;
								}

								// Calculate date2 - YYYY-MM-DD HH:II
								date2 = Date.UTC(yr,mo,da,hr,mn);
								date2midnight = Date.UTC(yr,mo,da,0,0);
								console.log(date2midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);

								date1_val = val;
								// Calculate date1
								yr = date1_val.substr(0,4);
								mo = Number(date1_val.substr(5,2)-1);
								da = date1_val.substr(8,2);
								hr = date1_val.substr(11,2);
								mn = date1_val.substr(14,2);
								date1 = Date.UTC(yr,mo,da,hr,mn);
								date1midnight = Date.UTC(yr,mo,da,0,0)
								console.log(date1midnight);
								//alert(yr + ' ' + mo + ' ' + da + ' ' + hr + ' ' + mn);


								var date2_required = ( $frm.find(date2).length == 0 || $frm.find(date2).attr('required') != 'required' ) ? false : true;
								if (cat.indexOf('_gt_') !== -1 ) {
									// >
									elmValid = Boolean(date1 > date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else if (cat.indexOf('_lt_') !== -1 ) {
									// <
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 < date2 || ( !date2_required && !!val && !date2_val ) );
								}
								else {
									// ==
									elmValid = required ? Boolean(val.length > 0) && Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) ) : Boolean(date1 == date2 || ( !date2_required && !!val && !date2_val ) );
								}

								//elmValid = $is_gt ? Boolean(date1 > date2 || ( $frm.find(date2).attr('required') != 'required' && String(val.trim()) != '' && String( date2_val.trim() ) == '') ) : Boolean(date2 > date1 || ( $frm.find(date2).attr('required') != 'required' && String( val.trim() ) != '' && String( date2_val.trim() ) == '') );
							}

							// field must match other field.
							else if (cat.indexOf('field==') != -1) {
								var pw1_name = cat.replace('field==','');
								var $pw1 = $frm.find( pw1_name );
								elmValid = Boolean(val == $pw1.val() );
							}

							// must be in list.
							else {
								var patterns = cat.toLowerCase().split('|');
								elmValid = Boolean( $.inArray(val.toLowerCase(), patterns) !== -1 );
							}
						break;
					} // end switch

					// put this element in the checkedFields array so it won't be checked again this iteration.
					checkedFields.push( $elm.attr('name')  );

					// report error if necessary
					if (!elmValid) {
						self.fn.raiseError( $elm, cat );
						self.errorState = true;
						return false;
					}

				}); // end each

				return elmValid;
			}, // end fn


			/**  **  **  **  **  **  **  **  **  **
			 *   isArray
			 *  @obj - object to check
			 *
			 *  Determines if input object is
			 *  an array
			 **  **  **  **  **  **  **  **  **  **/
			isArray : function(obj) {
				return Boolean( obj.constructor.toString().indexOf("Array") !== -1 );
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   oc
			 *  @arrayOrArgs - object/argument list
			 *
			 *  Creates a single-dimensional array
			 *  from the input array/object/args
			 **  **  **  **  **  **  **  **  **  **/
			oc : function(arrayOrArgs) {
				var o = {};
				var a = ( self.fn.isArray(arrayOrArgs)) ? arrayOrArgs : arguments;
				var i;
				for(i=0;i<a.length;i++) {
					o[a[i]]='';
				}
				return o;
			}, // end fn

			/**  **  **  **  **  **  **  **  **  **
			 *   raiseError
			 *  @elm - Form Element
			 *
			 *  Raises an error message for an invalid
			 *  form element.
			 **  **  **  **  **  **  **  **  **  **/
			raiseError : function($elm,$cat) {
				var $err_msg, $search, $replace;
				var $elmid = $elm.attr('id');
				var $label = $("label[for='"+$elmid+"']").html();
				var val = $.isArray( $elm.val() ) ? $elm.val() : !! $elm.val() ? $elm.val().trim() : '';
				//var $cat = arguments[1] || $elm.attr('data-validType');
				var $err_index = -1;
				console.log($elm[0].nodeName + ' ' + $elm.attr('name') + ' invalid ');
				console.log($elm.closest('.form_element'));
				$elm.closest('.form_element').addClass( self.errorClass );
				$elm.psiblings('.form-control-feedback').addClass('glyphicon-remove').removeClass('glyphicon-ok').show();
				$.each( self.errMsg, function($i,$val) {
					if ($cat.indexOf($i) !== -1) {
						$err_index = $i;
					}
				});

				if ($err_index == -1) {
					$err_index = 'default';
				}
				$err_msg = ($elm.attr('required') == 'required' && !val && $cat != 'select' && $cat != 'file' && $cat != 'checkbox' && $cat != 'radio') ?
					'[' + $label + '] : ' + 'Please enter something.' :
					'[' + $label + '] : ' + self.errMsg[$err_index];
				$search = '[val]';
				$replace = $cat.replace($err_index,'');

				try {
					if ( $($replace).length > 0 ) {
						$replace = $("label[for='" + $replace.substr(1) + "']").html();
					}
				} catch(e) {
					console.warn('Validator Class : Exception Caught')
				}
				$err_msg = $err_msg.replace($search,$replace);

				/* var n = noty( {
					text: '<strong>Error </strong> ' + $err_msg,
					layout: 'top',
					type: 'error',
					//timeout: 5000
				});  */
				$elm.psiblings('.help-block').html( $err_msg.replace('[' + $label + '] : ','') ).fadeIn('fast');
			},

			/**  **  **  **  **  **  **  **  **  **
			 *   removeError
			 *  @elm - Form Element
			 *
			 *  Removes an error message for an invalid
			 *  form element.
			 **  **  **  **  **  **  **  **  **  **/
			removeError : function($elm) {
				$elm.closest('.form_element').removeClass( self.errorClass )
				$elm.psiblings('.form-control-feedback').removeClass('glyphicon-remove');
				$elm.psiblings('.help-block').html('').hide();

				//add success class if not a disabled element.
				if (!( $elm.prop('disabled') || $elm.hasClass('disabled') ) ) {
					$elm.psiblings('.form-control-feedback').addClass('glyphicon-ok').show().end()
						.closest('.form_element').addClass( self.validClass );
				}
			} //end fn

		}; //end fns


		// perform the validation
		//$.noty.closeAll(); // close all notifications
		this.fn.validateForm();

	}

},{}],3:[function(require,module,exports){
// This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
require('../../js/transition.js')
require('../../js/alert.js')
require('../../js/button.js')
require('../../js/carousel.js')
require('../../js/collapse.js')
require('../../js/dropdown.js')
require('../../js/modal.js')
require('../../js/tooltip.js')
require('../../js/popover.js')
require('../../js/scrollspy.js')
require('../../js/tab.js')
require('../../js/affix.js')
},{"../../js/affix.js":4,"../../js/alert.js":5,"../../js/button.js":6,"../../js/carousel.js":7,"../../js/collapse.js":8,"../../js/dropdown.js":9,"../../js/modal.js":10,"../../js/popover.js":11,"../../js/scrollspy.js":12,"../../js/tab.js":13,"../../js/tooltip.js":14,"../../js/transition.js":15}],4:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

},{}],5:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

},{}],6:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.6'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

},{}],7:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.6'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

},{}],8:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.6'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

},{}],9:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

},{}],10:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

},{}],11:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.6'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

},{}],12:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

},{}],13:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

},{}],14:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

},{}],15:[function(require,module,exports){
/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

},{}],16:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:01Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// We once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android<4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android<4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optimization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*.
					// Use string for doubling so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur(),
				// break the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// Ensure the complete handler is called before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// Toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// Handle most common string cases
					ret.replace(rreturn, "") :
					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = window.location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],17:[function(require,module,exports){
!function(root, factory) {
	 if (typeof define === 'function' && define.amd) {
		 define(['jquery'], factory);
	 } else if (typeof exports === 'object') {
		 module.exports = factory(require('jquery'));
	 } else {
		 factory(root.jQuery);
	 }
}(this, function($) {

/*!
 @package noty - jQuery Notification Plugin
 @version version: 2.3.8
 @contributors https://github.com/needim/noty/graphs/contributors

 @documentation Examples and Documentation - http://needim.github.com/noty/

 @license Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php
 */

    if(typeof Object.create !== 'function') {
        Object.create = function(o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    var NotyObject = {

        init: function(options) {

            // Mix in the passed in options with the default options
            this.options = $.extend({}, $.noty.defaults, options);

            this.options.layout = (this.options.custom) ? $.noty.layouts['inline'] : $.noty.layouts[this.options.layout];

            if($.noty.themes[this.options.theme])
                this.options.theme = $.noty.themes[this.options.theme];
            else
                this.options.themeClassName = this.options.theme;

            this.options = $.extend({}, this.options, this.options.layout.options);
            this.options.id = 'noty_' + (new Date().getTime() * Math.floor(Math.random() * 1000000));

            // Build the noty dom initial structure
            this._build();

            // return this so we can chain/use the bridge with less code.
            return this;
        }, // end init

        _build: function() {

            // Generating noty bar
            var $bar = $('<div class="noty_bar noty_type_' + this.options.type + '"></div>').attr('id', this.options.id);
            $bar.append(this.options.template).find('.noty_text').html(this.options.text);

            this.$bar = (this.options.layout.parent.object !== null) ? $(this.options.layout.parent.object).css(this.options.layout.parent.css).append($bar) : $bar;

            if(this.options.themeClassName)
                this.$bar.addClass(this.options.themeClassName).addClass('noty_container_type_' + this.options.type);

            // Set buttons if available
            if(this.options.buttons) {

                // If we have button disable closeWith & timeout options
                this.options.closeWith = [];
                this.options.timeout = false;

                var $buttons = $('<div/>').addClass('noty_buttons');

                (this.options.layout.parent.object !== null) ? this.$bar.find('.noty_bar').append($buttons) : this.$bar.append($buttons);

                var self = this;

                $.each(this.options.buttons, function(i, button) {
                    var $button = $('<button/>').addClass((button.addClass) ? button.addClass : 'gray').html(button.text).attr('id', button.id ? button.id : 'button-' + i)
                        .attr('title', button.title)
                        .appendTo(self.$bar.find('.noty_buttons'))
                        .on('click', function(event) {
                            if($.isFunction(button.onClick)) {
                                button.onClick.call($button, self, event);
                            }
                        });
                });
            }

            // For easy access
            this.$message = this.$bar.find('.noty_message');
            this.$closeButton = this.$bar.find('.noty_close');
            this.$buttons = this.$bar.find('.noty_buttons');

            $.noty.store[this.options.id] = this; // store noty for api

        }, // end _build

        show: function() {

            var self = this;

            (self.options.custom) ? self.options.custom.find(self.options.layout.container.selector).append(self.$bar) : $(self.options.layout.container.selector).append(self.$bar);

            if(self.options.theme && self.options.theme.style)
                self.options.theme.style.apply(self);

            ($.type(self.options.layout.css) === 'function') ? this.options.layout.css.apply(self.$bar) : self.$bar.css(this.options.layout.css || {});

            self.$bar.addClass(self.options.layout.addClass);

            self.options.layout.container.style.apply($(self.options.layout.container.selector), [self.options.within]);

            self.showing = true;

            if(self.options.theme && self.options.theme.style)
                self.options.theme.callback.onShow.apply(this);

            if($.inArray('click', self.options.closeWith) > -1)
                self.$bar.css('cursor', 'pointer').one('click', function(evt) {
                    self.stopPropagation(evt);
                    if(self.options.callback.onCloseClick) {
                        self.options.callback.onCloseClick.apply(self);
                    }
                    self.close();
                });

            if($.inArray('hover', self.options.closeWith) > -1)
                self.$bar.one('mouseenter', function() {
                    self.close();
                });

            if($.inArray('button', self.options.closeWith) > -1)
                self.$closeButton.one('click', function(evt) {
                    self.stopPropagation(evt);
                    self.close();
                });

            if($.inArray('button', self.options.closeWith) == -1)
                self.$closeButton.remove();

            if(self.options.callback.onShow)
                self.options.callback.onShow.apply(self);

            if (typeof self.options.animation.open == 'string') {
                self.$bar.css('height', self.$bar.innerHeight());
                self.$bar.on('click',function(e){
                    self.wasClicked = true;
                });
                self.$bar.show().addClass(self.options.animation.open).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    if(self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
                    self.showing = false;
                    self.shown = true;
                    if(self.hasOwnProperty('wasClicked')){
                        self.$bar.off('click',function(e){
                            self.wasClicked = true;
                        });
                        self.close();
                    }
                });

            } else {
                self.$bar.animate(
                    self.options.animation.open,
                    self.options.animation.speed,
                    self.options.animation.easing,
                    function() {
                        if(self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
                        self.showing = false;
                        self.shown = true;
                    });
            }

            // If noty is have a timeout option
            if(self.options.timeout)
                self.$bar.delay(self.options.timeout).promise().done(function() {
                    self.close();
                });

            return this;

        }, // end show

        close: function() {

            if(this.closed) return;
            if(this.$bar && this.$bar.hasClass('i-am-closing-now')) return;

            var self = this;

            if(this.showing) {
                self.$bar.queue(
                    function() {
                        self.close.apply(self);
                    }
                );
                return;
            }

            if(!this.shown && !this.showing) { // If we are still waiting in the queue just delete from queue
                var queue = [];
                $.each($.noty.queue, function(i, n) {
                    if(n.options.id != self.options.id) {
                        queue.push(n);
                    }
                });
                $.noty.queue = queue;
                return;
            }

            self.$bar.addClass('i-am-closing-now');

            if(self.options.callback.onClose) {
                self.options.callback.onClose.apply(self);
            }

            if (typeof self.options.animation.close == 'string') {
                self.$bar.addClass(self.options.animation.close).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    if(self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
                    self.closeCleanUp();
                });
            } else {
                self.$bar.clearQueue().stop().animate(
                    self.options.animation.close,
                    self.options.animation.speed,
                    self.options.animation.easing,
                    function() {
                        if(self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
                    })
                    .promise().done(function() {
                        self.closeCleanUp();
                    });
            }

        }, // end close

        closeCleanUp: function() {

            var self = this;

            // Modal Cleaning
            if(self.options.modal) {
                $.notyRenderer.setModalCount(-1);
                if($.notyRenderer.getModalCount() == 0) $('.noty_modal').fadeOut(self.options.animation.fadeSpeed, function() {
                    $(this).remove();
                });
            }

            // Layout Cleaning
            $.notyRenderer.setLayoutCountFor(self, -1);
            if($.notyRenderer.getLayoutCountFor(self) == 0) $(self.options.layout.container.selector).remove();

            // Make sure self.$bar has not been removed before attempting to remove it
            if(typeof self.$bar !== 'undefined' && self.$bar !== null) {

                if (typeof self.options.animation.close == 'string') {
                    self.$bar.css('transition', 'all 100ms ease').css('border', 0).css('margin', 0).height(0);
                    self.$bar.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                        self.$bar.remove();
                        self.$bar = null;
                        self.closed = true;

                        if(self.options.theme.callback && self.options.theme.callback.onClose) {
                            self.options.theme.callback.onClose.apply(self);
                        }
                    });
                } else {
                    self.$bar.remove();
                    self.$bar = null;
                    self.closed = true;
                }
            }

            delete $.noty.store[self.options.id]; // deleting noty from store

            if(self.options.theme.callback && self.options.theme.callback.onClose) {
                self.options.theme.callback.onClose.apply(self);
            }

            if(!self.options.dismissQueue) {
                // Queue render
                $.noty.ontap = true;

                $.notyRenderer.render();
            }

            if(self.options.maxVisible > 0 && self.options.dismissQueue) {
                $.notyRenderer.render();
            }

        }, // end close clean up

        setText: function(text) {
            if(!this.closed) {
                this.options.text = text;
                this.$bar.find('.noty_text').html(text);
            }
            return this;
        },

        setType: function(type) {
            if(!this.closed) {
                this.options.type = type;
                this.options.theme.style.apply(this);
                this.options.theme.callback.onShow.apply(this);
            }
            return this;
        },

        setTimeout: function(time) {
            if(!this.closed) {
                var self = this;
                this.options.timeout = time;
                self.$bar.delay(self.options.timeout).promise().done(function() {
                    self.close();
                });
            }
            return this;
        },

        stopPropagation: function(evt) {
            evt = evt || window.event;
            if(typeof evt.stopPropagation !== "undefined") {
                evt.stopPropagation();
            }
            else {
                evt.cancelBubble = true;
            }
        },

        closed : false,
        showing: false,
        shown  : false

    }; // end NotyObject

    $.notyRenderer = {};

    $.notyRenderer.init = function(options) {

        // Renderer creates a new noty
        var notification = Object.create(NotyObject).init(options);

        if(notification.options.killer)
            $.noty.closeAll();

        (notification.options.force) ? $.noty.queue.unshift(notification) : $.noty.queue.push(notification);

        $.notyRenderer.render();

        return ($.noty.returns == 'object') ? notification : notification.options.id;
    };

    $.notyRenderer.render = function() {

        var instance = $.noty.queue[0];

        if($.type(instance) === 'object') {
            if(instance.options.dismissQueue) {
                if(instance.options.maxVisible > 0) {
                    if($(instance.options.layout.container.selector + ' > li').length < instance.options.maxVisible) {
                        $.notyRenderer.show($.noty.queue.shift());
                    }
                    else {

                    }
                }
                else {
                    $.notyRenderer.show($.noty.queue.shift());
                }
            }
            else {
                if($.noty.ontap) {
                    $.notyRenderer.show($.noty.queue.shift());
                    $.noty.ontap = false;
                }
            }
        }
        else {
            $.noty.ontap = true; // Queue is over
        }

    };

    $.notyRenderer.show = function(notification) {

        if(notification.options.modal) {
            $.notyRenderer.createModalFor(notification);
            $.notyRenderer.setModalCount(+1);
        }

        // Where is the container?
        if(notification.options.custom) {
            if(notification.options.custom.find(notification.options.layout.container.selector).length == 0) {
                notification.options.custom.append($(notification.options.layout.container.object).addClass('i-am-new'));
            }
            else {
                notification.options.custom.find(notification.options.layout.container.selector).removeClass('i-am-new');
            }
        }
        else {
            if($(notification.options.layout.container.selector).length == 0) {
                $('body').append($(notification.options.layout.container.object).addClass('i-am-new'));
            }
            else {
                $(notification.options.layout.container.selector).removeClass('i-am-new');
            }
        }

        $.notyRenderer.setLayoutCountFor(notification, +1);

        notification.show();
    };

    $.notyRenderer.createModalFor = function(notification) {
        if($('.noty_modal').length == 0) {
            var modal = $('<div/>').addClass('noty_modal').addClass(notification.options.theme).data('noty_modal_count', 0);

            if(notification.options.theme.modal && notification.options.theme.modal.css)
                modal.css(notification.options.theme.modal.css);

            modal.prependTo($('body')).fadeIn(notification.options.animation.fadeSpeed);

            if($.inArray('backdrop', notification.options.closeWith) > -1)
                modal.on('click', function(e) {
                    $.noty.closeAll();
                });
        }
    };

    $.notyRenderer.getLayoutCountFor = function(notification) {
        return $(notification.options.layout.container.selector).data('noty_layout_count') || 0;
    };

    $.notyRenderer.setLayoutCountFor = function(notification, arg) {
        return $(notification.options.layout.container.selector).data('noty_layout_count', $.notyRenderer.getLayoutCountFor(notification) + arg);
    };

    $.notyRenderer.getModalCount = function() {
        return $('.noty_modal').data('noty_modal_count') || 0;
    };

    $.notyRenderer.setModalCount = function(arg) {
        return $('.noty_modal').data('noty_modal_count', $.notyRenderer.getModalCount() + arg);
    };

    // This is for custom container
    $.fn.noty = function(options) {
        options.custom = $(this);
        return $.notyRenderer.init(options);
    };

    $.noty = {};
    $.noty.queue = [];
    $.noty.ontap = true;
    $.noty.layouts = {};
    $.noty.themes = {};
    $.noty.returns = 'object';
    $.noty.store = {};

    $.noty.get = function(id) {
        return $.noty.store.hasOwnProperty(id) ? $.noty.store[id] : false;
    };

    $.noty.close = function(id) {
        return $.noty.get(id) ? $.noty.get(id).close() : false;
    };

    $.noty.setText = function(id, text) {
        return $.noty.get(id) ? $.noty.get(id).setText(text) : false;
    };

    $.noty.setType = function(id, type) {
        return $.noty.get(id) ? $.noty.get(id).setType(type) : false;
    };

    $.noty.clearQueue = function() {
        $.noty.queue = [];
    };

    $.noty.closeAll = function() {
        $.noty.clearQueue();
        $.each($.noty.store, function(id, noty) {
            noty.close();
        });
    };

    var windowAlert = window.alert;

    $.noty.consumeAlert = function(options) {
        window.alert = function(text) {
            if(options)
                options.text = text;
            else
                options = {text: text};

            $.notyRenderer.init(options);
        };
    };

    $.noty.stopConsumeAlert = function() {
        window.alert = windowAlert;
    };

    $.noty.defaults = {
        layout      : 'top',
        theme       : 'defaultTheme',
        type        : 'alert',
        text        : '',
        dismissQueue: true,
        template    : '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation   : {
            open  : {height: 'toggle'},
            close : {height: 'toggle'},
            easing: 'swing',
            speed : 500,
            fadeSpeed: 'fast',
        },
        timeout     : false,
        force       : false,
        modal       : false,
        maxVisible  : 5,
        killer      : false,
        closeWith   : ['click'],
        callback    : {
            onShow      : function() {
            },
            afterShow   : function() {
            },
            onClose     : function() {
            },
            afterClose  : function() {
            },
            onCloseClick: function() {
            }
        },
        buttons     : false
    };

    $(window).on('resize', function() {
        $.each($.noty.layouts, function(index, layout) {
            layout.container.style.apply($(layout.container.selector));
        });
    });

    // Helpers
    window.noty = function noty(options) {
        return $.notyRenderer.init(options);
    };

$.noty.layouts.bottom = {
    name     : 'bottom',
    options  : {},
    container: {
        object  : '<ul id="noty_bottom_layout_container" />',
        selector: 'ul#noty_bottom_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 0,
                left         : '5%',
                position     : 'fixed',
                width        : '90%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};

$.noty.layouts.bottomCenter = {
    name     : 'bottomCenter',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomCenter_layout_container" />',
        selector: 'ul#noty_bottomCenter_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                left         : 0,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            $(this).css({
                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};


$.noty.layouts.bottomLeft = {
    name     : 'bottomLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomLeft_layout_container" />',
        selector: 'ul#noty_bottomLeft_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.bottomRight = {
    name     : 'bottomRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_bottomRight_layout_container" />',
        selector: 'ul#noty_bottomRight_layout_container',
        style   : function() {
            $(this).css({
                bottom       : 20,
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.center = {
    name     : 'center',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_center_layout_container" />',
        selector: 'ul#noty_center_layout_container',
        style   : function() {
            $(this).css({
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                    top : ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                    top : ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.centerLeft = {
    name     : 'centerLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_centerLeft_layout_container" />',
        selector: 'ul#noty_centerLeft_layout_container',
        style   : function() {
            $(this).css({
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};

$.noty.layouts.centerRight = {
    name     : 'centerRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_centerRight_layout_container" />',
        selector: 'ul#noty_centerRight_layout_container',
        style   : function() {
            $(this).css({
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            // getting hidden height
            var dupe = $(this).clone().css({visibility: "hidden", display: "block", position: "absolute", top: 0, left: 0}).attr('id', 'dupe');
            $("body").append(dupe);
            dupe.find('.i-am-closing-now').remove();
            dupe.find('li').css('display', 'block');
            var actual_height = dupe.height();
            dupe.remove();

            if($(this).hasClass('i-am-new')) {
                $(this).css({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                });
            }
            else {
                $(this).animate({
                    top: ($(window).height() - actual_height) / 2 + 'px'
                }, 500);
            }

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }

        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.inline = {
    name     : 'inline',
    options  : {},
    container: {
        object  : '<ul class="noty_inline_layout_container" />',
        selector: 'ul.noty_inline_layout_container',
        style   : function() {
            $(this).css({
                width        : '100%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};
$.noty.layouts.top = {
    name     : 'top',
    options  : {},
    container: {
        object  : '<ul id="noty_top_layout_container" />',
        selector: 'ul#noty_top_layout_container',
        style   : function() {
            $(this).css({
                top          : 0,
                left         : '5%',
                position     : 'fixed',
                width        : '90%',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 9999999
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none'
    },
    addClass : ''
};
$.noty.layouts.topCenter = {
    name     : 'topCenter',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topCenter_layout_container" />',
        selector: 'ul#noty_topCenter_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                left         : 0,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            $(this).css({
                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
            });
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};

$.noty.layouts.topLeft = {
    name     : 'topLeft',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topLeft_layout_container" />',
        selector: 'ul#noty_topLeft_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                left         : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    left: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.layouts.topRight = {
    name     : 'topRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topRight_layout_container" />',
        selector: 'ul#noty_topRight_layout_container',
        style   : function() {
            $(this).css({
                top          : 20,
                right        : 20,
                position     : 'fixed',
                width        : '310px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '310px'
    },
    addClass : ''
};
$.noty.themes.bootstrapTheme = {
    name: 'bootstrapTheme',
    modal: {
        css: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            zIndex: 10000,
            opacity: 0.6,
            display: 'none',
            left: 0,
            top: 0
        }
    },
    style: function() {

        var containerSelector = this.options.layout.container.selector;
        $(containerSelector).addClass('list-group');

        this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
        this.$closeButton.addClass('close');

        this.$bar.addClass( "list-group-item" ).css('padding', '0px');

        switch (this.options.type) {
            case 'alert': case 'notification':
                this.$bar.addClass( "list-group-item-info" );
                break;
            case 'warning':
                this.$bar.addClass( "list-group-item-warning" );
                break;
            case 'error':
                this.$bar.addClass( "list-group-item-danger" );
                break;
            case 'information':
                this.$bar.addClass("list-group-item-info");
                break;
            case 'success':
                this.$bar.addClass( "list-group-item-success" );
                break;
        }

        this.$message.css({
            fontSize: '13px',
            lineHeight: '16px',
            textAlign: 'center',
            padding: '8px 10px 9px',
            width: 'auto',
            position: 'relative'
        });
    },
    callback: {
        onShow: function() {  },
        onClose: function() {  }
    }
};


$.noty.themes.defaultTheme = {
    name    : 'defaultTheme',
    helpers : {
        borderFix: function() {
            if(this.options.dismissQueue) {
                var selector = this.options.layout.container.selector + ' ' + this.options.layout.parent.selector;
                switch(this.options.layout.name) {
                    case 'top':
                        $(selector).css({borderRadius: '0px 0px 0px 0px'});
                        $(selector).last().css({borderRadius: '0px 0px 5px 5px'});
                        break;
                    case 'topCenter':
                    case 'topLeft':
                    case 'topRight':
                    case 'bottomCenter':
                    case 'bottomLeft':
                    case 'bottomRight':
                    case 'center':
                    case 'centerLeft':
                    case 'centerRight':
                    case 'inline':
                        $(selector).css({borderRadius: '0px 0px 0px 0px'});
                        $(selector).first().css({'border-top-left-radius': '5px', 'border-top-right-radius': '5px'});
                        $(selector).last().css({'border-bottom-left-radius': '5px', 'border-bottom-right-radius': '5px'});
                        break;
                    case 'bottom':
                        $(selector).css({borderRadius: '0px 0px 0px 0px'});
                        $(selector).first().css({borderRadius: '5px 5px 0px 0px'});
                        break;
                    default:
                        break;
                }
            }
        }
    },
    modal   : {
        css: {
            position       : 'fixed',
            width          : '100%',
            height         : '100%',
            backgroundColor: '#000',
            zIndex         : 10000,
            opacity        : 0.6,
            display        : 'none',
            left           : 0,
            top            : 0
        }
    },
    style   : function() {

        this.$bar.css({
            overflow  : 'hidden',
            background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAQAAAClM0ndAAAAhklEQVR4AdXO0QrCMBBE0bttkk38/w8WRERpdyjzVOc+HxhIHqJGMQcFFkpYRQotLLSw0IJ5aBdovruMYDA/kT8plF9ZKLFQcgF18hDj1SbQOMlCA4kao0iiXmah7qBWPdxpohsgVZyj7e5I9KcID+EhiDI5gxBYKLBQYKHAQoGFAoEks/YEGHYKB7hFxf0AAAAASUVORK5CYII=') repeat-x scroll left top #fff"
        });

        this.$message.css({
            fontSize  : '13px',
            lineHeight: '16px',
            textAlign : 'center',
            padding   : '8px 10px 9px',
            width     : 'auto',
            position  : 'relative'
        });

        this.$closeButton.css({
            position  : 'absolute',
            top       : 4, right: 4,
            width     : 10, height: 10,
            background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
            display   : 'none',
            cursor    : 'pointer'
        });

        this.$buttons.css({
            padding        : 5,
            textAlign      : 'right',
            borderTop      : '1px solid #ccc',
            backgroundColor: '#fff'
        });

        this.$buttons.find('button').css({
            marginLeft: 5
        });

        this.$buttons.find('button:first').css({
            marginLeft: 0
        });

        this.$bar.on({
            mouseenter: function() {
                $(this).find('.noty_close').stop().fadeTo('normal', 1);
            },
            mouseleave: function() {
                $(this).find('.noty_close').stop().fadeTo('normal', 0);
            }
        });

        switch(this.options.layout.name) {
            case 'top':
                this.$bar.css({
                    borderRadius: '0px 0px 5px 5px',
                    borderBottom: '2px solid #eee',
                    borderLeft  : '2px solid #eee',
                    borderRight : '2px solid #eee',
                    boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                break;
            case 'topCenter':
            case 'center':
            case 'bottomCenter':
            case 'inline':
                this.$bar.css({
                    borderRadius: '5px',
                    border      : '1px solid #eee',
                    boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                this.$message.css({fontSize: '13px', textAlign: 'center'});
                break;
            case 'topLeft':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomRight':
            case 'centerLeft':
            case 'centerRight':
                this.$bar.css({
                    borderRadius: '5px',
                    border      : '1px solid #eee',
                    boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                this.$message.css({fontSize: '13px', textAlign: 'left'});
                break;
            case 'bottom':
                this.$bar.css({
                    borderRadius: '5px 5px 0px 0px',
                    borderTop   : '2px solid #eee',
                    borderLeft  : '2px solid #eee',
                    borderRight : '2px solid #eee',
                    boxShadow   : "0 -2px 4px rgba(0, 0, 0, 0.1)"
                });
                break;
            default:
                this.$bar.css({
                    border   : '2px solid #eee',
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                break;
        }

        switch(this.options.type) {
            case 'alert':
            case 'notification':
                this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
                break;
            case 'warning':
                this.$bar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
                this.$buttons.css({borderTop: '1px solid #FFC237'});
                break;
            case 'error':
                this.$bar.css({backgroundColor: 'red', borderColor: 'darkred', color: '#FFF'});
                this.$message.css({fontWeight: 'bold'});
                this.$buttons.css({borderTop: '1px solid darkred'});
                break;
            case 'information':
                this.$bar.css({backgroundColor: '#57B7E2', borderColor: '#0B90C4', color: '#FFF'});
                this.$buttons.css({borderTop: '1px solid #0B90C4'});
                break;
            case 'success':
                this.$bar.css({backgroundColor: 'lightgreen', borderColor: '#50C24E', color: 'darkgreen'});
                this.$buttons.css({borderTop: '1px solid #50C24E'});
                break;
            default:
                this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
                break;
        }
    },
    callback: {
        onShow : function() {
            $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
        },
        onClose: function() {
            $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
        }
    }
};

$.noty.themes.relax = {
    name    : 'relax',
    helpers : {},
    modal   : {
        css: {
            position       : 'fixed',
            width          : '100%',
            height         : '100%',
            backgroundColor: '#000',
            zIndex         : 10000,
            opacity        : 0.6,
            display        : 'none',
            left           : 0,
            top            : 0
        }
    },
    style   : function() {

        this.$bar.css({
            overflow    : 'hidden',
            margin      : '4px 0',
            borderRadius: '2px'
        });

        this.$message.css({
            fontSize  : '14px',
            lineHeight: '16px',
            textAlign : 'center',
            padding   : '10px',
            width     : 'auto',
            position  : 'relative'
        });

        this.$closeButton.css({
            position  : 'absolute',
            top       : 4, right: 4,
            width     : 10, height: 10,
            background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAxUlEQVR4AR3MPUoDURSA0e++uSkkOxC3IAOWNtaCIDaChfgXBMEZbQRByxCwk+BasgQRZLSYoLgDQbARxry8nyumPcVRKDfd0Aa8AsgDv1zp6pYd5jWOwhvebRTbzNNEw5BSsIpsj/kurQBnmk7sIFcCF5yyZPDRG6trQhujXYosaFoc+2f1MJ89uc76IND6F9BvlXUdpb6xwD2+4q3me3bysiHvtLYrUJto7PD/ve7LNHxSg/woN2kSz4txasBdhyiz3ugPGetTjm3XRokAAAAASUVORK5CYII=)",
            display   : 'none',
            cursor    : 'pointer'
        });

        this.$buttons.css({
            padding        : 5,
            textAlign      : 'right',
            borderTop      : '1px solid #ccc',
            backgroundColor: '#fff'
        });

        this.$buttons.find('button').css({
            marginLeft: 5
        });

        this.$buttons.find('button:first').css({
            marginLeft: 0
        });

        this.$bar.on({
            mouseenter: function() {
                $(this).find('.noty_close').stop().fadeTo('normal', 1);
            },
            mouseleave: function() {
                $(this).find('.noty_close').stop().fadeTo('normal', 0);
            }
        });

        switch(this.options.layout.name) {
            case 'top':
                this.$bar.css({
                    borderBottom: '2px solid #eee',
                    borderLeft  : '2px solid #eee',
                    borderRight : '2px solid #eee',
                    borderTop   : '2px solid #eee',
                    boxShadow   : "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                break;
            case 'topCenter':
            case 'center':
            case 'bottomCenter':
            case 'inline':
                this.$bar.css({
                    border   : '1px solid #eee',
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                this.$message.css({fontSize: '13px', textAlign: 'center'});
                break;
            case 'topLeft':
            case 'topRight':
            case 'bottomLeft':
            case 'bottomRight':
            case 'centerLeft':
            case 'centerRight':
                this.$bar.css({
                    border   : '1px solid #eee',
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                this.$message.css({fontSize: '13px', textAlign: 'left'});
                break;
            case 'bottom':
                this.$bar.css({
                    borderTop   : '2px solid #eee',
                    borderLeft  : '2px solid #eee',
                    borderRight : '2px solid #eee',
                    borderBottom: '2px solid #eee',
                    boxShadow   : "0 -2px 4px rgba(0, 0, 0, 0.1)"
                });
                break;
            default:
                this.$bar.css({
                    border   : '2px solid #eee',
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                });
                break;
        }

        switch(this.options.type) {
            case 'alert':
            case 'notification':
                this.$bar.css({backgroundColor: '#FFF', borderColor: '#dedede', color: '#444'});
                break;
            case 'warning':
                this.$bar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
                this.$buttons.css({borderTop: '1px solid #FFC237'});
                break;
            case 'error':
                this.$bar.css({backgroundColor: '#FF8181', borderColor: '#e25353', color: '#FFF'});
                this.$message.css({fontWeight: 'bold'});
                this.$buttons.css({borderTop: '1px solid darkred'});
                break;
            case 'information':
                this.$bar.css({backgroundColor: '#78C5E7', borderColor: '#3badd6', color: '#FFF'});
                this.$buttons.css({borderTop: '1px solid #0B90C4'});
                break;
            case 'success':
                this.$bar.css({backgroundColor: '#BCF5BC', borderColor: '#7cdd77', color: 'darkgreen'});
                this.$buttons.css({borderTop: '1px solid #50C24E'});
                break;
            default:
                this.$bar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'});
                break;
        }
    },
    callback: {
        onShow : function() {

        },
        onClose: function() {

        }
    }
};


return window.noty;

});
},{"jquery":16}],18:[function(require,module,exports){
'use strict';

module.exports = require('./src/js/adaptor/jquery');

},{"./src/js/adaptor/jquery":19}],19:[function(require,module,exports){
'use strict';

var ps = require('../main');
var psInstances = require('../plugin/instances');

function mountJQuery(jQuery) {
  jQuery.fn.perfectScrollbar = function (settingOrCommand) {
    return this.each(function () {
      if (typeof settingOrCommand === 'object' ||
          typeof settingOrCommand === 'undefined') {
        // If it's an object or none, initialize.
        var settings = settingOrCommand;

        if (!psInstances.get(this)) {
          ps.initialize(this, settings);
        }
      } else {
        // Unless, it may be a command.
        var command = settingOrCommand;

        if (command === 'update') {
          ps.update(this);
        } else if (command === 'destroy') {
          ps.destroy(this);
        }
      }
    });
  };
}

if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define(['jquery'], mountJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    mountJQuery(jq);
  }
}

module.exports = mountJQuery;

},{"../main":25,"../plugin/instances":36}],20:[function(require,module,exports){
'use strict';

function oldAdd(element, className) {
  var classes = element.className.split(' ');
  if (classes.indexOf(className) < 0) {
    classes.push(className);
  }
  element.className = classes.join(' ');
}

function oldRemove(element, className) {
  var classes = element.className.split(' ');
  var idx = classes.indexOf(className);
  if (idx >= 0) {
    classes.splice(idx, 1);
  }
  element.className = classes.join(' ');
}

exports.add = function (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    oldAdd(element, className);
  }
};

exports.remove = function (element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    oldRemove(element, className);
  }
};

exports.list = function (element) {
  if (element.classList) {
    return Array.prototype.slice.apply(element.classList);
  } else {
    return element.className.split(' ');
  }
};

},{}],21:[function(require,module,exports){
'use strict';

var DOM = {};

DOM.e = function (tagName, className) {
  var element = document.createElement(tagName);
  element.className = className;
  return element;
};

DOM.appendTo = function (child, parent) {
  parent.appendChild(child);
  return child;
};

function cssGet(element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

function cssSet(element, styleName, styleValue) {
  if (typeof styleValue === 'number') {
    styleValue = styleValue.toString() + 'px';
  }
  element.style[styleName] = styleValue;
  return element;
}

function cssMultiSet(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val.toString() + 'px';
    }
    element.style[key] = val;
  }
  return element;
}

DOM.css = function (element, styleNameOrObject, styleValue) {
  if (typeof styleNameOrObject === 'object') {
    // multiple set with object
    return cssMultiSet(element, styleNameOrObject);
  } else {
    if (typeof styleValue === 'undefined') {
      return cssGet(element, styleNameOrObject);
    } else {
      return cssSet(element, styleNameOrObject, styleValue);
    }
  }
};

DOM.matches = function (element, query) {
  if (typeof element.matches !== 'undefined') {
    return element.matches(query);
  } else {
    if (typeof element.matchesSelector !== 'undefined') {
      return element.matchesSelector(query);
    } else if (typeof element.webkitMatchesSelector !== 'undefined') {
      return element.webkitMatchesSelector(query);
    } else if (typeof element.mozMatchesSelector !== 'undefined') {
      return element.mozMatchesSelector(query);
    } else if (typeof element.msMatchesSelector !== 'undefined') {
      return element.msMatchesSelector(query);
    }
  }
};

DOM.remove = function (element) {
  if (typeof element.remove !== 'undefined') {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

DOM.queryChildren = function (element, selector) {
  return Array.prototype.filter.call(element.childNodes, function (child) {
    return DOM.matches(child, selector);
  });
};

module.exports = DOM;

},{}],22:[function(require,module,exports){
'use strict';

var EventElement = function (element) {
  this.element = element;
  this.events = {};
};

EventElement.prototype.bind = function (eventName, handler) {
  if (typeof this.events[eventName] === 'undefined') {
    this.events[eventName] = [];
  }
  this.events[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function (eventName, handler) {
  var isHandlerProvided = (typeof handler !== 'undefined');
  this.events[eventName] = this.events[eventName].filter(function (hdlr) {
    if (isHandlerProvided && hdlr !== handler) {
      return true;
    }
    this.element.removeEventListener(eventName, hdlr, false);
    return false;
  }, this);
};

EventElement.prototype.unbindAll = function () {
  for (var name in this.events) {
    this.unbind(name);
  }
};

var EventManager = function () {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function (element) {
  var ee = this.eventElements.filter(function (eventElement) {
    return eventElement.element === element;
  })[0];
  if (typeof ee === 'undefined') {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function (element, eventName, handler) {
  this.eventElement(element).unbind(eventName, handler);
};

EventManager.prototype.unbindAll = function () {
  for (var i = 0; i < this.eventElements.length; i++) {
    this.eventElements[i].unbindAll();
  }
};

EventManager.prototype.once = function (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (e) {
    ee.unbind(eventName, onceHandler);
    handler(e);
  };
  ee.bind(eventName, onceHandler);
};

module.exports = EventManager;

},{}],23:[function(require,module,exports){
'use strict';

module.exports = (function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

},{}],24:[function(require,module,exports){
'use strict';

var cls = require('./class');
var dom = require('./dom');

var toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

var clone = exports.clone = function (obj) {
  if (obj === null) {
    return null;
  } else if (obj.constructor === Array) {
    return obj.map(clone);
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = clone(original);
  for (var key in source) {
    result[key] = clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return dom.matches(el, "input,[contenteditable]") ||
         dom.matches(el, "select,[contenteditable]") ||
         dom.matches(el, "textarea,[contenteditable]") ||
         dom.matches(el, "button,[contenteditable]");
};

exports.removePsClasses = function (element) {
  var clsList = cls.list(element);
  for (var i = 0; i < clsList.length; i++) {
    var className = clsList[i];
    if (className.indexOf('ps-') === 0) {
      cls.remove(element, className);
    }
  }
};

exports.outerWidth = function (element) {
  return toInt(dom.css(element, 'width')) +
         toInt(dom.css(element, 'paddingLeft')) +
         toInt(dom.css(element, 'paddingRight')) +
         toInt(dom.css(element, 'borderLeftWidth')) +
         toInt(dom.css(element, 'borderRightWidth'));
};

exports.startScrolling = function (element, axis) {
  cls.add(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.add(element, 'ps-' + axis);
  } else {
    cls.add(element, 'ps-x');
    cls.add(element, 'ps-y');
  }
};

exports.stopScrolling = function (element, axis) {
  cls.remove(element, 'ps-in-scrolling');
  if (typeof axis !== 'undefined') {
    cls.remove(element, 'ps-' + axis);
  } else {
    cls.remove(element, 'ps-x');
    cls.remove(element, 'ps-y');
  }
};

exports.env = {
  isWebKit: 'WebkitAppearance' in document.documentElement.style,
  supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: window.navigator.msMaxTouchPoints !== null
};

},{"./class":20,"./dom":21}],25:[function(require,module,exports){
'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":27,"./plugin/initialize":35,"./plugin/update":39}],26:[function(require,module,exports){
'use strict';

module.exports = {
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  stopPropagationOnClick: true,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
  theme: 'default'
};

},{}],27:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  dom.remove(i.scrollbarX);
  dom.remove(i.scrollbarY);
  dom.remove(i.scrollbarXRail);
  dom.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":21,"../lib/helper":24,"./instances":36}],28:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = function (e) { e.stopPropagation(); };

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarY, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var halfOfScrollbarLength = _.toInt(i.scrollbarYHeight / 2);
    var positionTop = i.railYRatio * (e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top - halfOfScrollbarLength);
    var maxPositionTop = i.railYRatio * (i.railYHeight - i.scrollbarYHeight);
    var positionRatio = positionTop / maxPositionTop;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    updateScroll(element, 'top', (i.contentHeight - i.containerHeight) * positionRatio);
    updateGeometry(element);

    e.stopPropagation();
  });

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarX, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarXRail, 'click', function (e) {
    var halfOfScrollbarLength = _.toInt(i.scrollbarXWidth / 2);
    var positionLeft = i.railXRatio * (e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left - halfOfScrollbarLength);
    var maxPositionLeft = i.railXRatio * (i.railXWidth - i.scrollbarXWidth);
    var positionRatio = positionLeft / maxPositionLeft;

    if (positionRatio < 0) {
      positionRatio = 0;
    } else if (positionRatio > 1) {
      positionRatio = 1;
    }

    updateScroll(element, 'left', ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment);
    updateGeometry(element);

    e.stopPropagation();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindClickRailHandler(element, i);
};

},{"../../lib/helper":24,"../instances":36,"../update-geometry":37,"../update-scroll":38}],29:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + (deltaX * i.railXRatio);
    var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = _.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = _.toInt(dom.css(i.scrollbarX, 'left')) * i.railXRatio;
    _.startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + (deltaY * i.railYRatio);
    var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = _.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    _.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = _.toInt(dom.css(i.scrollbarY, 'top')) * i.railYRatio;
    _.startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseScrollXHandler(element, i);
  bindMouseScrollYHandler(element, i);
};

},{"../../lib/dom":21,"../../lib/helper":24,"../instances":36,"../update-geometry":37,"../update-scroll":38}],30:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var dom = require('../../lib/dom');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindKeyboardHandler(element, i) {
  var hovered = false;
  i.event.bind(element, 'mouseenter', function () {
    hovered = true;
  });
  i.event.bind(element, 'mouseleave', function () {
    hovered = false;
  });

  var shouldPrevent = false;
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (e.isDefaultPrevented && e.isDefaultPrevented()) {
      return;
    }

    var focused = dom.matches(i.scrollbarX, ':focus') ||
                  dom.matches(i.scrollbarY, ':focus');

    if (!hovered && !focused) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (_.isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
    case 37: // left
      deltaX = -30;
      break;
    case 38: // up
      deltaY = 30;
      break;
    case 39: // right
      deltaX = 30;
      break;
    case 40: // down
      deltaY = -30;
      break;
    case 33: // page up
      deltaY = 90;
      break;
    case 32: // space bar
      if (e.shiftKey) {
        deltaY = 90;
      } else {
        deltaY = -90;
      }
      break;
    case 34: // page down
      deltaY = -90;
      break;
    case 35: // end
      if (e.ctrlKey) {
        deltaY = -i.contentHeight;
      } else {
        deltaY = -i.containerHeight;
      }
      break;
    case 36: // home
      if (e.ctrlKey) {
        deltaY = element.scrollTop;
      } else {
        deltaY = i.containerHeight;
      }
      break;
    default:
      return;
    }

    updateScroll(element, 'top', element.scrollTop - deltaY);
    updateScroll(element, 'left', element.scrollLeft + deltaX);
    updateGeometry(element);

    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.preventDefault();
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindKeyboardHandler(element, i);
};

},{"../../lib/dom":21,"../../lib/helper":24,"../instances":36,"../update-geometry":37,"../update-scroll":38}],31:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindMouseWheelHandler(element, i) {
  var shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    var child = element.querySelector('textarea:hover, .ps-child:hover');
    if (child) {
      if (child.tagName !== 'TEXTAREA' && !window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        return false;
      }

      var maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    var delta = getDeltaFromEvent(e);

    var deltaX = delta[0];
    var deltaY = delta[1];

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
      } else {
        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
      }
      shouldPrevent = true;
    }

    updateGeometry(element);

    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== "undefined") {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== "undefined") {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindMouseWheelHandler(element, i);
};

},{"../instances":36,"../update-geometry":37,"../update-scroll":38}],32:[function(require,module,exports){
'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":36,"../update-geometry":37}],33:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindSelectionHandler(element, i) {
  function getRangeNode() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
  }

  var scrollingLoop = null;
  var scrollDiff = {top: 0, left: 0};
  function startScrolling() {
    if (!scrollingLoop) {
      scrollingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(scrollingLoop);
          return;
        }

        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
        updateGeometry(element);
      }, 50); // every .1 sec
    }
  }
  function stopScrolling() {
    if (scrollingLoop) {
      clearInterval(scrollingLoop);
      scrollingLoop = null;
    }
    _.stopScrolling(element);
  }

  var isSelected = false;
  i.event.bind(i.ownerDocument, 'selectionchange', function () {
    if (element.contains(getRangeNode())) {
      isSelected = true;
    } else {
      isSelected = false;
      stopScrolling();
    }
  });
  i.event.bind(window, 'mouseup', function () {
    if (isSelected) {
      isSelected = false;
      stopScrolling();
    }
  });

  i.event.bind(window, 'mousemove', function (e) {
    if (isSelected) {
      var mousePosition = {x: e.pageX, y: e.pageY};
      var containerGeometry = {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight
      };

      if (mousePosition.x < containerGeometry.left + 3) {
        scrollDiff.left = -5;
        _.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        _.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        _.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        _.startScrolling(element, 'y');
      } else {
        scrollDiff.top = 0;
      }

      if (scrollDiff.top === 0 && scrollDiff.left === 0) {
        stopScrolling();
      } else {
        startScrolling();
      }
    }
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindSelectionHandler(element, i);
};

},{"../../lib/helper":24,"../instances":36,"../update-geometry":37,"../update-scroll":38}],34:[function(require,module,exports){
'use strict';

var _ = require('../../lib/helper');
var instances = require('../instances');
var updateGeometry = require('../update-geometry');
var updateScroll = require('../update-scroll');

function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    updateScroll(element, 'top', element.scrollTop - differenceY);
    updateScroll(element, 'left', element.scrollLeft - differenceX);

    updateGeometry(element);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;
  var inGlobalTouch = false;
  var inLocalTouch = false;

  function globalTouchStart() {
    inGlobalTouch = true;
  }
  function globalTouchEnd() {
    inGlobalTouch = false;
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }
  function shouldHandle(e) {
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }
  function touchStart(e) {
    if (shouldHandle(e)) {
      inLocalTouch = true;

      var touch = getTouch(e);

      startOffset.pageX = touch.pageX;
      startOffset.pageY = touch.pageY;

      startTime = (new Date()).getTime();

      if (easingLoop !== null) {
        clearInterval(easingLoop);
      }

      e.stopPropagation();
    }
  }
  function touchMove(e) {
    if (!inLocalTouch && i.settings.swipePropagation) {
      touchStart(e);
    }
    if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = (new Date()).getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPreventDefault(differenceX, differenceY)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (!inGlobalTouch && inLocalTouch) {
      inLocalTouch = false;

      clearInterval(easingLoop);
      easingLoop = setInterval(function () {
        if (!instances.get(element)) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (supportsTouch) {
    i.event.bind(window, 'touchstart', globalTouchStart);
    i.event.bind(window, 'touchend', globalTouchEnd);
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  }

  if (supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(window, 'pointerdown', globalTouchStart);
      i.event.bind(window, 'pointerup', globalTouchEnd);
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(window, 'MSPointerDown', globalTouchStart);
      i.event.bind(window, 'MSPointerUp', globalTouchEnd);
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

module.exports = function (element) {
  if (!_.env.supportsTouch && !_.env.supportsIePointer) {
    return;
  }

  var i = instances.get(element);
  bindTouchHandler(element, i, _.env.supportsTouch, _.env.supportsIePointer);
};

},{"../../lib/helper":24,"../instances":36,"../update-geometry":37,"../update-scroll":38}],35:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');

// Handlers
var handlers = {
  'click-rail': require('./handler/click-rail'),
  'drag-scrollbar': require('./handler/drag-scrollbar'),
  'keyboard': require('./handler/keyboard'),
  'wheel': require('./handler/mouse-wheel'),
  'touch': require('./handler/touch'),
  'selection': require('./handler/selection')
};
var nativeScrollHandler = require('./handler/native-scroll');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = _.extend(i.settings, userSettings);
  cls.add(element, 'ps-theme-' + i.settings.theme);

  i.settings.handlers.forEach(function (handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
};

},{"../lib/class":20,"../lib/helper":24,"./handler/click-rail":28,"./handler/drag-scrollbar":29,"./handler/keyboard":30,"./handler/mouse-wheel":31,"./handler/native-scroll":32,"./handler/selection":33,"./handler/touch":34,"./instances":36,"./update-geometry":37}],36:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var defaultSettings = require('./default-setting');
var dom = require('../lib/dom');
var EventManager = require('../lib/event-manager');
var guid = require('../lib/guid');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = _.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = dom.css(element, 'direction') === "rtl";
  i.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  function focus() {
    cls.add(element, 'ps-focus');
  }

  function blur() {
    cls.remove(element, 'ps-focus');
  }

  i.scrollbarXRail = dom.appendTo(dom.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = dom.appendTo(dom.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarX, 'focus', focus);
  i.event.bind(i.scrollbarX, 'blur', blur);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(dom.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : _.toInt(dom.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = _.toInt(dom.css(i.scrollbarXRail, 'borderLeftWidth')) + _.toInt(dom.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  dom.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = dom.appendTo(dom.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = dom.appendTo(dom.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.event.bind(i.scrollbarY, 'focus', focus);
  i.event.bind(i.scrollbarY, 'blur', blur);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(dom.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : _.toInt(dom.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = _.toInt(dom.css(i.scrollbarYRail, 'borderTopWidth')) + _.toInt(dom.css(i.scrollbarYRail, 'borderBottomWidth'));
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));
  dom.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

exports.add = function (element) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element);
  return instances[newId];
};

exports.remove = function (element) {
  delete instances[getId(element)];
  removeId(element);
};

exports.get = function (element) {
  return instances[getId(element)];
};

},{"../lib/class":20,"../lib/dom":21,"../lib/event-manager":22,"../lib/guid":23,"../lib/helper":24,"./default-setting":26}],37:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var cls = require('../lib/class');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateScroll = require('./update-scroll');

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = {width: i.railXWidth};
  if (i.isRtl) {
    xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + element.scrollTop;
  }
  dom.css(i.scrollbarXRail, xRailOffset);

  var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  dom.css(i.scrollbarYRail, yRailOffset);

  dom.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  dom.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = dom.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        dom.remove(rail);
      });
    }
    dom.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, _.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = _.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, _.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = _.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    cls.add(element, 'ps-active-x');
  } else {
    cls.remove(element, 'ps-active-x');
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    updateScroll(element, 'left', 0);
  }
  if (i.scrollbarYActive) {
    cls.add(element, 'ps-active-y');
  } else {
    cls.remove(element, 'ps-active-y');
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    updateScroll(element, 'top', 0);
  }
};

},{"../lib/class":20,"../lib/dom":21,"../lib/helper":24,"./instances":36,"./update-scroll":38}],38:[function(require,module,exports){
'use strict';

var instances = require('./instances');

var upEvent = document.createEvent('Event');
var downEvent = document.createEvent('Event');
var leftEvent = document.createEvent('Event');
var rightEvent = document.createEvent('Event');
var yEvent = document.createEvent('Event');
var xEvent = document.createEvent('Event');
var xStartEvent = document.createEvent('Event');
var xEndEvent = document.createEvent('Event');
var yStartEvent = document.createEvent('Event');
var yEndEvent = document.createEvent('Event');
var lastTop;
var lastLeft;

upEvent.initEvent('ps-scroll-up', true, true);
downEvent.initEvent('ps-scroll-down', true, true);
leftEvent.initEvent('ps-scroll-left', true, true);
rightEvent.initEvent('ps-scroll-right', true, true);
yEvent.initEvent('ps-scroll-y', true, true);
xEvent.initEvent('ps-scroll-x', true, true);
xStartEvent.initEvent('ps-x-reach-start', true, true);
xEndEvent.initEvent('ps-x-reach-end', true, true);
yStartEvent.initEvent('ps-y-reach-start', true, true);
yEndEvent.initEvent('ps-y-reach-end', true, true);

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(yStartEvent);
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(xStartEvent);
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(yEndEvent);
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 1) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(xEndEvent);
  }

  if (!lastTop) {
    lastTop = element.scrollTop;
  }

  if (!lastLeft) {
    lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < lastTop) {
    element.dispatchEvent(upEvent);
  }

  if (axis === 'top' && value > lastTop) {
    element.dispatchEvent(downEvent);
  }

  if (axis === 'left' && value < lastLeft) {
    element.dispatchEvent(leftEvent);
  }

  if (axis === 'left' && value > lastLeft) {
    element.dispatchEvent(rightEvent);
  }

  if (axis === 'top') {
    element.scrollTop = lastTop = value;
    element.dispatchEvent(yEvent);
  }

  if (axis === 'left') {
    element.scrollLeft = lastLeft = value;
    element.dispatchEvent(xEvent);
  }

};

},{"./instances":36}],39:[function(require,module,exports){
'use strict';

var _ = require('../lib/helper');
var dom = require('../lib/dom');
var instances = require('./instances');
var updateGeometry = require('./update-geometry');
var updateScroll = require('./update-scroll');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  dom.css(i.scrollbarXRail, 'display', 'block');
  dom.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = _.toInt(dom.css(i.scrollbarXRail, 'marginLeft')) + _.toInt(dom.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = _.toInt(dom.css(i.scrollbarYRail, 'marginTop')) + _.toInt(dom.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  dom.css(i.scrollbarXRail, 'display', 'none');
  dom.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  dom.css(i.scrollbarXRail, 'display', '');
  dom.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":21,"../lib/helper":24,"./instances":36,"./update-geometry":37,"./update-scroll":38}],40:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * cellTemplate.js
 *
 * Cell template formatting functions
 */

;module.exports = function (self) {

  _.nameButton = function (value, icon) {
    var iconString = !!icon ? '<i class="fa fa-fw ' + icon + '"></i>' : '';
    return '<button style="padding:4px" class="btn btn-link btn-chk">' + iconString + value + '</button>';
  };

  _.link = function (value, icon, external) {
    var row = self.activeGrid.currentRow,
        id = row.id,
        href = window.location.href.trim('/');

    switch (true) {
      case !!icon && !!external:
        value = '<span><i class="fa fa-fw ' + icon + '"></i>' + value + '<i class="fa fa-fw fa-external-link"></i></span>';
        break;

      case !!icon:
        value = '<span><i class="fa fa-fw ' + icon + '"></i>' + value + '</span>';
        break;

      case !!external:
        value = '<span>' + value + '<i class="fa fa-fw fa-external-link"></i></span>';
        break;
    }

    return value.link(href + '/' + id);
  };

  _.email = function (value, icon) {

    var row = self.activeGrid.currentRow,
        id = row.id,
        href = window.location.href.trim('/'),
        text = !!icon ? '<span><i class="fa fa-fw ' + icon + '"></i>' + value + '<i class="fa fa-fw fa-external-link"></span>' : '<span><i class="fa fa-fw fa-envelope"></i>' + value + '<i class="fa fa-fw fa-external-link"></span>';

    return text.link('mailto:' + value);
  };

  _.getTags = function (arr) {
    return _.map(arr, function (o, i) {
      return '<div class="label label-primary" style="margin-right:3px">' + o.name + '</div>';
    }).join(' ');
  };

  _.getFlag = function (value, trueLabel, falseLabel, trueClass, falseClass) {
    var label = !! +value ? trueLabel || 'Yes' : falseLabel || 'No',
        className = !! +value ? trueClass || 'success' : falseClass || 'danger';

    return '<span style="margin:3px;" class="label label-' + className + '">' + label + '</span>';
  };

  _.getLabel = function (value, icon, bgColor, color) {
    var iconString = !!icon ? '<i class="fa fa-fw ' + icon + '"></i> ' : '',
        style = 'style="padding:2px 4px; color:' + (color || 'black') + ' ; background:' + (bgColor || 'white') + '"';

    return '<div ' + style + '>' + iconString + value + '</div>';
  };

  _.get = function (key, target, callback, icon, model) {
    var tmpKeyArr = key.split('.'),
        tmpKeyNext,
        returnArr;

    // move variables around
    if (typeof target === 'string') {
      icon = target;
      target = null;
    }

    if (typeof callback === 'string') {
      if (callback.indexOf('fa-') === 0) {
        model = icon;
        icon = callback;
      } else {
        model = callback;
        icon = null;
      }
      callback = null;
    }

    if (typeof target !== 'undefined') {
      if (target === null) return '';

      var target_array = typeof target.push === 'function' ? target : [target];

      return _.map(target_array, function (row, i) {
        var iconString = !!icon ? '<i class="fa fa-fw ' + icon + '"></i>' : '';

        if (row[key] == null) {
          return '';
        }

        if (model != null) {
          return '<button style="padding:4px" class="btn btn-link btn-editOther" data-id="' + row.id + '" data-model="' + model + '">' + iconString + row[key] + '</button>';
        } else {
          return '<div style="padding:4px">' + iconString + row[key] + '</div>';
        }
      });
    } else {

      target = self.activeGrid.currentRow;

      while (tmpKeyArr.length > 1) {
        tmpKeyNext = tmpKeyArr.shift();

        if (target[tmpKeyNext] != null) {
          target = target[tmpKeyNext];
        } else {
          console.warn(key + ' is not a valid key of ');
          console.warn(target);
          return false;
        }
      }

      switch (_typeof(target[tmpKeyArr[0]])) {
        case 'undefined':
          return false;
          break;

        case 'string':
          returnArr = [target[tmpKeyArr[0]]];
          break;

        default:
          returnArr = target[tmpKeyArr[0]];
      }
    }

    if (!!callback) {
      returnArr = returnArr.map(callback);
    }

    if (!!icon) {
      returnArr = returnArr.map(function (val) {
        return '<span><i class="fa fa-fw ' + icon + '"></i>' + val + '</span>';
      });
    }

    console.log(returnArr);

    return returnArr.join(' ');
  };

  /**
   * pivotExtract
   *
   *	Pulls a unique, flattened list out of the specified
   *	target or the current row. Optionally, you can
   *	specify a callback function which will be applied
   *	to the list using .map. You can also specify a
   *	font-awesome icon to be applied to each item in the list.
   *
   * @method function
   * @param  {[type]}   target   [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   icon     [description]
   * @return {[type]}            [description]
   */
  _.pivotExtract = function (target, callback, icon) {

    // find the target. If it's a string it's a key of the currentRow
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
      target = self.activeGrid.currentRow[target];
    }

    var a = _.uniq( // return unique values
    _.compact( // remove falsy values
    _.flatten( // flatten multi-dimensional array
    _.map( // map currentRow.users return list of group names
    target, callback))));

    // add the icons if applicable
    if (icon != null) {
      a = a.map(function (val) {
        return '<span><i class="fa fa-fw ' + icon + '"></i>' + val + '</span>';
      });
    }

    return a.join(' '); // join the list and return
  };

  return {
    cellTemplates: {

      id: function id(value) {
        return ('0000' + value).slice(-4);
      },

      name: function name(value) {
        return _.nameButton(value, self.opts().gridHeader.icon);
      },

      hostname: function hostname(value) {
        return _.nameButton(value, 'fa-building-o');
      },

      databaseName: function databaseName(value) {
        var r = jApp.aG().currentRow,
            flags = [];

        if (+r.inactive_flag == 1) {
          flags.push('<div class="label label-danger label-sm" style="margin-right:3px">Inactive</div>');
        }

        if (+r.ignore_flag == 1) {
          flags.push('<div class="label label-warning label-sm" style="margin-right:3px">Ignored</div>');
        }

        if (+r.production_flag == 1) {
          flags.push('<div class="label label-primary label-sm" style="margin-right:3px">Prod</div>');
        }

        return _.nameButton(r.name, 'fa-database') + flags.join(' ');
      },

      serverName: function serverName(value) {
        var r = jApp.aG().currentRow,
            flags = [],
            cname = '';

        if (r.cname != null && r.cname.trim() != '') {
          cname = ' (' + r.cname + ') ';
        }

        if (+r.inactive_flag == 1) {
          flags.push('<div class="label label-danger label-sm" style="margin:0 3px">Inactive</div>');
        }

        if (+r.production_flag == 1) {
          flags.push('<div class="label label-primary label-sm" style="margin:0 3px">Prod</div>');
        }

        return _.nameButton(r.name.toUpperCase(), 'fa-building-o') + cname + flags.join(' ');
      },

      username: function username(value) {
        return _.nameButton(value, 'fa-user');
      },

      person_name: function person_name() {
        return _.get('person.name', 'fa-male');
      },

      email: function email(value) {
        return _.email(value);
      },

      users: function users(arr) {
        return _.get('username', arr, 'fa-user', 'User');
      },

      roles: function roles(arr) {
        return _.get('name', arr, 'fa-briefcase', 'Role');
      },

      groups: function groups(arr) {
        return _.get('name', arr, 'fa-users', 'Group');
      },

      people: function people(arr) {
        return _.get('name', arr, 'fa-user', 'Person');
      },

      tags: function tags(arr) {
        return _.getTags(arr);
      },

      profile_groups: function profile_groups(arr) {
        return _.get('name', arr, 'fa-users');
      },

      group_roles: function group_roles(arr) {
        return _.pivotExtract('groups', function (row, i) {
          return row.roles.length ? _.get('name', row.roles, 'fa-briefcase', 'Role') : false;
        });
      },

      profile_group_roles: function profile_group_roles(arr) {
        return _.pivotExtract('groups', function (row, i) {
          return row.roles.length ? _.get('name', row.roles, 'fa-briefcase') : false;
        });
      },

      group_users: function group_users(arr) {
        return _.pivotExtract('groups', function (row, i) {
          return row.users.length ? _.get('username', row.users, 'fa-user', 'User') : false;
        });
      },

      user_groups: function user_groups(arr) {
        return _.pivotExtract('users', function (row, i) {
          return row.groups.length ? _.get('name', row.groups, 'fa-users', 'Group') : false;
        });
      },

      created_at: function created_at(value) {
        return date('Y-m-d', strtotime(value));
      },

      updated_at: function updated_at(value) {
        return date('Y-m-d', strtotime(value));
      },

      permissions: function permissions() {
        var row = jApp.aG().currentRow,
            p = [];

        if (!!Number(row.create_enabled)) p.push('Create');
        if (!!Number(row.read_enabled)) p.push('Read');
        if (!!Number(row.update_enabled)) p.push('Update');
        if (!!Number(row.delete_enabled)) p.push('Delete');

        return p.join(', ');
      }

    }
  };
};

},{}],41:[function(require,module,exports){
'use strict';

/**
 * colparams.js
 *
 * Specify any default column parameters here
 */
;module.exports = {
  Group: [{ // fieldset
    label: 'Group Details',
    helpText: 'Please fill out the following information about the group.',
    class: 'col-lg-4',
    fields: [{
      name: 'name',
      placeholder: 'e.g. Administrators',
      _label: 'Group Name',
      _enabled: true,
      required: true,
      'data-validType': 'Anything'
    }, {
      name: 'description',
      type: 'textarea',
      _label: 'Description',
      _enabled: true
    }, {
      name: 'modules',
      type: 'select',
      _label: 'Assign roles/permissions to this group',
      _enabled: true,
      _labelssource: 'a|b|c|d',
      _optionssource: '1|2|3|4',
      multiple: true
    }]
  }, {
    class: 'col-lg-8',
    fields: [{
      name: 'users',
      type: 'array',
      _label: 'Add Users to this Group',
      _enabled: true,
      fields: [{
        name: 'users',
        type: 'select',
        _label: 'Select Users',
        _labelssource: 'a|b|c|d',
        _optionssource: '1|2|3|4',
        _enabled: true,
        multiple: true
      }, {
        name: 'comment[]',
        placeholder: 'Optional Comment',
        _enabled: true
      }]
    }]
  }]
};

},{}],42:[function(require,module,exports){
'use strict';

/**
 * defaults.js
 *
 * Default app configuration
 */

;module.exports = {

  /**
   * Debug mode, set to false to supress messages
   * @type {Boolean}
   */
  debug: false,

  /**
   * Placeholder for the activeGrid object
   * @type {Object}
   */
  activeGrid: {},

  /**
   * Api route prefix
   *
   * automatically prepended to any api url
   * @type {String}
   */
  apiRoutePrefix: 'api/v1',

  /**
   * Storage object
   * @type {[type]}
   */
  store: $.jStorage,

  /**
   * Column parameters
   *
   * Form definitions
   * @type {Object}
   */
  colparams: require('./colparams'),

  /**
   * Grid object container
   * @type {Object}
   */
  oG: {
    admin: {}
  },

  /**
   * Views object container
   * @type {Object}
   */
  views: {
    admin: {}
  },

  /**
   * Grids object container
   * @type {Object}
   */
  grids: {
    admin: {}
  },

  /**
   * Array placeholder for tracking open forms
   * @type {Array}
   */
  openForms: []

};

},{"./colparams":41}],43:[function(require,module,exports){
'use strict';

/**
 * methods.js
 *
 * jApp method definitions
 *
 */

;module.exports = function (self) {

  return {

    /**
     * Convenience function to access the active grid object
     * @method function
     * @return {[type]} [description]
     */
    aG: function aG() {
      return self.activeGrid;
    }, // end fn

    /**
     * Add a view
     * @method function
     * @return {[type]} [description]
     */
    addView: function addView(name, viewDefinition, colparams) {
      var viewTarget = self.views,
          gridTarget = self.oG,
          tmp_name = name.split('.'),
          tmp_name_part,
          viewName;

      // drill down if applicable
      while (tmp_name.length > 1) {

        tmp_name_part = tmp_name.shift();
        jApp.log('name part ' + tmp_name_part);

        if (typeof viewTarget[tmp_name_part] === 'undefined') {
          viewTarget[tmp_name_part] = {};
        }

        if (typeof gridTarget[tmp_name_part] === 'undefined') {
          gridTarget[tmp_name_part] = {};
        }

        viewTarget = viewTarget[tmp_name_part];
        gridTarget = gridTarget[tmp_name_part];
      }

      // get the viewName
      viewName = tmp_name[0];

      // add the view function
      viewTarget[viewName] = function () {
        gridTarget[viewName] = new jGrid(viewDefinition);
      };

      // add the colparams
      self.colparams[viewDefinition.model] = colparams;
    }, // end fn

    /**
     * Prefix url with api route prefix
     * @method function
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    prefixURL: function prefixURL(url) {
      var parser,
          path = url;

      // handle well-formed urls
      if (url.indexOf('http:') === 0) {
        parser = document.createElement('a');
        parser.href = url;
        path = parser.pathname;
      }
      // remove the route prefix
      path = path.toString().replace(self.apiRoutePrefix, '');

      // add the route prefix
      path = self.apiRoutePrefix + '/' + path;

      // trim trailing and leading slashes and remove any double slashes
      path = path.split('/').filter(function (str) {
        if (!!str) return str;
      }).join('/');

      // add the location origin and return it
      return location.origin + '/' + path;
    }, // end fn

    /**
     * Get url relative to current url
     * @method function
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    getRelativeUrl: function getRelativeUrl(url) {
      var parser,
          path = url;

      // handle well-formed urls
      if (url.indexOf('http:') === 0) {
        parser = document.createElement('a');
        parser.href = url;
        path = parser.pathname;
      }
      // remove the route prefix
      path = path.toString().replace(self.apiRoutePrefix, '');

      // trim trailing and leading slashes and remove any double slashes
      path = path.split('/').filter(function (str) {
        if (!!str) return str;
      }).join('/');

      // add the location origin and return it
      return location.origin + '/' + path;
    }, // end fn

    /**
     * Get the table from the corresponding model
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    model2table: function model2table(model) {

      var RuleExceptions = {
        Person: 'people'
      };

      return RuleExceptions[model] == null ? (model + 's').toLowerCase() : RuleExceptions[model];
    }, // end fn

    /**
     * Convenience function to access the $grid object
     * in the active grid
     * @method function
     * @return {[type]} [description]
     */
    tbl: function tbl() {
      return self.activeGrid.DOM.$grid;
    }, // end fn

    /**
     * Convenience function to access the options
     * of the active grid
     * @method function
     * @return {[type]} [description]
     */
    opts: function opts() {
      return self.activeGrid.options;
    }, // end fn

    /**
     * Log a message
     * @method function
     * @param  {[type]} msg   [description]
     * @param  {[type]} force [description]
     * @return {[type]}       [description]
     */
    log: function log(msg, force) {
      if (!!self.debug || !!force) {
        console.log(msg);
      }
    }, // end fn

    /**
     * Log a warning message
     * @method function
     * @param  {[type]} msg   [description]
     * @param  {[type]} force [description]
     * @return {[type]}       [description]
     */
    warn: function warn(msg, force) {
      if (!!self.debug || !!force) {
        console.warn(msg);
      }
    } };
};

},{}],44:[function(require,module,exports){
'use strict';

/**
 * routing.js
 *
 * configures the routing patterns for the app
 */

;module.exports = {
  routing: {

    /**
     * Get the route for the specified parameters
     * @method function
     * @param  {[type]} route     [description]
     * @param  {[type]} model     [description]
     * @param  {[type]} optionKey [description]
     * @param  {[type]} labelKey  [description]
     * @return {[type]}           [description]
     */
    get: function get(route, model, optionKey, labelKey) {
      if (typeof jApp.routing[route] === 'function') {
        return jApp.prefixURL(jApp.routing[route](model, optionKey, labelKey));
      } else {
        return jApp.prefixURL(jApp.routing.default(route || model, model || null));
      }
    },

    /**
     * Inspect the selected model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]} id    [description]
     * @return {[type]}       [description]
     */
    inspect: function inspect(model, id) {
      return model + '/' + id + '/_inspect';
    }, // end fn

    /**
     * Checked out records route
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkedOut: function checkedOut(model) {
      return model + '/_checkedOut';
    },

    /**
     * Checkout a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkout: function checkout(model, id) {
      return model + '/' + id + '/_checkout';
    },

    /**
     * Checkin a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    checkin: function checkin(model, id) {
      return model + '/' + id + '/_checkin';
    },

    /**
     * Get permissions for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    getPermissions: function getPermissions(model) {
      return model + '/_getPermissions';
    },

    /**
     * get select options for a model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]}       [description]
     * @return {[type]}       [description]
     */
    selectOptions: function selectOptions(model, optionKey, labelKey) {
      return model + '/_selectOptions/' + optionKey + '_' + labelKey;
    },

    /**
     * get token options for a model
     * @method function
     * @param  {[type]} model [description]
     * @param  {[type]}       [description]
     * @return {[type]}       [description]
     */
    tokenOptions: function tokenOptions(model, optionKey, labelKey) {
      return model + '/_tokenOptions/' + optionKey + '_' + labelKey;
    },

    /**
     * Get the route for a mass update for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    massUpdate: function massUpdate(model) {
      return model + '/_massUpdate';
    },

    /**
     * default route for a model
     * @method function
     * @param  {[type]} model [description]
     * @return {[type]}       [description]
     */
    default: function _default(model, id) {
      return !!id ? model + '/' + id : model;
    }
  }
};

},{}],45:[function(require,module,exports){
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

var $ = (window.$),
    _ = (window._);

$.jStorage = require('./jStorage/jstorage');

/**
 * Configure the export
 * @method function
 * @return {[type]} [description]
 */
module.exports = function (options) {
	var self = this;

	options = options || {};

	/**
  * Configuration
  * @type {Object}
  */
	$.extend(true, this, require('./config/defaults'), require('./config/methods')(self), require('./config/cellTemplates')(self), require('./config/routing'), options);

	/**
  * Warn about debug mode if it's on
  */
	if (this.debug) {
		console.warn('DEBUG MODE ON ');
		//$.jStorage.flush();
	}
};

},{"./config/cellTemplates":40,"./config/defaults":42,"./config/methods":43,"./config/routing":44,"./jStorage/jstorage":46}],46:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/*
 * ----------------------------- JSTORAGE -------------------------------------
 * Simple local storage wrapper to save data on the browser side, supporting
 * all major browsers - IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
 *
 * Author: Andris Reinman, andris.reinman@gmail.com
 * Project homepage: www.jstorage.info
 *
 * Licensed under Unlicense:
 *
 * This is free and unencumbered software released into the public domain.
 *
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 *
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * For more information, please refer to <http://unlicense.org/>
 */

/* global ActiveXObject: false */
/* jshint browser: true */

;module.exports = (function () {
    'use strict';

    var
    /* jStorage version */
    JSTORAGE_VERSION = '0.4.12',

    /* detect a dollar object or create one if not found */
    $ = window.jQuery || window.$ || (window.$ = {}),

    /* check for a JSON handling support */
    JSON = {
        parse: window.JSON && (window.JSON.parse || window.JSON.decode) || String.prototype.evalJSON && function (str) {
            return String(str).evalJSON();
        } || $.parseJSON || $.evalJSON,
        stringify: Object.toJSON || window.JSON && (window.JSON.stringify || window.JSON.encode) || $.toJSON
    };

    // Break if no JSON support was found
    if (typeof JSON.parse !== 'function' || typeof JSON.stringify !== 'function') {
        throw new Error('No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page');
    }

    var
    /* This is the object, that holds the cached values */
    _storage = {
        __jstorage_meta: {
            CRC32: {}
        }
    },

    /* Actual browser storage (localStorage or globalStorage['domain']) */
    _storage_service = {
        jStorage: '{}'
    },

    /* DOM element for older IE versions, holds userData behavior */
    _storage_elm = null,

    /* How much space does the storage take */
    _storage_size = 0,

    /* which backend is currently used */
    _backend = false,

    /* onchange observers */
    _observers = {},

    /* timeout to wait after onchange event */
    _observer_timeout = false,

    /* last update time */
    _observer_update = 0,

    /* pubsub observers */
    _pubsub_observers = {},

    /* skip published items older than current timestamp */
    _pubsub_last = +new Date(),

    /* Next check for TTL */
    _ttl_timeout,

    /**
     * XML encoding and decoding as XML nodes can't be JSON'ized
     * XML nodes are encoded and decoded if the node is the value to be saved
     * but not if it's as a property of another object
     * Eg. -
     *   $.jStorage.set('key', xmlNode);        // IS OK
     *   $.jStorage.set('key', {xml: xmlNode}); // NOT OK
     */
    _XMLService = {

        /**
         * Validates a XML node to be XML
         * based on jQuery.isXML function
         */
        isXML: function isXML(elm) {
            var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
            return documentElement ? documentElement.nodeName !== 'HTML' : false;
        },

        /**
         * Encodes a XML node to string
         * based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
         */
        encode: function encode(xmlNode) {
            if (!this.isXML(xmlNode)) {
                return false;
            }
            try {
                // Mozilla, Webkit, Opera
                return new XMLSerializer().serializeToString(xmlNode);
            } catch (E1) {
                try {
                    // IE
                    return xmlNode.xml;
                } catch (E2) {}
            }
            return false;
        },

        /**
         * Decodes a XML node from string
         * loosely based on http://outwestmedia.com/jquery-plugins/xmldom/
         */
        decode: function decode(xmlString) {
            var dom_parser = 'DOMParser' in window && new DOMParser().parseFromString || window.ActiveXObject && function (_xmlString) {
                var xml_doc = new ActiveXObject('Microsoft.XMLDOM');
                xml_doc.async = 'false';
                xml_doc.loadXML(_xmlString);
                return xml_doc;
            },
                resultXML;
            if (!dom_parser) {
                return false;
            }
            resultXML = dom_parser.call('DOMParser' in window && new DOMParser() || window, xmlString, 'text/xml');
            return this.isXML(resultXML) ? resultXML : false;
        }
    };

    ////////////////////////// PRIVATE METHODS ////////////////////////

    /**
     * Initialization function. Detects if the browser supports DOM Storage
     * or userData behavior and behaves accordingly.
     */
    function _init() {
        /* Check if browser supports localStorage */
        var localStorageReallyWorks = false;
        if ('localStorage' in window) {
            try {
                window.localStorage.setItem('_tmptest', 'tmpval');
                localStorageReallyWorks = true;
                window.localStorage.removeItem('_tmptest');
            } catch (BogusQuotaExceededErrorOnIos5) {
                // Thanks be to iOS5 Private Browsing mode which throws
                // QUOTA_EXCEEDED_ERRROR DOM Exception 22.
            }
        }

        if (localStorageReallyWorks) {
            try {
                if (window.localStorage) {
                    _storage_service = window.localStorage;
                    _backend = 'localStorage';
                    _observer_update = _storage_service.jStorage_update;
                }
            } catch (E3) {/* Firefox fails when touching localStorage and cookies are disabled */}
        }
        /* Check if browser supports globalStorage */
        else if ('globalStorage' in window) {
                try {
                    if (window.globalStorage) {
                        if (window.location.hostname == 'localhost') {
                            _storage_service = window.globalStorage['localhost.localdomain'];
                        } else {
                            _storage_service = window.globalStorage[window.location.hostname];
                        }
                        _backend = 'globalStorage';
                        _observer_update = _storage_service.jStorage_update;
                    }
                } catch (E4) {/* Firefox fails when touching localStorage and cookies are disabled */}
            }
            /* Check if browser supports userData behavior */
            else {
                    _storage_elm = document.createElement('link');
                    if (_storage_elm.addBehavior) {

                        /* Use a DOM element to act as userData storage */
                        _storage_elm.style.behavior = 'url(#default#userData)';

                        /* userData element needs to be inserted into the DOM! */
                        document.getElementsByTagName('head')[0].appendChild(_storage_elm);

                        try {
                            _storage_elm.load('jStorage');
                        } catch (E) {
                            // try to reset cache
                            _storage_elm.setAttribute('jStorage', '{}');
                            _storage_elm.save('jStorage');
                            _storage_elm.load('jStorage');
                        }

                        var data = '{}';
                        try {
                            data = _storage_elm.getAttribute('jStorage');
                        } catch (E5) {}

                        try {
                            _observer_update = _storage_elm.getAttribute('jStorage_update');
                        } catch (E6) {}

                        _storage_service.jStorage = data;
                        _backend = 'userDataBehavior';
                    } else {
                        _storage_elm = null;
                        return;
                    }
                }

        // Load data from storage
        _load_storage();

        // remove dead keys
        _handleTTL();

        // start listening for changes
        _setupObserver();

        // initialize publish-subscribe service
        _handlePubSub();

        // handle cached navigation
        if ('addEventListener' in window) {
            window.addEventListener('pageshow', function (event) {
                if (event.persisted) {
                    _storageObserver();
                }
            }, false);
        }
    }

    /**
     * Reload data from storage when needed
     */
    function _reloadData() {
        var data = '{}';

        if (_backend == 'userDataBehavior') {
            _storage_elm.load('jStorage');

            try {
                data = _storage_elm.getAttribute('jStorage');
            } catch (E5) {}

            try {
                _observer_update = _storage_elm.getAttribute('jStorage_update');
            } catch (E6) {}

            _storage_service.jStorage = data;
        }

        _load_storage();

        // remove dead keys
        _handleTTL();

        _handlePubSub();
    }

    /**
     * Sets up a storage change observer
     */
    function _setupObserver() {
        if (_backend == 'localStorage' || _backend == 'globalStorage') {
            if ('addEventListener' in window) {
                window.addEventListener('storage', _storageObserver, false);
            } else {
                document.attachEvent('onstorage', _storageObserver);
            }
        } else if (_backend == 'userDataBehavior') {
            setInterval(_storageObserver, 1000);
        }
    }

    /**
     * Fired on any kind of data change, needs to check if anything has
     * really been changed
     */
    function _storageObserver() {
        var updateTime;
        // cumulate change notifications with timeout
        clearTimeout(_observer_timeout);
        _observer_timeout = setTimeout(function () {

            if (_backend == 'localStorage' || _backend == 'globalStorage') {
                updateTime = _storage_service.jStorage_update;
            } else if (_backend == 'userDataBehavior') {
                _storage_elm.load('jStorage');
                try {
                    updateTime = _storage_elm.getAttribute('jStorage_update');
                } catch (E5) {}
            }

            if (updateTime && updateTime != _observer_update) {
                _observer_update = updateTime;
                _checkUpdatedKeys();
            }
        }, 25);
    }

    /**
     * Reloads the data and checks if any keys are changed
     */
    function _checkUpdatedKeys() {
        var oldCrc32List = JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32)),
            newCrc32List;

        _reloadData();
        newCrc32List = JSON.parse(JSON.stringify(_storage.__jstorage_meta.CRC32));

        var key,
            updated = [],
            removed = [];

        for (key in oldCrc32List) {
            if (oldCrc32List.hasOwnProperty(key)) {
                if (!newCrc32List[key]) {
                    removed.push(key);
                    continue;
                }
                if (oldCrc32List[key] != newCrc32List[key] && String(oldCrc32List[key]).substr(0, 2) == '2.') {
                    updated.push(key);
                }
            }
        }

        for (key in newCrc32List) {
            if (newCrc32List.hasOwnProperty(key)) {
                if (!oldCrc32List[key]) {
                    updated.push(key);
                }
            }
        }

        _fireObservers(updated, 'updated');
        _fireObservers(removed, 'deleted');
    }

    /**
     * Fires observers for updated keys
     *
     * @param {Array|String} keys Array of key names or a key
     * @param {String} action What happened with the value (updated, deleted, flushed)
     */
    function _fireObservers(keys, action) {
        keys = [].concat(keys || []);

        var i, j, len, jlen;

        if (action == 'flushed') {
            keys = [];
            for (var key in _observers) {
                if (_observers.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            action = 'deleted';
        }
        for (i = 0, len = keys.length; i < len; i++) {
            if (_observers[keys[i]]) {
                for (j = 0, jlen = _observers[keys[i]].length; j < jlen; j++) {
                    _observers[keys[i]][j](keys[i], action);
                }
            }
            if (_observers['*']) {
                for (j = 0, jlen = _observers['*'].length; j < jlen; j++) {
                    _observers['*'][j](keys[i], action);
                }
            }
        }
    }

    /**
     * Publishes key change to listeners
     */
    function _publishChange() {
        var updateTime = (+new Date()).toString();

        if (_backend == 'localStorage' || _backend == 'globalStorage') {
            try {
                _storage_service.jStorage_update = updateTime;
            } catch (E8) {
                // safari private mode has been enabled after the jStorage initialization
                _backend = false;
            }
        } else if (_backend == 'userDataBehavior') {
            _storage_elm.setAttribute('jStorage_update', updateTime);
            _storage_elm.save('jStorage');
        }

        _storageObserver();
    }

    /**
     * Loads the data from the storage based on the supported mechanism
     */
    function _load_storage() {
        /* if jStorage string is retrieved, then decode it */
        if (_storage_service.jStorage) {
            try {
                _storage = JSON.parse(String(_storage_service.jStorage));
            } catch (E6) {
                _storage_service.jStorage = '{}';
            }
        } else {
            _storage_service.jStorage = '{}';
        }
        _storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;

        if (!_storage.__jstorage_meta) {
            _storage.__jstorage_meta = {};
        }
        if (!_storage.__jstorage_meta.CRC32) {
            _storage.__jstorage_meta.CRC32 = {};
        }
    }

    /**
     * This functions provides the 'save' mechanism to store the jStorage object
     */
    function _save() {
        _dropOldEvents(); // remove expired events
        try {
            _storage_service.jStorage = JSON.stringify(_storage);
            // If userData is used as the storage engine, additional
            if (_storage_elm) {
                _storage_elm.setAttribute('jStorage', _storage_service.jStorage);
                _storage_elm.save('jStorage');
            }
            _storage_size = _storage_service.jStorage ? String(_storage_service.jStorage).length : 0;
        } catch (E7) {/* probably cache is full, nothing is saved this way*/}
    }

    /**
     * Function checks if a key is set and is string or numberic
     *
     * @param {String} key Key name
     */
    function _checkKey(key) {
        if (typeof key != 'string' && typeof key != 'number') {
            throw new TypeError('Key name must be string or numeric');
        }
        if (key == '__jstorage_meta') {
            throw new TypeError('Reserved key name');
        }
        return true;
    }

    /**
     * Removes expired keys
     */
    function _handleTTL() {
        var curtime,
            i,
            TTL,
            CRC32,
            nextExpire = Infinity,
            changed = false,
            deleted = [];

        clearTimeout(_ttl_timeout);

        if (!_storage.__jstorage_meta || _typeof(_storage.__jstorage_meta.TTL) != 'object') {
            // nothing to do here
            return;
        }

        curtime = +new Date();
        TTL = _storage.__jstorage_meta.TTL;

        CRC32 = _storage.__jstorage_meta.CRC32;
        for (i in TTL) {
            if (TTL.hasOwnProperty(i)) {
                if (TTL[i] <= curtime) {
                    delete TTL[i];
                    delete CRC32[i];
                    delete _storage[i];
                    changed = true;
                    deleted.push(i);
                } else if (TTL[i] < nextExpire) {
                    nextExpire = TTL[i];
                }
            }
        }

        // set next check
        if (nextExpire != Infinity) {
            _ttl_timeout = setTimeout(_handleTTL, Math.min(nextExpire - curtime, 0x7FFFFFFF));
        }

        // save changes
        if (changed) {
            _save();
            _publishChange();
            _fireObservers(deleted, 'deleted');
        }
    }

    /**
     * Checks if there's any events on hold to be fired to listeners
     */
    function _handlePubSub() {
        var i, len;
        if (!_storage.__jstorage_meta.PubSub) {
            return;
        }
        var pubelm,
            _pubsubCurrent = _pubsub_last,
            needFired = [];

        for (i = len = _storage.__jstorage_meta.PubSub.length - 1; i >= 0; i--) {
            pubelm = _storage.__jstorage_meta.PubSub[i];
            if (pubelm[0] > _pubsub_last) {
                _pubsubCurrent = pubelm[0];
                needFired.unshift(pubelm);
            }
        }

        for (i = needFired.length - 1; i >= 0; i--) {
            _fireSubscribers(needFired[i][1], needFired[i][2]);
        }

        _pubsub_last = _pubsubCurrent;
    }

    /**
     * Fires all subscriber listeners for a pubsub channel
     *
     * @param {String} channel Channel name
     * @param {Mixed} payload Payload data to deliver
     */
    function _fireSubscribers(channel, payload) {
        if (_pubsub_observers[channel]) {
            for (var i = 0, len = _pubsub_observers[channel].length; i < len; i++) {
                // send immutable data that can't be modified by listeners
                try {
                    _pubsub_observers[channel][i](channel, JSON.parse(JSON.stringify(payload)));
                } catch (E) {}
            }
        }
    }

    /**
     * Remove old events from the publish stream (at least 2sec old)
     */
    function _dropOldEvents() {
        if (!_storage.__jstorage_meta.PubSub) {
            return;
        }

        var retire = +new Date() - 2000;

        for (var i = 0, len = _storage.__jstorage_meta.PubSub.length; i < len; i++) {
            if (_storage.__jstorage_meta.PubSub[i][0] <= retire) {
                // deleteCount is needed for IE6
                _storage.__jstorage_meta.PubSub.splice(i, _storage.__jstorage_meta.PubSub.length - i);
                break;
            }
        }

        if (!_storage.__jstorage_meta.PubSub.length) {
            delete _storage.__jstorage_meta.PubSub;
        }
    }

    /**
     * Publish payload to a channel
     *
     * @param {String} channel Channel name
     * @param {Mixed} payload Payload to send to the subscribers
     */
    function _publish(channel, payload) {
        if (!_storage.__jstorage_meta) {
            _storage.__jstorage_meta = {};
        }
        if (!_storage.__jstorage_meta.PubSub) {
            _storage.__jstorage_meta.PubSub = [];
        }

        _storage.__jstorage_meta.PubSub.unshift([+new Date(), channel, payload]);

        _save();
        _publishChange();
    }

    /**
     * JS Implementation of MurmurHash2
     *
     *  SOURCE: https://github.com/garycourt/murmurhash-js (MIT licensed)
     *
     * @author <a href='mailto:gary.court@gmail.com'>Gary Court</a>
     * @see http://github.com/garycourt/murmurhash-js
     * @author <a href='mailto:aappleby@gmail.com'>Austin Appleby</a>
     * @see http://sites.google.com/site/murmurhash/
     *
     * @param {string} str ASCII only
     * @param {number} seed Positive integer only
     * @return {number} 32-bit positive integer hash
     */

    function murmurhash2_32_gc(str, seed) {
        var l = str.length,
            h = seed ^ l,
            i = 0,
            k;

        while (l >= 4) {
            k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;

            k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
            k ^= k >>> 24;
            k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);

            h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;

            l -= 4;
            ++i;
        }

        switch (l) {
            case 3:
                h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
            /* falls through */
            case 2:
                h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
            /* falls through */
            case 1:
                h ^= str.charCodeAt(i) & 0xff;
                h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
        }

        h ^= h >>> 13;
        h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
        h ^= h >>> 15;

        return h >>> 0;
    }

    ////////////////////////// PUBLIC INTERFACE /////////////////////////

    $.jStorage = {
        /* Version number */
        version: JSTORAGE_VERSION,

        /**
         * Sets a key's value.
         *
         * @param {String} key Key to set. If this value is not set or not
         *              a string an exception is raised.
         * @param {Mixed} value Value to set. This can be any value that is JSON
         *              compatible (Numbers, Strings, Objects etc.).
         * @param {Object} [options] - possible options to use
         * @param {Number} [options.TTL] - optional TTL value, in milliseconds
         * @return {Mixed} the used value
         */
        set: function set(key, value, options) {
            _checkKey(key);

            options = options || {};

            // undefined values are deleted automatically
            if (typeof value == 'undefined') {
                this.deleteKey(key);
                return value;
            }

            if (_XMLService.isXML(value)) {
                value = {
                    _is_xml: true,
                    xml: _XMLService.encode(value)
                };
            } else if (typeof value == 'function') {
                return undefined; // functions can't be saved!
            } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
                    // clone the object before saving to _storage tree
                    value = JSON.parse(JSON.stringify(value));
                }

            _storage[key] = value;

            _storage.__jstorage_meta.CRC32[key] = '2.' + murmurhash2_32_gc(JSON.stringify(value), 0x9747b28c);

            this.setTTL(key, options.TTL || 0); // also handles saving and _publishChange

            _fireObservers(key, 'updated');
            return value;
        },

        /**
         * Looks up a key in cache
         *
         * @param {String} key - Key to look up.
         * @param {mixed} def - Default value to return, if key didn't exist.
         * @return {Mixed} the key value, default value or null
         */
        get: function get(key, def) {
            _checkKey(key);
            if (key in _storage) {
                if (_storage[key] && _typeof(_storage[key]) == 'object' && _storage[key]._is_xml) {
                    return _XMLService.decode(_storage[key].xml);
                } else {
                    return _storage[key];
                }
            }
            return typeof def == 'undefined' ? null : def;
        },

        /**
         * Deletes a key from cache.
         *
         * @param {String} key - Key to delete.
         * @return {Boolean} true if key existed or false if it didn't
         */
        deleteKey: function deleteKey(key) {
            _checkKey(key);
            if (key in _storage) {
                delete _storage[key];
                // remove from TTL list
                if (_typeof(_storage.__jstorage_meta.TTL) == 'object' && key in _storage.__jstorage_meta.TTL) {
                    delete _storage.__jstorage_meta.TTL[key];
                }

                delete _storage.__jstorage_meta.CRC32[key];

                _save();
                _publishChange();
                _fireObservers(key, 'deleted');
                return true;
            }
            return false;
        },

        /**
         * Sets a TTL for a key, or remove it if ttl value is 0 or below
         *
         * @param {String} key - key to set the TTL for
         * @param {Number} ttl - TTL timeout in milliseconds
         * @return {Boolean} true if key existed or false if it didn't
         */
        setTTL: function setTTL(key, ttl) {
            var curtime = +new Date();
            _checkKey(key);
            ttl = Number(ttl) || 0;
            if (key in _storage) {

                if (!_storage.__jstorage_meta.TTL) {
                    _storage.__jstorage_meta.TTL = {};
                }

                // Set TTL value for the key
                if (ttl > 0) {
                    _storage.__jstorage_meta.TTL[key] = curtime + ttl;
                } else {
                    delete _storage.__jstorage_meta.TTL[key];
                }

                _save();

                _handleTTL();

                _publishChange();
                return true;
            }
            return false;
        },

        /**
         * Gets remaining TTL (in milliseconds) for a key or 0 when no TTL has been set
         *
         * @param {String} key Key to check
         * @return {Number} Remaining TTL in milliseconds
         */
        getTTL: function getTTL(key) {
            var curtime = +new Date(),
                ttl;
            _checkKey(key);
            if (key in _storage && _storage.__jstorage_meta.TTL && _storage.__jstorage_meta.TTL[key]) {
                ttl = _storage.__jstorage_meta.TTL[key] - curtime;
                return ttl || 0;
            }
            return 0;
        },

        /**
         * Deletes everything in cache.
         *
         * @return {Boolean} Always true
         */
        flush: function flush() {
            _storage = {
                __jstorage_meta: {
                    CRC32: {}
                }
            };
            _save();
            _publishChange();
            _fireObservers(null, 'flushed');
            return true;
        },

        /**
         * Returns a read-only copy of _storage
         *
         * @return {Object} Read-only copy of _storage
         */
        storageObj: function storageObj() {
            function F() {}
            F.prototype = _storage;
            return new F();
        },

        /**
         * Returns an index of all used keys as an array
         * ['key1', 'key2',..'keyN']
         *
         * @return {Array} Used keys
         */
        index: function index() {
            var index = [],
                i;
            for (i in _storage) {
                if (_storage.hasOwnProperty(i) && i != '__jstorage_meta') {
                    index.push(i);
                }
            }
            return index;
        },

        /**
         * How much space in bytes does the storage take?
         *
         * @return {Number} Storage size in chars (not the same as in bytes,
         *                  since some chars may take several bytes)
         */
        storageSize: function storageSize() {
            return _storage_size;
        },

        /**
         * Which backend is currently in use?
         *
         * @return {String} Backend name
         */
        currentBackend: function currentBackend() {
            return _backend;
        },

        /**
         * Test if storage is available
         *
         * @return {Boolean} True if storage can be used
         */
        storageAvailable: function storageAvailable() {
            return !!_backend;
        },

        /**
         * Register change listeners
         *
         * @param {String} key Key name
         * @param {Function} callback Function to run when the key changes
         */
        listenKeyChange: function listenKeyChange(key, callback) {
            _checkKey(key);
            if (!_observers[key]) {
                _observers[key] = [];
            }
            _observers[key].push(callback);
        },

        /**
         * Remove change listeners
         *
         * @param {String} key Key name to unregister listeners against
         * @param {Function} [callback] If set, unregister the callback, if not - unregister all
         */
        stopListening: function stopListening(key, callback) {
            _checkKey(key);

            if (!_observers[key]) {
                return;
            }

            if (!callback) {
                delete _observers[key];
                return;
            }

            for (var i = _observers[key].length - 1; i >= 0; i--) {
                if (_observers[key][i] == callback) {
                    _observers[key].splice(i, 1);
                }
            }
        },

        /**
         * Subscribe to a Publish/Subscribe event stream
         *
         * @param {String} channel Channel name
         * @param {Function} callback Function to run when the something is published to the channel
         */
        subscribe: function subscribe(channel, callback) {
            channel = (channel || '').toString();
            if (!channel) {
                throw new TypeError('Channel not defined');
            }
            if (!_pubsub_observers[channel]) {
                _pubsub_observers[channel] = [];
            }
            _pubsub_observers[channel].push(callback);
        },

        /**
         * Publish data to an event stream
         *
         * @param {String} channel Channel name
         * @param {Mixed} payload Payload to deliver
         */
        publish: function publish(channel, payload) {
            channel = (channel || '').toString();
            if (!channel) {
                throw new TypeError('Channel not defined');
            }

            _publish(channel, payload);
        },

        /**
         * Reloads the data from browser storage
         */
        reInit: function reInit() {
            _reloadData();
        },

        /**
         * Removes reference from global objects and saves it as jStorage
         *
         * @param {Boolean} option if needed to save object as simple 'jStorage' in windows context
         */
        noConflict: function noConflict(saveInGlobal) {
            delete window.$.jStorage;

            if (saveInGlobal) {
                window.jStorage = this;
            }

            return this;
        }
    };

    // Initialize jStorage
    _init();

    return $.jStorage;
})();

},{}],47:[function(require,module,exports){
'use strict';

/**
 * default jForm Options
 *
 * Set the default options for the
 *  instance here. Any values specified
 *  at runtime will overwrite these
 *  values.
 *
 * @type Object
 */

;module.exports = {
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
  defaultColparams: {
    _enabled: true,
    name: 'input',
    type: 'text'
  },
  colParams: {},
  colParamsAdd: [], // storage container for additional colParams such as from linkTables
  loadExternal: true, // load external colParams e.g. from a db
  ttl: 30, // TTL for external data (mins)
  tableFriendly: '', // friendly name of table e.g. Application
  layout: 'standard' // standard (three-column layout) | single (one-col layout)
};

},{}],48:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
;'use strict';

var $ = (window.$),
    _ = (window._);
//jInput = require('../jInput/jInput.class');

module.exports = function (options) {

  var

  /**
   * Alias of this
   * @type {[type]}
   */
  self = this,

  /**
   * Shortcut to this.options.atts
   */
  oAtts,

  /**
   * Runtime options
   * @type {[type]}
   */
  runopts = options || {};

  /**  **  **  **  **  **  **  **  **  **
  	 *   FUNCTION DEFS
  	 **  **  **  **  **  **  **  **  **  **/
  this.fn = {
    _init: function _init() {
      var inpt;

      // create the form
      self.DOM.$frm = self.factory.form();

      // handle the fieldset
      self.fn.handleFieldset();

      // append the DOM elements
      self.fn.append();

      // create and append the hidden elements
      self.fn.buildInputs(self.options.hiddenElms);

      // handle the column parameters
      self.fn.handleColParams();
    }, // end fn

    /**
     * Serialize the input values
     * @method function
     * @return {[type]} [description]
     */
    serialize: function serialize() {
      var ret = {};
      _.each(self.oInpts, function (o, i) {
        // ignore disabled elements
        if (!!(o.$().prop('disabled') || o.$().hasClass('disabled'))) return false;

        ret[i] = o.fn.serialize();
      });
      return ret;
    }, // end fn

    /**
     * The the value of the input
     * @method function
     * @param  {[type]} value [description]
     * @param  {[type]} key   [description]
     * @return {[type]}       [description]
     */
    setInputValue: function setInputValue(value, key) {
      var oInpt;

      jApp.log('Setting up input ' + key);
      jApp.log(value);

      if (typeof self.oInpts[key] === 'undefined' || typeof self.oInpts[key].$ !== 'function') {
        jApp.log('No input associated with this key.');
        return false;
      }

      // get the jInput object
      oInpt = self.oInpts[key];

      // enable the input
      oInpt.fn.enable();

      // set the value of the input
      return oInpt.fn.setValue(value, key);
    }, // end fn

    /**
     * Is the form field an array input
     * @param  {[type]} oInpt [description]
     * @return {[type]}       [description]
     */
    isArrayFormField: function isArrayFormField(oInpt) {
      return !!oInpt.arrayField;
    }, //end fn

    /**
     * Is the form field a tokens field
     * @param  {[type]} value [description]
     * @param  {[type]} oInpt [description]
     * @return {[type]}       [description]
     */
    isTokensFormField: function isTokensFormField(oInpt, value) {
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!_.pluck(value, 'name').length && typeof oInpt.$().attr('data-tokens') !== 'undefined';
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

      return self.fn.serialize();
    }, // end fn

    /**
     * Get the DOM handle of the form
     * @return {[type]} [description]
     */
    handle: function handle() {
      return self.DOM.$prnt;
    }, // end fn

    /**
     * Get the form fieldset
     * @return {[type]} [description]
     */
    $fieldset: function $fieldset() {
      return self.DOM.$frm.find('fieldset');
    }, //end fn

    /**
     * Get form input by id
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    getElmById: function getElmById(id) {
      id = id.replace('#', '');

      return self.oInpts[id];
    },

    /**
     * Render the form html
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    render: function render(params) {
      var tmp = self.DOM.$prnt.prop('outerHTML'),
          ptrn;

      if (!!params && !$.isEmptyObject(params)) {
        _.each(params, function (o, key) {
          ptrn = new RegExp('\{@' + key + '\}', 'gi');
          tmp = tmp.replace(ptrn, o);
        });
      }
      return tmp;
    }, //end fn

    /**
     * Add inputs to the form
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    addElements: function addElements(arr) {
      self.options.colParamsAdd = _.union(self.options.colParamsAdd, arr);
    }, //end fn

    /**
     * Get external column parameters - deprecated
     * @return {[type]} [description]
     */
    getColParams: function getColParams() {
      jApp.log('A. Getting external colparams');
      self.options.colParams = jApp.colparams[self.options.model] || self.options.colParams;
      jApp.log(self.options.colParams);

      //process the colParams;
      self.fn.processExternalColParams();

      //add the buttons
      self.fn.processBtns();
    }, //end fn

    /**
     * Pre-Filter column parameters to remove invalid entries
     * @param  {[type]} unfilteredParams [description]
     * @return {[type]}                  [description]
     */
    preFilterColParams: function preFilterColParams(unfilteredParams) {
      return _.filter(unfilteredParams, function (o) {
        if (!o) {
          jApp.warn(o);
          jApp.warn('Fails because is null');
          return false;
        }

        // add the default colparams before attempting to filter
        o = $.extend(true, {}, self.options.defaultColparams, o);

        if (!o._enabled) {
          jApp.warn(o);
          jApp.warn('Fails because is not enabled');
          return false;
        }
        if (_.indexOf(self.options.disabledElements, o.name) !== -1) {
          jApp.warn(o);
          jApp.warn('Fails because is on the disabled elements list');
          return false;
        }

        return _.omit(o, function (value) {
          return !value || value === 'null' || value.toString().toLowerCase() === '__off__';
        });
      });
    }, // end fn

    /**
     * Get row data for the form
     * @param  {[type]}   url      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getRowData: function getRowData(url, callback) {

      $('.panel-overlay').show();

      $.getJSON(jApp.prefixURL(url), {}, self.callback.getRowData).fail(function () {
        console.error('There was a problem getting the row data');
      }).always(function (response) {
        if (typeof callback !== 'undefined' && typeof callback === 'function') {
          callback(response);
        } else if (typeof callback !== 'undefined' && typeof callback === 'string' && typeof self.fn[callback] !== 'undefined' && typeof self.fn[callback] === 'function') {
          self.fn[callback](response);
        }
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
    processFieldset: function processFieldset(o) {

      jApp.log('A. Processing the fieldset');
      jApp.log(o);
      //create the fieldset
      var $fs = $('<div/>', {
        class: o.class
      });

      // add the label, if necessary
      jApp.log('A.1 Adding the label');
      if (!!o.label) {
        $fs.append($('<legend/>').html(o.label));
      }

      // add the helptext if necessary
      jApp.log('A.2 Adding the helptext');
      if (!!o.helpText) {
        $fs.append($('<div/>', { class: 'alert alert-info' }).html(o.helpText));
      }

      // add the fields
      jApp.log('A.3 Adding the fields');
      _.each(self.fn.preFilterColParams(o.fields), function (oo, kk) {
        jApp.log('A.3.' + kk + ' Adding Field');
        jApp.log(oo);
        self.fn.processField(oo, $fs);
      });

      // add the fieldset to the DOM
      jApp.log('A.4 Adding to the DOM');
      self.DOM.$Inpts.append($fs);
    }, // end fn

    /**
     * Populate a row with the field inputs
     * @method function
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    populateFieldRow: function populateFieldRow(params, index, data) {
      var $btn_add = $('<button/>', { type: 'button', class: 'btn btn-link btn-array-add' }).html('<i class="fa fa-fw fa-plus"></i>'),
          $btn_remove = $('<button/>', { type: 'button', class: 'btn btn-link btn-array-remove' }).html('<i class="fa fa-fw fa-trash-o"></i>');

      jApp.log('---------Array Row Data---------');
      jApp.log(data);

      return $('<tr/>').append(_.map(params.fields, function (oo, ii) {
        var $td = $('<td/>', { nowrap: 'nowrap' }),
            value = null;

        oo['data-array-input'] = true;

        // if its the first input (the singleSelect) grab the value (the id of the row)
        if (!!data && !!data.id && ii === 0) {
          value = data.id;
        }

        jApp.log('-----[]-----');
        jApp.log(oo);
        jApp.log(data);

        // if its not the first input, grab the value from the pivot data
        if (ii > 0 && !!data && !!oo['data-pivotName'] && !!data.pivot && !!data.pivot[oo['data-pivotName']]) {
          value = data.pivot[oo['data-pivotName']];

          // if it's not a m-m relationship, look for the data in the root of the object
        } else if (ii > 0 && !!data && !!oo['data-pivotName'] && !!data[oo['data-pivotName']]) {
            value = data[oo['data-pivotName']];
          }

        self.fn.processField(oo, $td, value, true);
        return $td;
      })).append([$('<td/>', { nowrap: 'nowrap' }).append([$btn_remove, $btn_add])]);
    }, // end fn

    /**
     * Process form field from parameters
     * @method function
     * @param  {[type]} params [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
    processField: function processField(params, target, value, isArrayFormField) {
      var inpt,
          inpt_name = params.name.replace('[]', '');

      jApp.log('B. Processing Field');
      inpt = new jInput({ atts: params, form: self });

      if (!isArrayFormField) {
        self.oInpts[inpt_name] = inpt;
      } else if (typeof self.oInpts[inpt_name] !== 'undefined') {

        if (typeof self.oInpts[inpt_name].oInpts === 'undefined') {
          self.oInpts[inpt_name].oInpts = [];
        }
        self.oInpts[inpt_name].oInpts.push(inpt);
      }
      inpt.fn.val(value);
      target.append(inpt.fn.handle());
      //if (params.readonly === 'readonly') self.readonlyFields.push(params.name);
    }, // end fn

    /**
     * Process externally loaded column parameters - deprecated
     * @return {[type]} [description]
     */
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
          inpt = new jInput({ atts: o, form: self });
          self.oInpts[o.name] = inpt;
          self.DOM.$Inpts.find('.fs').eq(self.options.layout === 'standard' ? eq : 0).append(inpt.fn.handle());
          if (o.readonly === 'readonly') {
            self.readonlyFields.push(o.name);
          }
        }
      });

      //jApp.log('Now adding the colParamsAdd : ' + self.options.colParamsAdd.length);
      // process additional colParams that may have come from linkTables
      _.each(_.sortBy(self.options.colParamsAdd, function (o) {
        return !isNaN(o['data-ordering']) ? +o['data-ordering'] : 1000;
      }), function (o, key) {
        var inpt, eq;
        if (!!o && !!o.name && _.indexOf(self.options.disabledElements, o.name) === -1) {

          eq = !!o['data-fieldset'] ? Number(o['data-fieldset']) - 1 : 0;
          inpt = new jInput({ atts: o, form: self });
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
        //jApp.log( 'Setting up linked Element' );
        var This = $(this),
            $col = This.attr('_linkedElmFilterCol'),
            $id = This.val(),
            $labels = This.attr('_linkedElmLabels'),
            $options = This.attr('_linkedElmOptions'),
            oElm = self.fn.getElmById(This.attr('_linkedElmID')),
            atts;

        //jApp.log(This.attr('name'));
        //jApp.log($id);
        //jApp.log(oElm);

        // set data to always expire;
        oElm.fn.setTTL(-1);
        oElm.options.hideIfNoOptions = true;
        oElm.options.cache = false;

        if (typeof $id === 'string') {
          $id = "'" + $id + "'";
        }
        if ((typeof $id === 'undefined' ? 'undefined' : _typeof($id)) === 'object') {
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
      //self.DOM.$Inpts.append(btnFooter);
    }, //end fn

    /**
     * Submit the form
     * @return {[type]} [description]
     */
    submit: function submit() {

      self.fn.toggleSubmitted();

      $.ajax({
        //dataType : 'json',
        method: 'POST',
        url: jApp.prefixURL(self.options.atts.action),
        data: self.fn.serialize(),
        success: self.callback.submit
      }).done(self.fn.toggleSubmitted);
    }, //end fn

    /**
     * Toggle the submited flag of the form
     * @return {[type]} [description]
     */
    toggleSubmitted: function toggleSubmitted() {
      if (!self.submitted) {
        self.submitted = true;
        //self.oElms['btn_go'].fn.disable();
      } else {
          self.submitted = false;
          //self.oElms['btn_go'].fn.enable();
        }
    }, // end fn

    /**
     * Set the instance options
     * @method function
     * @return {[type]} [description]
     */
    setOptions: function setOptions(options) {
      // insulate against options being null
      options = options || {};
      // set the runtime values for the options
      var atts = options.atts || {};

      $.extend(true, self.options, // target
      self.defaults, // default options
      { // additional defaults
        // Default attributes
        atts: {
          name: 'frm_edit' + (options.tableFriendly || options.model || null)
        },

        // Default hidden elements
        hiddenElms: [{ atts: { 'type': 'hidden', 'readonly': 'readonly', 'name': '_method', 'value': atts.method || 'POST', 'data-static': true }
        }],

        // Default fieldset heading
        fieldset: {
          'legend': (options.tableFriendly || 'Form') + ' Details',
          'id': 'fs_details'
        },

        // Default buttons
        btns: [{ type: 'button', class: 'btn btn-primary btn-formMenu', id: 'btn_form_menu_heading', value: '<i class="fa fa-fw fa-bars"></i>' }, { type: 'button', class: 'btn btn-primary btn-go', id: 'btn_go', value: '<i class="fa fa-fw fa-floppy-o"></i> Save &amp; Close' }, { type: 'button', class: 'btn btn-primary btn-reset', id: 'btn_reset', value: '<i class="fa fa-fw fa-refresh"></i> Reset' }, { type: 'button', class: 'btn btn-primary btn-cancel', id: 'btn_cancel', value: '<i class="fa fa-fw fa-times"></i> Cancel' }]
      }, options || {} // runtime options
      );

      // alias to attributes object
      oAtts = self.options.atts || {};

      // set up the callback functions
      $.extend(true, self.callback, options.callback || {});

      return self.fn; // for chaining methods
    }, // end fn

    /**
     * Handle form fieldset
     * @method function
     * @return {[type]} [description]
     */
    handleFieldset: function handleFieldset() {
      if (!!self.options.loadExternal) return false;

      self.DOM.$frm.append(self.factory.fieldset());
    }, // end fn

    /**
     * Handle the column parameters
     * @method function
     * @return {[type]} [description]
     */
    handleColParams: function handleColParams() {
      if (!!self.options.loadExternal) {
        // get the colparams from an external json source
        return self.fn.getColParams();
      }

      self.fn.processColParams();
      self.fn.processBtns();
    }, // end fn

    /**
     * Append the DOM elements
     * @method function
     * @return {[type]} [description]
     */
    append: function append() {
      self.DOM.$frm.append(self.DOM.$Inpts);

      // append the form to the parent container
      self.DOM.$prnt.append(!!self.DOM.$frm.parents().length ? self.DOM.$frm.parents().last() : self.DOM.$frm);
    }, // end fn

    /**
     * Build inputs from array
     *  of column parameters
     * @method function
     * @return {[type]} [description]
     */
    buildInputs: function buildInputs(aColParams) {
      _.each(aColParams, self.factory.input);
    }, // end fn

    /**
     * pre-initialize the object
     * @method function
     * @return {[type]} [description]
     */
    _preInit: function _preInit() {
      self.store = jApp.store;
      self.readonly = false;

      // Get the default options and config
      self.options = {};
      self.defaults = require('./config/defaults');

      /**  **  **  **  **  **  **  **  **  **
      	 *   DOM ELEMENTS
      	 *
      	 *  These placeholders get replaced
      	 *  by their jQuery handles
      	 **  **  **  **  **  **  **  **  **  **/
      self.DOM = {
        $prnt: $('<div/>'),
        $frm: false,
        $fs: false,
        $Inpts: $('<div/>')
      };

      /**
       * Initialize submitted flag
       * @type {Boolean}
       */
      self.submitted = false;

      /**
       * Reference jStorage object
       * @type {[type]}
       */
      self.store = $.jStorage;

      /**
       * Container for jInput objects
       * @type {Array}
       */
      self.oInpts = {};

      /**
       * Initialize the rowData object
       * @type {Object}
       */
      self.rowData = {};

      /**
       * Initialize the readonly fields array
       * @type {Array}
       */
      self.readonlyFields = [];

      /**
       * Initialize the html template container
       * @type {Object}
       */
      self.html = {};

      /**
       * Shortcut function to the $frm
       * @method function
       * @return {[type]} [description]
       */
      self.$ = function () {
        return self.DOM.$frm;
      };

      // set the instance options
      self.fn.setOptions(options);

      // the model of the form
      self.model = self.options.model;

      // initialize
      self.fn._init();
    } }; // end fns

  /**
   * Builders for html elements
   * @type {Object}
   */
  // end fn

  this.factory = {

    /**
     * Create a form element
     * @method function
     * @return {[type]} [description]
     */
    form: function form(options) {
      options = options || self.options;

      return $('<form/>', options.atts).data('jForm', self).wrap(options.wrap);
    }, // end fn

    /**
     * Build and append an input
     * from column parameters
     * @method function
     * @param  {[type]} colparams [description]
     * @return {[type]}           [description]
     */
    input: function input(colparams, index) {
      var inpt = self.factory.jInput(colparams),
          atts = colparams.atts || {};

      // add the jInput object to the oInpts array
      self.oInpts[atts.name] = inpt;

      // add the input DOM handle to the DOM
      self.DOM.$Inpts.append(inpt.fn.handle());

      // add the input to the readonly
      //  fields list, if applicable
      if (!!atts.readonly) {
        self.readonlyFields.push(atts.name);
      }
    }, // end fn

    /**
     * Build a new jInput Object
     * from column parameters
     * @method function
     * @param  {[type]} colparams [description]
     * @return {[type]}           [description]
     */
    jInput: (function (_jInput) {
      function jInput(_x) {
        return _jInput.apply(this, arguments);
      }

      jInput.toString = function () {
        return _jInput.toString();
      };

      return jInput;
    })(function (colparams) {
      colparams.form = self;
      return new jInput(colparams);
    }), // end fn

    /**
     * Create a fieldset element
     * @method function
     * @return {[type]} [description]
     */
    fieldset: function fieldset(options) {
      options = options || self.options.fieldset;
      return $('<fieldset/>', options).append(self.factory.legend());
    }, // end fn

    /**
     * Create a legend element
     * @method function
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    legend: function legend(options) {
      options = options || self.options.fieldset.legend;
      return $('<legend/>').html(options);
    } }; // end fn

  // end factory

  // alias the submit function
  this.submit = this.fn.submit;

  this.callback = {

    /**
     * Get row data callback
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    getRowData: function getRowData(response) {
      var oInpt, $inpt;

      if (typeof response[0] !== 'undefined') {
        response = response[0];
      }

      self.rowData = response;

      self.DOM.$frm.clearForm();

      // iterate through each row and the the corresponding input value
      _.each(response, self.fn.setInputValue);

      // if there is a custom callback, then call it.
      if (typeof jApp.aG().fn.getRowDataCallback === 'function') {
        jApp.aG().fn.getRowDataCallback();
      }

      //self.DOM.$frm.find('.bsms').multiselect('refresh').change();
      $('.panel-overlay').hide();
    },

    // do something with the response
    submit: function submit(response) {
      jApp.log(response);
    }
  }; // end fns

  // initialize
  this.fn._preInit(options || {});
}; // end jForm declaration

},{"./config/defaults":47}],49:[function(require,module,exports){
'use strict';

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

/**
 * jGrid instance constructor
 * @method function
 * @param  {object} options
 * @return /jGrid         	jGrid instance
 */
;module.exports = function (options) {

	'use strict';

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
			jUtility.setOptions($.extend(true, {}, jUtility.getDefaultOptions(), { tableBtns: { new: { label: 'New ' + (options.model_display || options.model) } } }, options));

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
			//jUtility.setupIntervals();

			jApp.log('8. Building Menus');
			jUtility.buildMenus();

			jApp.log('9. Building Forms');
			jUtility.buildForms();

			jApp.log('10. Setting up bindings');
			jUtility.bind();

			//jApp.log('11. Setting up link tables')
			//jUtility.linkTables();

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
}; // end fn

},{}],50:[function(require,module,exports){
'use strict';

/**
 * Allowed attributes by input type
 * @type {Object}
 */
module.exports = {
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

},{}],51:[function(require,module,exports){
'use strict';

/**
 * Allowed column parameters by input type
 * @type {Object}
 */
module.exports = {
  radio: ['_labelssource', '_optionssource', '_optionsfilter'],
  select: ['_firstoption', '_firstlabel', '_labelssource', '_optionssource', '_optionsfilter']
};

},{}],52:[function(require,module,exports){
'use strict';

/**
 * default jInput Options
 *
 * Set the default options for the
 *  instance here. Any values specified
 *  at runtime will overwrite these
 *  values.
 *
 * @type Object
 */

;module.exports = {
	// html attributes
	atts: {
		type: 'text',
		class: 'form-control',
		name: 'input',
		_enabled: true
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

};

},{}],53:[function(require,module,exports){
'use strict';

/**
 * Disallowed column parameters by input type
 * @type {Object}
 */
module.exports = {
  hidden: ['_label', 'onClick', 'onChange']
};

},{}],54:[function(require,module,exports){
'use strict';

/**
 * Globally allowed attributes
 * @type {Array}
 */
module.exports = ['accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden', 'id', 'lang', 'lang', 'spellcheck', 'style', 'tabindex', 'title', 'translate', 'data-validType', 'readonly', 'required', 'onClick', 'onChange', 'form'];

},{}],55:[function(require,module,exports){
'use strict';

/**
 * Globally allowed column parameters
 * @type {Array}
 */
module.exports = ['_enabled', '_label', 'data-fieldset', 'data-ordering', 'data-validType-template', 'type'];

},{}],56:[function(require,module,exports){
'use strict';

/**
 * arrayInputs.js
 *
 * Array Input Methods
 */
;module.exports = function (self) {

      /**
       * Set up some convenience variables
       */
      var oAtts = function oAtts() {
            return self.options.atts;
      };

      return {

            /**
             * Is the form field an array input
             * @param  {[type]} oInpt [description]
             * @return {[type]}       [description]
             */
            isArrayFormField: function isArrayFormField() {
                  return !!self.arrayField;
            }, //end fn

            /**
             * Process array field from parameters
             * @method function
             * @param  {[type]} params [description]
             * @param  {[type]} target [description]
             * @return {[type]}        [description]
             */
            processArrayField: function processArrayField(params) {
                  var $container = $('<div/>', { class: 'array-field-container alert alert-info' }).data('colparams', params),
                      $table = $('<table/>', { class: '' }),
                      masterSelect = self.fn.getArrayMasterSelectParams(params.fields[0]),
                      $btn_add = $('<button/>', { type: 'button', class: 'btn btn-link btn-array-add' }).html('<i class="fa fa-fw fa-plus"></i>'),
                      inpt;

                  self.arrayField = true;

                  self.DOM.$container = $container;
                  self.DOM.$table = $table;

                  // add a row with the master select
                  inpt = new jInput({ atts: masterSelect, form: self.form });
                  inpt.DOM.$container = $container;
                  self.oInpts[masterSelect.name] = inpt;
                  $container.append(inpt.fn.handle());

                  // set up the custom multiselect object
                  inpt.fn.multiselect(self.fn.getArrayMasterSelectMultiSelectOptions());

                  // add button
                  $table.append($btn_add.wrap('<tr class="no-row-filler"><td></td></tr>'));

                  // add the table to the container
                  $container.append($table);

                  // setup the singleSelect parameters
                  params.fields[0] = self.fn.getArraySingleSelectParams(params.fields[0]);

                  // setup the names of the additional parameters
                  _.each(params.fields, function (o, i) {
                        if (i === 0) return false;

                        var baseName = params.fields[0].name.replace('[]', '');
                        o['data-pivotName'] = o.name;
                        o.name = baseName + '[][' + o.name + ']';
                  });

                  return $container;
            }, // end fn

            /**
             * Add rows corresponding to the selected array values
             * @method function
             * @return {[type]} [description]
             */
            arrayAddValues: function arrayAddValues() {
                  var multiSelect = this,
                      selectedRaw = multiSelect.getSelected(),
                      selectedOptions = selectedRaw.map(function (i, elm) {
                        return +$(elm).attr('value');
                  }),
                      selectedLabels = selectedRaw.map(function (i, elm) {
                        return $(elm).html();
                  });

                  jApp.log(selectedOptions);

                  _.each(selectedOptions, function (val, i) {
                        self.fn.arrayAddRow(val);
                  });

                  this.clearSelection();
            }, // end fn

            /**
             * Get Array MasterSelect Parameters
             * @method function
             * @param  {[type]} params [description]
             * @return {[type]}        [description]
             */
            getArrayMasterSelectParams: function getArrayMasterSelectParams(params) {
                  return $.extend({}, params, {
                        class: 'no-bsms',
                        multiple: true,
                        name: params.name + '-masterSelect'
                  });
            }, // end fn

            /**
             * Get Array SingleSelect Parameters
             * @method function
             * @param  {[type]} params [description]
             * @return {[type]}        [description]
             */
            getArraySingleSelectParams: function getArraySingleSelectParams(params) {
                  delete params._label;
                  delete params.multiple;

                  return $.extend({}, params, {
                        class: 'no-bsms form-control',
                        name: params.name.replace('[]', '') + '[]'
                  });
            }, // end fn

            /**
             * Get array MasterSelect Multiselect options
             * @method function
             * @return {[type]} [description]
             */
            getArrayMasterSelectMultiSelectOptions: function getArrayMasterSelectMultiSelectOptions() {
                  return $.extend(true, {}, self.options.bsmsDefaults, {
                        buttonClass: 'btn btn-primary',
                        onDropdownHidden: self.fn.arrayAddValues,
                        nonSelectedText: 'Quick picker'
                  });
            }, // end fn

            /**
             * Populate and array field with the form data
             * @return {[type]} [description]
             */
            populateArrayFormData: function populateArrayFormData(oInpt, data) {
                  self.fn.arrayRemoveAllRows(oInpt.$());
                  jApp.log('------Array Data------');
                  jApp.log(data);

                  // iterate through the data rows and populate the form
                  _.each(data, function (obj) {

                        // create a row in the array field table
                        jApp.log('--------Adding Row To The Array ---------');
                        jApp.log(oInpt.$());
                        self.fn.arrayAddRowFromContainer(oInpt.$(), obj);
                  });
            }, // end fn

            /**
             * Add row to array field from container
             * @param  {[type]} $container [description]
             * @return {[type]}            [description]
             */
            arrayAddRowFromContainer: function arrayAddRowFromContainer($container, data) {
                  var $table = $container.find('table'),
                      params = $container.data('colparams'),
                      $tr_new = jUtility.oCurrentForm().fn.populateFieldRow(params, 1, data || {});

                  $table.find('.btn-array-add,.no-row-filler').remove();

                  $table.append($tr_new);
            }, // end fn

            /**
             * Add row to an array input
             * @method function
             * @return {[type]} [description]
             */
            arrayAddRow: function arrayAddRow(value) {
                  var $container = self.DOM.$container || $(this).closest('.array-field-container'),
                      $table = $container.find('table'),
                      params = $container.data('colparams'),
                      $tr_new = jUtility.oCurrentForm().fn.populateFieldRow(params, 1, { id: value || null, pivot: null });

                  if (!!params.max && +$table.find('tr').length - 1 === params.max) {
                        return jUtility.msg.warning('This field requires at most ' + params.max + ' selections.');
                  }

                  $table.find('.btn-array-add,.no-row-filler').remove();

                  $table.append($tr_new);
            }, // end fn

            /**
             * Remove a row from an array input table
             * @return {[type]} [description]
             */
            arrayRemoveRow: function arrayRemoveRow() {
                  var $container = $(this).closest('.array-field-container'),
                      $table = $(this).closest('table'),
                      $tr = $(this).closest('tr'),
                      params = $container.data('colparams'),
                      $btn_add = $table.find('.btn-array-add').eq(0).detach();

                  if (!!params.min && +$table.find('tr').length - 1 === params.min) {
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
                  if (!$table.find('tr').length) {
                        $table.append('<tr class="no-row-filler"><td></td></tr>');
                  }

                  $table.find('tr:last-child').find('td:last-child').append($btn_add);
            }, // end fn

            /**
             * [function description]
             * @param  {[type]} $inpt [description]
             * @return {[type]}       [description]
             */
            arrayRemoveAllRows: function arrayRemoveAllRows($container) {
                  var $table = $container.find('table');

                  $table.empty();
                  $table.append('<tr class="no-row-filler"><td></td></tr>');
            } };
};

},{}],57:[function(require,module,exports){
'use strict';

/**
 * factory.js
 *
 * jInput factory methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {
    /**
     * Main builder method
     * @method function
     * @return {[type]} [description]
     */
    _build: function _build() {
      var $inpt = typeof self.factory[self.type] === 'function' ? self.factory[self.type]() : self.factory.input();

      return $inpt.data('jInput', self).off('change.jInput').on('change.jInput', function () {
        $(this).data('jInput').options.atts.value = $(this).val();
      });
    }, // end fn

    /**
     * Run post-build subroutines
     * @method function
     * @return {[type]} [description]
     */
    _postbuild: function _postbuild() {
      jApp.log('--Testing self object--');
      jApp.log(self);
      if (typeof self.factory._callback[self.type] === 'function') {
        self.factory._callback[self.type]();
      }
    }, // end fn

    // callback definitions
    _callback: {
      select: self.fn.initSelectOptions
    }, // end factory callbacks

    /**
     * create a generic input element
     * @method function
     * @return {[type]} [description]
     */
    input: function input() {
      return $('<input/>', self.fn.getAtts()).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a select element
     * @method function
     * @return {[type]} [description]
     */
    select: function select() {
      return $('<select/>', self.fn.getAtts()).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a tokens element
     * @method function
     * @return {[type]} [description]
     */
    tokens: function tokens() {
      // get the external options
      self.fn.getExtOptions();

      var runtime = self.fn.getAtts(),
          atts = $.extend(true, runtime, {
        type: 'text',
        'data-tokens': true,
        'data-url': self.fn.getExtUrl('tokens')
      });

      return $('<input/>', atts);
    }, // end fn

    /**
     * create a textarea element
     * @method function
     * @return {[type]} [description]
     */
    textarea: function textarea() {
      return $('<textarea/>', self.fn.getAtts()).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a button element
     * @method function
     * @return {[type]} [description]
     */
    button: function button() {
      return $('<button/>', self.fn.getAtts()).html(self.options.atts.value).wrap(self.options.wrap);
    }, // end fn

    /**
     * create an array input
     * @method function
     * @return {[type]} [description]
     */
    array: function array() {
      return self.fn.processArrayField(self.options.atts);
    }, //  end fn

    /**
     * create a label element
     * @method function
     * @return {[type]} [description]
     */
    label: function label() {
      return $('<label/>', { 'for': self.options.atts.id }).html(self.options.atts._label).wrap(self.options.wrap);
    }, // end fn

    /**
     * create a feedback icon
     * @method function
     * @return {[type]} [description]
     */
    feedbackIcon: function feedbackIcon() {
      return $('<i/>', { class: 'form-control-feedback glyphicon', style: 'display:none' });
    }, // end fn

    /**
     * Create a helptext block
     * @method function
     * @return {[type]} [description]
     */
    helpTextBlock: function helpTextBlock() {
      return $('<small/>', { class: 'help-block', style: 'display:none' });
    } };
};

},{}],58:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * input.js
 *
 * Input methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  },
      runopts = self.runopts;

  return {

    /**
     * Set the instance options
     * @method function
     * @return {[type]} [description]
     */
    setOptions: function setOptions(options) {
      // insulate against options being null
      options = options || {};
      // set the runtime values for the options
      var atts = options.atts || {};

      $.extend(true, self.options, // target
      self.defaults, // default options
      { // additional computed defaults
        atts: {
          id: atts.name || null,
          _enabled: true
        }
      }, options || {} // runtime options
      );

      // alias to attributes object
      //self.options.atts = self.options.atts || {};

      return self.fn; // for chaining methods
    }, // end fn

    /**
     * Resolve the input name
     * @return {[type]} [description]
     */
    resolveInputName: function resolveInputName() {
      if (self.fn.isMultiple()) {
        self.options.atts.name = self.options.atts.name.replace('[]', '') + '[]';
      }
    }, // end fn

    /**
     * Does the input accept multiple values
     * @return {[type]} [description]
     */
    isMultiple: function isMultiple() {
      return !!self.options.atts.multiple || self.options.atts.multiple === 'multiple';
    },

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
      //jApp.log(params);
      //jApp.log(obj);

      // check if the type is array
      //if (params.type == 'array') return self.fn.processArrayField(params, target);

      inpt = new jInput({ atts: params, form: self.form }, self);
      self.oInpts[params.name] = inpt;
      target.append(inpt.fn.handle());
      if (params.readonly === 'readonly') self.readonlyFields.push(params.name);
    }, // end fn

    /**
     * Get input attributes
     * @method function
     * @return {[type]} [description]
     */
    getAtts: function getAtts() {
      var gblAtts = self.globalAtts;
      var stdAtts = self.allowedAtts[self.type];
      var allowedAttributes = _.union(stdAtts, gblAtts);

      var filteredAtts = _.pick(self.options.atts, function (value, key) {
        if (typeof value === 'undefined' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || !value || value == '__OFF__' || value == '__off__' || _.indexOf(allowedAttributes, key) === -1 && key.indexOf('data-') === -1) {
          return false;
        } else {
          return true;
        }
      });
      return filteredAtts;
    }, // end fn

    /**
     * Set time to live on the store value
     * @method function
     * @param  {[type]} ttl [description]
     * @return {[type]}     [description]
     */
    setTTL: function setTTL(ttl) {
      self.store.setTTL(ttl);
    }, //end fn

    /**
     * Attribute handler function
     * @method function
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    attr: function attr(key, value) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        _.each(key, function (v, k) {
          self.options.atts[k] = v;
        });
        self.fn.refresh();
      } else if (!!value) {
        self.options.atts[key] = value;
        self.fn.refresh();
      } else {
        return self.options.atts[key];
      }
    }, // end fn

    /**
     * Set the value of the input
     * @method function
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setValue: function setValue(value) {
      jApp.log('--Setting value of ' + self.options.atts.name);
      jApp.log('---value');
      jApp.log(value);
      switch (self.type) {

        case 'select':

          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !!_.pluck(value, 'id').length) {
            jApp.log('-- plucking the value out of the object');
            value = _.pluck(value, 'id');
          }
          if (!!self.DOM.$inpt.data('multiselect')) {
            jApp.log('-- setting bsms select value');
            jApp.log(value);
            self.DOM.$inpt.multiselect('deselectAll');
            self.fn.val(value);
            self.DOM.$inpt.multiselect('select', value);
            self.DOM.$inpt.multiselect('refresh');
            return self.fn;
          }

          jApp.log('-- normal select, not bsms');
          self.fn.val(value);
          return self.fn;

        case 'tokens':
          self.DOM.$inpt.tokenfield('setTokens', _.pluck(value, 'name'));

          return self.fn;

        case 'array':
          self.fn.populateArrayFormData(self, value);
          return self.fn;

        default:
          self.fn.val(value);
          return self.fn;
      }
    }, // end fn

    /**
     * Value handler function
     * @method function
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    val: function val(value) {

      if (!!value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          self.$().attr('data-value', value);
          self.fn.attr('value', [value]);
          self.DOM.$inpt.val(value);
        } else {
          self.$().attr('data-value', value);
          self.fn.attr('value', value);
          self.DOM.$inpt.val(value);
        }

        return self.fn;
      }

      switch (self.type) {
        case 'radio':
        case 'checkbox':
          return $.map(self.DOM.$prnt.find(':checked'), function (i, elm) {
            return $(elm).val();
          });

        default:
          return self.DOM.$inpt.val();
      }
    }, // end fn

    /**
     * Serialize the input value and return the object representation
     * @method function
     * @return {[type]} [description]
     */
    serialize: function serialize() {
      var ret = {};

      if (!self.arrayField) {
        return self.fn.val();
      } else {
        self.DOM.$container.find('tr').each(function (i, row) {
          var $inpts = $(row).find(':input:not(button)'),
              key,
              val;

          $inpts.each(function (ii, inpt) {
            val = $(inpt).val();
            name = $(inpt).attr('data-pivotName');

            if (name == null) return false;

            if (ii == 0) {
              key = val;
              ret[key] = {};
            } else {
              ret[key][name] = val;
            }
          });
        });

        return ret;
      }
    }, // end fn

    /**
     * Refresh the attributes of the element
     * @method function
     * @return {[type]} [description]
     */
    refresh: function refresh() {
      _.each(self.fn.getAtts(), function (v, k) {
        if (k !== 'type') {
          // cannot refresh type
          self.DOM.$inpt.attr(k, v);
        }
      });

      self.DOM.$inpt.val(self.options.atts.value);
    },

    /**
     * Render the html of the element
     * @method function
     * @return {[type]} [description]
     */
    render: function render() {
      return self.DOM.$prnt.prop('outerHTML');
    },

    /**
     * jQuery reference to the parent of the element
     * @method function
     * @return {[type]} [description]
     */
    handle: function handle() {
      return self.DOM.$prnt;
    },

    /**
     * pre-initialize the object
     * @method function
     * @return {[type]} [description]
     */
    _preInit: function _preInit() {
      self.store = jApp.store;
      self.readonly = false;

      // Get the default options and config
      self.options = {};
      self.defaults = require('../defaults');

      // allowable html attributes
      self.globalAtts = require('../globalAttributes');
      self.allowedAtts = require('../allowedAttributes');

      // allowable column parameters
      self.globalColParams = require('../globalColParams');
      self.allowedColParams = require('../allowedColParams');
      self.disallowedColParams = require('../disallowedColParams');

      /**  **  **  **  **  **  **  **  **  **
         *   DOM ELEMENTS
         *
         *  These placeholders get replaced
         *  by their jQuery handles
         **  **  **  **  **  **  **  **  **  **/
      self.DOM = {
        $prnt: false,
        $inpt: false,
        $lbl: false
      };

      /**
       * [oInpts description]
       * @type {Array}
       */
      self.oInpts = [];

      /**
       * Is self an array field
       * @type {Boolean}
       */
      self.arrayField = false;

      /**
       * Shortcut function to the $inpt
       * @method function
       * @return {[type]} [description]
       */
      self.$ = function () {
        return self.DOM.$inpt;
      };

      // set the instance options to the runtime options
      self.fn.setOptions(self.runopts);

      // set the separator
      self.$separator = !!self.options.separator ? $('<br/>') : false;

      // set the type
      self.type = self.options.atts.type;

      // get the input name
      self.fn.resolveInputName();

      // set readonly flag on the input
      self.readonly = self.options.atts.readonly === 'readonly' ? true : false;

      // set the form
      self.form = runopts.form || self.options.atts.form || {};

      //set the parent element
      self.DOM.$prnt = self.options.parent.clone();

      // initialize
      self.fn._init();
    }, // end fn

    /**
     * Build a label for the input
     * @method function
     * @return {[type]} [description]
     */
    labelHandler: function labelHandler() {
      if (self.type === 'hidden' || !self.options.atts._label) return false;

      self.DOM.$lbl = self.factory.label();

      // append the label to the DOM
      self.DOM.$prnt.append(!!self.DOM.$lbl.parents().length ? self.DOM.$lbl.parents().last() : self.DOM.$lbl);

      //append the separator, if applicable
      if (!!self.options.separator) {
        self.DOM.$prnt.append(self.$separator.clone());
      }
    }, // end fn

    /**
     * A jquery handle to the input
     * @method function
     * @return {[type]} [description]
     */
    inputHandle: function inputHandle() {
      if (self.DOM.$inpt.parents().length) {
        return self.DOM.$inpt.parents().last();
      }
      return self.DOM.$inpt;
    }, // end fn

    /**
     * Append the input, feedback icon
     * container and help block
     * to the $prnt object
     *
     * @method function
     * @return {[type]} [description]
     */
    appendInput: function appendInput() {
      self.DOM.$prnt.append([self.fn.inputHandle(), self.factory.feedbackIcon(), self.factory.helpTextBlock()]);
    }, // end fn

    /**
     * Append the $prnt object to the specified target
     * @method function
     * @param  {[type]} $target [description]
     * @return {[type]}         [description]
     */
    appendTo: function appendTo($target) {
      self.DOM.$prnt.appendTo($target);
    }, // end fn

    /**
     * Initialize the object
     * @method function
     * @return {[type]} [description]
     */
    _init: function _init() {

      //handle the label
      self.fn.labelHandler();

      //create and append the input element
      self.DOM.$inpt = self.factory._build();

      //append the input
      self.fn.appendInput();

      // run any postbuild subroutines
      self.factory._postbuild();

      // //update reference to $inpt for radio groups
      // if (self.type === 'radio') {
      // 	self.DOM.$inpt = self.DOM.$prnt.find( '[name=' + self.options.atts.name + ']' );
      // }
    } };
};

},{"../allowedAttributes":50,"../allowedColParams":51,"../defaults":52,"../disallowedColParams":53,"../globalAttributes":54,"../globalColParams":55}],59:[function(require,module,exports){
'use strict';

/**
 * multiselect.js
 *
 * Multiselect Methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {

    /**
     * Multiselect handler
     * @return {[type]} [description]
     */
    multiselect: function multiselect(options) {
      if (!!self.$().data('no-bsms')) return false;

      self.$().multiselect(options || self.options.bsmsDefaults).multiselect('refresh');
      self.fn.multiselectExtraButtons();
      return self;
    }, // end fn

    /**
     * Destroy the multiselect
     * @method function
     * @return {[type]} [description]
     */
    multiselectDestroy: function multiselectDestroy() {
      self.$().multiselect('destroy');
    }, // end fn

    /**
     * Refresh the multiselect
     * @method function
     * @return {[type]} [description]
     */
    multiselectRefresh: function multiselectRefresh() {
      var inpt_name = self.options.atts.name.replace('[]', ''),
          oInpts,
          data;

      if (!self.options.extData) {
        return false;
      }

      $(this).prop('disabled', true).find('i').addClass('fa-spin');

      self.$().attr('data-tmpVal', self.$().val() || '').val('').multiselect('refresh');

      if (!!self.$().closest('.array-field-container').length) {
        data = self.$().closest('.array-field-container').data() || {};

        if (data['jInput']['oInpts'] !== 'undefined') {
          _.each(data.jInput.oInpts, function (o) {
            o.fn.getExtOptions(true);
          });
        }
      }

      self.fn.getExtOptions(true, function (newOptions) {
        jUtility.$currentForm().find('.btn.btn-refresh').prop('disabled', false).find('i').removeClass('fa-spin').end().end().find('[data-tmpVal]').each(self.fn.multiselectRefreshCallback);
      });
    }, // end fn

    /**
     * Refresh the multiselect callback
     * @method function
     * @param  {[type]} i   [description]
     * @param  {[type]} elm [description]
     * @return {[type]}     [description]
     */
    multiselectRefreshCallback: function multiselectRefreshCallback(i, elm) {
      $(elm).val($(elm).attr('data-tmpVal')).multiselect('enable').multiselect('refresh').multiselect('rebuild').removeAttr('data-tmpVal');
    }, // end fn

    /**
     * Add button and refresh button for multiselect elements
     * @return {[type]} [description]
     */
    multiselectExtraButtons: function multiselectExtraButtons() {
      if (!self.options.extData) return self;

      // make an add button, if the model is not the same as the current form
      if (self.fn.getModel() !== jApp.opts().model) {

        jApp.log('----------------------INPUT-------------------');
        jApp.log(self);

        var model = self.fn.getModel(),
            frmDef = {
          table: jApp.model2table(model),
          model: model,
          pkey: 'id',
          tableFriendly: model,
          atts: { method: 'POST' }
        },
            key = 'new' + model + 'Frm';

        if (!jUtility.isFormExists(key)) {
          jApp.log('building the form: ' + key);
          jUtility.DOM.buildForm(frmDef, key, 'newOtherFrm', model);
          jUtility.processFormBindings();
        }

        var $btnAdd = $('<button/>', {
          type: 'button',
          class: 'btn btn-primary btn-add',
          title: 'Create New ' + model
        }).html('New ' + model + ' <i class="fa fa-fw fa-external-link"></i>').off('click.custom').on('click.custom', function () {

          jUtility.actionHelper('new' + model + 'Frm');
        });

        self.DOM.$prnt.find('.btn-group .btn-add').remove().end().find('.btn-group').prepend($btnAdd);
      }

      var $btnRefresh = $('<button/>', {
        type: 'button',
        class: 'btn btn-primary btn-refresh',
        title: 'Refresh Options'
      }).html('<i class="fa fa-fw fa-refresh"></i>').off('click.custom').on('click.custom', self.fn.multiselectRefresh);

      self.DOM.$prnt.find('.btn-group .btn-refresh').remove().end().find('.btn-group').prepend($btnRefresh);

      return self;
    } };
};

},{}],60:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * options.js
 *
 * Options methods
 */
;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {

    /**
     * Build the options
     * @method function
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    buildOptions: function buildOptions(data) {
      // load JSON data if applicable
      if (!!data) {
        self.JSON = data;
      }

      if (oAtts().type === 'select') {
        self.fn.populateSelectOptions();
      } else {
        self.fn.populateTokensOptions();
      }
    }, // end fn

    /**
     * Retrieve external options
     * @param  {[type]}   force    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getExtOptions: function getExtOptions(force, callback) {
      jApp.log('getting external options');
      self.options.extData = true;

      force = typeof force !== 'undefined' ? force : false;

      // use the copy in storage if available;
      if (!force && self.options.cache && !!self.store.get('selectOptions_' + oAtts().name, false)) {
        //jApp.log('using local copy of options');
        return self.fn.buildOptions(JSON.parse(self.store.get('selectOptions_' + oAtts().name)));
      }

      var url, data;

      url = self.fn.getExtUrl();
      data = {};

      self.buildOptionsCallback = callback;

      //jApp.log('executing request for external options');
      $.getJSON(url, data, self.fn.buildOptions).always(function () {
        if (self.options.cache) {
          self.store.setTTL('selectOptions_' + oAtts().name, 1000 * 60 * self.options.ttl); // expire in 10 mins.
        }
      });
    }, // end fn

    /**
     * Populate Tokens Options
     * @method function
     * @return {[type]} [description]
     */
    populateTokensOptions: function populateTokensOptions() {
      jApp.log('--- Building TokenField Input ---');
      jApp.log(self.JSON);

      self.DOM.$inpt.data('tokenFieldSource', _.pluck(self.JSON, 'name'));
    }, //end fn

    /**
     * Populate Select Options
     * @method function
     * @return {[type]} [description]
     */
    populateSelectOptions: function populateSelectOptions() {

      // grab the external data if applicable
      if (self.options.extData) {
        oAtts()._labels = _.pluck(self.JSON, 'label');
        oAtts()._options = _.pluck(self.JSON, 'option');

        if (self.options.cache) {
          self.store.set('selectOptions_' + oAtts().name, JSON.stringify(self.JSON));
        }
      }

      // hide if empty options
      if ((!oAtts()._options || !oAtts()._options.length) && !!self.options.hideIfNoOptions) {
        //jApp.log('Hiding the element because there are no options ' + oAtts().name)
        return self.fn.disable().hide();
      }
      // else {
      // 	self.fn.enable().show();
      // }

      // remove all options
      jApp.log(self.DOM);
      self.DOM.$inpt.find('option').remove();

      // append first option if applicable
      if (!!oAtts()._firstlabel) {
        var firstOption = !!oAtts()._firstoption ? oAtts()._firstoption : '';
        self.DOM.$inpt.append($('<option/>', { value: firstOption }).html(oAtts()._firstlabel));
      }

      // iterate over the label/value pairs and build the options
      _.each(oAtts()._options, function (v, k) {
        self.DOM.$inpt.append(
        // determine if the current value is currently selected
        _.indexOf(oAtts().value, v) !== -1 || !!self.$().attr('data-value') && _.indexOf(self.$().attr('data-value').split('|'), v) !== -1 ? $('<option/>', { value: v, 'selected': 'selected' }).html(oAtts()._labels[k]) : $('<option/>', { value: !!v ? v : '' }).html(oAtts()._labels[k]));
      });

      // remove the unneeded data-value attribute
      self.$().removeAttr('data-value');

      // call the callback if applicable
      if (typeof self.buildOptionsCallback === 'function') {
        self.buildOptionsCallback();
        delete self.buildOptionsCallback;
      }
    }, // end fn

    /**
     * Get the model of the options source
     * @method function
     * @return {[type]} [description]
     */
    getModel: function getModel() {
      var tmp = oAtts()._optionssource.split('.');
      return tmp[0];
    }, // end fn

    /**
     * Initialize the select options
     * @param  {[type]} refresh [description]
     * @return {[type]}         [description]
     */
    initSelectOptions: function initSelectOptions(refresh) {
      jApp.log('Initializing Select Options');

      self.refreshAfterLoadingOptions = !!refresh ? true : false;

      // local data
      if (!!oAtts()._optionssource && _typeof(oAtts()._optionssource) === 'object') {
        self.options.extData = false;
        oAtts()._options = oAtts()._optionssource;
        oAtts()._labels = !!oAtts()._labelssource ? oAtts()._labelssource : oAtts()._optionssource;
        self.fn.buildOptions();
      } else if (!!oAtts()._optionssource && oAtts()._optionssource.indexOf('|') !== -1) {
        jApp.log(' - local options data - ');
        self.options.extData = false;
        oAtts()._options = oAtts()._optionssource.split('|');
        oAtts()._labels = !!oAtts()._labelssource ? oAtts()._labelssource.split('|') : oAtts()._optionssource.split('|');
        self.fn.buildOptions();
      }
      // external data
      else if (!!oAtts()._optionssource && oAtts()._optionssource.indexOf('.') !== -1) {
          jApp.log(' - external options data -');
          self.options.extData = true;
          //jApp.log('Getting External Options');
          self.fn.getExtOptions();
        }
    }, // end fn

    /**
     * Get the external url of the options
     * @return {[type]} [description]
     */
    getExtUrl: function getExtUrl(type) {
      var model, lbl, opt, tmp;

      type = type || oAtts().type;

      tmp = oAtts()._labelssource.split('.');
      self.model = model = tmp[0]; // db table that contains option/label pairs
      lbl = tmp[1]; // db column that contains labels
      opt = oAtts()._optionssource.split('.')[1];
      //where = ( !!oAtts()._optionsFilter && !!oAtts()._optionsFilter.length ) ? oAtts()._optionsFilter : '1=1';

      switch (type) {
        case 'select':
          return jApp.routing.get('selectOptions', model, opt, lbl);

        default:
          return jApp.routing.get('tokenOptions', model, opt, lbl);
      }
    } };
};

},{}],61:[function(require,module,exports){
'use strict';

/**
 * toggles.js
 *
 * Toggle methods
 */

;module.exports = function (self) {

  /**
   * Set up some convenience variables
   */
  var oAtts = function oAtts() {
    return self.options.atts;
  };

  return {
    /**
     * Hide the input
     * @method function
     * @return {[type]} [description]
     */
    hide: function hide() {
      if (!!self.DOM.$prnt.hide) {
        self.DOM.$prnt.hide();
      }
      return self.fn;
    },

    /**
     * Show the input
     * @method function
     * @return {[type]} [description]
     */
    show: function show() {
      if (oAtts().type !== 'hidden') {
        self.DOM.$prnt.show();
      }
      return self.fn;
    },

    /**
     * Disable the input
     * @method function
     * @return {[type]} [description]
     */
    disable: function disable() {
      if (oAtts().type !== 'hidden') {
        self.DOM.$inpt.prop('disabled', true);
        self.DOM.$inpt.addClass('disabled');
      }
      return self.fn;
    },

    /**
     * Enable the input
     * @method function
     * @return {[type]} [description]
     */
    enable: function enable() {
      if (!!self.DOM.$inpt.prop) {
        self.DOM.$inpt.prop('disabled', false);
        self.DOM.$inpt.removeClass('disabled');
      }
      return self.fn;
    }

  };
};

},{}],62:[function(require,module,exports){
'use strict';

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
;'use strict';

var $ = (window.$),
    _ = (window._),
    foo = 'bar';

require('perfect-scrollbar/jquery')($);
require('./vendor/bootstrap-multiselect')($);

module.exports = function (options) {

  var

  /**
   * Alias of this
   * @type Object
   */
  self = this,
      runopts = options || {};

  /**
   * Initialize this object
   */
  $.extend(true, self, {
    options: {
      atts: {}
    },

    /**
     * Run time options
     * @type Object
     */
    runopts: runopts,

    /**
     * Separator placeholder
     * @type {[type]}
     */
    $separator: {}
  });

  /**
   * Method definitions
   * @type {Object}
   */
  self.fn = $.extend(true,

  /**
   * Select/token options functions
   */
  require('./config/methods/options')(self),

  /**
   * Array input functions
   */
  require('./config/methods/arrayInputs')(self),

  /**
   * Multiselect functions
   */
  require('./config/methods/multiselect')(self),

  /**
   * Toggling functions
   */
  require('./config/methods/toggles')(self),

  /**
   * Other input-related functions
   */
  require('./config/methods/input')(self)); // end fns

  /**
   * Builders for html elements
   * @type {Object}
   */
  self.factory = require('./config/methods/factory')(self);

  // initialize
  self.fn._preInit(options || {});
}; // end fn

},{"./config/methods/arrayInputs":56,"./config/methods/factory":57,"./config/methods/input":58,"./config/methods/multiselect":59,"./config/methods/options":60,"./config/methods/toggles":61,"./vendor/bootstrap-multiselect":63,"perfect-scrollbar/jquery":18}],63:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 *
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
;module.exports = function ($) {
    "use strict"; // jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions'],

            init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function read() {
                                options();
                                setTimeout(function () {
                                    var ms = $element.data('multiselect');
                                    if (ms) ms.updateOriginalOptions(); //Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function read() {
                                value();
                                setTimeout(function () {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function read() {
                                selectedOptions();
                                setTimeout(function () {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.multiselect('destroy');
                });
            },

            update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);

        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            options.nonSelectedText = this.$select.data("placeholder");
        }

        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null;

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);

        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll();

        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }

        this.$select.hide().after(this.$container);
    };

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             *
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function buttonText(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                } else if (this.allSelectedText && options.length === $('option', $(select)).length && $('option', $(select)).length !== 1 && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    } else {
                        return this.allSelectedText;
                    }
                } else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                } else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = $(this).attr('label') !== undefined ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });

                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             *
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function buttonTitle(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                } else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = $(this).attr('label') !== undefined ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function optionLabel(element) {
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Triggered on change of the multiselect.
             *
             * Not triggered when selecting/deselecting options manually.
             *
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange: function onChange(option, checked) {},
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function onDropdownShow(event) {},
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function onDropdownHide(event) {},
            /**
             * Triggered after the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShown: function onDropdownShown(event) {},
            /**
             * Triggered after the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHidden: function onDropdownHidden(event) {},
            /**
             * Triggered on select all.
             */
            onSelectAll: function onSelectAll() {},
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            checkboxName: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableClickableOptGroups: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            delimiterText: ', ',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function buildContainer() {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function buildButton() {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            } else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width': this.options.buttonWidth,
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function buildDropdown() {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         *
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function buildDropdownOptions() {

            this.$select.children().each($.proxy(function (index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName').toLowerCase();

                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                } else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    } else {
                        this.createOptionValue(element);
                    }
                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function (event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li').addClass(this.options.selectedClass);
                    } else {
                        $target.closest('li').removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll();
                    } else {
                        this.deselectAll();
                    }
                }

                if (!isSelectAllOption) {
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        } else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    } else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }
                }

                this.$select.change();

                this.updateButtonText();
                this.updateSelectAll();

                this.options.onChange($option, checked);

                if (this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function (e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });

            $('li a', this.$ul).on('touchstart click', $.proxy(function (event) {
                event.stopPropagation();

                var $target = $(event.target);

                if (event.shiftKey && this.options.multiple) {
                    if ($target.is("label")) {
                        // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) {
                        // Make sure we actually have a range
                        var from = $target.closest("li").index();
                        var to = this.lastToggledInput.closest("li").index();

                        if (from > to) {
                            // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }

                        // Make sure we grab all elements since slice excludes the last index
                        ++to;

                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").slice(from, to).find("input");

                        range.prop('checked', checked);

                        if (this.options.selectedClass) {
                            range.closest('li').toggleClass(this.options.selectedClass, checked);
                        }

                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }
                    }

                    // Trigger the select "change" event
                    $target.trigger("change");
                }

                // Remembers last clicked option
                if ($target.is("input") && !$target.closest("li").is(".multiselect-item")) {
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function (event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                } else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                    // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                            index++;
                        } else if (! ~index) {
                            index = 0;
                        }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function (event) {
                    event.stopPropagation();

                    var group = $(event.target).parent();

                    // Search all option in optgroup
                    var $options = group.nextUntil('li.multiselect-group');
                    var $visibleOptions = $options.filter(":visible:not(.disabled)");

                    // check or uncheck items
                    var allChecked = true;
                    var optionInputs = $visibleOptions.find('input');
                    optionInputs.each(function () {
                        allChecked = allChecked && $(this).prop('checked');
                    });

                    optionInputs.prop('checked', !allChecked).trigger('change');
                }, this));
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function createOptionValue(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);

            if (this.options.enableHTML) {
                $label.html(" " + label);
            } else {
                $label.text(" " + label);
            }

            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.options.checkboxName) {
                $checkbox.attr('name', this.options.checkboxName);
            }
            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent().addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled').prop('disabled', true).closest('a').attr("tabindex", "-1").closest('li').addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li').addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function createDivider(element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function createOptgroup(group) {
            var groupName = $(group).prop('label');

            // Add a header for the group.
            var $li = $(this.options.templates.liGroup);

            if (this.options.enableHTML) {
                $('label', $li).html(groupName);
            } else {
                $('label', $li).text(groupName);
            }

            if (this.options.enableClickableOptGroups) {
                $li.addClass('multiselect-group-clickable');
            }

            this.$ul.append($li);

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            // Add the options of the group.
            $('option', group).each($.proxy(function (index, element) {
                this.createOptionValue(element);
            }, this));
        },

        /**
         * Build the selct all.
         *
         * Checks if a select all has already been created.
         */
        buildSelectAll: function buildSelectAll() {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }

            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");

                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                } else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }

                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                } else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }

                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent().addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function buildFilter() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);

                    // Adds optional filter clear button
                    if (this.options.includeFilterClearBtn) {
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function (event) {
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }

                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function (event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function (event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                            event.preventDefault();
                        }

                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function () {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function (index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if (this.options.filterBehavior === 'text') {
                                        filterCandidate = text;
                                    } else if (this.options.filterBehavior === 'value') {
                                        filterCandidate = value;
                                    } else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {
                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                            showElement = true;
                                        } else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);

                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        } else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show().removeClass('filter-hidden');
                                            }

                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show().removeClass('filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();
                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function destroy() {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function refresh() {
            $('option', this.$select).each($.proxy(function (index, element) {
                var $input = $('li input', this.$ul).filter(function () {
                    return $(this).val() === $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.options.selectedClass) {
                        $input.closest('li').addClass(this.options.selectedClass);
                    }
                } else {
                    $input.prop('checked', false);

                    if (this.options.selectedClass) {
                        $input.closest('li').removeClass(this.options.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled').prop('disabled', true).closest('li').addClass('disabled');
                } else {
                    $input.prop('disabled', false).closest('li').removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Select all options of the given values.
         *
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         *
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function select(selectValues, triggerOnChange) {
            if (!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if ($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (!this.options.multiple) {
                    this.deselectAll(false);
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li').addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);

                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function clearSelection() {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all options of the given values.
         *
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         *
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function deselect(deselectValues, triggerOnChange) {
            if (!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if ($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li').removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);

                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function selectAll(justVisible, triggerOnSelectAll) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;

            if (justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.options.selectedClass);
            } else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.options.selectedClass);
            }

            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:enabled", this.$select).prop('selected', true);
            } else {
                var values = visibleCheckboxes.map(function () {
                    return $(this).val();
                }).get();

                $("option:enabled", this.$select).filter(function (index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }

            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         *
         * If justVisible is true or not specified, only visible options are deselected.
         *
         * @param {Boolean} justVisible
         */
        deselectAll: function deselectAll(justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;

            if (justVisible) {
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);

                var values = visibleCheckboxes.map(function () {
                    return $(this).val();
                }).get();

                $("option:enabled", this.$select).filter(function (index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);

                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.options.selectedClass);
                }
            } else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.$select).prop('selected', false);

                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         *
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function rebuild() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();

            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            } else {
                this.enable();
            }

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function dataprovider(_dataprovider) {

            var groupCounter = 0;
            var $select = this.$select.empty();

            $.each(_dataprovider, function (index, option) {
                var $tag;

                if ($.isArray(option.children)) {
                    // create optiongroup tag
                    groupCounter++;

                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });

                    forEach(option.children, function (subOption) {
                        // add children option tags
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    });
                } else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                }

                $select.append($tag);
            });

            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function enable() {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false).removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function disable() {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true).addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function setOptions(options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function mergeOptions(options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function hasSelectAll() {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function updateSelectAll() {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");

                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                    this.options.onSelectAll();
                } else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function updateButtonText() {
            var options = this.getSelected();

            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            } else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }

            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function getSelected() {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function getOptionByValue(value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function getInputByValue(value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function updateOriginalOptions() {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function asyncFunction(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function () {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function setAllSelectedText(allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function (option, parameter, extraOptions) {
        return this.each(function () {
            var data = $(this).data('multiselect');
            var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);

                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function () {
        $("select[data-role=multiselect]").multiselect();
    });
};

},{}],64:[function(require,module,exports){
'use strict';

/**
 * defaults.js
 *
 * Default jGrid options
 */
;module.exports = function () {
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
      new: true,

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
    url: jApp.routing.get(jApp.opts().runtimeParams.model), // jApp.prefixURL( jApp.opts().runtimeParams.table + '/json' ), 	// url of JSON resource

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
     * Scope of the query
     */
    scope: 'all',

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
        class: 'btn btn-success btn-tblMenu',
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
        class: 'btn btn-success btn-refresh',
        icon: 'fa-refresh',
        label: 'Refresh',
        'data-order': 1
      },

      /**
       * New Button
       * @type {Object}
       */
      new: {
        type: 'button',
        class: 'btn btn-success btn-new',
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
        class: 'btn btn-success btn-headerFilters btn-toggle',
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

      search: {
        type: 'text',
        id: 'search',
        name: 'search',
        icon: 'fa-search',
        placeholder: 'Search...',
        'data-order': 9998
      },

      /**
       * Table status
       * @type {Object}
       */
      tableStatus: {
        type: 'button',
        class: 'btn btn-tableStatus',
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
        class: 'btn btn-primary btn-rowMenu',
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
        class: 'btn btn-primary btn-clear',
        id: 'btn_clear',
        icon: 'fa-square-o',
        label: 'Clear Selection'
      },

      /**
       * Inspect Record Button
       * @type {Object}
       */
      inspect: {
        type: 'button',
        class: 'btn btn-primary btn-inspect',
        id: 'btn_inspect',
        icon: 'fa-info',
        label: 'Inspect ...',
        'data-permission': 'read_enabled',
        'data-multiple': false
      },

      /**
       * Edit Button
       * @type {Object}
       */
      edit: {
        type: 'button',
        class: 'btn btn-primary btn-edit',
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
        class: 'btn btn-primary btn-delete',
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
        class: 'li-red',
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
};

},{}],65:[function(require,module,exports){
"use strict";

/**
 * formBindings.js
 * @type {Object}
 *
 * Event bindings related to forms
 */
;module.exports = {
  // the bind function will assume the scope is relative to the current form
  // unless the key is found in the global scope
  // boot functions will be automatically called at runtime
  "[data-validType='Phone Number']": {
    keyup: function keyup() {
      $(this).val(jUtility.formatPhone($(this).val()));
    }
  },

  "[data-validType='Zip Code']": {
    keyup: function keyup() {
      $(this).val(jUtility.formatZip($(this).val()));
    }
  },

  "[data-validType='SSN']": {
    keyup: function keyup() {
      var This = $(this);
      setTimeout(function () {
        This.val(jUtility.formatSSN(jApp.aG().val()));
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
      $(this).val(jUtility.formatNumber($(this).val()));
    }
  },

  "[data-validType='Integer']": {
    change: function change() {
      $(this).val(jUtility.formatInteger($(this).val()));
    }
  },

  "[data-validType='US State']": {
    change: function change() {
      $(this).val(jUtility.formatUC($(this).val()));
    }
  },

  "button.close, .btn-cancel": {
    click: jUtility.exitCurrentForm
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
    click: jUtility.jInput().fn.arrayAddRow
  },

  ".btn-array-remove": {
    click: jUtility.jInput().fn.arrayRemoveRow
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

  "input[type=file]": {
    change: function change(e) {
      e.preventDefault();
      jUtility.uploadFile(this);
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
};

},{}],66:[function(require,module,exports){
'use strict';

/**
 * forms.js
 * @type {Object}
 *
 * Standard form definitions
 */
;module.exports = {

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
};

},{}],67:[function(require,module,exports){
"use strict";

/**
 * gridBindings.js
 * @type {Object}
 *
 * Event bindings related to the grid
 */
;module.exports = {

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

  ".btn-clear-search": {
    click: function click() {
      var $search = $(this).closest('div').find('#search');

      $search.val('').keyup();
    }
  },

  "#search": {

    blur: function blur() {
      var val = $(this).val();

      if (!!val.length) {
        $(this).closest('div').find('.btn-clear-search').show();
      } else {
        $(this).animate({ width: 100 }, 'slow').closest('div').find('.btn-clear-search').hide();
      }
    },

    keyup: function keyup(e) {
      var delay = e.which === 13 ? 70 : 700,
          val = $(this).val();

      jApp.activeGrid.dataGrid.requestOptions.data['q'] = val;

      if (!!val.length) {
        $(this).animate({ width: 300 }, 'slow').closest('div').find('.btn-clear-search').show();
      } else {
        $(this).animate({ width: 100 }, 'slow').closest('div').find('.btn-clear-search').hide();
      }

      jUtility.timeout({
        key: 'updateGridSearch',
        delay: delay,
        fn: function fn() {
          $(this).focus();
          jUtility.executeGridDataRequest(true);
        }
      });
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
      var num_checked = jApp.aG().$().find('.chk_cid:visible:checked').length,
          num_unchecked = jApp.aG().$().find('.chk_cid:visible:not(:checked)').length;

      jApp.aG().$().find('.chk_cid:visible').prop('checked', num_checked <= num_unchecked);
      $('.chk_cid').eq(0).change();
    }
  },

  ".chk_cid": {
    change: function change() {
      var $chk_all = jApp.tbl().find('.chk_all'),
          // $checkall checkbox
      $checks = jApp.tbl().find('.chk_cid'),
          // $checkboxes
      total_num = $checks.length,
          // total checkboxes
      num_checked = jApp.tbl().find('.chk_cid:checked').length; // number of checkboxes checked

      jUtility.DOM.updateRowMenu(num_checked);

      // set the state of the checkAll checkbox
      $chk_all.prop('checked', total_num === num_checked ? true : false).prop('indeterminate', num_checked > 0 && num_checked < total_num ? true : false);

      if (!!num_checked) {
        $('.btn-editOther.active').removeClass('btn-default active').addClass('btn-link');
      }
    }
  },

  ".btn-chk": {
    click: function click() {
      $('.chk_cid:checked').prop('checked', false).eq(0).change();
      $(this).closest('.table-row').find('.chk_cid').click();
    }
  },

  ".btn-new": {
    click: function click() {
      jUtility.actionHelper('new');
    }
  },

  ".btn-edit": {
    click: function click() {
      if (jUtility.isOtherButtonChecked()) {
        return jUtility.actionHelper('edit' + jUtility.getOtherButtonModel());
      }
      return jUtility.actionHelper('edit');
    }
  },

  ".btn-editOther": {
    click: jUtility.DOM.editOtherButtonHandler
  },

  ".btn-inspect": {
    click: function click() {
      jUtility.actionHelper('inspect');
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
    click: jUtility.DOM.clearSelection
  },

  ".btn-refresh": {
    click: jUtility.DOM.refreshGrid
  },

  // ".btn-showMenu" : {
  //   click : jUtility.DOM.toggleRowMenu
  // },

  ".table-body": {
    mouseover: function mouseover() {
      $(this).focus();
    }
  }
};

},{}],68:[function(require,module,exports){
'use strict';

/**
 * initParams.js
 *
 * Initial Parameters
 */
;module.exports = {
  action: 'new',
  store: jApp.store,
  currentRow: {},
  permissions: {},
  dataGrid: {

    // pagination parameters
    pagination: {
      totalPages: -1,
      rowsPerPage: jApp.store.get('pref_rowsPerPage', jApp.aG().options.rowsPerPage)
    },

    // ajax requests
    requests: [],

    // request options
    requestOptions: {
      url: jApp.prefixURL(jApp.aG().options.url),
      data: {
        filter: jApp.aG().options.filter,
        scope: jApp.aG().options.scope || 'all',
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
    $rowMenu: $('<div/>', { class: 'btn-group btn-group-sm rowMenu', style: 'position:relative !important' })
  },

  forms: {},
  linkTables: [],
  temp: {}

};

},{}],69:[function(require,module,exports){
'use strict';

/**
 * bindings.js
 * @type {Object}
 *
 * methods dealing with events, bindings, and delegation
 */
;module.exports = {

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

  /**
   * Load event bindings for processing
   * @method function
   * @return {[type]} [description]
   */
  loadBindings: function loadBindings() {
    // form bindings
    jApp.opts().events.form = $.extend(true, require('../formBindings'), jApp.opts().events.form);

    // grid events
    jApp.opts().events.grid = $.extend(true, require('../gridBindings'), jApp.opts().events.grid);
  }, //end fn

  /**
   * Process the event bindings for the grid
   * @method function
   * @return {[type]} [description]
   */
  processGridBindings: function processGridBindings() {
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
        $scope = $(scope || document),
        scope_text = scope || 'document';

    if (event === 'boot') {
      return typeof fn === 'function' ? fn() : false;
    }

    // we cannot use event bubbling for scroll
    // events, we must use capturing
    if (event !== 'scroll') {
      if (!!$(window[target]).length) {
        //jApp.log('Found target within global scope ' + target);
        //jApp.log('Binding event ' + eventKey + ' to target ' + target);
        $(window[target]).off(eventKey).on(eventKey, fn);
      } else if (!jUtility.isEventDelegated(target, eventKey, scope_text) || force) {

        //jApp.log('Binding event ' + event + ' to target ' + target + ' within scope ' + scope_text);
        $scope.undelegate(target, eventKey).delegate(target, eventKey, fn);
        jUtility.eventIsDelegated(target, eventKey, scope_text);
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
  } };

},{"../formBindings":65,"../gridBindings":67}],70:[function(require,module,exports){
'use strict';

/**
 * booleans.js
 *
 * methods for checking boolean values
 */

;module.exports = {
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
   * Is an "other" button checked?
   * @method function
   * @return {[type]} [description]
   */
  isOtherButtonChecked: function isOtherButtonChecked() {
    return !!$('.btn-editOther.active').length;
  }, // end fn

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
   * Is the data
   * @method function
   * @return {[type]} [description]
   */
  isDataEmpty: function isDataEmpty(response) {
    return typeof response.data === 'undefined' || typeof response.data.length === 'undefined' || response.data.length == 0;
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
   * Is a form container maximized
   * @method function
   * @return {[type]} [description]
   */
  isFormOpen: function isFormOpen() {
    return !!jApp.aG().$().find('.div-form-panel-wrapper.max').length;
  }, // end fn

  /**
   * Is row menu open
   * @method function
   * @return {[type]} [description]
   */
  isRowMenuOpen: function isRowMenuOpen() {
    return !!$('.table-rowMenu-row:visible').length;
  }, // end fn

  /**
   * Check permission on the button parameters
   * @method function
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  isPermission: function isPermission(params) {
    if (!params['data-permission']) return true;
    return !!jApp.activeGrid.permissions[params['data-permission']];
  }, // end fn

  /**
   * Does the current action require a form?
   * @method function
   * @return {[type]} [description]
   */
  needsForm: function needsForm() {
    if (jApp.aG().action !== 'inspect') return true;
    return false;
  }, // end fn

  /**
   * The row needs to be checked out
   * @method function
   * @return {[type]} [description]
   */
  needsCheckout: function needsCheckout() {
    var action = jApp.aG().action;
    return jUtility.isCheckout() && (action === 'edit' || action === 'delete' || action.indexOf('edit') === 0);
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
   * Are Header Filters Non-empty
   * @method function
   * @return {[type]} [description]
   */
  areHeaderFiltersNonempty: function areHeaderFiltersNonempty() {
    return !!jApp.tbl().find('.header-filter').filter(function () {
      return !!this.value;
    }).length;
  } };

},{}],71:[function(require,module,exports){
'use strict';

/**
 * callback.js
 *
 * callback functions
 */
;module.exports = {

  /**  **  **  **  **  **  **  **  **  **
   *   CALLBACK
   *
   *  Defines the callback functions
   *  used by the various AJAX calls
   **  **  **  **  **  **  **  **  **  **/
  callback: {

    inspectSelected: function inspectSelected(response) {
      $('#div_inspect').find('.panel-body .target').html(response);
      jUtility.maximizeCurrentForm();
    }, // end fn

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
        jUtility.DOM.clearSelection();
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
      var responseData, self;

      jApp.log('6.6 data received. processing...');

      jUtility.DOM.setupGridHeaders();

      $('.table-cell.no-data').remove();

      if (jUtility.isResponseErrors(response)) {
        return jUtility.DOM.dataErrorHandler();
      }

      // init vars
      self = jApp.aG();

      // extract the data from the response;
      responseData = response.data;

      // TODO - handle pagination of api data and lazy loading

      // detect changes in data;
      self.dataGrid.delta = !$.isEmptyObject(self.dataGrid.data) ? jUtility.deltaData(self.dataGrid.data, responseData) : responseData;

      self.dataGrid.from = response.from;
      self.dataGrid.to = response.to;
      self.dataGrid.total = response.total;
      self.dataGrid.current_page = response.current_page;
      self.dataGrid.last_page = response.last_page;

      jUtility.DOM.updateGridFooter();

      self.dataGrid.data = responseData;

      if (jUtility.isDataEmpty(response)) {
        return jUtility.DOM.dataEmptyHandler();
      }

      // abort if no changes to the data
      if (!self.dataGrid.delta) {
        return false;
      }

      // remove all rows, if needed
      if (self.options.removeAllRows) {
        jUtility.DOM.removeRows(true);
      }

      jUtility.DOM.updateGrid();

      // show the preloader, then update the contents
      jUtility.DOM.togglePreloader();

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

      // adjust permissions
      jUtility.callback.getPermissions(jApp.aG().permissions);

      // adjust column widths
      jUtility.DOM.updateColWidths();

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
      jUtility.DOM.updatePanelHeader(data[self.options.columnFriendly]);
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
        jApp.activeGrid.temp.checkedOut = true;
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
        console.warn(jUtility.getErrorMessage(response));
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
    displayResponseErrors: function displayResponseErrors(res) {

      var response = res.responseJSON || res;

      jApp.log('Checking is response has errors.');
      if (jUtility.isResponseErrors(response)) {
        jApp.log('Response has errors. Displaying error.');
        console.warn(jUtility.getErrorMessage(response));
        jUtility.msg.clear();
        jUtility.msg.error(jUtility.getErrorMessage(response));
      } else {
        jApp.log('Response does not have errors.');
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
          $i = $('<i/>', { class: 'fa fa-lock fa-fw checkedOut' }),
          self = jApp.aG();

      self.DOM.$grid.find('.chk_cid').parent().removeClass('disabled').show();
      self.DOM.$grid.find('.rowMenu-container').removeClass('disabled');
      self.DOM.$grid.find('.checkedOut').remove();

      _.each(response, function (o) {

        if (!!o && !!o.lockable_id) {
          $tr = $('.table-row[data-identifier="' + o.lockable_id + '"]');

          $tr.find('.chk_cid').parent().addClass('disabled').hide().closest('.table-cell').append($('<span/>', { class: 'btn btn-default btn-danger pull-right checkedOut' }).html($i.prop('outerHTML')).clone().attr('title', 'Locked By ' + o.user.person.name));
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

},{}],72:[function(require,module,exports){
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * dom.js
 *
 * DOM manipulation functions
 */

;module.exports = {
  /**
   * DOM Manipulation Functions
   * @type {Object}
   */
  DOM: {

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
      jApp.aG().forms[oFrmHandle] = {}; // initialize it with a placeholder
      jApp.aG().forms[oFrmHandle] = oFrm = new jForm(params);

      // create form container
      jApp.aG().forms[$frmHandle] = {}; // initialize it with a placeholder
      jApp.aG().forms[$frmHandle] = $('<div/>', { 'class': 'gridFormContainer' }).html(jUtility.render(jApp.aG().html.forms[htmlKey], { tableFriendly: tableFriendly || jApp.opts().model })).find('.formContainer').append(oFrm.fn.handle()).end().appendTo(jApp.aG().$());

      return oFrm;
    }, // end fn

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
      jApp.aG().$().find('.table-body .table-row').remove();
      $('<div/>', { class: 'table-cell no-data' }).html('<div class="alert alert-warning"> <i class="fa fa-fw fa-warning"></i> I did not find anything matching your query.</div>').appendTo(jApp.tbl().find('#tbl_grid_body'));

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
      $('<div/>', { class: 'table-cell no-data' }).html('<div class="alert alert-danger"> <i class="fa fa-fw fa-warning"></i> There was an error retrieving the data.</div>').appendTo(jApp.tbl().find('#tbl_grid_body'));
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
      var i = +elm.closest('li').index() + 2;

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
          return _.indexOf(identifiers, Number($(row).attr('data-identifier'))) === -1;
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
        return [[$(elm).clone().text().toLowerCase(), $(elm).parent()]];
      }).sort(function (a, b) {

        if ($.isNumeric(a[0]) && $.isNumeric(b[0])) {
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
      $col.each(function (i, elm) {
        var $e = $(elm[1]);

        // detach the row from the DOM
        $e.detach();

        // attach the row in the correct order
        if (!desc) {
          jApp.tbl().find('.table-body').append($e);
        } else {
          jApp.tbl().find('.table-body').prepend($e);
        }
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

    /**
     * Attach Row Menu To The DOM
     * @method function
     * @return {[type]} [description]
     */
    attachRowMenu: function attachRowMenu() {
      $('.table-rowMenu-row').empty().append(jApp.aG().DOM.$rowMenu.wrap('<div class="table-header"></div>').parent());
    }, //end fn

    /**
     * Handler that triggers when an "other" button is clicked
     * @method function
     * @return {[type]} [description]
     */
    editOtherButtonHandler: function editOtherButtonHandler() {
      var id = $(this).attr('data-id'),
          model = $(this).attr('data-model'),
          icon = _.without($(this).find('i').attr('class').split(' '), 'fa', 'fa-fw')[0],
          options;

      $('.btn-editOther.active').not(this).removeClass('btn-default active').addClass('btn-link');

      $(this).toggleClass('btn-link btn-default active');

      options = !!$('.btn-editOther.active').length ? { id: id, model: model, icon: icon } : null;

      jUtility.DOM.updateRowMenuExternalItem(options);

      jUtility.DOM.toggleRowMenu(!!$('.btn-editOther.active').length);

      return true;
    }, // end fn

    /**
     * Update the row menu when an external item is checked
     * @method function
     * @return {[type]} [description]
     */
    updateRowMenuExternalItem: function updateRowMenuExternalItem(options) {
      var $row = $('.table-rowMenu-row'),
          iconClass = $row.find('.btn-rowMenu i').attr('data-tmpClass');

      if (!!options) {
        $('.chk_cid:checked,.chk_all').prop('checked', false).prop('indeterminate', false);

        $row.addClass('other').find('[data-custom]').hide().end().find('[data-custom-menu] .btn').hide().end().find('.btn-rowMenu').addClass('other').find('i').attr('data-tmpClass', options.icon).removeClass(iconClass).removeClass('fa-check-square-o').addClass(options.icon).end().end().find('.btn-primary').removeClass('btn-primary').addClass('btn-warning').end().find('.btn-history').hide().end();

        jUtility.DOM.toggleRowMenuItems(false);
      } else {

        $row.removeClass('other').find('[data-custom]').show().end().find('[data-custom-menu] .btn').show().end().find('.btn-rowMenu').removeClass('other').find('i').removeClass(iconClass).addClass('fa-check-square-o').removeAttr('data-tmpClass').end().end().find('.btn-warning').removeClass('btn-warning').addClass('btn-primary').end().find('.btn-history').show().end();
      }
    }, // end fn

    /**
     * Inspect the selected item
     * @method function
     * @return {[type]} [description]
     */
    inspectSelected: function inspectSelected() {
      jUtility.get({
        url: jUtility.getCurrentRowInspectUrl(),
        success: jUtility.callback.inspectSelected
      });
    }, // end fn

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

      // reset the row menu back to normal
      jUtility.DOM.updateRowMenuExternalItem();
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
     * Clear the selected items
     * @method function
     * @return {[type]} [description]
     */
    clearSelection: function clearSelection() {
      jApp.aG().$().find('.chk_cid').prop('checked', false).end().find('.btn-editOther.active').removeClass('active btn-default').addClass('btn-link');

      $('.chk_cid').eq(0).change();
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
     * Refresh the grid
     * @method function
     * @return {[type]} [description]
     */
    refreshGrid: function refreshGrid() {
      $(this).addClass('disabled').prop('disabled', true).find('i').addClass('fa-spin').end();
      // .delay(2000)
      // .removeClass('disabled')
      // .prop('disabled',false)
      // .find('i').removeClass('fa-spin').end();
      jUtility.updateAll();
    }, // end fn

    /**
     * iterates through changed data and updates the DOM
     * @method function
     * @return {[type]} [description]
     */
    updateGrid: function updateGrid() {
      // init vars
      var appendTR = false,
          appendTD = false,
          tr,
          td,
          td_chk,
          chk_cid,
          value,
          $table = jApp.tbl();

      jApp.log(' ---Updating The Grid--- ');

      // iterate through the changed data
      $.each(jApp.activeGrid.dataGrid.delta, function (i, oRow) {

        // remove the no-data placeholder
        $table.find('.table-body .tr-no-data').remove();

        // save the current row.
        jApp.aG().currentRow = jApp.aG().dataGrid.data[i];

        // find row in the table if it exists
        tr = $table.find('.table-row[data-identifier="' + oRow[jApp.opts().pkey] + '"]');
        console.log('find tr, attempt 1', tr);

        // try the json key if you can't find the row by the pkey
        if (!tr.length) {
          tr = $table.find('.table-row[data-jsonkey=' + i + ']');
          console.log('find tr, attempt 2', tr);
        }

        // create the row if it does not exist
        if (!tr.length) {
          tr = $('<div/>', { 'class': 'table-row', 'data-identifier': oRow[jApp.opts().pkey], 'data-jsonkey': i });
          console.log('couldnt find tr, making a new one', tr);
          appendTR = true;

          // add the data to the row
          tr.data('rowData', jApp.aG().dataGrid.data[i]);

          td_chk = $('<div/>', { 'class': 'table-cell', "nowrap": "nowrap", "style": "position:relative;" });

          // apply the global cell attributes
          if (!!jApp.opts().cellAtts['*']) {
            $.each(jApp.opts().cellAtts['*'], function (at, fn) {
              td_chk.attr(at, fn());
            });
          }

          chk_cid = !!oRow[jApp.opts().pkey] ? '<input type="checkbox" class="chk_cid" name="cid[]" />' : '';

          td_chk.html('<label class="btn btn-default pull-right lbl-td-check" style="margin-left:20px;"> ' + chk_cid + '</label> \
                  <div class="rowMenu-container"></div> \
                  </div>&nbsp;');

          tr.append(td_chk);
        } else {
          // update the row data- attributes
          tr.attr('data-identifier', oRow[jApp.opts().pkey]).attr('data-jsonkey', i);

          td_chk = tr.find('.table-cell').eq(0);
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

          // determine if the column is hidden
          if (_.indexOf(jApp.opts().hidCols, key) !== -1) {
            return false;
          }

          // find the cell if it exists
          td = tr.find('.table-cell[data-identifier="' + key + '"]');

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
          value = jUtility.prepareValue(jApp.aG().currentRow[key], key);

          if (td.html().trim() !== value.toString().trim()) {
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
          console.log('adding the row to the dom', $('#tbl_grid_body').append(tr));
          //$('#tbl_grid_body').append(tr);
        }
      }); // end each

      // reset column widths
      jUtility.DOM.updateColWidths();

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
          $('<label/>', { class: 'btn btn-default pull-right lbl-td-check', style: 'margin-left:20px' }).append($('<input/>', { type: 'checkbox', class: 'chk_cid', name: 'cid[]' })).appendTo($(elm));
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

      jApp.log('--done updating grid');
    },

    /**
     * Update the grid footer message
     * @method function
     * @return {[type]} [description]
     */
    updateGridFooter: function updateGridFooter() {
      var target = $('.data-footer-message'),
          self = jApp.activeGrid,
          data = self.dataGrid,
          message = '<div style="padding:6px;" class="alert-warning"><i class="fa fa-fw fa-info"></i> Records ' + data.from + ' - ' + data.to + ' of ' + data.total + ' total</div>';

      target.html(message);
    }, // end fn

    /**
     * Clear the grid footer
     * @method function
     * @return {[type]} [description]
     */
    clearGridFooter: function clearGridFooter() {
      $('.data-footer-message').html('');
    }, // end fn

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
      type = type || 'buttons';

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

              // mark this as a custom button
              oo['data-custom'] = true;

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
        var btns = target.find('[data-order]');

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
     * Create a text input for a menu
     * @method function
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    createMenuText: function createMenuText(o) {
      var $input,
          $div = $('<div/>', { style: 'position:relative', 'data-order': o['data-order'] }).html('<button style="display:none;" class="btn btn-link btn-clear-search btn-toggle">Reset</button>');

      $input = $('<input/>', _.omit(o, 'data-order'));

      $div.prepend($input);

      o.ignore = true;

      return $div;
    }, // end fn

    /**
     * Helper function to create menu links
     * @method function
     * @param  {obj} o html parameters of the link
     * @return {jQuery obj}
     */
    createMenuLink: function createMenuLink(o) {
      var $btn_choice = $('<a/>', { href: 'javascript:void(0)', 'data-permission': o['data-permission'] || null });

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

      return $('<li/>', { class: o.class, title: o.title }).append($btn_choice);
    }, // end fn

    /**
     * Helper function to create menu buttons
     * @method function
     * @param  {obj} o html parameters of the button
     * @return {jQuery obj}
     */
    createMenuButton: function createMenuButton(params) {
      var $btn, $btn_a, $btn_choice, $ul;

      if (!!params.type && params.type == 'text') {
        return jUtility.DOM.createMenuText(params);
      }

      if (_typeof(params[0]) === 'object') {
        // determine if button is a dropdown menu

        $btn = $('<div/>', { class: 'btn-group btn-group-sm', 'data-custom-menu': true });

        // params[0] will contain the dropdown toggle button
        $btn_a = $('<a/>', {
          type: 'button',
          class: params[0].class + ' dropdown-toggle',
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
          $btn_a.append($('<span/>', { class: 'fa fa-caret-down' }));
          $btn.append($btn_a);
          $ul = $('<ul/>', { class: 'dropdown-menu' });

          _.each(params, function (o, key) {
            if (key === 0) return false;
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

        if (!!params['data-custom']) {
          $btn.attr('btn-custom', true);
        }

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

  } };

},{}],73:[function(require,module,exports){
"use strict";

/**
 * formatters.js
 *
 * methods dealing with string formats
 */

;module.exports = {

  /**
   * Format phone number
   * @method function
   * @param  {[type]} phonenum [description]
   * @return {[type]}          [description]
   */
  formatPhone: function formatPhone(phonenum) {
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
      var parts = phonenum.match(regexObj);
      var phone = "";
      if (parts[1]) {
        phone += "(" + parts[1] + ") ";
      }
      phone += parts[2] + "-" + parts[3];
      return phone;
    } else {
      //invalid phone number
      return phonenum;
    }
  }, // emd fn

  /**
   * Format zip code
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatZip: function formatZip(z) {
    z = z.replace(/[^0-9-]/gi, "");
    if (/^\d{6,9}$/.test(z)) {
      z = z.substring(0, 5) + "-" + z.substring(5);
      return z;
    } else {
      return z.substring(0, 10);
    }
  }, // end fn

  /**
   * Format number
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatNumber: function formatNumber(z) {
    if (isNaN(parseFloat(z))) {
      if (!isNaN(z.replace(/[^0-9\.]/gi, ""))) {
        return z.replace(/[^0-9\.]/gi, "");
      } else {
        return '';
      }
    } else {
      return parseFloat(z);
    }
  }, // end fn

  /**
   * Format Integer
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatInteger: function formatInteger(z) {
    if (!isNaN(z)) {
      return Math.round(z);
    } else {
      return z.replace(/[^0-9]/gi, "");
    }
  }, // end fn

  /**
   * Format SSN
   * @method formatSSN
   * @param  {[type]}  z [description]
   * @return {[type]}    [description]
   */
  formatSSN: function formatSSN(z) {
    z = z.replace(/\D/g, '');

    switch (z.length) {
      case 0:
      case 1:
      case 2:
      case 3:
        return z;

      case 4:
      case 5:
        return z.substr(0, 3) + '-' + z.substr(3);
    }

    return z.substr(0, 3) + '-' + z.substr(3, 2) + '-' + z.substr(5);
  }, // end fn

  /**
   * Format UpperCase
   * @method function
   * @param  {[type]} z [description]
   * @return {[type]}   [description]
   */
  formatUC: function formatUC(z) {
    return z.toUpperCase();
  }, // end fn

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
    var template,
        templateFunctions = $.extend(true, {}, jApp.cellTemplates, jApp.opts().templates);

    if (typeof templateFunctions[column] === 'function') {
      template = templateFunctions[column];
      value = template(value);
    }

    if (value == null) {
      value = '';
    }

    if (value.toString().toLowerCase() === 'null') {
      return '';
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
    var ptrn;

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
  replacer: function replacer(match, p1) {
    return jApp.aG().currentRow[p1];
  } };

},{}],74:[function(require,module,exports){
'use strict';

/**
 * forms.js
 *
 * methods dealing with forms
 */

;module.exports = {
  /**
   * Form boot up function
   * @method function
   * @return {[type]} [description]
   */
  formBootup: function formBootup() {
    if (typeof jApp.aG().fn.formBootup === 'function') {
      jApp.aG().fn.formBootup();
    }

    jUtility.$currentFormWrapper()
    //reset validation stuff
    .find('.has-error').removeClass('has-error').end().find('.has-success').removeClass('has-success').end().find('.help-block').hide().end().find('.form-control-feedback').hide().end()

    //multiselects
    .find('select:not(.no-bsms)').addClass('bsms').end().find('.bsms').each(function (i, elm) {
      if (!!$(elm).data('no-bsms')) return false;

      $(elm).data('jInput').fn.multiselect().fn.multiselectRefresh();
    }).end().find('[data-tokens]').each(function () {
      if (!!$(this).data('tokenFieldSource')) {
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
   * Refresh and rebuild the current form
   * @method function
   * @return {[type]} [description]
   */
  refreshCurrentForm: function refreshCurrentForm() {
    jApp.aG().store.flush();
    jUtility.oCurrentForm().fn.getColParams();
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
        if ($(elm).hasClass('bsms') && !$elm.data('no-bsms')) {
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
   * Does the meta data describe the current form?
   * @method function
   * @param  {[type]} meta [description]
   * @param  {[type]} oFrm [description]
   * @return {[type]}      [description]
   */
  doesThisMetaDataDescribeTheCurrentForm: function doesThisMetaDataDescribeTheCurrentForm(meta) {
    var current = jUtility.oCurrentForm();

    return meta.action === jApp.aG().action || !!meta.model && !!current.model && meta.model === current.model;
  }, // end fn

  /**
   * Maximize the current form
   * @method function
   * @return {[type]} [description]
   */
  maximizeCurrentForm: function maximizeCurrentForm() {
    try {
      jApp.log('   maximizing the current form');
      jApp.log(jUtility.oCurrentForm());

      var openFormKey = null,
          openForm;

      if (jApp.openForms.length) {
        jApp.openForms.last().wrapper.removeClass('max');

        _.each(jApp.openForms, function (meta, key) {
          if (jUtility.doesThisMetaDataDescribeTheCurrentForm(meta)) {
            jApp.log('openFormKey ' + key);
            openFormKey = key;
            jApp.log(meta);
            openForm = meta;
          }
        });
      }

      if (openFormKey !== null && !!openForm) {
        // form is minimized, open it.
        jApp.openForms.splice(openFormKey, 1); // remove the element from the array
        jApp.openForms.push(openForm); // move the element to the end
      } else {
          // open a new form
          jApp.openForms.push({
            wrapper: jUtility.$currentFormWrapper(),
            obj: jUtility.oCurrentForm() || {},
            $: jUtility.$currentForm(),
            action: jApp.aG().action,
            model: !!jUtility.oCurrentForm() ? jUtility.oCurrentForm().model : jUtility.getActionModel()
          });
        }

      // maximize the form and enable its buttons
      jApp.openForms.last().wrapper.addClass('max');
      //.find('button').prop('disabled',false);
    } catch (e) {
      console.warn(e);
      return false;
    }
  }, // end fn

  /**
   * Exit the current form, checking in the record if needed
   * @method function
   * @return {[type]} [description]
   */
  exitCurrentForm: function exitCurrentForm() {
    if (jUtility.needsCheckin()) {
      return jUtility.checkin(jUtility.getCurrentRowId());
    }

    return jUtility.closeCurrentForm();
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

        jApp.openForms.last().wrapper.addClass('max').find('button').prop('disabled', false).end().find('.btn-refresh').trigger('click');
      }
    } catch (ignore) {}
  }, // end fn

  /**
   * Load Form Definitions
   * @method function
   * @return {[type]} [description]
   */
  loadFormDefinitions: function loadFormDefinitions() {
    jApp.opts().formDefs = $.extend(true, {}, require('../forms'), jApp.opts().formDefs);
  }, //end fn

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
   * Upload the file
   * @method function
   * @param  {[type]} $inpt [description]
   * @return {[type]}       [description]
   */
  uploadFile: function uploadFile(inpt) {
    var formData = new FormData(),
        $btn,
        requestOptions;

    _.each(inpt.files, function (file, index) {
      formData.append(inpt.name, file, file.name);
    });

    $btn = jUtility.$currentFormWrapper().find('.btn-go');

    requestOptions = {
      url: jUtility.getCurrentFormAction(),
      data: formData,
      //fail : console.warn,
      always: function always() {
        jUtility.toggleButton($btn);
      }
    };

    jUtility.postJSONfile(requestOptions);

    jUtility.toggleButton($btn);
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
      var oValidate = new $.validator(jUtility.$currentForm());
      if (oValidate.errorState) {
        return false;
      }
    }

    // turn off the button to avoid multiple clicks;
    jUtility.toggleButton($btn);

    jUtility.postJSON(requestOptions);
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
   * Get the action of the current form
   * @method function
   * @return {[type]} [description]
   */
  getCurrentFormAction: function getCurrentFormAction() {
    var action = jApp.aG().action;

    if (action.indexOf('edit') === 0 || action.indexOf('delete') === 0) {
      return jApp.routing.get(jUtility.getActionModel(), jUtility.getCurrentRowId());
    }

    switch (action) {
      case 'withSelectedDelete':
        return jApp.routing.get(jUtility.getActionModel());

      case 'withSelectedUpdate':
        return jApp.routing.get('massUpdate', jUtility.getActionModel());

      case 'resetPassword':
        return jApp.routing.get('resetPassword/' + jUtility.getCurrentRowId());

      default:
        return jApp.routing.get(jUtility.oCurrentForm().options.model); //jApp.opts().table;
    }
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

  /**
   * formFactory
   *
   * build a new form for the model
   * @method function
   * @param  {[type]} model [description]
   * @return {[type]}       [description]
   */
  formFactory: function formFactory(model) {
    var colparams,
        key = 'edit' + model + 'frm',
        htmlkey = 'editOtherFrm',
        tableFriendly = model,
        formDef = {
      model: model,
      pkey: 'id',
      tableFriendly: model,
      atts: { method: 'PATCH' }
    },
        oFrm;

    if (!jApp.colparams[model]) {
      console.warn('there are no colparams available for ' + model);
      return false;
    }

    // build the form
    oFrm = jUtility.DOM.buildForm(formDef, key, htmlkey, tableFriendly);

    // set up the form bindings
    jUtility.bind();

    return oFrm;
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
    var key,
        tmpForms,
        tmpIndex,
        action = jApp.aG().action,
        model;

    if (!jUtility.needsForm()) return {};

    jApp.log(' Getting current form for action: ' + action, true);

    switch (jApp.aG().action) {
      case 'new':
      case 'New':
        return jApp.aG().forms.oNewFrm;

      case 'edit':
      case 'Edit':
        return jApp.aG().forms.oEditFrm;
    }

    // the form is not a standard form, try to find it from the current action

    // get an array of the form objects
    tmpForms = _.compact(_.map(jApp.aG().forms, function (o, key) {
      if (key.indexOf('o') === 0) return key;else return false;
    }));
    jApp.log('-- these are the forms', true);
    jApp.log(tmpForms, true);

    // try to find the action in the forms
    tmpIndex = _.findIndex(tmpForms, function (str) {
      return str.toLowerCase().indexOf(action.toLowerCase()) !== -1;
    });
    jApp.log('-- the index of the current form ' + tmpIndex, true);

    if (tmpIndex > -1) {
      jApp.log('Found current form', true);
      jApp.log(jApp.aG().forms[tmpForms[tmpIndex]], true);
      return jApp.aG().forms[tmpForms[tmpIndex]];
    }

    // we don't have a form built yet, see if we have a form definition for the current action and build the form
    return jUtility.formFactory(jUtility.getActionModel());

    // if ( jUtility.isOtherButtonChecked() ) {
    //   model = jUtility.getOtherButtonModel();
    //   console.log('building a new form for model ' + model )
    //   model = jApp.aG().temp.actionModel;
    //   return jUtility.formFactory( model );
    // } else {
    //   console.warn('could not find the actionModel to build the form');
    // }
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
      if (jUtility.needsForm()) {
        return jUtility.oCurrentForm().$();
      }
      return $('#div_inspect').find('.target');
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
   *   setupFormContainer
   *
   *  When a rowMenu button is clicked,
   *  this function sets up the
   *  corresponding div
   **  **  **  **  **  **  **  **  **  **/
  setupFormContainer: function setupFormContainer() {
    jUtility.DOM.overlay(2, 'on');

    if (jUtility.needsForm()) {
      jApp.aG().hideOverlayOnError = false;
      jUtility.resetCurrentForm();
      jUtility.maximizeCurrentForm();
      jUtility.setCurrentFormFocus();
      jUtility.formBootup();
      jUtility.getCurrentFormRowData();
    } else {
      jUtility.DOM.inspectSelected();
    }
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
  } };

},{"../forms":66}],75:[function(require,module,exports){
'use strict';

/**
 * grid.js
 *
 * grid methods
 */
;module.exports = {
  /**
   * Calculate where the grid should be positioned
   * @return {[type]} [description]
   */
  calculateGridPosition: function calculateGridPosition() {
    if (typeof $('.colHeaders').offset() === 'undefined') {
      return false;
    }
    return {
      marginTop: +$('.colHeaders').height() + $('.colHeaders').offset().top,
      height: +$(window).height() - 95 - $('.colHeaders').offset().top
    };
  }, // end fn

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
            },
            'data-column': o
          });
        }
      });

      jApp.aG().temp.visibleColumnsMenuSetup = true;
    } else {
      return false;
    }
  }, //end fn

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
   * Turn off modal overlays
   * @method function
   * @return {[type]} [description]
   */
  turnOffOverlays: function turnOffOverlays() {
    jUtility.DOM.overlay(1, 'off');
    jUtility.DOM.overlay(2, 'off');
  }, //end fn

  /**
   * Update countdown
   * @method function
   * @return {[type]} [description]
   */
  updateCountdown: function updateCountdown() {
    if (jUtility.isFormOpen() || jUtility.isRowMenuOpen()) {
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

  /**
   * Temp storage object
   * @type {Object}
   */
  temp: {},

  /**
   * Get the jInput object
   * @method function
   * @return {[type]} [description]
   */
  jInput: (function (_jInput) {
    function jInput() {
      return _jInput.apply(this, arguments);
    }

    jInput.toString = function () {
      return _jInput.toString();
    };

    return jInput;
  })(function () {
    if (!this.temp.jInput) {
      this.temp.jInput = new jInput({});
    }
    return this.temp.jInput;
  }), // end fn

  /**
   * Get the jForm object
   * @method function
   * @return {[type]} [description]
   */
  jForm: (function (_jForm) {
    function jForm() {
      return _jForm.apply(this, arguments);
    }

    jForm.toString = function () {
      return _jForm.toString();
    };

    return jForm;
  })(function () {
    if (!this.temp.jForm) {
      this.temp.jForm = new jForm({});
    }
    return this.temp.jForm;
  }), // end fn

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
  getDefaultOptions: require('../defaults'), // end fn

  /**
   * Get users permissions
   * @method function
   * @return {[type]} [description]
   */
  getPermissions: function getPermissions(model) {
    model = model || jApp.opts().model;

    var storeKey = model + '_permissions';

    if (!!jApp.store.get(storeKey, false)) {
      return jUtility.callback.getPermissions(jApp.store.get(storeKey));
    }

    jApp.log('0.1 - Getting Permissions from server');

    var requestOptions = {
      url: jApp.routing.get('getPermissions', model),
      success: function success(response) {
        jApp.store.set(storeKey, response, { TTL: 60000 * 60 * 24 });
        jApp.log(jApp.store.getTTL(storeKey));

        jUtility.callback.getPermissions(response);
        jUtility.buildMenus();
      }
    };

    jApp.log(requestOptions.url);

    jUtility.getJSON(requestOptions);
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
    if (!!jUtility.numInvisibleItemsChecked()) {
      return jUtility.confirmInvisibleCheckedItems(action, callback);
    }

    return jUtility.withSelectedAction(action, callback, true);
  }, // end fn

  /**
   * With selected actions
   * @param  {[type]}   action   [description]
   * @param  {Function} callback [description]
   * @param  {[type]}   $cid     [description]
   * @return {[type]}            [description]
   */
  withSelectedAction: function withSelectedAction(action, callback, includeHidden) {
    var $cid = jUtility.getCheckedItems(includeHidden),
        model = jUtility.getActionModel();

    if (!$cid.length && !jUtility.isOtherButtonChecked()) {
      return jUtility.msg.warning('Nothing selected.');
    }

    switch (action) {
      // DELETE SELECTED
      case 'delete':
        jApp.aG().action = 'withSelectedDelete';
        bootbox.confirm('Are you sure you want to delete ' + $cid.length + ' ' + model + ' record(s)?', function (response) {
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

      default:
        console.warn(action + ' is not a valid withSelected action');
        break;
    }
  }, //end fn

  /**
   * [function description]
   * @method function
   * @param  {[type]} action [description]
   * @return {[type]}        [description]
   */
  actionHelper: function actionHelper(action) {
    var id, model;

    jApp.aG().action = action;

    if (jUtility.needsCheckout()) {

      id = jUtility.getCurrentRowId();
      model = jUtility.getActionModel();

      jUtility.checkout(id, model);
    }

    jUtility.setupFormContainer();
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
   * Get the model that the action is action on
   * @method function
   * @return {[type]} [description]
   */
  getActionModel: function getActionModel() {
    if (jUtility.isOtherButtonChecked()) {
      return jUtility.getOtherButtonModel();
    }
    // if (!!jApp.aG().temp && !!jApp.aG().temp.actionModel) {
    //   return jApp.aG().temp.actionModel;
    // }
    return jApp.opts().model;
  }, // end fn

  /**
   * Get the id of the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getOtherButtonId: function getOtherButtonId() {
    return jUtility.getActiveOtherButton().attr('data-id');
  }, // end fn

  /**
   * Get the model of the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getOtherButtonModel: function getOtherButtonModel() {
    return jUtility.getActiveOtherButton().attr('data-model');
  }, // end fn

  /**
   * Get the "other" button that is checked
   * @method function
   * @return {[type]} [description]
   */
  getActiveOtherButton: function getActiveOtherButton() {
    return $('.btn-editOther.active').eq(0);
  }, // end fn

  /**
   * Get current row id
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowId: function getCurrentRowId() {
    // if (!!jApp.aG().temp && jApp.aG().temp.actionId > 0) {
    //   return jApp.aG().temp.actionId;
    // }
    if (jUtility.isOtherButtonChecked()) {
      return jUtility.getOtherButtonId();
    }

    return jUtility.getCheckedItems(true);
  }, //end fn

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
    jApp.aG().html = $.extend(true, {}, require('../templates'), jApp.opts().html);

    jApp.log('2.1 HTML Templates Done');
  }, // end fn

  /**
   * Get the rows that match the header filter text
   * @method function
   * @return {[type]} [description]
   */
  getHeaderFilterMatchedRows: function getHeaderFilterMatchedRows() {
    var currentColumn,
        currentMatches,
        matchedRows = [],
        targetString;

    //iterate through header filters and apply each
    jApp.tbl().find('.header-filter').filter(function () {
      return !!$(this).val().toString().trim().length;
    }).each(function () {

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
    var changes = {};
    _.each(now, function (row, i) {
      if (typeof prev[i] === 'undefined') {
        changes[i] = row;
      } else {
        _.each(row, function (value, prop) {
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
  checkout: function checkout(id, model) {

    if (!model) {
      model = jApp.opts().model;
    }

    jUtility.getJSON({
      url: jApp.routing.get('checkout', model, id), //jApp.prefixURL( '/checkout/_' + jApp.opts().model + '_' + id ),
      success: jUtility.callback.checkout
    });
  }, // end fn

  /**
   * Checkin record
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  checkin: function checkin(id, model) {

    if (!model) {
      model = jUtility.getActionModel();
    }

    jUtility.getJSON({
      url: jApp.routing.get('checkin', model, id), // jApp.prefixURL( '/checkin/_' + jApp.opts().model + '_' + id ),
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
      url: jApp.routing.get('checkedOut', jApp.opts().model), //jApp.prefixURL( '/checkedout/_' + jApp.opts().model ),
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
    ag = $.extend(ag, require('../initParams'));

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

    if (jUtility.isOtherButtonChecked()) {
      return [jUtility.getOtherButtonId()];
    }

    return $('.table-grid').find(selector).map(function (i, elm) {
      return $(elm).closest('.table-row').attr('data-identifier');
    }).get();
  }, // end fn

  /**
   * Get the data objects of the checked items
   * @method function
   * @param  {[type]} includeHidden [description]
   * @return {[type]}               [description]
   */
  getCheckedObjects: function getCheckedObjects(includeHidden) {
    var items = jUtility.getCheckedItems(includeHidden),
        ret = [];

    _.each(items, function (val) {
      ret.push(_.findWhere(jApp.activeGrid.dataGrid.data, { id: val }));
    });

    return ret;
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
  } };

},{"../defaults":64,"../initParams":68,"../templates":80}],76:[function(require,module,exports){
"use strict";

/**
 * intervals.js
 *
 * methods dealing with intervals and timeouts
 */

;module.exports = {

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
  } };

},{}],77:[function(require,module,exports){
'use strict';

/**
 * messaging.js
 *
 * methods dealing with messaging
 */

;module.exports = {
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
    show: function show(message, type, timeout) {
      return noty({
        layout: 'bottomLeft',
        text: message,
        type: type || 'info',
        dismissQueue: true,
        timeout: timeout || 3000
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
      jUtility.msg.show(message, 'error', 10000);
    }, // end fn

    /**
     * Display a warning message
     * @method function
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    warning: function warning(message) {
      jUtility.msg.show(message, 'warning');
    } }
};

},{}],78:[function(require,module,exports){
'use strict';

/**
 * pagination.js
 *
 * methods dealing with pagination
 */
;module.exports = {

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
  } };

},{}],79:[function(require,module,exports){
'use strict';

/**
 * request.js
 *
 * methods dealing with ajax requests
 */
;module.exports = {
  /**
   * Get the data url of the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowDataUrl: function getCurrentRowDataUrl() {
    // use the specified row data url if there is one
    if (typeof jApp.opts().rowDataUrl !== 'undefined') {
      return jApp.prefixURL(jApp.opts().rowDataUrl);
    }
    return jApp.routing.get(jUtility.getActionModel(), jUtility.getCurrentRowId());
  }, //end fn

  /**
   * Get the inspect url of the current row
   * @method function
   * @return {[type]} [description]
   */
  getCurrentRowInspectUrl: function getCurrentRowInspectUrl() {
    return jApp.routing.get('inspect', jUtility.getActionModel(), jUtility.getCurrentRowId());
  }, //end fn

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
   * get the requested url
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  get: function get(requestOptions) {
    var opts = $.extend(true, {
      url: null,
      data: {},
      success: function success() {},
      always: function always() {},
      fail: jUtility.callback.displayResponseErrors,
      complete: function complete() {}
    }, requestOptions);

    jApp.log('6.5 ajax options set, executing ajax request');
    return $.get(opts.url, opts.data, opts.success).fail(opts.fail).always(opts.always).complete(opts.complete);
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
      fail: jUtility.callback.displayResponseErrors,
      always: function always() {},
      complete: function complete() {}
    }, requestOptions);

    jApp.log('6.5 ajax options set, executing ajax request');
    return $.getJSON(opts.url, opts.data, opts.success).fail(opts.fail).always(opts.always).complete(opts.complete);
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
      always: function always() {},
      fail: jUtility.callback.displayResponseErrors,
      complete: function complete() {}
    }, requestOptions);

    return $.ajax({
      url: opts.url,
      data: opts.data,
      success: opts.success,
      type: 'POST',
      dataType: 'json'
    }).fail(opts.fail).always(opts.always).complete(opts.complete);
  }, // end fn

  /**
   * post JSON to upload a file
   * @method function
   * @param  {[type]} requestOptions [description]
   * @return {[type]}                [description]
   */
  postJSONfile: function postJSONfile(requestOptions) {

    // if ( typeof requestOptions.data.append !== 'function' ) {
    //   requestOptions.data = jUtility.prepareFormData( requestOptions.data || {} );
    // }

    var opts = $.extend(true, {
      url: null,
      data: {},
      success: function success() {},
      always: function always() {},
      fail: jUtility.callback.displayResponseErrors,
      complete: function complete() {}
    }, requestOptions);

    return $.ajax({
      url: opts.url,
      data: opts.data,
      success: opts.success,
      type: 'POST',
      dataType: 'json',
      processData: false,
      contentType: false,
      cache: false
    }).fail(opts.fail).always(opts.always).complete(opts.complete);
  }, // end fn

  /**
   * Execute the grid data request
   * @method function
   * @return {[type]} [description]
   */
  executeGridDataRequest: function executeGridDataRequest(search) {
    jApp.log('6.3 Setting up options for the data request');
    var params = $.extend(true, jApp.aG().dataGrid.requestOptions, {
      success: jUtility.callback.update,
      fail: jUtility.gridDataRequestCallback.fail,
      always: !!search ? jUtility.gridDataRequestCallback.search : jUtility.gridDataRequestCallback.always,
      complete: jUtility.gridDataRequestCallback.complete
    }),
        r = jApp.aG().dataGrid.requests;

    jUtility.DOM.clearGridFooter();

    // show the preloader
    jUtility.DOM.activityPreloader('show');

    // execute the request
    jApp.log('6.4 Executing ajax request');

    jUtility.killPendingRequest('gridData');

    r.gridData = jUtility.getJSON(params);
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
      //jUtility.setupIntervals();
    }

    jUtility.clearCountdownInterval();

    jApp.log('6.1 Starting Countdown timer');
    // start the countdown timer

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
    }, // end fn

    /**
     * Execute after grid data search request
     * @method function
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    search: function search(response) {
      jUtility.callback.displayResponseErrors(response);
      if (jUtility.isCaching()) {
        jApp.aG().store.set('data_' + jApp.opts().table, response);
      }
      jUtility.DOM.togglePreloader(true);

      $('#search').focus().val($('#search').val());
    }, // end fn

    /**
     * Grid data request completed
     * @method function
     * @return {[type]} [description]
     */
    complete: function complete() {
      jUtility.DOM.activityPreloader('hide');
      jUtility.countdown();
    } } };

},{}],80:[function(require,module,exports){
"use strict";

/**
 * templates.js
 *
 * html templates
 */

;module.exports = {

  // main grid body
  tmpMainGridBody: "<div class=\"row\">\n                      <div class=\"col-lg-12\">\n                        <div class=\"panel panel-info panel-grid panel-grid1\">\n                          <div class=\"panel-heading\">\n                            <h1 class=\"page-header\"><i class=\"fa {@icon} fa-fw\"></i><span class=\"header-title\"> {@headerTitle} </span></h1>\n                            <div class=\"alert alert-warning alert-dismissible helpText\" role=\"alert\"> <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button> {@helpText} </div>\n                          </div>\n                          <div class=\"panel-body grid-panel-body\">\n                            <div class=\"table-responsive\">\n                              <div class=\"table table-bordered table-grid\">\n                                <div class=\"table-head\">\n                                  <div class=\"table-row table-menu-row\">\n                                    <div class=\"table-header table-menu-header\" style=\"width:100%\">\n                                      <div class=\"btn-group btn-group-sm table-btn-group\">  </div>\n                                    </div>\n                                  </div>\n                                  <div style=\"display:none\" class=\"table-row table-rowMenu-row\"></div>\n                                  <div style=\"display:none\" class=\"table-row table-otherMenu-row\"></div>\n                                  <div class=\"table-row tfilters\" style=\"display:none\">\n                                    <div style=\"width:10px;\" class=\"table-header\">&nbsp;</div>\n                                    <div style=\"width:175px;\" class=\"table-header\" align=\"right\"> <span class=\"label label-info filter-showing\"></span> </div>\n                                  </div>\n                                </div>\n                                <div class=\"table-body\" id=\"tbl_grid_body\">\n                                  <!--{$tbody}-->\n                                </div>\n                                <div class=\"table-foot\">\n                                  <div class=\"row\">\n                                    <div class=\"col-md-3\">\n                                      <div class=\"data-footer-message pull-left\"></div>\n                                      <div style=\"display:none\" class=\"ajax-activity-preloader pull-left\"></div>\n                                      <div class=\"divRowsPerPage pull-right\">\n                                        <select style=\"width:180px;display:inline-block\" type=\"select\" name=\"RowsPerPage\" id=\"RowsPerPage\" class=\"form-control\">\n                                          <option value=\"10\">10</option>\n                                          <option value=\"15\">15</option>\n                                          <option value=\"25\">25</option>\n                                          <option value=\"50\">50</option>\n                                          <option value=\"100\">100</option>\n                                          <option value=\"10000\">All</option>\n                                        </select>\n                                      </div>\n                                    </div>\n                                    <div class=\"col-md-9\">\n\n                                      <div class=\"paging\"></div>\n\n                                    </div>\n                                  </div>\n                                </div>\n                                <!-- /. table-foot -->\n                              </div>\n                            </div>\n                            <!-- /.table-responsive -->\n                          </div>\n                          <!-- /.panel-body -->\n                        </div>\n                        <!-- /.panel -->\n                      </div>\n                      <!-- /.col-lg-12 -->\n                    </div>\n                    <!-- /.row -->\n                    <div id=\"div_inspect\" class=\"div-btn-edit min div-form-panel-wrapper\">\n                      <div class=\"frm_wrapper\">\n                        <form>\n                          <div class=\"panel panel-info\">\n                            <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">×</button> <i class=\"fa fa-info fa-fw\"></i> <span class=\"spn_editFriendlyName\">{@Name}</span> [Inspecting] </div>\n                            <div class=\"panel-overlay\" style=\"display:none\"></div>\n                            <div class=\"panel-body\">\n                                <div class=\"target\"></div>\n                            </div>\n                            <div class=\"panel-btns footer\">\n                              <button type=\"button\" class=\"btn btn-primary btn-formMenu\" id=\"btn_form_menu_heading\"><i class=\"fa fa-fw fa-bars\"></i></button>\n                              <button type=\"button\" class=\"btn btn-primary btn-cancel\" id=\"btn_cancel\"><i class=\"fa fa-fw fa-times\"></i> Close</button>\n                            </div>\n                          </div>\n                        </form>\n                      </div>\n                    </div>",

  // check all checkbox template
  tmpCheckAll: "<label for=\"chk_all\" class=\"btn btn-default pull-right\"> <input id=\"chk_all\" type=\"checkbox\" class=\"chk_all\" name=\"chk_all\"> </label>",

  // header filter clear text button
  tmpClearHeaderFilterBtn: "<span class=\"fa-stack fa-lg\"><i class=\"fa fa-circle-thin fa-stack-2x\"></i><i class=\"fa fa-remove fa-stack-1x\"></i></span>",

  // filter showing ie Showing X / Y Rows
  tmpFilterShowing: "<i class=\"fa fa-filter fa-fw\"></i>{@totalVis} / {@totalRows}",

  // table header sort button
  tmpSortBtn: "<button rel=\"{@ColumnName}\" title=\"{@BtnTitle}\" class=\"btn btn-sm btn-default {@BtnClass} tbl-sort pull-right\" type=\"button\"> <i class=\"fa fa-sort-{@faClass} fa-fw\"></i> </button>",

  // form templates
  forms: {

    // Edit Form Template
    editFrm: "<div id=\"div_editFrm\" class=\"div-btn-edit min div-form-panel-wrapper\">\n                <div class=\"frm_wrapper\">\n                  <div class=\"panel panel-blue\">\n                    <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">×</button> <i class=\"fa fa-pencil fa-fw\"></i> <span class=\"spn_editFriendlyName\">{@Name}</span> [Editing] </div>\n                    <div class=\"panel-overlay\" style=\"display:none\"></div>\n                    <div class=\"panel-body\">\n                      <div class=\"row side-by-side\">\n                        <div class=\"side-by-side editFormContainer formContainer\"> </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>",

    // New Form Template
    newFrm: "<div id=\"div_newFrm\" class=\"div-btn-new min div-form-panel-wrapper\">\n                <div class=\"frm_wrapper\">\n                  <div class=\"panel panel-green\">\n                    <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">×</button> <i class=\"fa fa-plus fa-fw\"></i> New: <span class=\"spn_editFriendlyName\">{@tableFriendly}</span> </div>\n                    <div class=\"panel-overlay\" style=\"display:none\"></div>\n                    <div class=\"panel-body\">\n                      <div class=\"row side-by-side\">\n                        <div class=\"side-by-side newFormContainer formContainer\"> </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>",

    // New Form Template
    newOtherFrm: "<div id=\"div_newFrm\" class=\"div-btn-new min div-form-panel-wrapper\">\n                    <div class=\"frm_wrapper\">\n                      <div class=\"panel panel-info\">\n                        <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">×</button> <i class=\"fa fa-plus fa-fw\"></i> New: <span class=\"spn_editFriendlyName\">{@tableFriendly}</span> </div>\n                        <div class=\"panel-overlay\" style=\"display:none\"></div>\n                        <div class=\"panel-body\">\n                          <div class=\"row side-by-side\">\n                            <div class=\"side-by-side newOtherFormContainer formContainer\"> </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>",

    // Edit Form Template
    editOtherFrm: "<div id=\"div_editFrm\" class=\"div-btn-edit min div-form-panel-wrapper\">\n                    <div class=\"frm_wrapper\">\n                      <div class=\"panel panel-warning\">\n                        <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">×</button> <i class=\"fa fa-plus fa-fw\"></i> Edit: <span class=\"spn_editFriendlyName\">{@tableFriendly}</span> </div>\n                        <div class=\"panel-overlay\" style=\"display:none\"></div>\n                        <div class=\"panel-body\">\n                          <div class=\"row side-by-side\">\n                            <div class=\"side-by-side editOtherFormContainer formContainer\"> </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>",

    // Delete Form Template
    deleteFrm: "<div id=\"div_deleteFrm\" class=\"div-btn-delete min div-form-panel-wrapper\">\n                  <div class=\"frm_wrapper\">\n                    <div class=\"panel panel-red\">\n                      <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\">×</button> <i class=\"fa fa-trash-o fa-fw\"></i> <span class=\"spn_editFriendlyName\"></span> : {@deleteText} </div>\n                      <div class=\"panel-overlay\" style=\"display:none\"></div>\n                      <div class=\"panel-body\">\n                        <div class=\"row side-by-side\">\n                          <div class=\"delFormContainer formContainer\"></div>\n                        </div>\n                      </div>\n                    </div>\n                    </form>\n                  </div>\n                </div>",

    // Colparams Form Template
    colParamFrm: "<div id=\"div_colParamFrm\" class=\"div-btn-other min div-form-panel-wrapper\">\n                    <div class=\"frm_wrapper\">\n                      <div class=\"panel panel-lblue\">\n                        <div class=\"panel-heading\"> <button type=\"button\" class=\"close\" aria-hidden=\"true\" data-original-title=\"\" title=\"\">×</button> <i class=\"fa fa-gear fa-fw\"></i> <span class=\"spn_editFriendlyName\">Form Setup</span> </div>\n                        <div class=\"panel-overlay\" style=\"display:none\"></div>\n                        <div class=\"panel-body\" style=\"padding:0 0px !important;\">\n                          <div class=\"row side-by-side\">\n                            <div class=\"col-lg-3 tbl-list\"></div>\n                            <div class=\"col-lg-2 col-list\"></div>\n                            <div class=\"col-lg-7 param-list\">\n                              <div class=\"side-by-side colParamFormContainer formContainer\"> </div>\n                            </div>\n                          </div>\n                        </div>\n                        <div class=\"panel-heading\"> <input type=\"button\" class=\"btn btn-success btn-save\" id=\"btn_save\" value=\"Save\"> <button type=\"reset\" class=\"btn btn-warning btn-reset\" id=\"btn_reset\">Reset</button> <input type=\"button\" class=\"btn btn-warning btn-refreshForm\" id=\"btn_refresh\" value=\"Refresh Form\"> <input type=\"button\" class=\"btn btn-danger btn-cancel\" id=\"btn_cancel\" value=\"Cancel\"> </div>\n                      </div>\n                    </div>\n                  </div>"
  }
};

},{}],81:[function(require,module,exports){
'use strict';

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
;'use strict';

var $ = (window.$),
    _ = (window._),
    jForm = require('../jForm/jForm.class'),
    jInput = require('../jInput/jInput.class'),
    bootstrap = require('bootstrap');

$.validator = require('@ingenious/jquery-validator');
$.fn.bootpag = require('./vendor/jquery.bootpag');

require('./vendor/jquery.md5')($);
require('noty');

module.exports = $.extend(require('./config/methods/bindings'), require('./config/methods/booleans'), require('./config/methods/callbacks'), require('./config/methods/dom'), require('./config/methods/formatters'), require('./config/methods/forms'), require('./config/methods/grid'), require('./config/methods/intervals'), require('./config/methods/messaging'), require('./config/methods/pagination'), require('./config/methods/request'));

},{"../jForm/jForm.class":48,"../jInput/jInput.class":62,"./config/methods/bindings":69,"./config/methods/booleans":70,"./config/methods/callbacks":71,"./config/methods/dom":72,"./config/methods/formatters":73,"./config/methods/forms":74,"./config/methods/grid":75,"./config/methods/intervals":76,"./config/methods/messaging":77,"./config/methods/pagination":78,"./config/methods/request":79,"./vendor/jquery.bootpag":82,"./vendor/jquery.md5":83,"@ingenious/jquery-validator":2,"bootstrap":3,"noty":17}],82:[function(require,module,exports){
'use strict';

/**
 * @preserve
 * bootpag - jQuery plugin for dynamic pagination
 *
 * Copyright (c) 2015 botmonster@7items.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://botmonster.com/jquery-bootpag/
 *
 * Version:  1.0.7
 *
 */
;module.exports = function (options) {

    var $owner = this,
        settings = $.extend({
        total: 0,
        page: 1,
        maxVisible: null,
        leaps: true,
        href: 'javascript:void(0);',
        hrefVariable: '{{number}}',
        next: '&raquo;',
        prev: '&laquo;',
        firstLastUse: false,
        first: '<span aria-hidden="true">&larr;</span>',
        last: '<span aria-hidden="true">&rarr;</span>',
        wrapClass: 'pagination',
        activeClass: 'active',
        disabledClass: 'disabled',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first'
    }, $owner.data('settings') || {}, options || {});

    if (settings.total <= 0) return this;

    if (!$.isNumeric(settings.maxVisible) && !settings.maxVisible) {
        settings.maxVisible = parseInt(settings.total, 10);
    }

    $owner.data('settings', settings);

    function renderPage($bootpag, page) {

        page = parseInt(page, 10);
        var lp,
            maxV = settings.maxVisible == 0 ? 1 : settings.maxVisible,
            step = settings.maxVisible == 1 ? 0 : 1,
            vis = Math.floor((page - 1) / maxV) * maxV,
            $page = $bootpag.find('li');
        settings.page = page = page < 0 ? 0 : page > settings.total ? settings.total : page;
        $page.removeClass(settings.activeClass);
        lp = page - 1 < 1 ? 1 : settings.leaps && page - 1 >= settings.maxVisible ? Math.floor((page - 1) / maxV) * maxV : page - 1;

        if (settings.firstLastUse) {
            $page.first().toggleClass(settings.disabledClass, page === 1);
        }

        var lfirst = $page.first();
        if (settings.firstLastUse) {
            lfirst = lfirst.next();
        }

        lfirst.toggleClass(settings.disabledClass, page === 1).attr('data-lp', lp).find('a').attr('href', href(lp));

        var step = settings.maxVisible == 1 ? 0 : 1;

        lp = page + 1 > settings.total ? settings.total : settings.leaps && page + 1 < settings.total - settings.maxVisible ? vis + settings.maxVisible + step : page + 1;

        var llast = $page.last();
        if (settings.firstLastUse) {
            llast = llast.prev();
        }

        llast.toggleClass(settings.disabledClass, page === settings.total).attr('data-lp', lp).find('a').attr('href', href(lp));

        $page.last().toggleClass(settings.disabledClass, page === settings.total);

        var $currPage = $page.filter('[data-lp=' + page + ']');

        var clist = "." + [settings.nextClass, settings.prevClass, settings.firstClass, settings.lastClass].join(",.");
        if (!$currPage.not(clist).length) {
            var d = page <= vis ? -settings.maxVisible : 0;
            $page.not(clist).each(function (index) {
                lp = index + 1 + vis + d;
                $(this).attr('data-lp', lp).toggle(lp <= settings.total).find('a').html(lp).attr('href', href(lp));
            });
            $currPage = $page.filter('[data-lp=' + page + ']');
        }
        $currPage.not(clist).addClass(settings.activeClass);
        $owner.data('settings', settings);
    }

    function href(c) {

        return settings.href.replace(settings.hrefVariable, c);
    }

    return this.each(function () {

        var $bootpag,
            lp,
            me = $(this),
            p = ['<ul class="', settings.wrapClass, ' bootpag">'];

        if (settings.firstLastUse) {
            p = p.concat(['<li data-lp="1" class="', settings.firstClass, '"><a href="', href(1), '">', settings.first, '</a></li>']);
        }
        if (settings.prev) {
            p = p.concat(['<li data-lp="1" class="', settings.prevClass, '"><a href="', href(1), '">', settings.prev, '</a></li>']);
        }
        for (var c = 1; c <= Math.min(settings.total, settings.maxVisible); c++) {
            p = p.concat(['<li data-lp="', c, '"><a href="', href(c), '">', c, '</a></li>']);
        }
        if (settings.next) {
            lp = settings.leaps && settings.total > settings.maxVisible ? Math.min(settings.maxVisible + 1, settings.total) : 2;
            p = p.concat(['<li data-lp="', lp, '" class="', settings.nextClass, '"><a href="', href(lp), '">', settings.next, '</a></li>']);
        }
        if (settings.firstLastUse) {
            p = p.concat(['<li data-lp="', settings.total, '" class="last"><a href="', href(settings.total), '">', settings.last, '</a></li>']);
        }
        p.push('</ul>');
        me.find('ul.bootpag').remove();
        me.append(p.join(''));
        $bootpag = me.find('ul.bootpag');

        me.find('li').click(function paginationClick() {

            var me = $(this);
            if (me.hasClass(settings.disabledClass) || me.hasClass(settings.activeClass)) {
                return;
            }
            var page = parseInt(me.attr('data-lp'), 10);
            $owner.find('ul.bootpag').each(function () {
                renderPage($(this), page);
            });

            $owner.trigger('page', page);
        });
        renderPage($bootpag, settings.page);
    });
};

},{}],83:[function(require,module,exports){
"use strict";

/** jQuery md5()
  * Encodes a string in MD5
  * @author Gabriele Romanato <http://blog.gabrieleromanato.com>
  * @requires jQuery 1.4+
  * Usage $.md5(string)
  */
;module.exports = function ($) {

        $.md5 = function (string) {

                function RotateLeft(lValue, iShiftBits) {
                        return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
                }

                function AddUnsigned(lX, lY) {
                        var lX4, lY4, lX8, lY8, lResult;
                        lX8 = lX & 0x80000000;
                        lY8 = lY & 0x80000000;
                        lX4 = lX & 0x40000000;
                        lY4 = lY & 0x40000000;
                        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                        if (lX4 & lY4) {
                                return lResult ^ 0x80000000 ^ lX8 ^ lY8;
                        }
                        if (lX4 | lY4) {
                                if (lResult & 0x40000000) {
                                        return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
                                } else {
                                        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
                                }
                        } else {
                                return lResult ^ lX8 ^ lY8;
                        }
                }

                function F(x, y, z) {
                        return x & y | ~x & z;
                }
                function G(x, y, z) {
                        return x & z | y & ~z;
                }
                function H(x, y, z) {
                        return x ^ y ^ z;
                }
                function I(x, y, z) {
                        return y ^ (x | ~z);
                }

                function FF(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function GG(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function HH(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function II(a, b, c, d, x, s, ac) {
                        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                        return AddUnsigned(RotateLeft(a, s), b);
                };

                function ConvertToWordArray(string) {
                        var lWordCount;
                        var lMessageLength = string.length;
                        var lNumberOfWords_temp1 = lMessageLength + 8;
                        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
                        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                        var lWordArray = Array(lNumberOfWords - 1);
                        var lBytePosition = 0;
                        var lByteCount = 0;
                        while (lByteCount < lMessageLength) {
                                lWordCount = (lByteCount - lByteCount % 4) / 4;
                                lBytePosition = lByteCount % 4 * 8;
                                lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
                                lByteCount++;
                        }
                        lWordCount = (lByteCount - lByteCount % 4) / 4;
                        lBytePosition = lByteCount % 4 * 8;
                        lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
                        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                        return lWordArray;
                };

                function WordToHex(lValue) {
                        var WordToHexValue = "",
                            WordToHexValue_temp = "",
                            lByte,
                            lCount;
                        for (lCount = 0; lCount <= 3; lCount++) {
                                lByte = lValue >>> lCount * 8 & 255;
                                WordToHexValue_temp = "0" + lByte.toString(16);
                                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                        }
                        return WordToHexValue;
                };

                function Utf8Encode(string) {
                        string = string.replace(/\r\n/g, "\n");
                        var utftext = "";

                        for (var n = 0; n < string.length; n++) {

                                var c = string.charCodeAt(n);

                                if (c < 128) {
                                        utftext += String.fromCharCode(c);
                                } else if (c > 127 && c < 2048) {
                                        utftext += String.fromCharCode(c >> 6 | 192);
                                        utftext += String.fromCharCode(c & 63 | 128);
                                } else {
                                        utftext += String.fromCharCode(c >> 12 | 224);
                                        utftext += String.fromCharCode(c >> 6 & 63 | 128);
                                        utftext += String.fromCharCode(c & 63 | 128);
                                }
                        }

                        return utftext;
                };

                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7,
                    S12 = 12,
                    S13 = 17,
                    S14 = 22;
                var S21 = 5,
                    S22 = 9,
                    S23 = 14,
                    S24 = 20;
                var S31 = 4,
                    S32 = 11,
                    S33 = 16,
                    S34 = 23;
                var S41 = 6,
                    S42 = 10,
                    S43 = 15,
                    S44 = 21;

                string = Utf8Encode(string);

                x = ConvertToWordArray(string);

                a = 0x67452301;b = 0xEFCDAB89;c = 0x98BADCFE;d = 0x10325476;

                for (k = 0; k < x.length; k += 16) {
                        AA = a;BB = b;CC = c;DD = d;
                        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                        a = AddUnsigned(a, AA);
                        b = AddUnsigned(b, BB);
                        c = AddUnsigned(c, CC);
                        d = AddUnsigned(d, DD);
                }

                var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

                return temp.toLowerCase();
        };
};

},{}]},{},[1]);

//# sourceMappingURL=terntables-core.js.map

//# sourceMappingURL=terntables.js.map
