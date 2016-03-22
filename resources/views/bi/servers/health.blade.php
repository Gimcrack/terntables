@extends('frame')

@section('content')

<script type="text/javascript">

$(function() {

  var getServerHealth = function() {

    $.getJSON( '/api/v1/Server/_health', function(response) {
      var $target = $('.serverGrid');

      $target.find('.col1 .panel-body, .col2 .list-group').empty();

      _.each(response, function(server) {
        var className, d1 = new Date(server.updated_at), d2 = new Date();

        if ( server.alert != null && server.alert.toString().trim().length > 0 )
        {
          className = 'server alert';

          $('<li/>', { class : 'list-group-item', rel : server.id })
            .html(server.alert.replace('\r\n','<br/>').replace('--Reported at','<br/> --'))
            .appendTo($target.find('.col2 .list-group'));

        } else if ( (d2-d1)/1000/60 > 15 && server.name !== 'myProperty' ) // server hasn't checkedin in 15 mins
        {
          className = 'server warning';

          $('<li/>', { class : 'list-group-item', rel : server.id })
            .html(" Server " + server.name + ' has not checked in since ' + server.updated_at_for_humans + ". There may be a problem with the service.")
            .appendTo($target.find('.col2 .list-group'));
        }
        else {
          className = 'server';
        }



        $('<div/>', {
          class : className,
          rel : server.id,
          style : 'cursor:pointer'
        })
          .html('<i class="fa fa-fw fa-building"></i><br/>' + server.name )
          .appendTo($target.find('.col1 .panel-body'));
      });

      $('.server')
        .mouseover(function() {
          $('li[rel=' + $(this).attr('rel') + ']').addClass('active')
        })
        .mouseout(function() {
          $('li[rel=' + $(this).attr('rel') + ']').removeClass('active')
        })
    });

  }

  setInterval(getServerHealth, 60000);

  getServerHealth();

});

</script>

<div class="serverGrid">

  <div class="col2 col-lg-3">
    <div class="panel panel-warning"  style="padding:0 !important; margin:0 !important;">
      <div class="panel-heading">
        <i class="fa fa-fw fa-info"></i> Alerts
      </div>
      <div class="panel-body" style="padding:0 !important; margin:0 !important;">
        <ul class="list-group server-alerts">

        </ul>
      </div>

    </div>

  </div>

  <div class="col1 col-lg-9">
    <div class="panel panel-info" style="padding:0 !important; margin:0 !important;">
      <div class="panel-heading">
        <i class="fa fa-heart fa-fw"></i> Server Health
      </div>
      <div class="panel-body"  style="padding:0 !important; margin:0 !important;">

      </div>
    </div>
  </div>



</div>




@endsection
