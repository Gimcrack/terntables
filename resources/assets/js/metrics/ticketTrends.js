;( function(window, $) {

	var _ = require('lodash');
	var moment = require('moment');

	var _urlParams = function(url) {

	  // get query string from url (optional) or window
	  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	  // we'll store the parameters here
	  var obj = {};

	  // if query string exists
	  if (queryString) {

	    // stuff after # is not part of query string, so get rid of it
	    queryString = queryString.split('#')[0];

	    // split our query string into its component parts
	    var arr = queryString.split('&');

	    for (var i=0; i<arr.length; i++) {
	      // separate the keys and the values
	      var a = arr[i].split('=');

	      // in case params look like: list[]=thing1&list[]=thing2
	      var paramNum = undefined;
	      var paramName = a[0].replace(/\[\d*\]/, function(v) {
	        paramNum = v.slice(1,-1);
	        return '';
	      });

	      // set parameter value (use 'true' if empty)
	      var paramValue = typeof(a[1])==='undefined' ? true : decodeURI(a[1]);

	      // (optional) keep case consistent
	      paramName = paramName.toLowerCase();
	      paramValue = paramValue.toLowerCase();

	      // if parameter name already exists
	      if (obj[paramName]) {
	        // convert value to array (if still string)
	        if (typeof obj[paramName] === 'string') {
	          obj[paramName] = [obj[paramName]];
	        }
	        // if no array index number specified...
	        if (typeof paramNum === 'undefined') {
	          // put the value on the end of the array
	          obj[paramName].push(paramValue);
	        }
	        // if array index number specified...
	        else {
	          // put the value at that index number
	          obj[paramName][paramNum] = paramValue;
	        }
	      }
	      // if param name doesn't exist yet, set it
	      else {
	        obj[paramName] = paramValue;
	      }
	    }
	  }

	  return obj;
	}

	window._get = _urlParams();

	window.ticketTrends = function(params) {

	    var base = '/metrics/tickets/trends/json/',
	    	url = base + params.filter(e => e).join('/');

	    $.ajaxSetup({
	        converters: {
	        	'text json': $.parseJSON
	        }
	    });

	    $.getJSON( url, (response) => process(response.data) );

	    /**
	     * Process the data obtained from the api
	     *
	     * @param      {<type>}  data    The data
	     */
	    let process = function( data )
	    {
	    	// ignore some categories
	    	if ( !! _get.ignore ) {
	    		data = _(data).reject( o => {
	    			if( ! o.Category ) return false;
	    			return _get.ignore.split('|').some( cat => cat.toLowerCase() == o.Category.toLowerCase() );
	    		}).value();

	    		console.dir(data);
	    	}

	    	chart1(data);
	    	chart2(data);
	    	chart3(data);
	    	chart4(data);
	    	chart5(data);
	    	chart6(data);
	    	$('.preloader').hide();
	    }

	    /**
	     * Closed Tickets By Month
	     *
	     * @param      {<type>}  data    The data
	     */
	    let chart1 = function(data)
	    {
	    	let today = new Date(),

        	ykeys = _(data).map( o => o.CreatedDate.getFullYear() ).uniq().value().sort(),

	    	fn_counting = o => o.CreatedDate.getFullYear(),

	    	chartSettings = {
	            parseTime : false,
	            element : 'closed-tickets-by-month',
	            data : _(data)
	            	// reject tickets from this month
	            	.reject( o => {
	            		return ( o.CreatedDate.getMonth() == today.getMonth() ) &&
		            	( o.CreatedDate.getFullYear() == today.getFullYear() )
	            	})
	            	// group by month and year
	            	.groupBy( o => o.CreatedDate.getMonth() + ' ' + o.CreatedDate.getFullYear() )
	            	// reject months with low ticket numbers if we have a lot of data
	            	.reject( o => o.length < 20 && data.length > 800 )
	            	// ungroup from previous operation
	            	.values()
	            	// bring it back to one level array of objects
	            	.flatten()
	            	// group by month
	            	.groupBy( o => o.CreatedDate.getMonth() )
	            	// count by year
	            	.map( (o, i) => _(o).countBy(fn_counting).extend({ x : moment(new Date(2000,i,1)).format("MMM") }).value() )
	            	// get the data
	            	.value(),
	            xkey : 'x',
	            ykeys : ykeys,
	            labels : ykeys,
	            resize : true,
		        stacked : true,
	        };

	        // display the chart
	        Morris.Line(chartSettings);

	        chartSettings.element = 'closed-tickets-by-month-bar';

	        Morris.Bar( chartSettings );
	    }

	    /**
	     * Hours By Customer
	     *
	     * @param      {<type>}  data    The data
	     */
	    let chart2 = function(data)
	    {
	    	let fn_grouping = (o) => {

	    		return ( !! o.Customer_Department && o.Customer_Department != 'null' ) ?
	    			o.Customer_Department :
	    			'-No Department-';

	    	},	fn_mapping = (o, i) => {

	    		return {
	    			label : i,
				    value : Math.ceil( _(o).sumBy('TotalTimeWorked') / 60 )
				};

			},	chartSettings = {
	    		element : 'hours-by-customer',
		        data : _(data)
		        		.groupBy( fn_grouping )
		        		.map( fn_mapping )
	        			.orderBy(o => -o.value)
	        			.value()
	        			.slice(0,10),
		        resize : true,
	    	};

	    	Morris.Donut(chartSettings);
	    }

	    /**
	     * Tickets By Customer
	     *
	     * @param      {<type>}  data    The data
	     */
	    let chart3 = function(data)
	    {
	    	let fn_grouping = (o) =>
	    	{
	    		return ( !! o.Customer_Department && o.Customer_Department != 'null' ) ?
	    			o.Customer_Department :
	    			'-No Department-';
	    	},

	    	fn_mapping = (o, i) =>
	    	{
        		return {
        			label : i,
        			value : o.length
        		};
	        },

	    	chartSettings = {
	    		element : 'tickets-by-customer',
		        data : _(data)
		        		.groupBy( fn_grouping )
		        		.map( fn_mapping )
		        		.orderBy( o => -o.value )
		        		.value()
		        		.slice(0,10),
		        resize : true,
	    	};

	    	Morris.Donut(chartSettings);
	    }

	    /**
	     * Tickets By Days Open
	     *
	     * @param      {<type>}  data    The data
	     */
	    let chart4 = function(data)
	    {
	    	let fn_counting = (o) =>
	    	{
	    		if ( o.DaysOpen <= 2 )  return ' 1-2 days';
    		 	if ( o.DaysOpen <= 5 )  return ' 2-5 days';
    		 	if ( o.DaysOpen <= 10 ) return ' 5-10 days';
    		 	if ( o.DaysOpen <= 20 ) return '10-20 days';
    		 	if ( o.DaysOpen <= 50 ) return '20-50 days';
    		 	return '50+ days';
	    	},

	    	fn_mapping = (o, i) =>
	    	{
        		let percentage = Math.round( ( 100 * o ) / data.length, 2);

        		return {
        			label : `${i} (${percentage}%)`,
        			value : o
        		};
        	},

	    	chartSettings = {
	    		element : 'tickets-by-days-open',
		        data : _(data)
		        		.countBy( fn_counting )
		        		.map( fn_mapping )
		        		.orderBy( o => o.label )
		        		.value(),
		        resize : true,
	    	};

	    	Morris.Donut(chartSettings);
	    }

	    /**
	     * Tickets By Category
	     *
	     * @param      {<type>}  data    The data
	     */
	    let chart5 = function(data)
	    {
	    	let fn_counting = o => o.Category,

	    	fn_mapping = (o, i) =>
	    	{
        		let percentage = Math.round( ( 100 * o ) / data.length, 2);

        		return {
        			label : `${i} (${percentage}%)`,
        			tickets : o
        		};
        	},

	    	chartSettings = {
	    		element : 'tickets-by-category',
		        data : _(data)
		        		.countBy( fn_counting )
		        		.map( fn_mapping )
		        		.orderBy( o => -o.tickets )
		        		.value()
		        		.slice(0,10),
		        xkey : 'label',
		        ykeys : ['tickets'],
		        labels : 'Tickets',
		        resize : true,
		        stacked : true,
	    	};

	    	Morris.Bar(chartSettings);
	    }

	    /**
	     * Hours By Category
	     *
	     * @param      {<type>}  data    The data
	     */
	    let chart6 = function(data)
	    {

	    	let fn_grouping = o => o.Category,

	    	fn_mapping = (o, i) =>
	    	{
        		return {
        			label : i,
        			hours : Math.ceil( _(o).sumBy('TotalTimeWorked') / 60 )
        		};
	        },

	    	chartSettings = {
	    		element : 'hours-by-category',
		        data : _(data)
		        		.groupBy( fn_grouping )
		        		.map( fn_mapping )
		        		.orderBy( o => -o.hours )
		        		.value()
		        		.slice(0,10),
		        xkey : 'label',
		        ykeys : ['hours'],
		        labels : 'Hours',
		        resize : true,
		        stacked : true,
	    	};

	    	Morris.Bar(chartSettings);
	    }

	}
})(window, jQuery);

