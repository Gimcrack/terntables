<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css">

    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.js"></script>

    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.2.0/lodash.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.js"></script>

  </head>

  <body>
      <div class="col-lg-3">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Open Incidents By Customer - BI Team
          </div>
          <div class="panel-body">
            <div id="donut-chart-incidents-by-customer-department"></div>
          </div>

        </div>
      </div>
      <div class="col-lg-9">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Open Incidents By Month Created - BI Team
          </div>
          <div class="panel-body">
            <div id="bar-chart-incidents-by-month-created"></div>
          </div>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Open Incidents By Rep & Status - BI Team
          </div>
          <div class="panel-body">
            <div id="bar-chart-incidents-by-rep-and-status-1"></div>
            <hr/>
            <div id="bar-chart-incidents-by-rep-and-status-2"></div>
          </div>

        </div>
      </div>


    <script type="text/javascript">

          $.getJSON('http://isupport/Api/v14-5/Incident/Group/BI%20Team', function(response){

            // prepare the data

            var barChartData1 = _.map(
              _.groupBy(response.data, 'assignee'),
              function(o, i) {
                return _.extend( _.countBy( o, 'status' ), { label : i } );
              });

            Morris.Bar({
             element : 'bar-chart-incidents-by-rep-and-status-1',
             data : barChartData1.slice(0,5),
             xkey : 'label',
             ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
             labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
             resize : true,
           });

           Morris.Bar({
             element : 'bar-chart-incidents-by-rep-and-status-2',
             data : barChartData1.slice(5),
             xkey : 'label',
             ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
             labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
             resize : true,
           });

            var donutChartData1 = _.map(
              _.groupBy(response.data, 'department' ),
              function(o, i) {
                return { label : i || '-No Department-', value : o.length }
              });

            Morris.Donut({
              element : 'donut-chart-incidents-by-customer-department',
              data : donutChartData1,
            });

            var barChartData2 = _.map(
              _.groupBy(response.data, function(o) { var d = new Date(o.created_date); return d.getFullYear() + '-' + (+d.getMonth()+1) } ),
              function(o, i) {
                return { label : i, count : o.length }
            });

            Morris.Bar({
              element : 'bar-chart-incidents-by-month-created',
              data : barChartData2,
              xkey : 'label',
              ykeys : ['count'],
              labels : ['Open Tickets By Month Created'],
              resize : true,
            });

          })



    </script>
  </body>
</html>
