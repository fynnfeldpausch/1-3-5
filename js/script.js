$(document).on('ready', function() {
  app.init();
});

var app = {
  store: $.localStorage,
  dirty: false,

  init: function() {
    $(".row li").hover(
      function () { $(this).addClass('hover'); },
      function () { $(this).removeClass('hover'); }
    );
    $('.row .box').click(
      function(e) { app.toggle($(this)); }
    );
    $('.row input').keyup(
      function(e) { app.dirty = true; }
    ).focusin(
      function(e) { $(this).parents('li').addClass('focus'); }
    ).focusout(
      function(e) { $(this).parents('li').removeClass('focus'); }
    );
    $('#clear').click(function(e) {
      e.preventDefault();
      app.clear();
    });
    setInterval(
      function() { if (app.dirty) { app.save(); } }, 2500
    );
    app.load();
  },

  toggle: function($box) {
    var $li = $($box.parents('li'));
    if ($li.find('input').val() == "") {
      return;
    } else if ($li.hasClass('checked')) {
      $li.removeClass('checked');
      $li.find('input').attr('readonly', false);
      app.store.delete($li.attr('id'));
    } else {
      $li.addClass('checked');
      $li.find('input').attr('readonly', true);
      app.store.set($li.attr('id'), true);
    }
  },

  load: function() {
    app.showDate();
    $('.row input').each(function(i) {
      $(this).val(app.store.get($(this).parents('li').attr('id') + '-txt'));
    });
    $('.row .box').each(function(i) {
      if (app.store.get($(this).parents('li').attr('id'))) {
        app.toggle($(this));
      }
    });
  },

  save: function() {
    $('.row input').each(function(i) {
      app.store.set($(this).parents('li').attr('id') + '-txt', $(this).val());
    });
    app.store.set('date', new Date().toISOString());
    app.showDate();
    app.dirty = false;
  },

  clear: function() {
    $('.row .box').each(function(i) {
      if ($(this).parents('li').hasClass('checked')) {
        app.toggle($(this));
      }
    });
    $('.row input').each(function(i) {
      $(this).val("");
      app.store.delete($(this).parents('li').attr('id') + '-txt');
    });
    app.store.delete('date');
    app.showDate();
  },

  showDate: function() {
    var date = app.store.get('date');
    if (!date) {
      $('#date').html("").attr('title', '');
    } else if($('#date').size() > 0) {
      var $date = $('<span id="date" />').attr('title', date).timeago();
      $('#date').replaceWith($date);
    } else {
      var $date = $('<span id="date" />').attr('title', date).css('display', 'none').timeago();
      $('header').prepend($date);
      $date.fadeIn();
    }
  }
}