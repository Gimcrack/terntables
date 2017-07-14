@extends('partials.metrics.tickets')

@section('body')
      <div class="col-xs-12">
        <div class="panel panel-success">
          <div class="panel-heading">
            <strong class="visible-md visible-lg">Distribution of Time Allocation By Customer Over Last 12 Months : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-sm">Time Allocation By Customer Last 12 Months : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-xs">Hours By Customer : {{$id ?: "IT Department"}}</strong>
          </div>
          <div class="panel-body">
            <h3 style="text-align:left">Display Options</h3>
            <div class="btn-group">
                <button class="btn btn-info pull-left active disabled" data-toggle="collapse" data-toggle-target="#quarters" name="button">Quarter Intervals</button>
                <button class="btn btn-info pull-left active disabled" data-toggle="collapse" data-toggle-target="#halves" name="button">Six-Month Intervals</button>
                <button class="btn btn-info pull-left active disabled" data-toggle="collapse" data-toggle-target="#year" name="button">Entire Year</button>
            </div>

            <div class="col-xs-12 collapse in" id="quarters">
              <div class="col-xs-12 col-md-6 col-lg-3">
                @include('partials.preloader')
                <div id="donut-chart-time-allocation-q1"></div>
                <h3><div class="label label-success">{{ date('M `y',strtotime('12 months ago')) }} - {{ date('M `y',strtotime('10 months ago')) }}</div></h3>
                <h3><div class="label label-info label-total-hours"></div></h3>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-3">
                @include('partials.preloader')
                <div id="donut-chart-time-allocation-q2"></div>
                <h3><div class="label label-success">{{ date('M `y',strtotime('9 months ago')) }} - {{ date('M `y',strtotime('7 months ago')) }}</div></h3>
                <h3><div class="label label-info label-total-hours"></div></h3>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-3">
                @include('partials.preloader')
                <div id="donut-chart-time-allocation-q3"></div>
                <h3><div class="label label-success">{{ date('M `y',strtotime('6 months ago')) }} - {{ date('M `y',strtotime('4 months ago')) }}</div></h3>
                <h3><div class="label label-info label-total-hours"></div></h3>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-3">
                @include('partials.preloader')
                <div id="donut-chart-time-allocation-q4"></div>
                <h3><div class="label label-success">{{ date('M `y',strtotime('3 months ago')) }} - Present</div></h3>
                <h3><div class="label label-info label-total-hours"></div></h3>
              </div>
            </div>
            <div class="col-xs-12 collapse in" id="halves">
              <div class="col-xs-6">
                @include('partials.preloader')
                <div id="donut-chart-time-allocation-h1"></div>
                <h3><div class="label label-success">{{ date('M `y',strtotime('12 months ago')) }} - {{ date('M `y',strtotime('7 months ago')) }}</div></h3>
                <h3><div class="label label-info label-total-hours"></div></h3>
              </div>
              <div class="col-xs-6">
                @include('partials.preloader')
                <div id="donut-chart-time-allocation-h2"></div>
                <h3><div class="label label-success">{{ date('M `y',strtotime('6 months ago')) }} - Present</div></h3>
                <h3><div class="label label-info label-total-hours"></div></h3>
              </div>
            </div>
            <div class="col-xs-12 collapse in" id="year">
              @include('partials.preloader')
              <div id="donut-chart-time-allocation-total"></div>
              <h3><div class="label label-success">{{ date('M `y',strtotime('12 months ago')) }} - Present</div></h3>
              <h3><div class="label label-info label-total-hours"></div></h3>
            </div>
          </div>

        </div>
      </div>

      <div class="col-xs-12">
        <div class="panel panel-info">
          <div class="panel-heading">
            <strong class="visible-md visible-lg">Closed Tickets By Customer And Rep Over Last 12 Months : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-sm">Closed Tickets By Customer And Rep : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-xs">Closed Tickets : {{$id ?: "IT Department"}}</strong>
          </div>
          <div class="panel-body">
            @include('partials.preloader')
            <div id="bar-chart-incidents-by-rep-and-customer"></div>
          </div>
        </div>
      </div>

      <div class="col-xs-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <strong class="visible-md visible-lg">Closed Tickets By Rep Over Last 12 Months : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-sm">Closed Tickets By Rep : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-xs">Closed Tickets : {{$id ?: "IT Department"}}</strong>
          </div>
          <div class="panel-body">
            @include('partials.preloader')
            <div id="bar-chart-incidents-by-rep"></div>
          </div>
        </div>
      </div>

      <div class="col-xs-12">
        <div class="panel panel-warning">
          <div class="panel-heading">
            <strong class="visible-md visible-lg">Closed Tickets By Customer Over Last 12 Months : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-sm">Closed Tickets By Customer : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-xs">Closed Tickets : {{$id ?: "IT Department"}}</strong>
          </div>
          <div class="panel-body">
            @include('partials.preloader')
            <div id="bar-chart-incidents-by-customer"></div>
          </div>
        </div>
      </div>

      <!-- <div class="col-xs-12 col-sm-6 col-lg-9">
        <div class="panel panel-warning">
          <div class="panel-heading">
            Open Incidents By Month Created - {{$id ?: "IT Department"}}
          </div>
          <div class="panel-body">
            <div id="bar-chart-incidents-by-month-created"></div>
          </div>
        </div>
      </div>
      <div class="col-xs-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            Open Incidents By Rep & Status - {{$id ?: "IT Department"}}
          </div>
          <div class="panel-body">
            <div id="bar-chart-incidents-by-rep-and-status-1"></div>
            <hr/>
            <div id="bar-chart-incidents-by-rep-and-status-2"></div>
          </div>

        </div>
      </div>
      <div class="col-xs-12">
        <div class="panel panel-info">
          <div class="panel-heading">
            Open Incidents - {{$id ?: "IT Department"}}
          </div>
          <div class="panel-body">
            <table id="tbl_tickets" class="display" width="100%">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Assignee</th>
                  <th>Created Date</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Department</th>
                </tr>
              </thead>
            </table>
          </div>

        </div>
      </div> -->


    <script type="text/javascript">
        var url = '/metrics/tickets/archive/json/{{$groupOrIndividual}}/{{$id}}',
        oit = false;

        if ( '{{$id}}' == 'OIT' ) {
            url = '/metrics/tickets/archive/json';
            oit = true;
        }
          $.getJSON(url, function(response){

            $('.preloader').hide();

            if (oit)
            {
                response.data = _(response.data).reject( o => o.group.match(/GIS Team/gi) ).value();
            }

            // get the department list
            var departmentList = _.uniq( _.map( response.data, function(o, i) { return o.department || '-No Department-' } ) ).sort();

            // get the rep list
            var repList = _.uniq( _.map( response.data, function(o, i) { return o.assignee || '-No Rep-' } ) ).sort();

            console.log(departmentList);

            // divide the data in quarters
            var dataQuadrants = _.groupBy(response.data, function(o) {
              var d = new Date(o.created_date);

              return  Math.floor( +d.getMonth() / 3 );
            });

            // divid the data in half
            var dataHalves = _.groupBy(response.data, function(o) {
              var d = new Date(o.created_date);

              return  Math.floor( +d.getMonth() / 6 );
            });


            var donutChartQuadrantData = _.map( dataQuadrants, function(quad) {
              return _.map(
              _.groupBy(quad, 'department' ),
              function(o, i) {
                var v;
                if (o.length == 1) {
                  v = +o[0].total_time_worked;
                }  else {
                  v = _.reduce(o, function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.total_time_worked })
                }
                // get the total hours
                v = Math.ceil(v/60);
                return { label : i || '-No Department-', value : v }
              });
            });

            var donutChartHalfData = _.map( dataHalves, function(half) {
              return _.map(
              _.groupBy(half, 'department' ),
              function(o, i) {
                var v;
                if (o.length == 1) {
                  v = +o[0].total_time_worked;
                }  else {
                  v = _.reduce(o, function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.total_time_worked })
                }
                // get the total hours
                v = Math.ceil(v/60);
                return { label : i || '-No Department-', value : v }
              });
            });

            var donutChartTotalData = _.map(
              _.groupBy(response.data, 'department' ),
              function(o, i) {
                var v;
                if (o.length == 1) {
                  v = +o[0].total_time_worked;
                }  else {
                  v = _.reduce(o, function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.total_time_worked })
                }
                // get the total hours
                v = Math.ceil(v/60);
                return { label : i || '-No Department-', value : v }
              });

            var barChartIncidentsByCustomerAndRepData = _.map(
              _.groupBy(response.data, 'assignee'),
              function(o, i) {
                return _.extend( _.countBy( o, 'department' ), { label : i } );
              }
            );

            var barChartIncidentsByRepData = _.map(
              _.groupBy(response.data, 'assignee'),
              function(o, i) {
                var v = Math.ceil( _.reduce(o, function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + (+oo.total_time_worked || 0) }) / 60 );

                return _.extend( { count : o.length, total_hours : v || 0 }, { label : i || '-No Rep-' } );
              }
            );

            var barChartIncidentsByCustomerData = _.map(
              _.groupBy(response.data, 'department'),
              function(o, i) {
                var v = Math.ceil( _.reduce(o, function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + (+oo.total_time_worked || 0) }) / 60 );

                return _.extend( { count : o.length, total_hours : v || 0 }, { label : i || '-No Department-' } );
              }
            );

            // console.log(_.groupBy(response.data, 'department' ));
            // console.log(donutChartQuadrantData1);

            var total1 = _.reduce( donutChartQuadrantData[0], function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });
            var total2 = _.reduce( donutChartQuadrantData[1], function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });
            var total3 = _.reduce( donutChartQuadrantData[2], function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });
            var total4 = _.reduce( donutChartQuadrantData[3], function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });

            var total5 = _.reduce( donutChartHalfData[0], function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });
            var total6 = _.reduce( donutChartHalfData[1], function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });

            var total7 = _.reduce( donutChartTotalData, function(sum,oo) { if (isNaN(sum)) { sum=0 } return +sum + +oo.value });

            $('.label-total-hours').eq(0).html(total1 + ' Total Hours');
            $('.label-total-hours').eq(1).html(total2 + ' Total Hours');
            $('.label-total-hours').eq(2).html(total3 + ' Total Hours');
            $('.label-total-hours').eq(3).html(total4 + ' Total Hours');
            $('.label-total-hours').eq(4).html(total5 + ' Total Hours');
            $('.label-total-hours').eq(5).html(total6 + ' Total Hours');
            $('.label-total-hours').eq(6).html(total7 + ' Total Hours');


            var charts = [];

            Morris.Donut({
              element : 'donut-chart-time-allocation-q1',
              data : donutChartQuadrantData[0],
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              },
            });
            Morris.Donut({
              element : 'donut-chart-time-allocation-q2',
              data : donutChartQuadrantData[1],
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              }
            });
            Morris.Donut({
              element : 'donut-chart-time-allocation-q3',
              data : donutChartQuadrantData[2],
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              }
            });
            Morris.Donut({
              element : 'donut-chart-time-allocation-q4',
              data : donutChartQuadrantData[3],
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              }
            });
            Morris.Donut({
              element : 'donut-chart-time-allocation-h1',
              data : donutChartHalfData[0],
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              }
            });
            Morris.Donut({
              element : 'donut-chart-time-allocation-h2',
              data : donutChartHalfData[1],
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              }
            });
            Morris.Donut({
              element : 'donut-chart-time-allocation-total',
              data : donutChartTotalData,
              resize : true,
              formatter : function(v) {
                return v + ' Hours';
              }
            });

            Morris.Bar({
              element : 'bar-chart-incidents-by-rep-and-customer',
              data : barChartIncidentsByCustomerAndRepData,
              resize : true,
              xkey : 'label',
              ykeys : departmentList,
              labels : departmentList,
              stacked : true,
              xLabelAngle : 25,
              padding : 80,
              fillOpacity: 0.3
            });

            Morris.Bar({
              element : 'bar-chart-incidents-by-customer',
              data : barChartIncidentsByCustomerData,
              resize : true,
              xkey : 'label',
              ykeys : ['count', 'total_hours'],
              labels : ['Count', 'Total Hours'],
              stacked : false,
              xLabelAngle : 25,
              padding : 80,
              fillOpacity: 0.3
            });

            Morris.Bar({
              element : 'bar-chart-incidents-by-rep',
              data : barChartIncidentsByRepData,
              resize : true,
              xkey : 'label',
              ykeys : ['count', 'total_hours'],
              labels : ['Count', 'Total Hours'],
              stacked : false,
              xLabelAngle : 25,
              padding : 80,
              fillOpacity: 0.3
            });

            $('button[data-toggle]').removeClass('disabled').click( function() {
              $('button[data-toggle]').not(this).removeClass('active');
              $(this).addClass('active');

              $('div.collapse').removeClass('in');
              $( $(this).attr('data-toggle-target')).addClass('in');

            }).eq(0).click();

            // prepare the data

          //   var barChartData1 = _.map(
          //     _.groupBy(response.data, 'assignee'),
          //     function(o, i) {
          //       return _.extend( _.countBy( o, 'status' ), { label : i } );
          //     });
           //
          //   Morris.Bar({
          //    element : 'bar-chart-incidents-by-rep-and-status-1',
          //    data : barChartData1,
          //    xkey : 'label',
          //    ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
          //    labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
          //    stacked : true,
          //    //resize : true,
          //    //gridTextSize : 12,
          //    xLabelAngle : 25,
          //    padding : 80,
          //   //  xLabelFormat : function(l) {
          //   //    return l.label.split(' ').join('\n');
          //   //  },
          //    fillOpacity: 0.3
          //  });

          //  Morris.Bar({
          //    element : 'bar-chart-incidents-by-rep-and-status-2',
          //    data : barChartData1.slice( Math.floor( barChartData1.count/2 ) ),
          //    xkey : 'label',
          //    ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
          //    labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
          //    resize : true,
          //  });
            //console.log(response.data);



            // var months = [
            //   'Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
            // ];
            //
            // var barChartData2 = _.map(
            //   _.groupBy(response.data, function(o) {
            //     var d = new Date(o.created_date);
            //     return d.getFullYear() + '-' + ('0'+(+d.getMonth()+1)).slice(-2,4) }
            //   ),
            //   function(o, i) {
            //     return _.extend( _.countBy( o, 'status' ), { label : i } );
            // });
            //
            // Morris.Bar({
            //   element : 'bar-chart-incidents-by-month-created',
            //   data : barChartData2,
            //   xkey : 'label',
            //   ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
            //   labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
            //   resize : true,
            //   stacked : true,
            //   //gridTextSize : 11,
            //   xLabelAngle : 30
            // });

          })



    </script>
@endsection
