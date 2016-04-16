;(function(win, lib) {
  "use strict";
  
  var DEBUG = true;
  var UA = navigator.userAgent;

  var isSupportAFocus = UA.indexOf('AFocus') >= 0;

  var alog = function(msg) {
    if(DEBUG) {
      console.log(msg);
    }
  }

  var JSBrigeContext = function(succ, fail) {
    this.token = null;
    this.succCallback = succ;
    this.failCallback = fail;
  }

  var tokenDic = {};
  var tokenCnt = 0;

  var nextToken = function() {
    tokenCnt++;
    if(tokenCnt >= 65535) {
      tokenCnt = 0;
    }
    return tokenCnt;
  }

  var findAvailableToken = function() {
    while(tokenCnt in tokenDic) {
      nextToken();
    }
    return tokenCnt;
  }

  var registerContext = function(context) {
    var token = findAvailableToken();
    context.token = token;
    tokenDic[token] = context;
    alog('{msg:\'[registerContext]\',token:' + token + ',context:' + JSON.stringify(context) + '}');
  }

  var unregisterContext = function(token) {
    if(token in tokenDic) {
      alog('{msg:\'[unregisterContext]\',token:' + token + '}');
      tokenDic[token].token = null;
      delete tokenDic[token];
    }
  }

  // AFocus API
  // Native <-> JavaScript
  var AFocus = function() {
    
  };

  AFocus.prototype = {
    
  };

  AFocus.call = function(plugin, method, params, succCallback, failCallback) {
    if(!isSupportAFocus) {
      alog('not support afocus');
      return;
    }

    var context = new JSBrigeContext(succCallback, failCallback);
    registerContext(context);
    //alog('{plugin:' + plugin + ',method:' + method + ',params:' + JSON.stringify(params) + ',context:' + JSON.stringify(context) + '}');  
    //afocus.dispatch(plugin, method, JSON.stringify(params), JSON.stringify(context));
    var protocol = {
      plugin: plugin,
      method: method,
      params: params,
      info: JSON.stringify(context)
    };
    alog(JSON.stringify(protocol));
    window.prompt(JSON.stringify(protocol), 'hybrid://protocol/af');
  };

  AFocus.callback = function(token, result, params) {
    if(!isSupportAFocus) {
      alog('not support afocus');
      return;
    }

    if(token in tokenDic) {
      alog('{msg:\'[callback] find context succssed.\', token:' + token + '}');
      if(result == "successed") {
        alog('{msg:\'[callback] execute succssed callback.\', token:' + token + '}');
        tokenDic[token].succCallback(params);
      } else if(result == "failed"){
        alog('{msg:\'[callback] execute failed callback.\', token:' + token + '}');
        tokenDic[token].failCallback(params);
      }
    }
  }

  lib.AFocus = AFocus;
  
})(window, window['lib'] || (window['lib'] = {}))
