<nav class="navbar navbar-default navbar-static-top {{ env('CSS_CLASS') }}" role="navigation" style="margin-bottom: 0">
  <div class="navbar-header">
    @unless(Auth::guest())
    <button type="button" class="navbar-toggle btn btm-sm btn-success pull-left">
  		<i class="fa fa-bars fa-fw"></i>
  	</button>
    @endif
  	<a class="navbar-brand" href="{{ url('/') }}">
  		{{ env('APP_HEADER_TITLE','Laravel Dashboard')}}
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
          @if( !empty( \App\User::aduser() ) )
          <li>
            <a href="{{ url('/auth/adlogin', ['_token' => csrf_token()]) }}">Continue As {{ \App\User::aduser() }}</a>
          </li>
          @endif
          <li>
    				<a href="{{ url('/auth/login') }}">Login</a>
    			</li>
    		</ul>
      </li>
    @else
  	<li class="dropdown">
      <a class="dropdown-toggle usermenu" data-toggle="dropdown" href="#">
  			<i class="fa fa-user fa-fw"></i> {{ Auth::user()->username }} <i class="fa fa-caret-down"></i>
  		</a>
  		<ul class="dropdown-menu dropdown-admin-settings">

        @if( Auth::user()->isAdmin() )
          <li class="menu-section-heading"> Admin Menu </li>
    			<li>
    				<a href="{{ url('admin/people')}}" ><i class="fa fa-user fa-fw"></i> Manage Contacts</a>
    			</li>
    			<li>
    				<a href="{{ url('admin/users')}}" ><i class="fa fa-user fa-fw"></i> Manage Users</a>
    			</li>
    			<li>
    				<a href="{{ url('admin/groups')}}" ><i class="fa fa-users fa-fw"></i> Manage Groups</a>
    			</li>
    			<li>
    				<a href="{{ url('admin/roles')}}" ><i class="fa fa-lock fa-fw"></i> Manage Roles</a>
    			</li>
    			<li>
    				<a href="{{ url('admin/operatingSystems')}}" ><i class="fa fa-windows fa-fw"></i> Manage Operating Systems</a>
    			</li>
    			<li>
    				<a href="{{ url('oit/outageTasks/_generate')}}" ><i class="fa fa-tasks fa-fw"></i> Auto-Generate Outage Tasks</a>
    			</li>
  			@endif

  			<li class="divider"></li>
  			<li>
  				<a href="{{ url('profile') }}" ><i class="fa fa-gear fa-fw"></i> My Profile</a>
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
