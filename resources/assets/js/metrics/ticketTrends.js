;( function(window, $) {

	var _ = require('lodash');
	var moment = require('moment');

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
	            labels : ykeys
	        }; 

	        // display the chart
	        Morris.Line(chartSettings);
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
	