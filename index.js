var initCourseTab = (function(doc) {
	var oCourseTabLks = doc.getElementsByClassName('course-tab-lk'),
		oCourseCardList = doc.getElementsByClassName('js-course-card-list')[0],
		oSearchInput = doc.getElementById('js-serach-input'),

		courseData = JSON.parse(doc.getElementById('js-course-data').innerHTML),
		cardItemTpl = doc.getElementById('js-card-item-tpl').innerHTML,

		oCourseTabLksLen = oCourseTabLks.length;

	return {
		// input框的input绑定事件
		searchCourse: function() {
			var val = oSearchInput.value,
				len = val.length;

			if(len > 0) {
				var data = this.searchData(courseData, val);

				if(data && data.length > 0) {
					oCourseCardList.innerHTML = this.makeList(data);
				}else {
					oCourseCardList.innerHTML = this.showTip('没有搜索到相关课程');
				}
			}else {
				this.restoreList();
			}
		},

		// 目录的click绑定事件
		tabClick: function(e) {
			var e = e || window.event,
				tar = e.target || e.srcElement,
				className = tar.className,
				item;

			if(className === 'course-tab-lk') {
				var field = tar.getAttribute('data-field');

				this.changeTabCurrent(tar);
				oCourseCardList.innerHTML = this.makeList(this.filterData(field, courseData));
			}
		},

		// 创造字符串模板，用来渲染
		makeList: function(data) {
			var list = '';

			data.forEach(function(elem) {
				list += cardItemTpl.replace(/{{(.*?)}}/g, function(node, key) {
					return {
						img: elem.img,
						courseName: elem.course,
						isFree: elem.is_free === '1' ? 'free' : 'vip',
						price: elem.is_free === '1' ? '免费' : ('￥' + elem.price + '.00'),
						hours: elem.classes
					}[key];
				});
			});

			return list;
		},

		// 过滤出自己想要的数据
		filterData: function(field, data) {
			if(field === 'all') {
				return data;
			}

			var newArr = data.filter(function(elem) {

				switch(field) {
					case 'free':
					    return elem.is_free === '1';
					    break;
					case 'vip':
						return elem.is_free === '0';
						break;
					default:
						return true;
				}
			});

			return newArr;
		},

		// 根据关键字找到相关的数据
		searchData: function(data, keyword) {
			return data.reduce(function(prev, elem) {
				var res = elem.course.indexOf(keyword);

				res !== -1 && prev.push(elem);
				return prev;
			}, []);
		},

		// 显示所有课程
		initCourseList: function() {
			oCourseCardList.innerHTML = this.makeList(courseData);
		},

		// 重置页面
		restoreList: function() {
			oCourseCardList.innerHTML = this.makeList(courseData);
			this.changeTabCurrent(oCourseTabLks[0]);
		},

		// 重置所有的类，并给当前点击的类加上样式
		changeTabCurrent: function(currentDom) {
			for (var i = 0; i < oCourseTabLksLen; i++) {
				item = oCourseTabLks[i];
				item.className = 'course-tab-lk';
			}

			currentDom.className += ' current';
		},

		// 搜索完后不存在课程的提示
		showTip: function(text) {
			return '<div class="course-list-tip"><span>' + text + '</span></div>';
		}
	};
})(document);

;(function(doc) {

	var oSearchInput = doc.getElementById('js-serach-input'),
		oTabList = doc.getElementsByClassName('js-course-tab-list')[0];

	var init = function() {
		initCourseTab.initCourseList();
		bindEvent();
	}

	function bindEvent() {
		oSearchInput.addEventListener('input', initCourseTab.searchCourse.bind(initCourseTab), false);
		oTabList.addEventListener('click', initCourseTab.tabClick.bind(initCourseTab), false);
	}

	init();
})(document);