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

    <script type="text/javascript" src="/js/underscore.js"> </script>
    <script type="text/javascript" src="/js/jstorage.js"> </script>
    <script type="text/javascript" src="/js/async-grid/js/jApp.class.js"> </script>
    <script type="text/javascript" src="/js/all.js"> </script>

    <script type="text/javascript" src="/js/working/jquery.validator.js"></script>

    <script type="text/javascript" src="/js/async-grid/js/jForm.class.js"> </script>
    <script type="text/javascript" src="/js/async-grid/js/jInput.class.js"> </script>
    <script type="text/javascript" src="/js/async-grid/js/jLinkTable.class.js"> </script>
    <script type="text/javascript" src="/js/async-grid/js/jUtility.class.js"> </script>

    <script type="text/javascript" src="/js/async-grid/js/jGrid.class.js"> </script>
    <script type="text/javascript" src="/js/working/admin.contacts.html.js"> </script>
    <script type="text/javascript" src="/js/working/admin.users.html.js"> </script>
    <script type="text/javascript" src="/js/working/admin.groups.html.js"> </script>
    <script type="text/javascript" src="/js/working/admin.modules.html.js"> </script>
    <script type="text/javascript" src="/js/working/profile.html.js"> </script>
    <script type="text/javascript" src="/js/working/documents.html.js"> </script>
  </head>
  <body class="{{ env('CSS_CLASS') }}">
    <div id="wrapper" class="{{ env('CSS_CLASS') }}">
      @include('partials.topbar')

      <div id="page-wrapper" class="">
        @yield('content')

      </div><!-- /#page-wrapper -->

      @include('partials.modalOverlays')

    </div><!-- /#wrapper -->

    <div class="flash-message">
      @include('flash::message')
    </div>
  </body>
</html>
