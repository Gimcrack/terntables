<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">

    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.js"></script>

    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.2.0/lodash.js"></script>

  </head>

  <body>
    <fieldset>
      <legend>Open Incidents By Rep - BI Team</legend>
      <div id="bar-chart"></div>

      <br/>
      <br/>

      <div id="donut-chart">   </div>
    </fieldset>

    <!-- <table id="apiTable">
      <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cname</th>
            <th>IP</th>
            <th>Inactive Flag</th>
            <th>Production Flag</th>
        </tr>
      </thead>
    </table> -->
    <script type="text/javascript">

          // $('#apiTable').DataTable({
          //   ajax : {
          //     url : '/bi/servers/json',
          //     dataSrc : ''
          //   },
          //   columns : [
          //     { data: 'name' },
          //     { data: 'description' },
          //     { data: 'cname' },
          //     { data: 'ip' },
          //     { data: 'inactive_flag' },
          //     { data: 'production_flag' },
          //   ]
          // })
          //
          //

          $.getJSON('http://isupport/Api/v14-5/Incident/Group/BI%20Team', function(response){
            console.log(response);

            var data = _.map( _.groupBy(response.data, 'assignee'), function(o,i) { return _.extend( _.countBy(o, 'status'), { label : i } ) } )

            console.log(data);

            Morris.Bar({
              element : 'bar-chart',
              data : data,
              xkey : 'label',
              ykeys : ['In Progress', 'Open', 'Reopened', 'Pending', 'Waiting for Reply', 'Waiting for Vendor'],
              labels : ['In Progress', 'Open', 'Reopened', 'Pending', 'Waiting for Reply', 'Waiting for Vendor'],
              resize : true,
            });

            // Morris.Donut({
            //   element : 'donut-chart',
            //   data : data,
            // });
          })



    </script>
  </body>
</html>
