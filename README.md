# lib-breeze

## 引入

下载 build/breeze.js, 在html中引入。

## UA
Breeze/version

## 调用Native接口

`lib.Breeze.call(plugin, method, params, succCallback, failCallback);`

例如
```
lib.Breeze.call('notify', 'showToast', {}, function(s) {
	console.log('succ');
}, function(e) {
	console.log('fail');
});
```

## 事件监听

`lib.Breeze.addEventListener(code, listener);`

例如
```
lib.Breeze.addEventListener('BR_SHAKE', function(event) {
	console.log('shake');
});
```
