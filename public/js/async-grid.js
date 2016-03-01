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
},{"./jApp/jApp.class":44,"./jForm/jForm.class":47,"./jGrid/jGrid.class":48,"./jInput/jInput.class":61,"./jUtility/jUtility.class":80}],2:[function(require,module,exports){
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
			'IPV4'			: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
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
!function(root, factory) {
	 if (typeof define === 'function' && define.amd) {
		 define(['jquery'], factory);
	 } else if (typeof exports === 'object') {
		 module.exports = factory($);
	 } else {
		 factory(root.jQuery);
	 }
}(this, function($) {

/*!
 @package noty - jQuery Notification Plugin
 @version version: 2.3.7
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
                options.themeClassName = this.options.theme;

            delete options.layout;
            delete options.theme;

            this.options = $.extend({}, this.options, this.options.layout.options);
            this.options.id = 'noty_' + (new Date().getTime() * Math.floor(Math.random() * 1000000));

            this.options = $.extend({}, this.options, options);

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

},{}],17:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = require('./src/js/adaptor/jquery');

},{"./src/js/adaptor/jquery":18}],18:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('../main')
  , psInstances = require('../plugin/instances');

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

      return jQuery(this);
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

},{"../main":24,"../plugin/instances":35}],19:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
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

},{}],20:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
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

},{}],21:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
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

},{}],22:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
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

},{}],23:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('./class')
  , d = require('./dom');

exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

exports.clone = function (obj) {
  if (obj === null) {
    return null;
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = this.clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = this.clone(original);
  for (var key in source) {
    result[key] = this.clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return d.matches(el, "input,[contenteditable]") ||
         d.matches(el, "select,[contenteditable]") ||
         d.matches(el, "textarea,[contenteditable]") ||
         d.matches(el, "button,[contenteditable]");
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
  return this.toInt(d.css(element, 'width')) +
         this.toInt(d.css(element, 'paddingLeft')) +
         this.toInt(d.css(element, 'paddingRight')) +
         this.toInt(d.css(element, 'borderLeftWidth')) +
         this.toInt(d.css(element, 'borderRightWidth'));
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

},{"./class":19,"./dom":20}],24:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var destroy = require('./plugin/destroy')
  , initialize = require('./plugin/initialize')
  , update = require('./plugin/update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};

},{"./plugin/destroy":26,"./plugin/initialize":34,"./plugin/update":38}],25:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

module.exports = {
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  stopPropagationOnClick: true,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  useBothWheelAxes: false,
  useKeyboard: true,
  useSelectionScroll: false,
  wheelPropagation: false,
  wheelSpeed: 1
};

},{}],26:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  d.remove(i.scrollbarX);
  d.remove(i.scrollbarY);
  d.remove(i.scrollbarXRail);
  d.remove(i.scrollbarYRail);
  h.removePsClasses(element);

  instances.remove(element);
};

},{"../lib/dom":20,"../lib/helper":23,"./instances":35}],27:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

function bindClickRailHandler(element, i) {
  function pageOffset(el) {
    return el.getBoundingClientRect();
  }
  var stopPropagation = window.Event.prototype.stopPropagation.bind;

  if (i.settings.stopPropagationOnClick) {
    i.event.bind(i.scrollbarY, 'click', stopPropagation);
  }
  i.event.bind(i.scrollbarYRail, 'click', function (e) {
    var halfOfScrollbarLength = h.toInt(i.scrollbarYHeight / 2);
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
    var halfOfScrollbarLength = h.toInt(i.scrollbarXWidth / 2);
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

},{"../../lib/helper":23,"../instances":35,"../update-geometry":36,"../update-scroll":37}],28:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../../lib/dom')
  , h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

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

    var scrollLeft = h.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
    updateScroll(element, 'left', scrollLeft);
  }

  var mouseMoveHandler = function (e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    h.stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function (e) {
    currentPageX = e.pageX;
    currentLeft = h.toInt(d.css(i.scrollbarX, 'left')) * i.railXRatio;
    h.startScrolling(element, 'x');

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

    var scrollTop = h.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
    updateScroll(element, 'top', scrollTop);
  }

  var mouseMoveHandler = function (e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(element);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function () {
    h.stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function (e) {
    currentPageY = e.pageY;
    currentTop = h.toInt(d.css(i.scrollbarY, 'top')) * i.railYRatio;
    h.startScrolling(element, 'y');

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

},{"../../lib/dom":20,"../../lib/helper":23,"../instances":35,"../update-geometry":36,"../update-scroll":37}],29:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

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

    if (!hovered) {
      return;
    }

    var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      // go deeper if element is a webcomponent
      while (activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }
      if (h.isEditable(activeElement)) {
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

},{"../../lib/helper":23,"../instances":35,"../update-geometry":36,"../update-scroll":37}],30:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

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

  function shouldBeConsumedByTextarea(deltaX, deltaY) {
    var hoveredTextarea = element.querySelector('textarea:hover');
    if (hoveredTextarea) {
      var maxScrollTop = hoveredTextarea.scrollHeight - hoveredTextarea.clientHeight;
      if (maxScrollTop > 0) {
        if (!(hoveredTextarea.scrollTop === 0 && deltaY > 0) &&
            !(hoveredTextarea.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      var maxScrollLeft = hoveredTextarea.scrollLeft - hoveredTextarea.clientWidth;
      if (maxScrollLeft > 0) {
        if (!(hoveredTextarea.scrollLeft === 0 && deltaX < 0) &&
            !(hoveredTextarea.scrollLeft === maxScrollLeft && deltaX > 0)) {
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

    if (shouldBeConsumedByTextarea(deltaX, deltaY)) {
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

},{"../instances":35,"../update-geometry":36,"../update-scroll":37}],31:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};

},{"../instances":35,"../update-geometry":36}],32:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var h = require('../../lib/helper')
  , instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

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
    h.stopScrolling(element);
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
        h.startScrolling(element, 'x');
      } else if (mousePosition.x > containerGeometry.right - 3) {
        scrollDiff.left = 5;
        h.startScrolling(element, 'x');
      } else {
        scrollDiff.left = 0;
      }

      if (mousePosition.y < containerGeometry.top + 3) {
        if (containerGeometry.top + 3 - mousePosition.y < 5) {
          scrollDiff.top = -5;
        } else {
          scrollDiff.top = -20;
        }
        h.startScrolling(element, 'y');
      } else if (mousePosition.y > containerGeometry.bottom - 3) {
        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
          scrollDiff.top = 5;
        } else {
          scrollDiff.top = 20;
        }
        h.startScrolling(element, 'y');
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

},{"../../lib/helper":23,"../instances":35,"../update-geometry":36,"../update-scroll":37}],33:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateScroll = require('../update-scroll');

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

module.exports = function (element, supportsTouch, supportsIePointer) {
  var i = instances.get(element);
  bindTouchHandler(element, i, supportsTouch, supportsIePointer);
};

},{"../instances":35,"../update-geometry":36,"../update-scroll":37}],34:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry');

// Handlers
var clickRailHandler = require('./handler/click-rail')
  , dragScrollbarHandler = require('./handler/drag-scrollbar')
  , keyboardHandler = require('./handler/keyboard')
  , mouseWheelHandler = require('./handler/mouse-wheel')
  , nativeScrollHandler = require('./handler/native-scroll')
  , selectionHandler = require('./handler/selection')
  , touchHandler = require('./handler/touch');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = h.extend(i.settings, userSettings);

  clickRailHandler(element);
  dragScrollbarHandler(element);
  mouseWheelHandler(element);
  nativeScrollHandler(element);

  if (i.settings.useSelectionScroll) {
    selectionHandler(element);
  }

  if (h.env.supportsTouch || h.env.supportsIePointer) {
    touchHandler(element, h.env.supportsTouch, h.env.supportsIePointer);
  }
  if (i.settings.useKeyboard) {
    keyboardHandler(element);
  }

  updateGeometry(element);
};

},{"../lib/class":19,"../lib/helper":23,"./handler/click-rail":27,"./handler/drag-scrollbar":28,"./handler/keyboard":29,"./handler/mouse-wheel":30,"./handler/native-scroll":31,"./handler/selection":32,"./handler/touch":33,"./instances":35,"./update-geometry":36}],35:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , defaultSettings = require('./default-setting')
  , EventManager = require('../lib/event-manager')
  , guid = require('../lib/guid')
  , h = require('../lib/helper');

var instances = {};

function Instance(element) {
  var i = this;

  i.settings = h.clone(defaultSettings);
  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = d.css(element, 'direction') === "rtl";
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

  i.scrollbarXRail = d.appendTo(d.e('div', 'ps-scrollbar-x-rail'), element);
  i.scrollbarX = d.appendTo(d.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
  i.scrollbarX.setAttribute('tabindex', 0);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = h.toInt(d.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : h.toInt(d.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth = h.toInt(d.css(i.scrollbarXRail, 'borderLeftWidth')) + h.toInt(d.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  d.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
  d.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = d.appendTo(d.e('div', 'ps-scrollbar-y-rail'), element);
  i.scrollbarY = d.appendTo(d.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
  i.scrollbarY.setAttribute('tabindex', 0);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = h.toInt(d.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : h.toInt(d.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? h.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth = h.toInt(d.css(i.scrollbarYRail, 'borderTopWidth')) + h.toInt(d.css(i.scrollbarYRail, 'borderBottomWidth'));
  d.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));
  d.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  if (typeof element.dataset === 'undefined') {
    return element.getAttribute('data-ps-id');
  } else {
    return element.dataset.psId;
  }
}

function setId(element, id) {
  if (typeof element.dataset === 'undefined') {
    element.setAttribute('data-ps-id', id);
  } else {
    element.dataset.psId = id;
  }
}

function removeId(element) {
  if (typeof element.dataset === 'undefined') {
    element.removeAttribute('data-ps-id');
  } else {
    delete element.dataset.psId;
  }
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

},{"../lib/dom":20,"../lib/event-manager":21,"../lib/guid":22,"../lib/helper":23,"./default-setting":25}],36:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateScroll = require('./update-scroll');

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
  d.css(i.scrollbarXRail, xRailOffset);

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
  d.css(i.scrollbarYRail, yRailOffset);

  d.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
  d.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
}

module.exports = function (element) {
  var i = instances.get(element);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  var existingRails;
  if (!element.contains(i.scrollbarXRail)) {
    existingRails = d.queryChildren(element, '.ps-scrollbar-x-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        d.remove(rail);
      });
    }
    d.appendTo(i.scrollbarXRail, element);
  }
  if (!element.contains(i.scrollbarYRail)) {
    existingRails = d.queryChildren(element, '.ps-scrollbar-y-rail');
    if (existingRails.length > 0) {
      existingRails.forEach(function (rail) {
        d.remove(rail);
      });
    }
    d.appendTo(i.scrollbarYRail, element);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, h.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
    i.scrollbarXLeft = h.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(i, h.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
    i.scrollbarYTop = h.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
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

},{"../lib/class":19,"../lib/dom":20,"../lib/helper":23,"./instances":35,"./update-scroll":37}],37:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('./instances');

var upEvent = document.createEvent('Event')
  , downEvent = document.createEvent('Event')
  , leftEvent = document.createEvent('Event')
  , rightEvent = document.createEvent('Event')
  , yEvent = document.createEvent('Event')
  , xEvent = document.createEvent('Event')
  , xStartEvent = document.createEvent('Event')
  , xEndEvent = document.createEvent('Event')
  , yStartEvent = document.createEvent('Event')
  , yEndEvent = document.createEvent('Event')
  , lastTop
  , lastLeft;

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
    element.scrollTop = 0;
    element.dispatchEvent(yStartEvent);
    return; // don't allow negative scroll
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = 0;
    element.dispatchEvent(xStartEvent);
    return; // don't allow negative scroll
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    element.scrollTop = i.contentHeight - i.containerHeight;
    element.dispatchEvent(yEndEvent);
    return; // don't allow scroll past container
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    element.scrollLeft = i.contentWidth - i.containerWidth;
    element.dispatchEvent(xEndEvent);
    return; // don't allow scroll past container
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

},{"./instances":35}],38:[function(require,module,exports){
/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry')
  , updateScroll = require('./update-scroll');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

  // Recalculate rail margins
  d.css(i.scrollbarXRail, 'display', 'block');
  d.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  d.css(i.scrollbarXRail, 'display', 'none');
  d.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  d.css(i.scrollbarXRail, 'display', '');
  d.css(i.scrollbarYRail, 'display', '');
};

},{"../lib/dom":20,"../lib/helper":23,"./instances":35,"./update-geometry":36,"./update-scroll":37}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{"./colparams":40}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{"./config/cellTemplates":39,"./config/defaults":41,"./config/methods":42,"./config/routing":43,"./jStorage/jstorage":45}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{"./config/defaults":46}],48:[function(require,module,exports){
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
			jUtility.setupIntervals();

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

},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
'use strict';

/**
 * Allowed column parameters by input type
 * @type {Object}
 */
module.exports = {
  radio: ['_labelssource', '_optionssource', '_optionsfilter'],
  select: ['_firstoption', '_firstlabel', '_labelssource', '_optionssource', '_optionsfilter']
};

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
'use strict';

/**
 * Disallowed column parameters by input type
 * @type {Object}
 */
module.exports = {
  hidden: ['_label', 'onClick', 'onChange']
};

},{}],53:[function(require,module,exports){
'use strict';

/**
 * Globally allowed attributes
 * @type {Array}
 */
module.exports = ['accesskey', 'class', 'contenteditable', 'contextmenu', 'dir', 'draggable', 'dropzone', 'hidden', 'id', 'lang', 'lang', 'spellcheck', 'style', 'tabindex', 'title', 'translate', 'data-validType', 'readonly', 'required', 'onClick', 'onChange', 'form'];

},{}],54:[function(require,module,exports){
'use strict';

/**
 * Globally allowed column parameters
 * @type {Array}
 */
module.exports = ['_enabled', '_label', 'data-fieldset', 'data-ordering', 'data-validType-template', 'type'];

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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
          console.log(' --tokens', _.pluck(value, 'name'));
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

},{"../allowedAttributes":49,"../allowedColParams":50,"../defaults":51,"../disallowedColParams":52,"../globalAttributes":53,"../globalColParams":54}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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

},{}],61:[function(require,module,exports){
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

},{"./config/methods/arrayInputs":55,"./config/methods/factory":56,"./config/methods/input":57,"./config/methods/multiselect":58,"./config/methods/options":59,"./config/methods/toggles":60,"./vendor/bootstrap-multiselect":62,"perfect-scrollbar/jquery":17}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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
      jApp.aG().$().find('.chk_cid').prop('checked', $(this).prop('checked'));
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

},{}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{"../formBindings":64,"../gridBindings":66}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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
      console.log('loaded');
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

      console.log('response', response);
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

},{}],71:[function(require,module,exports){
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
      console.log('loading...');

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
          appendTD = false;

      if (!!jApp.aG().dataGrid.delta[0] && jApp.aG().dataGrid.delta[0][jApp.opts().pkey] === 'NoData') {
        var tr = $('<div/>', { class: 'table-row tr-no-data' }).append($('<div/>', { class: 'table-cell' }).html('No Data'));

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

},{}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
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
      console.log('checking in record');
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

    console.log('formData', formData);

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

},{"../forms":65}],74:[function(require,module,exports){
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

},{"../defaults":63,"../initParams":67,"../templates":79}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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
    } } };

},{}],79:[function(require,module,exports){
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

},{}],80:[function(require,module,exports){
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

},{"../jForm/jForm.class":47,"../jInput/jInput.class":61,"./config/methods/bindings":68,"./config/methods/booleans":69,"./config/methods/callbacks":70,"./config/methods/dom":71,"./config/methods/formatters":72,"./config/methods/forms":73,"./config/methods/grid":74,"./config/methods/intervals":75,"./config/methods/messaging":76,"./config/methods/pagination":77,"./config/methods/request":78,"./vendor/jquery.bootpag":81,"./vendor/jquery.md5":82,"@ingenious/jquery-validator":2,"bootstrap":3,"noty":16}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

//# sourceMappingURL=async-grid.js.map

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
}

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
}

String.prototype.ucwords = function() {
    return this.toString().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//# sourceMappingURL=async-grid.js.map
