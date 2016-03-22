<script>

$(function(){
  var getMessages = function() {

    console.log('getting messages');

    $.getJSON('/api/v1/Server/_alerts', function(response) {
      var h = [];
      $('#messages-badge').html( ( !! response.length ) ? response.length : '' );

      _.each(response, function(o,i) {
        h.push('<li><a href="#"><div><strong>' + o.name + '</strong><span class="pull-right text-muted"><em>' + o.updated_at_for_humans + '</em>' +
                '</span></div>' +
                '<div>' + o.alert.replace('\r\n','<br/>').replace('--Reported at','<br/> -- ') + '</div></a></li>');
      });

      $('.dropdown-messages').html( h.join('<li class="divider"></li>') );

    });

  }

  getMessages();
  setInterval(getMessages ,60000);

});

</script>
