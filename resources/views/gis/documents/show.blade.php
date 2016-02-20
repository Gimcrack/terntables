@extends('partial')

@section('content')
  <div class="row">
    <div class="col-lg-12">
      <div class="panel panel-info">
        <div class="panel-heading">
          <h1 class="page-header">{{ $document->name }}</h1>

          <div class="alert alert-warning alert-dismissible helpText" role="alert">
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span>
              <span class="sr-only">Close</span></button>
              {{ $document->description }}
          </div>

          <div class="table-head">
            <div class="table-row">
              <div class="table-header">
                <div class="btn-group btn-group-sm table-btn-group">
                  <a class="btn btn-success btn-refresh" target="_blank" href='{{ url("gis/documents/{$document->id}/pdf") }}'>
                    <i class="fa fa-fw fa-lg fa-file-pdf-o"></i><span>Download PDF</span>
                  </a>
                  <a class="btn btn-success btn-refresh" target="_blank" href='{{ url("gis/documents/{$document->id}/raw") }}'>
                    <i class="fa fa-fw fa-lg fa-file-code-o"></i><span>Download Raw XML</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-body ">
          <table class="table table-striped">
            @unless (empty($params['file_name']))
            <tr>
              <th style="width:200px;">
                File Name
              </th>
              <td style="width:600px">
                {{ $params['file_name'] }}
              </td>
            </tr>
            @endunless

            @unless (empty($params['description']))
            <tr>
              <th style="width:200px;">
                Description
              </th>
              <td>
                {{ $params['description'] }}
              </td>
            </tr>
            @endunless

            @unless (empty($params['file_type']))
            <tr>
              <th style="width:200px;">
                File Type
              </th>
              <td>
                {{ $params['file_type'] }}
              </td>
            </tr>
            @endunless

            @unless (empty($params['geometry_type']))
            <tr>
              <th style="width:200px;">
                Geometry Type
              </th>
              <td>
                {{ $params['geometry_type'] }}
              </td>
            </tr>
            @endunless

            @unless (empty($params['attributes']))
            <tr>
              <th style="width:200px;">
                Attributes
              </th>
              <td>
                <table class="table table-striped">
                  @foreach($params['attributes'] as $key => $value)
                    @unless( empty($value) )
                      <tr>
                        <th style="width:200px;">{{ $key }}</th>
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
              <th style="width:200px;">
                Responsible Parties
              </th>
              <td>
                <table class="table table-striped">
                  @foreach($params['responsible_parties'] as $key => $value)
                    @unless( empty($value) )
                      <tr>
                        <th style="width:200px;">{{ $value['role'] }}</th>
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
              <th style="width:200px;">
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
              <th style="width:200px;">
                Coverage Area
              </th>
              <td>
                {{ $params['coverage_area'] }}
              </td>
            </tr>
            @endunless

            @if ( is_array($params['dates']))
              @foreach($params['dates'] as $key => $value)
                @unless( empty($value) )
                  <tr>
                    <th style="width:200px;">{{ $replace[$key] ?: $key }}</th>
                    <td>{{ date('Y-m-d', strtotime($value) ) }}</td>
                  </tr>
                @endunless
              @endforeach
            @endunless

            @unless( empty($params['date_last_updated']) )
              <tr>
                <th style="width:200px;">Date MetaData Last Updated</th>
                <td>{{ date('Y-m-d', strtotime($params['date_last_updated'])) }}</td>
              </tr>
            @endunless

          </table>
        </div>
      </div>

    </div>

  </div>

@endsection
