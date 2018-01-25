;(function(window) {
  var self;


  window.sharepoint = {};
  window.sharepoint.fn = {};

  self = window.sharepoint;

  window.sharepoint.fn = {

    projects : function() {
      var
          refreshInterval = 30*1000,
          countdown_interval,
          countdown,
          count,
          setHeader,
          showProjects,
          serialize,
          ignoreProp,
          cleanProp,
          parseTaxonomy,
          exec,
          datatable,
          site = 'https://sp-hprm-tst.msb.matsugov.lan/sites/project-portal',
          query = {
            querytext : "'ContentTypeId:0x010021BC7C845DB8D44986A57A0DA0437ABC*'",
            selectproperties : "'" + [
              'Title',
              'Description',
              'ExecutiveSummaryOWSMTXT',
              'ProjectStartDateOWSDATE',
              'ProjectStartScheduOWSDATE',
              'ProjectEndDateOWSDATE',
              'ProjectEndScheduleOWSDATE',
              'StartDateScheduled',
              'EndDateScheduled',
              'owstaxIdOwnerx0020Department',
              'CategoriesOWSTEXT',
              'ListUrl',
              'ProjectStatusOWSCHCS',
              'ReportingFrequencyOWSCHCS',
              'Priority',
              'ProjectNumberOWSTEXT',
              'OriginOWSCHCS',
              'OriginalPath',
              'SPSiteUrl',
              'Notes',
              'PublishingImage',
              'ParentLink',
              'SiteTitle',
              'SitePath',
              'SiteID',
              'AttachmentURI',
              'DefaultEncodingURL',
              'ExternalMediaURL',
              'HierarchyUrl',
              'OrgParentUrls',
              'OrgUrls',
              'Path',
              'PictureThumbnailURL',
              'PictureURL',
              'SiteLogo',
            ].join(',') + "'",
            rowlimit : 30,

          };

      setHeader = function(xhr) {
        xhr.setRequestHeader('accept','application/json;odata=verbose');
      }

      serialize = function(obj) {
        var str = [];
        for(var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(p + "=" + encodeURIComponent(obj[p]));
          }
        return str.join("&");
      }

      parseTaxonomy = function(val)
      {
        var tax = {
          termGuids : [],
          termSetGuids : [],
          termValues : []
        }

        var parts = val.split(';');

        _.each(parts, function( part ) {

          if ( part.indexOf('GP0|#') === 0) {
            var tempGUID = part.replace('GP0|#','');
            tax.termGuids.push(tempGUID);
          } else if ( part.indexOf('GTSet|#') === 0) {
            var tempGUID = part.replace('GTSet|#','');
            tax.termSetGuids.push(tempGUID);
          } else if (part.indexOf('L0|#') === 0) {

            var tempParts = part.replace('L0|#','').split('|');
            tax.termGuids.push( tempParts[0] );
            tax.termValues.push(tempParts[1] );

          }

        });

        return tax;

      }

      renderTitle = function(data, type, row) {
        /*
        <span title="Open Menu"
          class="NotificationDiv ms-ellipsis-a js-callout-launchPoint"
          style="margin-top: 3px; float: right; cursor: pointer;"
          rel="/_layouts/15/listform.aspx?ListId={f0456e81-3235-4fff-b2c0-410702fb6e6b}&amp;ID=1&amp;ContentTypeID=0x010021BC7C845DB8D44986A57A0DA0437ABC00B232F1241B4F30439589819AAFD5292B&amp;Source=https://sp-hprm-tst.msb.matsugov.lan/sites/project-portal/Pages/Portal.aspx"
          path="https://sp-hprm-tst.msb.matsugov.lan/sites/project-portal/project-plastic/Lists/Project Details/DispForm.aspx?ID=1"
          ref="Project Plastic">
          <img class="ms-ellipsis-icon" alt="Open Menu" src="/_layouts/15/images/spcommon.png">
        </span>
        */
        return  $('<a/>', { target : '_blank', href : row.OriginalPath }).html(data).prop('outerHTML');

      }

      showProjects = function(response) {
        var projects_raw = response.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results,
            projects_parsed = [];

        countdown();

        _.each( projects_raw, function( row ) {
          var temp = {};

          _.each( row.Cells.results, function( cell ) {
            if ( ignoreProp(cell.Key) ) return false;

            temp[ cleanProp(cell.Key) ] = cell.Value;
          })

          projects_parsed.push(temp);

        });

        if ( datatable !== undefined ) {
          datatable.destroy();
        }

        datatable = $('#projects_table').DataTable({
          processing : true,
          data : projects_parsed,
          columns : [
            //{ data : 'number', render : function(data, type, row) { return  $('<a/>', { target : '_blank', href : 'http://isupport/Rep/Incident/default.aspx?ID=' + row.id }).html(data).prop('outerHTML'); } },
            { data : 'PublishingImage', render : function(data, type, row) { var $d = $(data); $d.attr('src', 'https://sp-hprm-tst.msb.matsugov.lan' + $d.attr('src')); return $d.prop('outerHTML'); } },
            { data : 'Title', render : renderTitle},
            { data : 'SiteTitle', render : function(data, type, row) { return  $('<a/>', { target : '_blank', href : row.ParentLink.replace('/Lists/Project Details/AllItems.aspx','') }).html(data).prop('outerHTML'); }},
            { data : 'ProjectStatus'},
            { data : 'ProjectStartDate', render : function(data) { return data.slice(0,10) } },
            { data : 'ProjectEndDate', render : function(data) { return data.slice(0,10) } },
            { data : 'ProjectNumber'},
            { data : 'Origin'},
            { data : 'Priority'},
            { data : 'ReportingFrequency'},
            { data : 'Owner Department', render : function(data) { var tax = parseTaxonomy(data); return tax.termValues.join('; ') } },
            { data : 'Categories'},
            // { data : 'description', render : function(data) { return $('<p>' + data + '</p>').text().slice(0,50) + '...' }},
            // { data : 'priority'},
            // { data : 'status'},
            // { data : 'customer'},
            // { data : 'department'},
          ]
        })

        console.log('response', projects_parsed);

        setTimeout( exec, refreshInterval );
      }



      ignoreProp = function(prop) {
        var ignored = [
          'AAMEnabledManagedProperties',
          'DocId',
          'PartitionId',
          'Rank',
          'RenderTemplateId',
          'UrlZone'
        ];

        return ( _.indexOf( ignored, prop ) !== -1 );
      }

      cleanProp = function(prop) {
        return prop
          .replace('owstaxId','')
          .replace('x0020',' ')
          .replace('OWSMTXT','')
          .replace('OWSCHCS','')
          .replace('OWSDATE','')
          .replace('OWSTEXT','');
      }

      countdown = function() {
        count = refreshInterval;

        if ( countdown_interval !== undefined )
        {
          clearInterval(countdown_interval);
        }

        countdown_interval = setInterval( decrement, 1000 );
      }

      decrement = function() {
        $('#countdown').html( Math.floor(count/1000) )
        count -= 1000;
      }

      exec = function() {
        $.ajax({
          url : self.fn.getApiSearchUrl(site),
          type : 'GET',
          data : serialize(query),
          dataType : 'json',
          beforeSend : setHeader,
          success : showProjects,
          processData: false,
          xhrFields: {
            withCredentials: true
          },
          headers:{
            "Accept": "application/json; odata=verbose"
          },
          contentType: "application/json; odata=verbose"
        });
      }


      exec();
    },

    getApiSearchUrl : function(site) {
      return site + '/_api/search/query';
    }

  }


})(window);
