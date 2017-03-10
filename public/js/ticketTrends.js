(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

;(function (window, $) {
	window.ticketTrends = function (params) {

		var base = '/metrics/tickets/trends/json/',
		    url = base + params.filter(function (e) {
			return e;
		}).join('/');

		$.ajaxSetup({
			converters: {
				'text json': $.parseJSON
			}
		});

		$.getJSON(url, function (response) {
			return process(response.data);
		});

		/**
   * Process the data obtained from the api
   *
   * @param      {<type>}  data    The data
   */
		var process = function process(data) {
			chart1(data);
			chart2(data);
			chart3(data);
			chart4(data);
			chart5(data);
			chart6(data);
			$('.preloader').hide();
		};

		/**
   * Closed Tickets By Month
   *
   * @param      {<type>}  data    The data
   */
		var chart1 = function chart1(data) {
			var chartSettings = {
				parseTime: false,
				element: 'closed-tickets-by-month',
				data: [{ x: 'Jan' }, { x: 'Feb' }, { x: 'Mar' }, { x: 'Apr' }, { x: 'May' }, { x: 'Jun' }, { x: 'Jul' }, { x: 'Aug' }, { x: 'Sep' }, { x: 'Oct' }, { x: 'Nov' }, { x: 'Dec' }],
				xkey: 'x',
				ykeys: [],
				labels: []
			},
			    ykeys = [],
			    today = new Date();

			// process the chart data
			_.each(data, function (o) {

				var d = o.CreatedDate,
				    m = d.getMonth(),
				    y = d.getFullYear();

				// don't add current month
				//if (m == today.getMonth() && y == today.getFullYear()) {return false;}

				ykeys.push(y);

				chartSettings.data[m][y] = chartSettings.data[m][y] + 1 || 1;
			});

			// get the ykeys, unique and sorted
			ykeys = _.uniq(ykeys).sort();

			// throw out outliers
			_.each(chartSettings.data, function (row) {

				for (var year in row) {
					if (year == 'x') continue;
					if (chartSettings.data.length > 2000 && row[year] < 20) delete row[year];
				}
			});

			// set the labels
			chartSettings.ykeys = chartSettings.labels = ykeys;

			// display the chart
			Morris.Line(chartSettings);
		};

		/**
   * Hours By Customer
   *
   * @param      {<type>}  data    The data
   */
		var chart2 = function chart2(data) {
			var chartSettings = {
				element: 'hours-by-customer',
				data: _.orderBy(_.map(_.groupBy(data, function (o) {
					return !!o.Customer_Department && o.Customer_Department != 'null' ? o.Customer_Department : '-No Department-';
				}), function (o, i) {
					return {
						label: i,
						value: Math.ceil(_.sum(_.map(o, 'TotalTimeWorked')) / 60)
					};
				}), function (o) {
					return -o.value;
				}).slice(0, 10),
				resize: true
			};

			Morris.Donut(chartSettings);
		};

		/**
   * Tickets By Customer
   *
   * @param      {<type>}  data    The data
   */
		var chart3 = function chart3(data) {
			var chartSettings = {
				element: 'tickets-by-customer',
				data: _.orderBy(_.map(_.groupBy(data, function (o) {
					return !!o.Customer_Department && o.Customer_Department != 'null' ? o.Customer_Department : '-No Department-';
				}), function (o, i) {
					return {
						label: i,
						value: o.length
					};
				}), function (o) {
					return -o.value;
				}).slice(0, 10),
				resize: true
			};

			Morris.Donut(chartSettings);
		};

		/**
   * Tickets By Days Open
   *
   * @param      {<type>}  data    The data
   */
		var chart4 = function chart4(data) {
			var chartSettings = {
				element: 'tickets-by-days-open',
				data: _.orderBy(_.map(_.countBy(data, function (o) {
					if (o.DaysOpen <= 2) return ' 1-2 days';
					if (o.DaysOpen <= 5) return ' 2-5 days';
					if (o.DaysOpen <= 10) return ' 5-10 days';
					if (o.DaysOpen <= 20) return '10-20 days';
					if (o.DaysOpen <= 50) return '20-50 days';
					return '50+ days';
				}), function (o, i) {
					var percentage = Math.round(100 * o / data.length, 2);
					return {
						label: i + ' (' + percentage + '%)',
						value: o
					};
				}), function (o) {
					return o.label;
				}),
				resize: true
			};

			Morris.Donut(chartSettings);
		};

		/**
   * Tickets By Category
   *
   * @param      {<type>}  data    The data
   */
		var chart5 = function chart5(data) {
			var chartSettings = {
				element: 'tickets-by-category',
				data: _.orderBy(_.map(_.countBy(data, function (o) {
					return o.Category;
				}), function (o, i) {
					var percentage = Math.round(100 * o / data.length, 2);
					return {
						label: i + ' (' + percentage + '%)',
						tickets: o
					};
				}), function (o) {
					return -o.tickets;
				}).slice(0, 10),
				xkey: 'label',
				ykeys: ['tickets'],
				labels: 'Tickets',
				resize: true,
				stacked: true
			};

			Morris.Bar(chartSettings);
		};

		/**
   * Hours By Category
   *
   * @param      {<type>}  data    The data
   */
		var chart6 = function chart6(data) {
			var chartSettings = {
				element: 'hours-by-category',
				data: _.orderBy(_.map(_.groupBy(data, function (o) {
					return o.Category;
				}), function (o, i) {
					return {
						label: i,
						hours: Math.ceil(_.sum(_.map(o, 'TotalTimeWorked')) / 60)
					};
				}), function (o) {
					return -o.hours;
				}).slice(0, 10),
				xkey: 'label',
				ykeys: ['hours'],
				labels: 'Hours',
				resize: true,
				stacked: true
			};

			Morris.Bar(chartSettings);
		};
	};
})(window, jQuery);

},{}]},{},[1]);

//# sourceMappingURL=ticketTrends.js.map
