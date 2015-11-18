@extends('app')

@section('content')
  <div class="row">
    <div class="col-lg-12">
      <div class="panel panel-info" style="margin-top:50px;">
        <div class="panel-heading">
          <h1 class="page-header">Revision History: {{  $model->name . " (" . get_class($model) . ")" }}</h1>
          @unless( empty($model->description) )
          <div class="alert alert-warning alert-dismissible helpText" role="alert">
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span>
              <span class="sr-only">Close</span></button>
              {{ $model->description }}
          </div>
          @endunless
          <div class="table-head">
            <div class="table-row">
              <div class="table-header">
                <div class="btn-group btn-group-sm table-btn-group">
                  <button class="btn btn-success btn-refresh" onclick="history.back()">
                    <i class="fa fa-fw fa-lg fa-arrow-left"></i><span>Back</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <table class="table table-striped">
            @foreach($model->revisionHistory as $history )
            <tr>
              <th style="width:100%;">
                <small><i class="fa fa-clock-o fa-fw"></i>{{ date('Y-m-d H:i', strtotime( $history->updated_at )) }}</small>
                <small><i class="fa fa-user fa-fw"></i>{{ @$history->userResponsible()->person->name ?: 'System' }}</small>
                <br/>
                @if($history->key == 'created_at' && !$history->old_value)
                 Record Created
                @else
                  <strong>[{{ $history->fieldName() }}]</strong> changed from <strong>"{{ $history->oldValue() }}"</strong> to <strong>"{{ $history->newValue() }}"</strong>
                @endif

              </th>
            </tr>
            @endforeach
          </table>

        </div>
      </div>

    </div>

  </div>

@endsection
