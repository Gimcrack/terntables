@extends('partials.metrics.tickets')

@section('body')

<div class="col-xs-12 col-sm-6 col-lg-3">
  <div class="panel panel-success">
    <div class="panel-heading">
      Open Incidents By Customer - {{$id ?: "IT Department"}}
    </div>
    <div class="panel-body">
      @include('partials.preloader')
      <div id="donut-chart-incidents-by-customer-department"></div>
    </div>

  </div>
</div>
<div class="col-xs-12 col-sm-6 col-lg-9">
  <div class="panel panel-warning">
    <div class="panel-heading">
      Open Incidents By Month Created - {{$id ?: "IT Department"}}
    </div>
    <div class="panel-body">
      @include('partials.preloader')
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
      @include('partials.preloader')
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
      @include('partials.preloader')
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
</div>


<script type="text/javascript">

    $.getJSON('https://isupport.msb.matsugov.lan/Api/v14-5/Incident/{{$groupOrIndividual}}/{{$id}}', function(response){
      $('.preloader').hide();

      $('#tbl_tickets').DataTable(
        {
          processing : true,
          data : response.data,
          columns : [
            { data : 'number', render : function(data, type, row) { return  $('<a/>', { target : '_blank', href : 'http://isupport/Rep/Incident/default.aspx?ID=' + row.id }).html(data).prop('outerHTML'); } },
            { data : 'assignee'},
            { data : 'created_date'},
            { data : 'description', render : function(data) { return $('<p>' + data + '</p>').text().slice(0,50) + '...' }},
            { data : 'priority'},
            { data : 'status'},
            { data : 'customer'},
            { data : 'department'},
          ]
        });

      // prepare the data

      var barChartData1 = _.map(
        _.groupBy(response.data, 'assignee'),
        function(o, i) {
          return _.extend( _.countBy( o, 'status' ), { label : i } );
        });

      Morris.Bar({
       element : 'bar-chart-incidents-by-rep-and-status-1',
       data : barChartData1,
       xkey : 'label',
       ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
       labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
       stacked : true,
       //resize : true,
       //gridTextSize : 12,
       xLabelAngle : 25,
       padding : 80,
      //  xLabelFormat : function(l) {
      //    return l.label.split(' ').join('\n');
      //  },
       fillOpacity: 0.3
     });

    //  Morris.Bar({
    //    element : 'bar-chart-incidents-by-rep-and-status-2',
    //    data : barChartData1.slice( Math.floor( barChartData1.count/2 ) ),
    //    xkey : 'label',
    //    ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
    //    labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
    //    resize : true,
    //  });

      var donutChartData1 = _.map(
        _.groupBy(response.data, 'department' ),
        function(o, i) {
          return { label : i || '-No Department-', value : o.length }
        });

      Morris.Donut({
        element : 'donut-chart-incidents-by-customer-department',
        data : donutChartData1,
        resize : true,
      });

      var months = [
        'Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
      ];

      var barChartData2 = _.map(
        _.groupBy(response.data, function(o) {
          var d = new Date(o.created_date);
          return d.getFullYear() + '-' + ('0'+(+d.getMonth()+1)).slice(-2,4) }
        ),
        function(o, i) {
          return _.extend( _.countBy( o, 'status' ), { label : i } );
      });

      Morris.Bar({
        element : 'bar-chart-incidents-by-month-created',
        data : barChartData2,
        xkey : 'label',
        ykeys : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
        labels : ['Open','Pending','Reopened','Waiting for Reply','Waiting for Vendor','In Progress'],
        resize : true,
        stacked : true,
        //gridTextSize : 11,
        xLabelAngle : 30
      });

    })
</script>
@endsection
