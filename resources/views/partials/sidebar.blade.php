@unless(Auth::guest())
  <div class="navbar-left sidebar" role="navigation">
  	<div class="sidebar-overlay">
  		<span class="close-icon">
  			<i class="fa fa-close fa-2x fa-fw pull-right" style="cursor:pointer;margin-top:10px;"></i>
  		</span>
  	</div>
  	<div class="sidebar-nav">

  		<ul class="nav" id="side-menu">
      <!-- BASE MODULE -->
      <li>
        <a href="{{ url('home') }}"><i class="fa fa-home fa-fw"></i> Home</a>
      </li>

      <li>
        <a href="{{ url('profile') }}"><i class="fa fa-user fa-fw"></i> My Profile</a>
      </li>

      @if( Auth::user()->checkAccess('Org.read') )
      <li>
        <a href="{{ url('orgs') }}"><i class="fa fa-building-o fa-fw"></i> Manage Orgs</a>
      </li>
      @endif

      @if( Auth::user()->checkAccess('JobRole.read') )
      <li>
        <a href="{{ url('jobroles') }}"><i class="fa fa-briefcase fa-fw"></i> Manage Job Roles</a>
      </li>
      @endif

  		<!-- <li>
  			<a href="#"><i class="fa fa-user fa-fw"></i> My Stuff <span class="fa arrow"></span></a>
  			<ul class="nav nav-second-level">


  			</ul>
  		</li> -->
  	</ul>
  	</div>
  	<!-- /.sidebar-collapse -->
  </div>
  <!-- /.navbar-static-side -->
@endif
