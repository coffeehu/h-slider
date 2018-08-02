(function(){


var utils = {
	width:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientWidth;
		}
		return this.getWidthOrHeight(el,'width','content');
	},
	inWidth:function(el){
		return this.getWidthOrHeight(el,'width','padding');
	},
	outWidth:function(el,margin){
		var extra = margin?'margin':'border';
		return this.getWidthOrHeight(el,'width',extra);
	},
	height:function(el){
		if(this.isWindow(el)){
			return window.document.documentElement.clientHeight;
		}
		return this.getWidthOrHeight(el,'height','content');
	},
	inHeight:function(el){
		return this.getWidthOrHeight(el,'height','padding');
	},
	outHeight:function(el,margin){
		var extra = margin?'margin':'border';
		return this.getWidthOrHeight(el,'height',extra);
	},
	getWidthOrHeight:function(el,type,extra){
		var isHide = false;
		var _display, _visibility;
		if(el.style.display === 'none') { //不可见
			isHide = true;
			_display = el.style.display, 
			_visibility = el.style.visibility;
			el.style.display = 'block';
			el.style.visibility = 'hidden';
		}

		var styles = this.getStyle(el),
			val = this.curCSS(el,type,styles),
			isBorderBox = this.curCSS(el,'boxSizing',styles) === 'border-box';

		if(val === 'auto'){
			val = el['offset'+type[0].toUpperCase()+type.slice(1)];
		}

		val = parseFloat(val)||0;
		
		var finalVal = ( val + this.argumentWidthOrHeight(el,type,extra,isBorderBox,styles) );

		if(isHide){
			el.style.display = _display;
			el.style.visibility = _visibility;
		}

		return finalVal;
	},
	getStyle:function(el){
		var view = el.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( el );
	},
	curCSS:function(el,type,styles){
		var val;
		if(styles){
			val = styles.getPropertyValue(type) || styles[type];
		}
		return val;
	},
	//当为 borderBox 时，width 宽度为 content+padding+border
	argumentWidthOrHeight:function(el,type,extra,isBorderBox,styles){
		var val = 0, that = this;
		var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
		var i;

		if(extra === (isBorderBox?'border':'content') ){ // 此时不需要进行padding、border、margin的加减，所以不参与循环
			i = 4;
		}else{
			i = ( type==='width' ? 1 : 0 );			
		}

		for(;i<4;i=i+2){

			if(extra === 'margin'){
				val += parseFloat( that.curCSS(el, 'margin'+cssExpand[i], styles) );
			}

			// 当为 border-box 时，减去
			if(isBorderBox){
				// padding 和 content 时都会减去 border
				if(extra !== 'margin'){
					val -= parseFloat( that.curCSS(el, 'border'+cssExpand[i]+'Width', styles) );
				}

				if(extra === 'content'){
					val -= parseFloat( that.curCSS(el, 'padding'+cssExpand[i], styles) );
				}
			}else{
				if(extra !== 'content'){
					val += parseFloat( that.curCSS(el, 'padding'+cssExpand[i], styles) );
				}
				if(extra === 'border'|| extra === 'margin'){
					val += parseFloat( that.curCSS(el, 'border'+cssExpand[i]+'Width', styles) );
				}
			}

		}
		return val;
	},
	isWindow:function( obj ) {
		return obj != null && obj === obj.window;
	},
	css:function(el,name,value){
		// 取值
		if(typeof name === 'string' && value === undefined){
			var styles = this.getStyle(el);
			var val = this.curCSS(el,name,styles);
			return val;
		}

		// 赋值		
		var type = typeof name,
		i;
		if(type === 'string'){
			this.style(el,name,value);
		}else if(type === 'object'){
			for(i in name){
				this.style(el,i,name[i]);
			}
		}
	},
	style:function(el,name,value){
		var type = typeof value,
			style = el.style;
		if ( value !== undefined ) {

			if(type === 'number'){
				value += this.cssNumber[name]?'':'px';
			}

			style[ name ] = value;
		}
	},
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},
	remove:function(el){
		var p = el.parentNode;
		if(p){
			el.parentNode.removeChild( el );
		}
		return el;
	},
	hasClass:function(el,value){
		var className = ' '+value+' ';
		var curValue = el.getAttribute && el.getAttribute('class') || '';
		var cur = ' '+this.stripAndCollapse(curValue)+' ';

		if(cur.indexOf(className) > -1){
			return true;
		}
		return false;
	},
	addClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) < 0 ) {
						cur += clazz + ' ';
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
	},
	removeClass:function(el, value){
		var classes = this.classesToArray(value),
		curValue,cur,j,clazz,finalValue;

		if(classes.length>0){
			curValue = el.getAttribute && el.getAttribute('class') || '';
			cur = ' '+this.stripAndCollapse(curValue)+' ';

			if(cur){
				var j=0;
				while( (clazz = classes[j++]) ){
					if ( cur.indexOf( ' ' + clazz + ' ' ) > -1 ) {
						cur = cur.replace(' '+clazz+' ' ,' ');
					}
				}

				finalValue = this.stripAndCollapse(cur);
				if(curValue !== finalValue){
					el.setAttribute('class',finalValue);
				}
			}
		}
	},
	stripAndCollapse:function(value){
		var htmlwhite = ( /[^\s]+/g );
		var arr = value.match(htmlwhite)||[];
		return arr.join(' ');
	},
	classesToArray:function(value){
		if ( Array.isArray( value ) ) {
			return value;
		}
		if ( typeof value === "string" ) {
			var htmlwhite = ( /[^\s]+/g );
			return value.match( htmlwhite ) || [];
		}
		return [];
	},
	addHandler : function(element, type, handler){
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		}
		else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		}else {
			element["on" + type] = handler;
		}
	},
	removeHandler : function(element, type, handler) {
		if(element.removeEventListener){
			element.removeEventListener(type, handler, false);
		}else if(element.attachEvent){
			element.detachEvent("on"+type, handler);
		}else{
			element["on" + type] = null;
		}
	},
	prepend: function(el, childEl) {
		el.insertBefore(childEl, el.firstChild);
	}

};


	/*=========图片轮播对象的构造函数=========*/
	function ImageFlow(id, data, scale){
		this.el = document.getElementById(id);
		this.width = utils.width(this.el);
		this.content = this.el.getElementsByClassName('h-slideimg-content')[0];
		this.displays = []; // 图片展示实例集合
		this.lastDisplay = null; //上一个被放大的 display 实例
		this.scale = scale || 1.5; //放大倍数
		this.intervalId = null; // 定时任务id
		this.time = 3000; // 轮播速度
		this.toRight = true; // 轮播方向默认向右
		this.anime = false;
		this.currentIndex = -1;

		this.renderEmptyFill();
		this.renderArrows();

		this.viewEl = this.el.getElementsByTagName('ul')[0]; // 展示栏
		this.displayEls = this.viewEl.getElementsByTagName('li'); //图片展示的元素

		this.renderReflection(this.displayEls);

		this.count = this.displays.length;  // 内含的展示图片的数量
	}

	window.ImageFlow = ImageFlow;

	//填充顶部
	ImageFlow.prototype.renderEmptyFill = function() {
		var emptyFill = document.createElement('div');
		utils.addClass(emptyFill, 'h-slideimg--emptyfill');
		utils.prepend(this.el, emptyFill);
	}

	//渲染左右操作的箭头按钮
	ImageFlow.prototype.renderArrows = function() {
		var that = this;
		var arrows = document.createElement('div');
		utils.addClass(arrows, 'h-slideimg-arrow');

		var leftArrow = document.createElement('div');
		var rightArrow = document.createElement('div');
		var name = document.createElement('div');
		utils.addClass(leftArrow, 'arrow-left');
		utils.addClass(rightArrow, 'arrow-right');
		utils.addClass(name, 'arrow-movie-name');

		utils.addHandler(leftArrow, 'click', function() {
			if(that.intervalId) {
				clearInterval(that.intervalId);
			}
			var index = that.currentIndex > 0 ? (that.currentIndex-1) : 0;
			var display = that.displays[index];
			if(!that.anime) utils.addClass(that.content, 'anime-scale');
			display.zoomIn(that.scale);
		});

		utils.addHandler(rightArrow, 'click', function() {
			if(that.intervalId) {
				clearInterval(that.intervalId);
			}
			var index = that.currentIndex === (that.count-1) ? (that.count-1) : (that.currentIndex+1);
			var display = that.displays[index];
			if(!that.anime) utils.addClass(that.content, 'anime-scale');
			display.zoomIn(that.scale);			
		})

		arrows.appendChild(leftArrow);
		arrows.appendChild(rightArrow);
		arrows.appendChild(name);
		this.el.appendChild(arrows);
	}

	//渲染倒影，同时构建了 display 实例
	ImageFlow.prototype.renderReflection = function(displayEls) {
		var reflectionUl = document.createElement('div');
		utils.addClass(reflectionUl, 'reflection');

		for(var i=0,l=displayEls.length; i<l; i++) {
			var displayEl = displayEls[i];
			var img = displayEl.getElementsByTagName('img')[0];
			var reflectionEl = document.createElement('li');
			utils.addClass(reflectionEl, 'reflectionItem');
			var canvas = document.createElement('canvas');

			if(img.complete) {
				renderCanvas(canvas, img);
			}else {
				img.onload = function(canvas, img) {
					return function() {
						renderCanvas(canvas, img);
					}
				}(canvas, img);
			}

			reflectionEl.appendChild(canvas);
			reflectionUl.appendChild(reflectionEl);

			var display = new Display(i, displayEl, reflectionEl, this);
			this.displays.push(display);
		}

		this.content.appendChild(reflectionUl);
	}

	function renderCanvas(canvas, img) {
		var context = canvas.getContext("2d");
		context.translate(0, canvas.height);
      	context.scale(1, -1); 
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
		context.globalCompositeOperation = "destination-out";

		var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
		gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	// 放大并居中。index: 图片索引；scale：放大大小
	ImageFlow.prototype.setScale = function(index, scale) {
		var display = this.displays[index];
		display.zoomIn(scale);
	}

	// 启动轮播。 n:起始索引。  time：间隔时间
	ImageFlow.prototype.run = function(index, time) {
		var that = this;
		var index = index;
		that.time = time;

		that.displays[index].zoomIn(that.scale);

		that.intervalId = setInterval(function() {
			if(index === 0) {
				that.toRight = true;
			}else if(index === that.count-1) {
				that.toRight = false;
			}

			if(that.toRight) {
				index++;
			}else {
				index--;
			}

			var display = that.displays[index];
			if(!that.anime) utils.addClass(that.content, 'anime-scale');
			display.zoomIn(that.scale);
		}, time);
	}

	/*---图片展示的构造函数，包含了对自身缩放、居中的方法----*/
	function Display(index, displayEl, reflectionEl, root){
		this.index = index;
		this.el = displayEl;  // 对应的元素
		this.reflectionEl = reflectionEl; // 倒影栏元素
		this.root = root;  // ImageFlow 实例

		this.width = utils.width(this.el);
		this.margin = parseFloat( utils.css(this.el, 'margin-left') );
		
		this.isBig = false;

		// 事件设置
		var that = this;
		this.el.onmouseenter = function() {
			if(that.isBig && that.root.intervalId){
				clearInterval(that.root.intervalId);
				that.root.intervalId = null;
			}
		}
		this.el.onmouseleave = function() {
			if(that.isBig) {
				if(that.index === that.root.count - 1) {
					that.root.toRight = false;
				}else if(that.index === 0) {
					that.root.toRight = true;
				}
				var index = that.root.toRight ? (that.index + 1) : (that.index - 1);
				if(that.root.intervalId) clearInterval(that.root.intervalId);
				that.root.run(that.index, that.root.time);
			}
		}
		this.el.onclick = function() {
			if(that.isBig) return;
			if(that.root.intervalId) {
				clearInterval(that.root.intervalId);
			}
			if(!that.root.anime) utils.addClass(that.root.content, 'anime-scale');
			that.zoomIn(that.root.scale);
		}
	}

	//放大
	Display.prototype.zoomIn = function(scale) {
		if(this.isBig) return;
		this.isBig = true;

		this.root.currentIndex = this.index;

		if(this.root.lastDisplay) this.root.lastDisplay.recover();

		// 执行放大
		utils.css(this.el, 'transform', 'scale('+scale+')');

		// transform方法并不会把周围元素挤开，而是覆盖式，所以要自己设置边距。
		var marginRight =  this.width*scale - this.width + this.margin;
		utils.css(this.el, 'margin-right', marginRight);

		// 调整倒影
		utils.css(this.reflectionEl, 'transform', 'scale('+scale+')');
		utils.css(this.reflectionEl, 'margin-right', marginRight);

		// 图片置为水平居中
		this.setCenter(scale);

		this.root.lastDisplay = this;
	}

	//恢复
	Display.prototype.recover = function() {
		this.isBig = false;
		utils.css(this.el, 'transform', 'scale(1)');
		utils.css(this.el, 'margin-right', this.margin);

		utils.css(this.reflectionEl, 'transform', 'scale(1)');
		utils.css(this.reflectionEl, 'margin-right', this.margin);
	}

	// 居中图片
	Display.prototype.setCenter = function(scale) {
		scale = scale || 1;
		var rootWidth = this.root.width;
		var offset = (rootWidth - this.width * scale) * 0.5;
		var slideimg = this.root.content;

		var nowLeftOffset = this.width * this.index + (this.index * 2 + 1) * this.margin;
		
		utils.css(slideimg, 'margin-left', offset - nowLeftOffset);
	}



}());