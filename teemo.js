/*
	* Teemo 1.0
	*/

	//格式化数据
	this.Teemo = this.Teemo||{},
	function (){
		var self = self||{};

		// 支持下载的类型
		self.allType = {
			image:['jpg','png'],
			json:['json'],
			audio:['mp3']
		};

		//获取该文件的类型
		self.getType = function(u){

			var _type = (u.match(/[^\.]+$/)[0]);
			var _result = null;

			for (key in self.allType) {
				
				if(self.allType[key].join(',').indexOf(_type) !== -1){
					
					_result = key;
					break;

				}else{

					_result = 'nonsupport';
				
				}

			}
			
			return _result;
		}

		//格式化数据
		self.setData = function(data){

			var _data = [];

			data.forEach(function(e,i,o){

				var _url = e.url||e,
				 	_type = self.getType(_url),
				 	_callback = e.callback||null;

				_data.push({
						url:_url,
						type:_type,
						callback:_callback
					});	

			});
			Teemo.data = _data;
		};

		Teemo.self = self;

	}(),



	//下载器
	this.Teemo = this.Teemo||{},
	function (){
		var load = load||{};
		//支持的事件类型
		load.events = {
				start:null,
				loading:null,
				complete:null,
				error:null
			};

		load.on = function(t,c){
			load.events[t] = c;
		};
		load.off = function(t){
			load.events[t] = null;
		};
		load.start = function(d){

			var _d = d||Teemo.data;
			load.nowProgress = 0;
			load.allProgress = _d.length;
			load._runEvent('start');
			_d.forEach(function(e,i,o){

				e.type !== 'nonsupport'&&load["_"+e.type](e);

			});

		};

		// 请求文件 xhr
		load._get = function(url,type,callback){

			var _xhr = new XMLHttpRequest();

			_xhr.open('post',url,true);
			_xhr.responseType = type;
			_xhr.send();
			_xhr.onload = function(e){

				callback(e);

			};
			_xhr.onerror = function(e){

				console.log('error:'+e);

			};

		}

		load._complete = function(o,e){

			o.callback&&o.callback(e);
			load.nowProgress++;
			load._runEvent('loading');
			load._runEvent('complete');
		}

		load._error = function(o,e){

			load._runEvent('error');

		}
		load._runEvent = function(k){

			switch (k)
			{
				case 'start':
				load.events.start&&load.start();
				break;

				case 'loading':
				load.events.loading&&load.events.loading({nowProgress:load.nowProgress,allProgress:load.allProgress});
				break;

				case 'complete':
				load.events.complete&&load.nowProgress === load.allProgress&&load.events.complete();
				break;

				case 'error':
				load.events.error&&load.events.error();
				break;
			}
		


		};
		load._image = function(o){

			var i = new Image();
			i.src = o.url;
			i.onload = function(e){

				load._complete(o,e);
			};
			i.error = function(e){

				load.error(o,e);
			}
		};
		load._json = function(o){

			load._get(o.url,'text',o.callback);

		};
		load._audio = function(o){
			//未加入
			

		};

		Teemo.load = load;

	}();