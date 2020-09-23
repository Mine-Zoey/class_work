const http = require('http');
const fs = require('fs');

var server = http.createServer((req, res) => {
    //获取请求的链接url
    const paths = req.url.split('/');
    //输出的是txt的文件夹
    let root = paths[1];
    //文件名--- txt格式（.txt是否）

    let fileName = paths[2];
    //
    var lastname = paths[3];
    //路径拼接
    let str = './' + root + '/' + fileName;

    //提交方式判断
    if (req.method === 'GET') {//get提交
        //root判断
        if (root === 'contents') {//contents

            fs.readFile(str, (err, data) => {

                if (fileName === '' || fileName === undefined) {
                    //无参数
                    paramErr(req, res);
                } else if (err) {
                    //文件不存在
                    fileNotExist(req, res);

                } else if (!err && lastname === undefined) {
                    //文件存在
                    fileExist(req, res, data);
                } else {
                    //其他错误
                    Err(req, res, root);
                }
            });

        } else if (root === 'infos') {//infos

            fs.readFile(str, (err, data) => {
                if (fileName === '' || fileName === undefined) {
                    //无参数
                    paramErr(req, res);
                } else if (err) {
                    //文件不存在
                    fileNotExist(req, res);
                } else if (!err && lastname === undefined) {
                    //文件存在
                    fs.stat(str, (err, info) => {

                        //文件的创建时间
                        let birthtimes = info.birthtime.toISOString().replace(/\..+/, '') + 'Z';
                        //更新文件的时间
                        let mtimes = info.mtime.toISOString().replace(/\..+/, '') + 'Z';

                        let times = {
                            createTime: birthtimes,
                            updateTime: mtimes
                        };
                        res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
                        ////将对象转为json对象
                        res.end(JSON.stringify(times));
                    });
                } else {
                    //其他错误
                    Err(req, res, root);
                }
            });
        } else {//其他
            otherErr(req, res);
        }
    } else if (req.method === 'POST') {//post提交
        //root判断
        if (root === 'contents') {

            fs.readFile(str, (err, data) => {

                if (fileName === '' || fileName === undefined) {
                    //无参数
                    paramErr(req, res);
                } else if (err) {
                    //文件不存在
                    fileNotExist(req, res);
                } else if (!err && lastname === undefined) {
                    //文件存在
                    let data = []
                    req.on('data', chunk => {
                        // console.log(chunk);
                        data.push(chunk);  // 将接收到的数据暂时保存起来
                    });
                    req.on('end', () => {
                        //console.log(data);
                        data = data.toString();
                        if (data.length > 20 || data.length === 0) {

                            res.writeHead(400, {'Content-Type': 'text/plain;charset=utf-8'});
                            res.end(`data length err`);
                            //console.log(`data length err`);
                        } else {
                            fs.writeFile('./data/n34.txt', data, 'utf-8', function (err, result) {

                                if (err) {
                                    res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
                                    res.end(`write file err`);
                                    // console.log('write file err');

                                } else {
                                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                                    res.end(`done`);
                                    // console.log(`done`);
                                }
                            });
                        }
                    });
                } else {
                    //其他错误
                    Err(req, res, root);
                }
            });
        } else {
            otherErr(req, res);
        }
    } else {//其他提交方式
        otherErr(req, res);
    }
});


server.listen(8000, () => {
    console.log('success');
});

//无参数
function paramErr(req, res) {
    res.writeHead(400, {'Content-Type': 'text/plain;charset=utf-8'});
    res.end(`param err`);
}

//文件不存在
function fileNotExist(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
    res.end(`file not exist`);
}

//文件存在
function fileExist(req, res, data) {
    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'})
    res.end(data);
}

//get其他
function Err(req, res, root) {
    res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
    res.end(`${req.method} ${root} err'`);
}

//其他错误
function otherErr(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
    res.end(`${req.method} ${req.url} not found`);
    //console.log(`${req.method} ${req.url} not found`);
}