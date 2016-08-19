<tr>
    <td>{{ $logEntry->level_name }}</td>
    <td>{{ $logEntry->loggable_type }}\{{ $logEntry->loggable_name }} </td>
    <td>{{ $logEntry->message }}</td>
    <td>{{ ( new \Carbon\Carbon($logEntry->reported_at) )->diffForHumans() }}</td>
</tr>