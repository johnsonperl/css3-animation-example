# CSS3 Animation Example
## janimation.js 的完整的例子
> 这是 [janimation.js](https://github.com/johnsonperl/janimation.js "janimation.js") 的一个完整的例子。实现了类似“易企秀”、“兔展”所具有的功能。janimation.js 和 touch_and_basic.js 这两个 javascript 文件都集中放在了 `static/js/js.js` 里面。便于做成产品后压缩。

- 里面定位使用到了 CSS 的 `rem` 单位来控制。美工给到的 PSD 文件宽度是 640px 的，所以设定 `html{font-size:640px;}`，到具体设备中，通过 javascript 来动态修改 html 的字体大小为浏览器宽度。
- 切图后，所有定位原来是 `px` 单位的，都用类似 `calc(230rem/640)` 的方式来设定。这是定位的关键。

### DEMO
![拜博招聘H5](http://m.ibyersh.com/zt/2016/zhaop/1470900882.png "")