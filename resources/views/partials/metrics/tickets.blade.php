<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/s/bs-3.3.5/dt-1.10.10,b-1.1.0,b-html5-1.1.0,cr-1.3.0,fh-3.1.0,r-2.0.0,sc-1.4.0/datatables.min.css"/>



    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js"></script>

    <script src="//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.2.0/lodash.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.js"></script>
    <script type="text/javascript" src="//cdn.datatables.net/s/bs-3.3.5/dt-1.10.10,b-1.1.0,b-html5-1.1.0,cr-1.3.0,fh-3.1.0,r-2.0.0,sc-1.4.0/datatables.min.js"></script>

    <script type="text/javascript">
      /*!
       * jQuery.parseJSON() extension (supports ISO & Asp.net date conversion)
       *
       * Version 1.0 (13 Jan 2011)
       *
       * Copyright (c) 2011 Robert Koritnik
       * Licensed under the terms of the MIT license
       * http://www.opensource.org/licenses/mit-license.php
       */
      (function ($) {
       
          // JSON RegExp
          var rvalidchars = /^[\],:{}\s]*$/;
          var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
          var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
          var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
          var dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
          var dateNet = /\/Date\((\d+)(?:-\d+)?\)\//i;
       
          // replacer RegExp
          var replaceISO = /"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:[.,](\d+))?Z"/i;
          var replaceNet = /"\\\/Date\((\d+)(?:-\d+)?\)\\\/"/i;
       
          // determine JSON native support
          var nativeJSON = (window.JSON && window.JSON.parse) ? true : false;
          var extendedJSON = nativeJSON && window.JSON.parse('{"x":9}', function(k,v){return "Y";}) === "Y";
       
          var jsonDateConverter = function(key, value) {
              if (typeof(value) === "string")
              {
                  if (dateISO.test(value))
                  {
                      return new Date(value);
                  }
                  if (dateNet.test(value))
                  {
                      return new Date(parseInt(dateNet.exec(value)[1], 10));
                  }
              }
              return value;
          };
       
          $.extend({
              parseJSON: function(data, convertDates) {
                  /// <summary>Takes a well-formed JSON string and returns the resulting JavaScript object.</summary>
                  /// <param name="data" type="String">The JSON string to parse.</param>
                  /// <param name="convertDates" optional="true" type="Boolean">Set to true when you want ISO/Asp.net dates to be auto-converted to dates.</param>
       
                  if (typeof data !== "string" || !data) {
                      return null;
                  }
       
                  // Make sure leading/trailing whitespace is removed (IE can't handle it)
                  data = $.trim(data);
       
                  // Make sure the incoming data is actual JSON
                  // Logic borrowed from http://json.org/json2.js
                  if (rvalidchars.test(data
                      .replace(rvalidescape, "@")
                      .replace(rvalidtokens, "]")
                      .replace(rvalidbraces, "")))
                  {
                      // Try to use the native JSON parser
                      if (extendedJSON || (nativeJSON && convertDates !== true))
                      {
                          return window.JSON.parse(data, convertDates === true ? jsonDateConverter : undefined);
                      }
                      else
                      {
                          data = convertDates === true ?
                              data.replace(replaceISO, "new Date(parseInt('$1',10),parseInt('$2',10)-1,parseInt('$3',10),parseInt('$4',10),parseInt('$5',10),parseInt('$6',10),(function(s){return parseInt(s,10)||0;})('$7'))")
                                  .replace(replaceNet, "new Date($1)") :
                              data;
                          return (new Function("return " + data))();
                      }
                  } else
                  {
                      $.error("Invalid JSON: " + data);
                  }
              }
          });
      })(jQuery);
      
    </script>

    <style>
      h3 { text-align: center }
      /*svg { height : 450px; }*/
      .windows8 {
        position: relative;
        width: 78px;
        height:78px;
        margin:auto;
      }

          .windows8 .wBall {
            position: absolute;
            width: 74px;
            height: 74px;
            opacity: 0;
            transform: rotate(225deg);
              -o-transform: rotate(225deg);
              -ms-transform: rotate(225deg);
              -webkit-transform: rotate(225deg);
              -moz-transform: rotate(225deg);
            animation: orbit 6.96s infinite;
              -o-animation: orbit 6.96s infinite;
              -ms-animation: orbit 6.96s infinite;
              -webkit-animation: orbit 6.96s infinite;
              -moz-animation: orbit 6.96s infinite;
          }

          .windows8 .wBall .wInnerBall{
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgb(0,0,0);
            left:0px;
            top:0px;
            border-radius: 10px;
          }

          .windows8 #wBall_1 {
            animation-delay: 1.52s;
              -o-animation-delay: 1.52s;
              -ms-animation-delay: 1.52s;
              -webkit-animation-delay: 1.52s;
              -moz-animation-delay: 1.52s;
          }

          .windows8 #wBall_2 {
            animation-delay: 0.3s;
              -o-animation-delay: 0.3s;
              -ms-animation-delay: 0.3s;
              -webkit-animation-delay: 0.3s;
              -moz-animation-delay: 0.3s;
          }

          .windows8 #wBall_3 {
            animation-delay: 0.61s;
              -o-animation-delay: 0.61s;
              -ms-animation-delay: 0.61s;
              -webkit-animation-delay: 0.61s;
              -moz-animation-delay: 0.61s;
          }

          .windows8 #wBall_4 {
            animation-delay: 0.91s;
              -o-animation-delay: 0.91s;
              -ms-animation-delay: 0.91s;
              -webkit-animation-delay: 0.91s;
              -moz-animation-delay: 0.91s;
          }

          .windows8 #wBall_5 {
            animation-delay: 1.22s;
              -o-animation-delay: 1.22s;
              -ms-animation-delay: 1.22s;
              -webkit-animation-delay: 1.22s;
              -moz-animation-delay: 1.22s;
          }



          @keyframes orbit {
            0% {
              opacity: 1;
              z-index:99;
              transform: rotate(180deg);
              animation-timing-function: ease-out;
            }

            7% {
              opacity: 1;
              transform: rotate(300deg);
              animation-timing-function: linear;
              origin:0%;
            }

            30% {
              opacity: 1;
              transform:rotate(410deg);
              animation-timing-function: ease-in-out;
              origin:7%;
            }

            39% {
              opacity: 1;
              transform: rotate(645deg);
              animation-timing-function: linear;
              origin:30%;
            }

            70% {
              opacity: 1;
              transform: rotate(770deg);
              animation-timing-function: ease-out;
              origin:39%;
            }

            75% {
              opacity: 1;
              transform: rotate(900deg);
              animation-timing-function: ease-out;
              origin:70%;
            }

            76% {
            opacity: 0;
              transform:rotate(900deg);
            }

            100% {
            opacity: 0;
              transform: rotate(900deg);
            }
          }

          @-o-keyframes orbit {
            0% {
              opacity: 1;
              z-index:99;
              -o-transform: rotate(180deg);
              -o-animation-timing-function: ease-out;
            }

            7% {
              opacity: 1;
              -o-transform: rotate(300deg);
              -o-animation-timing-function: linear;
              -o-origin:0%;
            }

            30% {
              opacity: 1;
              -o-transform:rotate(410deg);
              -o-animation-timing-function: ease-in-out;
              -o-origin:7%;
            }

            39% {
              opacity: 1;
              -o-transform: rotate(645deg);
              -o-animation-timing-function: linear;
              -o-origin:30%;
            }

            70% {
              opacity: 1;
              -o-transform: rotate(770deg);
              -o-animation-timing-function: ease-out;
              -o-origin:39%;
            }

            75% {
              opacity: 1;
              -o-transform: rotate(900deg);
              -o-animation-timing-function: ease-out;
              -o-origin:70%;
            }

            76% {
            opacity: 0;
              -o-transform:rotate(900deg);
            }

            100% {
            opacity: 0;
              -o-transform: rotate(900deg);
            }
          }

          @-ms-keyframes orbit {
            0% {
              opacity: 1;
              z-index:99;
              -ms-transform: rotate(180deg);
              -ms-animation-timing-function: ease-out;
            }

            7% {
              opacity: 1;
              -ms-transform: rotate(300deg);
              -ms-animation-timing-function: linear;
              -ms-origin:0%;
            }

            30% {
              opacity: 1;
              -ms-transform:rotate(410deg);
              -ms-animation-timing-function: ease-in-out;
              -ms-origin:7%;
            }

            39% {
              opacity: 1;
              -ms-transform: rotate(645deg);
              -ms-animation-timing-function: linear;
              -ms-origin:30%;
            }

            70% {
              opacity: 1;
              -ms-transform: rotate(770deg);
              -ms-animation-timing-function: ease-out;
              -ms-origin:39%;
            }

            75% {
              opacity: 1;
              -ms-transform: rotate(900deg);
              -ms-animation-timing-function: ease-out;
              -ms-origin:70%;
            }

            76% {
            opacity: 0;
              -ms-transform:rotate(900deg);
            }

            100% {
            opacity: 0;
              -ms-transform: rotate(900deg);
            }
          }

          @-webkit-keyframes orbit {
            0% {
              opacity: 1;
              z-index:99;
              -webkit-transform: rotate(180deg);
              -webkit-animation-timing-function: ease-out;
            }

            7% {
              opacity: 1;
              -webkit-transform: rotate(300deg);
              -webkit-animation-timing-function: linear;
              -webkit-origin:0%;
            }

            30% {
              opacity: 1;
              -webkit-transform:rotate(410deg);
              -webkit-animation-timing-function: ease-in-out;
              -webkit-origin:7%;
            }

            39% {
              opacity: 1;
              -webkit-transform: rotate(645deg);
              -webkit-animation-timing-function: linear;
              -webkit-origin:30%;
            }

            70% {
              opacity: 1;
              -webkit-transform: rotate(770deg);
              -webkit-animation-timing-function: ease-out;
              -webkit-origin:39%;
            }

            75% {
              opacity: 1;
              -webkit-transform: rotate(900deg);
              -webkit-animation-timing-function: ease-out;
              -webkit-origin:70%;
            }

            76% {
            opacity: 0;
              -webkit-transform:rotate(900deg);
            }

            100% {
            opacity: 0;
              -webkit-transform: rotate(900deg);
            }
          }

          @-moz-keyframes orbit {
            0% {
              opacity: 1;
              z-index:99;
              -moz-transform: rotate(180deg);
              -moz-animation-timing-function: ease-out;
            }

            7% {
              opacity: 1;
              -moz-transform: rotate(300deg);
              -moz-animation-timing-function: linear;
              -moz-origin:0%;
            }

            30% {
              opacity: 1;
              -moz-transform:rotate(410deg);
              -moz-animation-timing-function: ease-in-out;
              -moz-origin:7%;
            }

            39% {
              opacity: 1;
              -moz-transform: rotate(645deg);
              -moz-animation-timing-function: linear;
              -moz-origin:30%;
            }

            70% {
              opacity: 1;
              -moz-transform: rotate(770deg);
              -moz-animation-timing-function: ease-out;
              -moz-origin:39%;
            }

            75% {
              opacity: 1;
              -moz-transform: rotate(900deg);
              -moz-animation-timing-function: ease-out;
              -moz-origin:70%;
            }

            76% {
            opacity: 0;
              -moz-transform:rotate(900deg);
            }

            100% {
            opacity: 0;
              -moz-transform: rotate(900deg);
            }
          }
    </style>
  </head>

  <body>
      @yield('body')
  </body>
</html>
