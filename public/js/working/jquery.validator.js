/**
 *  jquery.validator.js - Custom Form Validation JS class
 *
 *  Client-side form validation class
 *
 *  Jeremy Bloomstrom | jeremy@in.genio.us
 *
 */
;(function($,window) {


	'use strict';
	var validator = function(frm) {


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

	}; // end validator class

	window.validator = validator;

})($,window); // end closure
