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


      <li>
  			<a href="#"><i class="fa fa-globe fa-fw"></i> GIS <span class="fa arrow"></span></a>
  			<ul class="nav nav-second-level">
          @if( Auth::user()->checkAccess('Document.read') )
          <li>
            <a href="{{ url('gis/documents') }}"><i class="fa fa-file-text-o fa-fw"></i> Documents</a>
          </li>
          @endif
        </ul>
      </li>


      <li>
  			<a href="#"><i class="fa fa-desktop fa-fw"></i> OIT <span class="fa arrow"></span></a>
  			<ul class="nav nav-second-level">
          @if( Auth::user()->checkAccess('Outage.read') )
          <li>
            <a href="{{ url('oit/outages') }}"><i class="fa fa-power-off fa-fw"></i> Outages</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('OutageTaskDetail.read') )
          <li>
            <a href="{{ url('oit/outageTasks') }}"><i class="fa fa-check-square-o fa-fw"></i> Outage Tasks</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('OutageTask.read') )
          <li>
            <a href="{{ url('oit/taskTemplates') }}"><i class="fa fa-file-text-o fa-fw"></i> Outage Templates</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('Server.read') )
          <li>
            <a href="{{ url('oit/servers') }}"><i class="fa fa-building-o fa-fw"></i> Servers</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('DatabaseInstance.read') )
          <li>
            <a href="{{ url('oit/sql-servers') }}"><i class="fa fa-database fa-fw"></i> Sql Servers</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('Application.read') )
          <li>
            <a href="{{ url('oit/applications') }}"><i class="fa fa-cubes fa-fw"></i> Applications</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('Database.read') )
          <li>
            <a href="{{ url('oit/databases') }}"><i class="fa fa-database fa-fw"></i> Databases</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('Server.read') )
          <li>
            <a href="{{ url('oit/approveUpdates') }}"><i class="fa fa-windows fa-fw"></i> Approve Updates</a>
          </li>
          <li>
            <a href="{{ url('oit/updates') }}"><i class="fa fa-windows fa-fw"></i> Install Updates</a>
          </li>
          @endif

          @if( Auth::user()->checkAccess('LogEntry.read') )
          <li>
            <a href="{{ url('oit/logs') }}"><i class="fa fa-list-alt fa-fw"></i> Read Logs</a>
          </li>
          @endif

        </ul>
      </li>


      <li>
        <a href="{{ url('/auth/logout') }}"><i class="fa fa-sign-out fa-fw"></i> Logout </a>
      </li>
  	</ul>
  	</div>
  	<!-- /.sidebar-collapse -->
  </div>
  <!-- /.navbar-static-side -->
@endif
