/**
 * @file ding.availability.js
 * JavaScript behaviours for fetching and displaying availability.
 */

(function($) {

  // Cache of fetched availability information.
  Drupal.DADB = {};

  Drupal.behaviors.dingAvailabilityAttach = {
    attach: function(context, settings) {
      var ids = [];
      var html_ids = [];
      $.each(settings.ding_availability, function(id, entity_ids) {
        $.each(entity_ids, function(index, entity_id) {
          if (Drupal.DADB[entity_id] === undefined) {
            Drupal.DADB[entity_id] = null;
            ids.push(entity_id);
            html_ids.push(id);
          }
        });
      });

     $.each(html_ids, function(index, id) {
        $('#' + id).addClass('pending');
      });

      // Fetch availability.
      if (ids.length > 0) {
          //Insert spinner
        $('.field-name-ding-availability-holdings').append('<span style="margin-left: 45%;width: 33%;" class="availability_spinner"><img src="'+ Drupal.settings.avail_spinner.spinner +'" /></span>');
      
        $.getJSON(settings.basePath + 'ding_availability/' + (settings.ding_availability_mode ? settings.ding_availability_mode: 'items') + '/' + ids.join(','), {}, update);
      }
      else {
        // Apply already fetched availability
        $.each(settings.ding_availability, function(id, entity_ids) {
          updateAvailability(id, entity_ids);
        });
      }

      function update(data, textData) {
        $.each(data, function(id, item) {
          // Update cache.
          Drupal.DADB[id] = item;
        });

        $.each(settings.ding_availability, function(id, entity_ids) {
          if (id.match(/^availability-/)) {
            // Update availability indicators.
            updateAvailability(id, entity_ids);
          }
          else {
            // Update holding information.
            updateHoldings(id, entity_ids);
          }
        });
        $('.availability_spinner').remove(); 
      }

      function updateAvailability(id, entity_ids) {
        var available = false;
        var reservable = false;
        var on_way = false;
        $.each(entity_ids, function(index, entity_id) {
          if (Drupal.DADB[entity_id]) {
            available = available || Drupal.DADB[entity_id]['available'];
            reservable = reservable || Drupal.DADB[entity_id]['reservable'];
            on_way = Drupal.DADB[entity_id]['on_way'];
          }
        });

        var element = $('#' + id);
        element.removeClass('pending').addClass('processed');

        if (available) {
          element.addClass('available');
        }
        if (reservable) {
          element.addClass('reservable');
        }

        if ((available && reservable) || (available && !reservable)) {
          element.attr('title', Drupal.t('available'));
          // If availability is an link extrend information.
          if (settings.ding_availability_link === 1) {
            $('a', element).append('<span class="availability-status">&nbsp;(' + Drupal.t('available') + ')<span>');
          }
        }
        else if (!available && reservable) {
          element.attr('title', Drupal.t('on loan'));
          if (on_way){
              $('a', element).append('<span class="availability-status">&nbsp;(' + Drupal.t('Bought/On way') + ')<span>');
          }
            // If availability is an link extrend information.
          else if (settings.ding_availability_link === 1) {
            $('a', element).append('<span class="availability-status">&nbsp;(' + Drupal.t('on loan') + ')<span>');
          }        }
                
        else if (!available && ! reservable) {
          element.attr('title', Drupal.t('unavailable'));
          // If availability is an link extrend information.
          if (settings.ding_availability_link === 1) {
            $('a', element).append('<span class="availability-status">&nbsp;(' + Drupal.t('unavailable') + ')<span>');
          }
        }
      }
      function updateHoldings(id, entity_ids) {
        var entity_id = entity_ids.pop();
        var available = false;
        var reservable = false;
        if (Drupal.DADB[entity_id] && Drupal.DADB[entity_id]['html']) {
          var available = available || Drupal.DADB[entity_id]['available'];
          var reservable = reservable || Drupal.DADB[entity_id]['reservable'];
          var total_count = total_count || Drupal.DADB[entity_id]['total_count'];
          if (!available && !reservable && total_count < 2) {
            $('.group-materiale-details').css('padding-top','5px'); // When the box is not shown. add some padding.
            return;
        }else if($('.field-name-ding-periodical-issues').length)
        {
            $('.group-materiale-details').css('padding-top','5px'); // When the box is not shown. add some padding.
            $('.field-name-ding-availability-holdings').hide();
            return;
          } else {
            $('#' + id).append(Drupal.DADB[entity_id]['html']);
          }
        }
      }
    }
  };
})(jQuery);

