var express = require('express');
const app = express();
var fs = require('fs');
// var cors = require('cors');

app.listen(8888, () => {
	console.log('server is ready in port 8888');
});
// app.use(cors());
app.use(express.static('./'));
// app.use(express.static('public'));//和上面的是一样的

app.use('/test', (req, res) => {
	res.send('just test !!!!');
});

app.use('/getImages', (req, res) => {
	console.log(req.query);
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = myDate.getMonth() + 1;
	var d = myDate.getDate();
	var date = '' + y + m + d;
	var buf = fs.readFileSync('./images/image' + date + '/urls' + date + '.json', (error) => console.log(error));
	// console.log('---', buf.toString());
	res.send(buf.toString());
});

app.use('/listimg', (req, res) => {

	finder((err, files) => {
		if (err) {
			res.end(JSON.stringify(err));
			return;
		}
		var out = {
			error: null,
			urls: files
		};
		res.writeHead(200, {
			"Content-Type": "application/json"
		});
		res.end(JSON.stringify(out));
	});
});


function finder(callback) {
	var myDate = new Date();
	var y = myDate.getFullYear();
	var m = myDate.getMonth() + 1;
	var d = myDate.getDate();
	var path = '/home/ubuntu/Funpic_server/images/image' + y + m + d;

	fs.readdir(path, function(err, files) {
		let url = 'http://140.143.166.218:8888/images/image' + y + m + d + '/' + files;
		//err 为错误 , files 文件名列表包含文件夹与文件
		if (err) {
			callback(err);
			console.log('error:\n' + err);
		}
		callback(null, url);
		console.log(url);
	});

}