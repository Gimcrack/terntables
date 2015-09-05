<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Aynchronous Laravel Dashboard</title>
    <link rel="stylesheet" href="/css/all.css" media="screen" title="no title" charset="utf-8">
  </head>
  <body class="{{ env('CSS_CLASS') }}">
    <div id="wrapper" class="{{ env('CSS_CLASS') }}">


      @include('partials.topbar')

      <div id="page-wrapper" class="">
        @yield('content')
      </div><!-- /#page-wrapper -->

      @include('partials.modalOverlays')

    </div><!-- /#wrapper -->
    <script type="text/javascript" src="/js/all.js"> </script>
  </body>
</html>
