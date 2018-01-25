@if( \Auth::check() )
    <meta name="api_token" content="{{ \Auth::user()->api_token }}">
 @endif