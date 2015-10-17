<style media="screen">
* {
  box-sizing: border-box;
  border-radius:0px !important;
  font-family:Calibri,Arial,sans-serif;
  font-weight: 300;
}
.close {
  display:none;
}

.table {
    margin-bottom: 20px;
    max-width: 800px;
    width: 100%;
}
.table > thead > tr > th, .table > thead > tr > td, .table > tbody > tr > th, .table > tbody > tr > td, .table > tfoot > tr > th, .table > tfoot > tr > td {
    border-top: 1px solid #ddd;
    line-height: 1.42857;
    padding: 8px;
    vertical-align: top;
}
.table > thead > tr > th {
    border-bottom: 2px solid #ddd;
    vertical-align: bottom;
}
.table > caption + thead > tr:first-child > th, .table > caption + thead > tr:first-child > td, .table > colgroup + thead > tr:first-child > th, .table > colgroup + thead > tr:first-child > td, .table > thead:first-child > tr:first-child > th, .table > thead:first-child > tr:first-child > td {
    border-top: 0 none;
}
.table > tbody + tbody {
    border-top: 2px solid #ddd;
}
.table .table {
    background-color: #f8f8f8;
}
.table-condensed > thead > tr > th, .table-condensed > thead > tr > td, .table-condensed > tbody > tr > th, .table-condensed > tbody > tr > td, .table-condensed > tfoot > tr > th, .table-condensed > tfoot > tr > td {
    padding: 5px;
}
.table-bordered {
    border: 1px solid #ddd;
}
.table-bordered > thead > tr > th, .table-bordered > thead > tr > td, .table-bordered > tbody > tr > th, .table-bordered > tbody > tr > td, .table-bordered > tfoot > tr > th, .table-bordered > tfoot > tr > td {
    border: 1px solid #ddd;
}
.table-bordered > thead > tr > th, .table-bordered > thead > tr > td {
    border-bottom-width: 2px;
}
.table-striped > tbody > tr:nth-of-type(2n+1) {
    background-color: #f9f9f9;
}
.table-hover > tbody > tr:hover {
    background-color: #f5f5f5;
}
table col[class*="col-"] {
    display: table-column;
    float: none;
    position: static;
}
table td[class*="col-"], table th[class*="col-"] {
    display: table-cell;
    float: none;
    position: static;
}
.table > thead > tr > td.active, .table > thead > tr > th.active, .table > thead > tr.active > td, .table > thead > tr.active > th, .table > tbody > tr > td.active, .table > tbody > tr > th.active, .table > tbody > tr.active > td, .table > tbody > tr.active > th, .table > tfoot > tr > td.active, .table > tfoot > tr > th.active, .table > tfoot > tr.active > td, .table > tfoot > tr.active > th {
    background-color: #f5f5f5;
}
.table-hover > tbody > tr > td.active:hover, .table-hover > tbody > tr > th.active:hover, .table-hover > tbody > tr.active:hover > td, .table-hover > tbody > tr:hover > .active, .table-hover > tbody > tr.active:hover > th {
    background-color: #e8e8e8;
}
.table > thead > tr > td.success, .table > thead > tr > th.success, .table > thead > tr.success > td, .table > thead > tr.success > th, .table > tbody > tr > td.success, .table > tbody > tr > th.success, .table > tbody > tr.success > td, .table > tbody > tr.success > th, .table > tfoot > tr > td.success, .table > tfoot > tr > th.success, .table > tfoot > tr.success > td, .table > tfoot > tr.success > th {
    background-color: #dff0d8;
}
.table-hover > tbody > tr > td.success:hover, .table-hover > tbody > tr > th.success:hover, .table-hover > tbody > tr.success:hover > td, .table-hover > tbody > tr:hover > .success, .table-hover > tbody > tr.success:hover > th {
    background-color: #d0e9c6;
}
.table > thead > tr > td.info, .table > thead > tr > th.info, .table > thead > tr.info > td, .table > thead > tr.info > th, .table > tbody > tr > td.info, .table > tbody > tr > th.info, .table > tbody > tr.info > td, .table > tbody > tr.info > th, .table > tfoot > tr > td.info, .table > tfoot > tr > th.info, .table > tfoot > tr.info > td, .table > tfoot > tr.info > th {
    background-color: #d9edf7;
}
.table-hover > tbody > tr > td.info:hover, .table-hover > tbody > tr > th.info:hover, .table-hover > tbody > tr.info:hover > td, .table-hover > tbody > tr:hover > .info, .table-hover > tbody > tr.info:hover > th {
    background-color: #c4e3f3;
}
.table > thead > tr > td.warning, .table > thead > tr > th.warning, .table > thead > tr.warning > td, .table > thead > tr.warning > th, .table > tbody > tr > td.warning, .table > tbody > tr > th.warning, .table > tbody > tr.warning > td, .table > tbody > tr.warning > th, .table > tfoot > tr > td.warning, .table > tfoot > tr > th.warning, .table > tfoot > tr.warning > td, .table > tfoot > tr.warning > th {
    background-color: #fcf8e3;
}
.table-hover > tbody > tr > td.warning:hover, .table-hover > tbody > tr > th.warning:hover, .table-hover > tbody > tr.warning:hover > td, .table-hover > tbody > tr:hover > .warning, .table-hover > tbody > tr.warning:hover > th {
    background-color: #faf2cc;
}
.table > thead > tr > td.danger, .table > thead > tr > th.danger, .table > thead > tr.danger > td, .table > thead > tr.danger > th, .table > tbody > tr > td.danger, .table > tbody > tr > th.danger, .table > tbody > tr.danger > td, .table > tbody > tr.danger > th, .table > tfoot > tr > td.danger, .table > tfoot > tr > th.danger, .table > tfoot > tr.danger > td, .table > tfoot > tr.danger > th {
    background-color: #f2dede;
}
.table-hover > tbody > tr > td.danger:hover, .table-hover > tbody > tr > th.danger:hover, .table-hover > tbody > tr.danger:hover > td, .table-hover > tbody > tr:hover > .danger, .table-hover > tbody > tr.danger:hover > th {
    background-color: #ebcccc;
}
.table-responsive {
    min-height: 0.01%;
    overflow-x: auto;
}

