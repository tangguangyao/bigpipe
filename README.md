bigpipe
=======
小实例
bigpipe技术：
淘宝一篇接受bigpipe的文章：
http://www.searchtb.com/2011/04/an-introduction-to-bigpipe.html
另外一篇nodejs使用bigpipe的文章：
http://engineering.xueqiu.com/blog/2013/02/27/implementing-bigpipe-in-nodejs/

我就是看上面两篇来了解bigpipe的，在尝试用node实现后，感觉这个很强大，非常强大，目前我用的比较多的是页面加载完用ajax请求，然后用前端mvc绑定数据。
假如说页面内容很多，加载完dom后，需要7，8个接口来通过ajax来get请求，页面是需要发送8，9个请求的。
而使用bigpipe只需要一个请求足以。

引用淘宝文章里面的：
BigPipe 比AJAX 有三个好处：
1. AJAX 的核心是XMLHttpRequest，客户端需要异步的向服务器端发送请求，然后将传送过来的内容动态添加到网页上。如此实现存在一些缺陷，即发送往返请求需要耗费时间，而BigPipe 技术使浏览器并不需要发送XMLHttpRequest 请求，这样就节省时间损耗。
2. 使用AJAX时，浏览器和服务器的工作顺序执行。服务器必须等待浏览器的请求，这样就会造成服务器的空闲。浏览器工作时，服务器在等待，而服务器工作时，浏览器在等待，这也是一种性能的浪费。使用BigPipe，浏览器和服务器可以并行同时工作，服务器不需要等待浏览器的请求，而是一直处于加载页面内容的工作阶段，这就会使效率得到更大的提高。
3. 减少浏览器发送到请求。对一个5亿用户的网站来说，减少了使用AJAX额外带来的请求，会减少服务器的负载，同样会带来很大的性能提升。

传统页面加载：
1. 用户访问网页，浏览器发送一个HTTP 请求到网络服务器
2. 服务器解析这个请求，然后从存储层去数据，接着生成一个html 文件内容，并在一个HTTP Response 中把它传送给客户端
3. HTTP response 在网络中传输
4. 浏览器解析这个Response ，创建一个DOM 树，然后下载所需的CSS 和JS文件
5. 下载完CSS 文件后，浏览器解析他们并且应用在相应的内容上
6. 下载完JS 后，浏览器解析和执行他们

bigpipe加载：
1. Request parsing：服务器解析和检查http request
2. Datafetching：服务器从存储层获取数据
3. Markup generation：服务器生成html 标记
4. Network transport ： 网络传输response
5. CSS downloading：浏览器下载CSS
6. DOM tree construction and CSS styling:浏览器生成DOM 树，并且使用CSS
7. JavaScript downloading: 浏览器下载页面引用的JS 文件
8. JavaScript execution: 浏览器执行页面JS代码

综上，bigpipe是很实用的，facebook和国内的新浪都是用的这种优化办法，所以可以放心大胆的使用
在http://engineering.xueqiu.com/blog/2013/02/27/implementing-bigpipe-in-nodejs/
这篇文章中已经很好的演示了，如何使用node实现；
我结合angularjs，组合的案例：
https://github.com/tangguangyao/bigpipe

用到一个bigpipe.js来自《深入浅出nodejs》
var Bigpipe=function(){
this.callbacks={};
}

Bigpipe.prototype.ready=function(key,callback){
if(!this.callbacks[key]){
this.callbacks[key]=[];
}
this.callbacks[key].push(callback);
}

Bigpipe.prototype.set=function(key,data){
var callbacks=this.callbacks[key]||[];
for(var i=0;i<callbacks.length;i++){
callbacks[i].call(this,data);
}
}

用到一个其中关键点：
需要手动启动angularjs，如果用ng-app是自动启动的，那么如果页面没有加载完毕，angularjs是不会执行的，因为bigpipe整个页面加载完毕会相对较慢，所以我们需要手动控制，让页面上上面的angularjs可以执行时，就执行，手动加载
angular.bootstrap(document.documentElement);
参考：http://www.360doc.com/content/12/0910/14/10504424_235355551.shtml 
bigpipe.ready接受到的数据可能会因为后端查询数据库返回比较慢，所以在angularjs中需要，手动$apply，才检查更新，不然在后端返回这部分 数据比较慢的情况下，这个数据angular是绑定不上的
参考：http://www.angularjs.cn/A0a6 

下面是我在一个复杂案例中的尝试：
https://github.com/tangguangyao/stock

访问首页，热门股票和热门用户，我就是用bigpipe改写的。