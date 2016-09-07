<!--[if mso]>
<style>h1, h2, h3, body,table tr,table td, table th, a, span,table.MsoNormalTable {  
    font-family:Calibri, Arial, Helvetica, sans-serif !important;  
}

table tr:nth-child(even) {
    background:#c4e3f3;
}

table tr:nth-child(odd) {
    background:#d9edf7;
}
</style>
<!--<![endif]-->

<div style="font-family:'Calibri, Arial, sans-serif', background:#fcf8e3; ">

<h1>MSB IT Dashboard</h1>
<h2>Notification Digest</h2>
@if( $which == 'fifteen' )
<h3>From last 15 minutes</h3>
@elseif( $which == 'daily' )
<h3>From last day</h3>
@else
<h3>From last week</h3>
@endif

@if( $logEntries->count() )
<table style="width:100%; border:1px solid #bce8f1; color:#31708f; border-radius:3px; padding:15px;">
    <tr>
        <th>Severity</th>
        <th>Source</th>
        <th>Message</th>
        <th>Last Reported At</th>
        <th>Entry Count</th>
    </tr>
    @each('emails.logEntry',$logEntries,'logEntry' )
</table>

<div style="width:100% background:#fcf8e3; border:1px solid #faebcc; border-radius:3px; color: #8a6d3b; padding:15px;">
<h2>Severity Levels</h2>
<p>These levels are borrowed from the syslog protocol. See <a href="https://tools.ietf.org/html/rfc5424">RFC5424</a> for more information.</p>
    <ul>
        <li><strong>Debug</strong> <em>Detailed debug information</em></li>
        <li><strong>Info</strong> <em>Interesting events</em></li>
        <li><strong>Notice</strong> <em>Normal, significant events</em></li>
        <li><strong>Warning</strong> <em>Exceptional occurrences that are not errors</em></em>
        <li><strong>Error</strong> <em>Errors that do not require immediate action</em></li>
        <li><strong>Critical</strong> <em>Critical conditions, impending failure</em></li>
        <li><strong>Alert</strong> <em>Action must be taken immediately</em></li>
    <li><strong>Emergency</strong> <em>Urgent alert</em></li>
    </ul>
</div>

@else()
<p><em>Nothing to report</em></p>
@endif

</div>