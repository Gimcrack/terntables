<script>

;(function(window){

  window.messages = {

    ackAll : function() {
      $.getJSON('/api/v1/Alert/_acknowledge', function() { messages.get() } )
    },

    ack : function(id) {
      $.getJSON('/api/v1/Alert/' + id + '/_acknowledge', function() { messages.get() })
    },

    get : function() {

      console.log('getting messages');

      $.getJSON('/api/v1/Alert/_server', function(response) {
        messages.process(response)
      });
    },

    process : function(response) {
      var h = [];
      $('#messages-badge').html( ( !! response.length ) ? response.length : '' );


      if ( !! response.length )
      {
        h.push(
          '<li> <button style="margin:10px; width:95%;" type="button" onclick="messages.ackAll()" class="btn btn-primary">Acknowledge All</button> </li>'
        );
      }

      _.each(response, function(o,i) {
        h.push('<li><a href="#"><div><strong>' + o.name + '</strong><span class="pull-right text-muted"><em>' + o.updated_at_for_humans + '</em>' +
                '</span></div>' +
                '<div>' + o.message.replace('\r\n','<br/>').replace('--Reported at','<br/> -- ') + '</div></a>' +
                '<button style="margin:10px;" type="button" onclick="messages.ack(' + o.id + ')" class="btn btn-sm btn-primary">Acknowledge</button>' +
                '</li>');
      });

      $('.dropdown-messages').html( h.join('<li class="divider"></li>') );


      setTimeout( messages.get, 60000);

    }

  }
}(window));

$(function() {
    messages.get();
})


</script>
