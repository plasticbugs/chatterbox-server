var App = function() {
  this.server = 'http://127.0.0.1:3000/classes/messages';
  this.username = 'Scott';
  this.roomList = [];
};

App.prototype.init = function() {
  this.fetch();
};

App.prototype.send = function(message) {

  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
  
};

App.prototype.fetch = function(room) {

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    data: {
      order: '-createdAt',
      limit: 400
    },
    success: function (data) {
      
      console.log(data.results);

      // for (var i = 0; i < data.results.length; i++) {
      //   if (data.results[i].roomname === '' || data.results[i].roomname === null || data.results[i].roomname === undefined ) {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (!_.has(data.results[i], 'text') || !_.has(data.results[i], 'username') || data.results[i].text === '') {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].roomname.length > 20) {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].text && data.results[i].text.match('<.*>')) { 
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].username && data.results[i].username.match('<.*>')) {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].createdAt && data.results[i].createdAt.match('<.*>')) {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].updatedAt && data.results[i].updatedAt.match('<.*>')) {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].roomname && data.results[i].roomname.match('<.*>')) {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].username && data.results[i].username === 'hi') {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      //   if (data.results[i].username && data.results[i].username === 'plasticbugs') {
      //     data.results.splice(i, 1);
      //     i--;
      //     continue;
      //   }
      // }

      if (room !== undefined) {
        for (var i = 0; i < data.results.length; i++) {
          if (data.results[i].roomname && data.results[i].roomname !== room) {
            data.results.splice(i, 1);
            i--;
            continue;
          }          
        }
      }

      console.log('chatterbox: Message recieved');

      var uniqRooms = {};

      for (var i = 0; i < data.results.length; i++) {
        if (uniqRooms[data.results[i].roomname] === undefined && data.results[i].roomname !== undefined) {
          uniqRooms[data.results[i].roomname] = 1;
        }
      }

      for (var key in uniqRooms) {
        app.renderRoom(key);
      }
     
      data.results.forEach(function(message) {
        app.renderMessage(message);
      });


    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

App.prototype.clearMessages = function() {

  $('#chats').children().remove();
  
};

App.prototype.renderMessage = function(message) {

  if (message) {

    var username = message.username;
    //var created = message.createdAt || $.now();
    var roomname = message.roomname || 'lobby';
    var text = message.text;

    var elementToAppend = `<div class="row tweet">
                            <div class="two columns">
                              <p class="userName">` + username + `</p>
                            </div>
                            <div class="six columns">
                              <p class="textBox">` + text + `</p>
                            </div>
                          </div>`;


    $('#chats').append(elementToAppend);  
  }

};

App.prototype.renderRoom = function(room) {
  
  if (room === null || room === '' || room === undefined || app.roomList.indexOf(room) !== -1) {
    return;
  }

  var roomToAppend = '<option class="workPlox">' + room + '</option>';
  $('#roomSelect').append(roomToAppend);
  app.roomList.push(room);

};

App.prototype.handleUsernameClick = function(clickedUsername, cssProperty, cssValue) {
  
  var children = $('#chats').children();
  
  _.each(children, function(tweet) {
    var username = $(tweet).find('.userName').text();
    if (clickedUsername === username) {
      console.log(username);
      $(tweet).css(cssProperty, cssValue);
    }
  });
  
};

App.prototype.handleSubmit = function() {
  app.clearMessages();
  app.fetch();
};

var app = new App();

$(document).ready(function() {

  app.init();

  $('#refresh').on('click', function(event) {
    event.preventDefault();
    app.clearMessages();
    var room = $('#roomSelect').val();
    console.log(room);
    app.fetch(room);
  });

  $('#postMessage').on('click', function(event) {
    event.preventDefault();

    var myText = $('textarea#exampleMessage').val();
    $('textarea#exampleMessage').val('');
    console.log(myText);

    var newMessage = {
      username: app.username,
      createdAt: $.now(),   
      text: myText,
      roomname: $('#roomSelect').val() || "lobby"
    };

    app.send(newMessage);
    app.clearMessages();
    app.fetch();
  });

  $(document).on('click', '#postAddRoom', function(event) {
    event.preventDefault();
    var roomName = $('textarea#postAddRoom').val();
    app.renderRoom(roomName);
    $('textarea#postAddRoom').val('');
  });

  $(document).on('click', '.userName', function() {
    if ($(this).css('font-weight') === 'bold') {
      
      console.log($(this).attr('font-weight', 'bold'));
      var cssProperty = 'font-weight';
      var cssValue = 'normal';
      console.log(cssProperty);
      console.log(cssValue);
      app.handleUsernameClick($(this).text(), cssProperty, cssValue);

    } else {

      var cssProperty = 'font-weight';
      var cssValue = 'bold';
      console.log(cssProperty);
      console.log(cssValue);
      app.handleUsernameClick($(this).text(), cssProperty, cssValue);

    }
  });

  $(document).on('change', '#roomSelect', function(event) {

    event.preventDefault();
    var room = $(this).val();
    console.log(room);
    app.clearMessages();
    app.fetch(room);

  });

});


