<nav class="navbar navbar-default navbar-static-top {{ env('CSS_CLASS') }}" role="navigation" style="margin-bottom: 0">
  <div class="navbar-header">
    @unless(Auth::guest())
    <button type="button" class="navbar-toggle btn btm-sm btn-success pull-left">
  		<i class="fa fa-bars fa-fw"></i>
  	</button>
    @endif
  	<a class="navbar-brand ajaxy ajaxy-view" href="{{ url('/') }}">
  		Asynchronous Dashboard
  		<span class="label label-primary label-small">{{ env('APP_LABEL') }}</span>
  	</a>
  </div>
  <!-- /.navbar-header -->

  <ul class="nav navbar-top-links navbar-right">
  	<li class="dropdown">
  		<a class="dropdown-toggle" data-toggle="dropdown" href="#">
  			<i class="fa fa-question-circle fa-fw"></i> Help <i class="fa fa-caret-down"></i>
  		</a>
  		<ul class="dropdown-menu">
  			<li>
  				<a href="mailto:{{ env('ADMIN_EMAIL') }}?subject=Dashboard Issue"> <i class="fa fa-envelope-o fa-fw"></i> Report A Problem</a>
  			</li>
  		</ul>
  	</li>
    @if( Auth::guest() )
      <li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
    			<i class="fa fa-user fa-fw"></i> Login <i class="fa fa-caret-down"></i>
    		</a>
        <ul class="dropdown-menu">
          <li>
            <a href="{{ url('/auth/adlogin', ['_token' => csrf_token()]) }}">Continue As {{ \App\User::aduser() }}</a>
          </li>
          <li>
    				<a href="{{ url('/auth/login') }}">Alternate Login</a>
    			</li>
    		</ul>
      </li>
    @else
  	<li class="dropdown">
      <a class="dropdown-toggle" data-toggle="dropdown" href="#">
  			<i class="fa fa-user fa-fw"></i> {{ Auth::user()->name }} <i class="fa fa-caret-down"></i>
  		</a>
  		<ul class="dropdown-menu dropdown-admin-settings">
  			@if( Auth::user()->isAdmin() )
    			<li>
    				<a href="javascript:void(0)" onclick="jApp.activeGrid.fn.colParamSetup()"><i class="fa fa-gear fa-fw"></i> Setup Forms</a>
    			</li>
    			<li>
    				<a href="admin/history.html" data-fn="true"><i class="fa fa-calendar fa-fw"></i> View History</a>
    			</li>
    			<li class="divider"></li>
    			<li>
    				<a href="admin/users.html" data-fn="true" class="active ajaxy ajaxy-view"><i class="fa fa-user fa-fw"></i> Users Setup</a>
    			</li>
    			<li>
    				<a href="admin/logins.html" data-fn="true" class="ajaxy ajaxy-view"><i class="fa fa-user fa-fw"></i> Logins Setup</a>
    			</li>
    			<li>
    				<a href="admin/groups.html" data-fn="true" class="ajaxy ajaxy-view"><i class="fa fa-users fa-fw"></i> Groups Setup</a>
    			</li>
    			<li>
    				<a href="admin/modules.html" data-fn="true" class="ajaxy ajaxy-view"><i class="fa fa-cube fa-fw"></i> Modules Setup</a>
    			</li>
  			@endif

  			<li class="divider"></li>
  			<li>
  				<a href="profile.html" data-fn="true" class="ajaxy ajaxy-view"><i class="fa fa-gear fa-fw"></i> My Profile</a>
  			</li>
  			<li>
  				<a href="{{ url('/auth/logout') }}"><i class="fa fa-sign-out fa-fw"></i> Logout </a>
  			</li>
  		</ul>
  		<!-- /.dropdown -->
  	</li>
    @endif
  </ul>
  <!-- /.navbar-top-links -->

  @include('partials.sidebar')
</nav>