</style>

<div class="row">
  <div class="col-lg-12">
    <div class="panel panel-info" style="margin-top:50px;">
      <div class="panel-heading">
        <h1 class="page-header">{{ $document->name }}</h1>
        @unless( empty($document->description) )
        <div class="alert alert-warning alert-dismissible helpText" role="alert">
          <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span>
            <span class="sr-only">Close</span></button>
            {{ $document->description }}
        </div>
        @endunless
      </div>
      <div class="panel-body ">
        <table class="table table-striped">
          @unless (empty($params['file_name']))
          <tr>
            <th style="width:100px;">
              File Name
            </th>
            <td>
              {{ $params['file_name'] }}
            </td>
          </tr>
          @endunless

          @unless (empty($params['description']))
          <tr>
            <th style="width:100px;">
              Description
            </th>
            <td>
              {{ $params['description'] }}
            </td>
          </tr>
          @endunless

          @unless (empty($params['file_type']))
          <tr>
            <th style="width:100px;">
              File Type
            </th>
            <td>
              {{ $params['file_type'] }}
            </td>
          </tr>
          @endunless

          @unless (empty($params['geometry_type']))
          <tr>
            <th style="width:100px;">
              Geometry Type
            </th>
            <td>
              {{ $params['geometry_type'] }}
            </td>
          </tr>
          @endunless

          @unless (empty($params['attributes']))
          <tr>
            <th style="width:100px;">
              Attributes
            </th>
            <td>
              <table class="table table-striped">
                @foreach($params['attributes'] as $key => $value)
                  @unless( empty($value) )
                    <tr>
                      <th style="width:100px;">{{ $key }}</th>
                      <td>{{ $value }}</td>
                    </tr>
                  @endunless
                @endforeach
              </table>
            </td>
          </tr>
          @endunless

          @unless (empty($params['responsible_parties']))
          <tr>
            <th style="width:100px;">
              Responsible Parties
            </th>
            <td>
              <table class="table table-striped">
                @foreach($params['responsible_parties'] as $key => $value)
                  @unless( empty($value) )
                    <tr>
                      <th style="width:100px;">{{ $value['role'] }}</th>
                      <td>{{ $value['OrgName'] }}</td>
                    </tr>
                  @endunless
                @endforeach
              </table>
            </td>
          </tr>
          @endunless

          @unless (empty($params['construction_procedures']))
          <tr>
            <th style="width:100px;">
              Construction Procedures
            </th>
            <td>
              <table class="table table-striped">
                @foreach($params['construction_procedures'] as $key => $value)
                  @unless( empty($value) )
                    <tr>
                      <td>{{ $value }}</td>
                    </tr>
                  @endunless
                @endforeach
              </table>
            </td>
          </tr>
          @endunless

          @unless (empty($params['coverage_area']))
          <tr>
            <th style="width:100px;">
              Coverage Area
            </th>
            <td>
              {{ $params['coverage_area'] }}
            </td>
          </tr>
          @endunless

          @unless (empty($params['dates']))
            @foreach($params['dates'] as $key => $value)
              @unless( empty($value) )
                <tr>
                  <th style="width:100px;">{{ $replace[$key] }}</th>
                  <td>{{ date('Y-m-d', strtotime($value) ) }}</td>
                </tr>
              @endunless
            @endforeach
          @endunless

          @unless( empty($params['date_last_updated']) )
            <tr>
              <th style="width:100px;">Date MetaData Last Updated</th>
              <td>{{ date('Y-m-d', strtotime($params['date_last_updated'])) }}</td>
            </tr>
          @endunless

        </table>
      </div>
    </div>

  </div>

</div>
