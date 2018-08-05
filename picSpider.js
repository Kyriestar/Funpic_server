var https = require('https');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var request = require("request");

var _url = 'https://m.weibo.cn/api/container/getIndex?type=uid&value=';
var _weiboId = ['5824051112']; //2654037900 5824051112
var _containerid;
var _pageUrl = '&page=';
var _pageNum;
var _fileindex = 3;

var _dir = setFoldername();
mkdirp(_dir, function(err) {
	if (err) {
		console.log(err);
	}
});

//脚本的入口
_weiboId.forEach((id) => {
	getFunPic(_url, id);
});



function getFunPic(url, id) {
	opt = {
		method: 'GET',
		url: url + id,
		timeout: 8000,
		encoding: null,
	}
	// opt.proxy = 'http://' + '121.42.167.160:3128';
	request(opt, function(error, response, body) {
		if (error) {
			console.log(error);
			return;
		}
		if (body) {
			// console.log(body.toString());
			var dataObj = JSON.parse(body.toString());
			var tabs = dataObj.data.tabsInfo.tabs;
			for (i in tabs) {
				if (tabs[i].tab_type === 'weibo') {
					_containerid = tabs[i].containerid; //获取containerid
				}
			}
			console.log(_containerid);
			getData(url, id, _containerid);
		}
	});
}

function getData(url, id, conid) {

	opt = {
		method: 'GET',
		url: url + id + '&containerid=' + conid,
		timeout: 8000,
		encoding: null,
	}
	// opt.proxy = 'http://' + '121.42.167.160:3128';
	request(opt, function(error, response, body) {
		if (error) {
			console.log(error);
			return;
		}
		if (body) {
			// console.log('--', body.toString());
			var dataObj = JSON.parse(body.toString());
			getPicUrl(dataObj);
			// console.log();
		}
	});

}


//获取图片的url
function getPicUrl(dataObj) {

	var data = dataObj.data;
	var cardsArr = data.cards;
	console.log('length:' + cardsArr.length);
	var picUrls = [];
	for (i in cardsArr) {
		if (cardsArr[i].mblog) {
			var mblog = cardsArr[i].mblog;
			var like = mblog.attitudes_count; //点赞的数量
			var text = mblog.text; //微博文字
			if (text.indexOf("奖") > 0 || text.indexOf("抽一位") > 0 || text.indexOf("精选") < 0) {
				continue;
			}
			if (mblog.pics) {
				for (j in mblog.pics) {
					if (mblog.pics[j].large) {
						var filename = setFilename();
						download(mblog.pics[j].large.url, _dir, filename);
						console.log('url:', mblog.pics[j].large.url);
						// picUrls.push(mblog.pics[j].large.url); // 写入json
					}
				}
			}
		}
	}
	// 写入json
	// var picUrlsObj = {
	// 	'urls': picUrls
	// }
	// var myDate = new Date();
	// var y = myDate.getFullYear();
	// var m = myDate.getMonth() + 1;
	// var d = myDate.getDate();
	// fs.writeFile(_dir + '/urls' + y + m + d + '.json', JSON.stringify(picUrlsObj), (error) => {
	// 	console.log(error);
	// });

}

//下载图片
function download(url, dir, filename) {
	console.log("filename :" + filename);
	request.head(url, function(err, res, body) {
		request(url).pipe(fs.createWriteStream(dir + "/" + filename));
	});
};

//设置放图片的文件夹名字
function setFoldername() {
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = myDate.getMonth() + 1;
	var d = myDate.getDate();
	var foldername = './images/image' + y + m + d
	return foldername;
}
//设置图片名字
function setFilename() {
	var myDate = new Date();
	var m = myDate.getMonth() + 1;
	var d = myDate.getDate();
	var filename = m.toString() + d.toString() + '_' + parseInt(Math.random() * 1000) + '.jpg';
	return filename;
}


// exports.getWBlink = getContainerId;