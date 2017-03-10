;( function(window, $) {
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
	        let chartSettings = {
	            parseTime : false,
	            element : 'closed-tickets-by-month',
	            data : [
	                { x : 'Jan' },
	                { x : 'Feb' },
	                { x : 'Mar' },
	                { x : 'Apr' },
	                { x : 'May' },
	                { x : 'Jun' },
	                { x : 'Jul' },
	                { x : 'Aug' },
	                { x : 'Sep' },
	                { x : 'Oct' },
	                { x : 'Nov' },
	                { x : 'Dec' },
	        	],
	            xkey : 'x',
	            ykeys : [],
	            labels : []
	        },
	        ykeys = [],
	        today = new Date();


		    // process the chart data
	        _.each(data, (o) => {
	        
	            let d = o.CreatedDate,
                    m = d.getMonth(),
                    y = d.getFullYear();

                // don't add current month
                //if (m == today.getMonth() && y == today.getFullYear()) {return false;}
	            
	            ykeys.push(y);

	            chartSettings.data[m][y] = ( chartSettings.data[m][y] + 1 ) || 1;
	        });

	        // get the ykeys, unique and sorted
	        ykeys = _.uniq( ykeys ).sort();

	        // throw out outliers
	        _.each( chartSettings.data, (row) => {
	        	
	        	for(let year in row)
	        	{
	        		if( year == 'x') continue;
	        		if ( chartSettings.data.length > 800 && row[year] < 20 ) delete row[year]; 
	        	}
	        })

	        // set the labels
	        chartSettings.ykeys = chartSettings.labels = ykeys;
	        
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
	    	let chartSettings = {
	    		element : 'hours-by-customer',
		        data : _.orderBy(
		        	 _.map(
		        		 _.groupBy(data, (o) => { 
		        		 	return ( !! o.Customer_Department && o.Customer_Department != 'null' ) ? o.Customer_Department : '-No Department-'; 
		        		}),
			        	(o, i) => { 
			        		return { 
			        			label : i, 
			        			value : Math.ceil( _.sum( _.map(o, 'TotalTimeWorked') ) / 60 )
			        		}; 
			        	}
        			), o => -o.value).slice(0,10),
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
	    	let chartSettings = {
	    		element : 'tickets-by-customer',
		        data : _.orderBy(
		        	 _.map(
		        		 _.groupBy(data, (o) => { 
		        		 	return ( !! o.Customer_Department && o.Customer_Department != 'null' ) ? o.Customer_Department : '-No Department-'; 
		        		}),
			        	(o, i) => { 
			        		return { 
			        			label : i, 
			        			value : o.length
			        		}; 
			        	}
        			), o => -o.value).slice(0,10),
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
	    	let chartSettings = {
	    		element : 'tickets-by-days-open',
		        data : _.orderBy(
		        		_.map(
		        		 _.countBy(data, (o) => { 
		        		 	if ( o.DaysOpen <= 2 ) return ' 1-2 days'; 
		        		 	if ( o.DaysOpen <= 5 ) return ' 2-5 days'; 
		        		 	if ( o.DaysOpen <= 10 ) return ' 5-10 days'; 
		        		 	if ( o.DaysOpen <= 20 ) return '10-20 days'; 
		        		 	if ( o.DaysOpen <= 50 ) return '20-50 days';
		        		 	return '50+ days';
		        		}),
			        	(o, i) => { 
			        		let percentage = Math.round(100 * o/data.length, 2);
			        		return { 
			        			label : `${i} (${percentage}%)`, 
			        			value : o
			        		}; 
			        	}
    				), o => o.label),
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
	    	let chartSettings = {
	    		element : 'tickets-by-category',
		        data : _.orderBy(
		        		_.map(
		        		 _.countBy(data, (o) => o.Category ),
			        	(o, i) => { 
			        		let percentage = Math.round(100 * o/data.length, 2);
			        		return { 
			        			label : `${i} (${percentage}%)`, 
			        			tickets : o
			        		}; 
			        	}
    				), o => -o.tickets).slice(0,10),
		        xkey : 'label',
		        ykeys : ['tickets'],
		        labels : 'Tickets',
		        resize : true,
		        stacked : true,
		        //gridTextSize : 11,
		        //xLabelAngle : 15

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
	    	let chartSettings = {
	    		element : 'hours-by-category',
		        data : _.orderBy(
		        		_.map(
		        		 _.groupBy(data, (o) => o.Category ),
			        	(o, i) => { 
			        		return { 
			        			label : i, 
			        			hours : Math.ceil( _.sum( _.map(o,'TotalTimeWorked') ) / 60 )
			        		}; 
			        	}
    				), o => -o.hours).slice(0,10),
		        xkey : 'label',
		        ykeys : ['hours'],
		        labels : 'Hours',
		        resize : true,
		        stacked : true,
		        //gridTextSize : 11,
		        //xLabelAngle : 15

	    	};
	    	
	    	Morris.Bar(chartSettings);
	    }

	}
})(window, jQuery);
	