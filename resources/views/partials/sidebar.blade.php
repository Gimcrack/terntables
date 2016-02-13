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

      @if( Auth::user()->checkAccess('Document.read') )
      <li>
  			<a href="#"><i class="fa fa-globe fa-fw"></i> GIS <span class="fa arrow"></span></a>
  			<ul class="nav nav-second-level">
          <li>
            <a href="{{ url('documents') }}"><i class="fa fa-file-text-o fa-fw"></i> Documents</a>
          </li>
        </ul>
      </li>
      @endif

      @if( Auth::user()->checkAccess('Server.read') )
      <li>
  			<a href="#"><i class="fa fa-database fa-fw"></i> BI <span class="fa arrow"></span></a>
  			<ul class="nav nav-second-level">
          <li>
            <a href="{{ url('bi/servers') }}"><i class="fa fa-server fa-fw"></i> Servers</a>
          </li>
          <li>
            <a href="{{ url('bi/applications') }}"><i class="fa fa-windows fa-fw"></i> Applications</a>
          </li>
          <li>
            <a href="{{ url('bi/databases') }}"><i class="fa fa-database fa-fw"></i> Databases</a>
          </li>
        </ul>
      </li>
      @endif

      <li>
        <a href="{{ url('/auth/logout') }}"><i class="fa fa-sign-out fa-fw"></i> Logout </a>
      </li>
  	</ul>
  	</div>
  	<!-- /.sidebar-collapse -->
  </div>
  <!-- /.navbar-static-side -->
@endif
