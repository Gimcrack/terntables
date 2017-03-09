@extends('partials.metrics.tickets')

@section('body')
      <!-- <div class="col-xs-12">
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
      </div> -->

      <div class="col-xs-12">
        <div class="panel panel-warning">
          <div class="panel-heading">
            <strong class="visible-md visible-lg">Closed Tickets By Month - Last {{ $years ?: 5 }} Years : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-sm">Closed Tickets By Customer : {{$id ?: "IT Department"}}</strong>
            <strong class="visible-xs">Closed Tickets : {{$id ?: "IT Department"}}</strong>
          </div>
          <div class="panel-body">
            @include('partials.preloader')
            <div id="closed-tickets-by-month"></div>
          </div>
        </div>
      </div>

      


    <script type="text/javascript">
          $.ajaxSetup({
            converters: {
            'text json': $.parseJSON
            }
          });

          $.getJSON('/metrics/tickets/trends/json/{{$groupOrIndividual}}/{{$id}}/{{$years}}', function(response){

            $('.preloader').hide();

            var dataTicketsByMonthYear = [
                { x : 'Jan' },
                { x : 'Feb' },
                { x : 'Mar' },
                { x : 'Apr' },
                { x : 'Max' },
                { x : 'Jun' },
                { x : 'Jul' },
                { x : 'Aug' },
                { x : 'Sep' },
                { x : 'Oct' },
                { x : 'Nov' },
                { x : 'Dec' },
            ], ykeys = [];

            // divide the data in quarters
            _.each(response.data, function(o) {
            
              var d = o.CreatedDate,
                  m = d.getMonth(),
                  y = d.getFullYear();
              
              ykeys.push(y);

              if ( ! dataTicketsByMonthYear[m][y] ) 
              {
                dataTicketsByMonthYear[m][y] = 1;
              }
              else
              {
                dataTicketsByMonthYear[m][y]++;
              }

            });

            ykeys = _.uniq( ykeys ).sort();

            // set placeholder values for months with no tickets.
            for( ii = 0; ii < dataTicketsByMonthYear.length; ii++ )
            {
              for( jj=0; jj < ykeys.length; jj++)
              {
                if ( ! dataTicketsByMonthYear[ii][ ykeys[jj] ]  )
                  dataTicketsByMonthYear[ii][ ykeys[jj] ] = 0;
              }
            }
            
            //Morris.Line()
            Morris.Line({
              element : 'closed-tickets-by-month',
              data : dataTicketsByMonthYear,
              xkey : 'x',
              ykeys : ykeys,
              labels : ykeys
            });

          })



    </script>
@endsection
