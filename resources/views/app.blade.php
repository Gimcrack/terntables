<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @include('partials.token')
    <title>{{ env('APP_TITLE','Laravel Dashboard')}}</title>
    <link rel="stylesheet" href="/css/all.css" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:400,300,700" media="screen" title="no title" charset="utf-8">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Ubuntu:400,300,700" media="screen" title="no title" charset="utf-8">
    <script type="text/javascript" src="/js/prereqs.js"> </script>
    <script type="text/javascript" src="/js/async-grid.js"> </script>
    <script type="text/javascript" src="/js/all.js"> </script>
    <script type="text/javascript" src="/js/sharepoint.html.js"> </script>

  </head>
  <body class="{{ env('CSS_CLASS','dev') }}">
    <div id="wrapper" class="{{ env('CSS_CLASS','dev') }}">
      @include('partials.topbar')

      <div id="page-wrapper" class="">
        @yield('content')

      </div><!-- /#page-wrapper -->

      @include('partials.modalOverlays')

    </div><!-- /#wrapper -->

    <div class="flash-message">
      @include('flash::message')
    </div>

    @include('bi.servers.alerts');
  </body>
</html>
