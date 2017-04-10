// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader('X-Parse-Application-Id', '42c3ed7c94fed042291633945f78fc083d80d18a');
  jqXHR.setRequestHeader('X-Parse-REST-API-Key', '890ad4e875072efc3ea94f238b1f19d96047e3e6');
});

