@if ( !empty(\App\User::aduser() ) )
<div class="panel panel-info">
  <div class="panel-heading">Login with Windows Account</div>
  <div class="panel-body">
    <form class="form-horizontal" role="form" method="GET" action="{{ url('/auth/adlogin') }}/{{ csrf_token() }}">

      <div class="form-group">
        <div class="col-md-6 col-md-offset-4">
          <button type="submit" class="btn btn-primary">Continue As {{ \App\User::aduser() }}</button>
        </div>
      </div>
    </form>
  </div>
</div>
@endif
