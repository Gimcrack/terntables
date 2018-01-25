<h1>
 MSB IT Dashboard Warning
</h1>

<p>
  The following servers have not checked in in the last 15 minutes. Check to make sure the agent service is running.
</p>

<ul>
  @foreach($servers as $server)
  <li>
    {{ $server->name }} ({{ $server->updated_at_for_humans }})
  </li>
  @endforeach
</ul>

<small>Reported at {{ date('Y-m-d H:i:s') }}</small>
