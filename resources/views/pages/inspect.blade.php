@extends('partial')

@section('content')
  <div class="row">
    <div class="col-lg-12">
      <div class="panel panel-info">
        <div class="panel-heading">
          <h1 class="page-header">Inspecting : {{ $name . " (" . get_class($model) . ")" }}</h1>

          <div class="alert alert-warning alert-dismissible helpText" role="alert">
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span>
              <span class="sr-only">Close</span></button>
              The current attributes of the record and the record history.
          </div>

        </div>



        <div class="panel-body" id="attributes" class="collapse">
          <div class="col-xs-12 col-md-6 col-lg-2">
            <div class="panel panel-primary">
              <div class="panel-heading">
                <h3>Record History</h3>
              </div>
              <div class="panel-body">
                <table class="table table-striped">
                  @foreach($history as $hist )
                  <tr>
                    <th style="width:100%;">
                      <small><i class="fa fa-clock-o fa-fw"></i>{{ $hist['dateForHumans'] }}</small>
                      <small><i class="fa fa-user fa-fw"></i>{{ $hist['person'] }}</small>
                      <br/>
                      {{ $hist['description'] }}
                    </th>
                  </tr>
                  @endforeach
                </table>
              </div>
            </div>
          </div>

          <div class="col-xs-12 col-md-6 col-lg-10">
            <div class="panel panel-primary">
              <div class="panel-heading">
                <h3>Record Attributes (Current)</h3>
              </div>
              <div class="panel panel-body">
                {!! $attributes !!}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
@endsection
