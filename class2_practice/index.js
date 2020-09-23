const http = require('http');
const fs = require('fs');
//端口号
const config = {
    port: 8000
};
console.time('index');
var server = http.createServer((req, res) => {
    console.log(`start -->[${new Date().toISOString()}] coming request - ${req.method} ${req.url}`);
    let method = req.method;
    let requestMethod;
    console.log(`method == ` + method);
    switch (method) {
        case 'GET':
            requestMethod = getMethod;
            break;
        case 'POST':
            requestMethod = postMethod;
            break;
        default :
            otherErr(req, res);
            console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
            return;
    }
    requestMethod(req, res);
});

//启动
server.listen(config.port, () => {
    console.log(`server is ready on ${config.port}`);
})

function getPath(req, res) {
    console.log('getPath--->');
    //获取请求的链接url
    var paths = req.url.split('/');
    return paths;
}

//get提交方法
function getMethod(req, res) {
    console.log('getMethod--->');
    var paths = getPath(req, res);
    var root = paths[1];
    var fileroot;
    console.log(`root == ` + root);
    switch (root) {
        case 'contents':
            fileroot = getContentsMethod;
            break;
        case 'infos':
            fileroot = getInfosMethod;
            break;
        default:
            otherErr(req, res);
            console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);

            return;
    }
    fileroot(req, res);

}

//post提交方法
function postMethod(req, res) {
    console.log('postMethod--->');
    var paths = getPath(req, res);
    var root = paths[1];
    console.log('root == ' + root);
    let fileroot;
    switch (root) {
        case 'contents':
            fileroot = postContentsMethod;
            break;
        default:
            otherErr(req, res);
            console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
            return;
    }
    fileroot(req, res);
}

//getContentsMethod
function getContentsMethod(req, res) {
    console.log('getContentsMethod --->');
    getMethods(req, res);

}

//getInfosMethod
function getInfosMethod(req, res) {
    console.log('getInfosMethod--->');
    getMethods(req, res);
}

//getMethods
function getMethods(req, res) {
    console.log('getMethods--->')
    var paths = getPath(req, res);
    //输出的是txt的文件夹
    var root = paths[1];
    var file = paths[2];
    let filename = filesuffixTool(file);

    //路径拼接
    let str = './data' + '/' + filename;
    fs.readFile(str, (err, data) => {
        if (filename === '' || filename === undefined) {
            //无参数
            paramErr(req, res);
        } else if (err) {
            //文件不存在
            fileNotExist(req, res);
        } else if (!err) {
            //文件存在
            if (req.method === 'GET' && root === 'infos') {
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
                    console.log(JSON.stringify(times));
                    console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
                });
            } else {
                fileExist(req, res, data);
            }
        } else {
            //其他错误
            Err(req, res, root);
        }
    });
}

function postContentsMethod(req, res) {
    console.log('postContentsMethod--->');
    var paths = getPath(req, res);
    //输出的是txt的文件夹
    var root = paths[1];
    var filename = filesuffixTool(paths[2]);
    //路径拼接
    var str = './data' + '/' + filename;
    fs.readFile(str, (err, data) => {
        if (filename === '' || filename === undefined) {
            //无参数
            paramErr(req, res);
        } else if (err) {
            console.log(`./data中不存在 ${filename} ,需要新建写入！`)
            postWriteFile(req, res);
        } else if (!err) {
            console.log(`./data中存在 ${filename} ,直接覆盖写入！`)
            postWriteFile(req, res);
        } else {
            //其他错误
            Err(req, res, root);
        }
    });
}

function postWriteFile(req, res) {
    console.log('postWriteFile--->');
    var paths = getPath(req, res);
    var filename = filesuffixTool(paths[2]);
    let data = []
    req.on('data', chunk => {
        data.push(chunk);  // 将接收到的数据暂时保存起来
    });
    req.on('end', () => {
        //console.log(data);
        data = data.toString();
        if (data.length > 20 || data.length === 0) {

            res.writeHead(400, {'Content-Type': 'text/plain;charset=utf-8'});
            console.log(`data length err`);
            res.end(`data length err`);
            console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
        } else {
            let string = './data/' + filename;
            console.log('post write--->' + string);
            fs.writeFile(string, data, 'utf-8', function (err, result) {

                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
                    console.log('write file err');
                    res.end(`write file err`);

                } else {
                    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
                    console.log(`done`);
                    res.end(`done`);
                }
                console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
            });
        }


    });
}

//其他错误
function otherErr(req, res) {
    console.log('otherErr--->');
    res.statusCode = 404;
    console.log(`${req.method} ${req.url} not found`);
    return res.end(`${req.method} ${req.url} not found`);
}

//文件名后缀工具
function filesuffixTool(file) {
    console.log('filesuffixTool--->');
    if (file === '' || file === undefined) {
        return '';
    } else {
        //文件名转数组
        let filenames = file.split('.');
        console.log('file--->' + filenames);
        //文件后缀名
        let filesuffix = filenames[1];
        if (filesuffix === '' || filesuffix === null || filesuffix === undefined) {
            file = file + '.txt';
            console.log(file);
        }
        return file;
    }

}

//无参数
function paramErr(req, res) {
    console.log('paramErr--->');
    res.writeHead(400, {'Content-Type': 'text/plain;charset=utf-8'});
    console.log(`param err`);
    res.end(`param err`);
    console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
}

//文件不存在
function fileNotExist(req, res) {
    console.log('fileNotExist--->');
    res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
    console.log(`file not exist`);
    res.end(`file not exist`);
    console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);

}

//文件存在
function fileExist(req, res, data) {
    console.log('fileExist--->');
    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'})
    console.log(data);
    res.end(data);
    console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);
}

//get其他
function Err(req, res, root) {
    console.log('Err--->');
    res.writeHead(500, {'Content-Type': 'text/plain;charset=utf-8'});
    console.log(`${req.method} ${root} err'`);
    res.end(`${req.method} ${root} err'`);
    console.log(`end -->[${new Date().toISOString()}] ending request - ${req.method} ${req.url}`);

}
