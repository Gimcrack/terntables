<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.10/css/jquery.dataTables.css" media="screen" title="no title" charset="utf-8">

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.10/js/jquery.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.10/js/jquery.dataTables.js"></script>

  </head>
  <body>
    <table id="apiTable">
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
    </table>
    <script type="text/javascript">

          $('#apiTable').DataTable({
            ajax : {
              url : '/bi/servers/json',
              dataSrc : ''
            },
            columns : [
              { data: 'name' },
              { data: 'description' },
              { data: 'cname' },
              { data: 'ip' },
              { data: 'inactive_flag' },
              { data: 'production_flag' },
            ]
          })

    </script>
  </body>
</html>
