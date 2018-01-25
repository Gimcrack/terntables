@extends('frame')

@section('content')

<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.11/css/dataTables.bootstrap.min.css" media="screen" title="no title" charset="utf-8">
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.11/js/jquery.dataTables.min.js"></script>



<div id="page-wrapper" style="padding:20px;">
  <div class="row">
    <div class="col-lg-12">
      <table id="projects_table" class="table table-striped">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Project</th>
            <th>Site</th>
            <th>Status</th>
            <th>Project Start</th>
            <th>Project End</th>
            <th>Project Number</th>
            <th>Origin</th>
            <th>Priority</th>
            <th>Reporting Freq.</th>
            <th>Department(s)</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
  <div class="row">
    <h4><div class="label label-info">Refreshing in <span id="countdown"></span>s</div></h4>
  </div>
</div>


<script>
  jApp.sharepoint.fn.projects();
</script>



@endsection
