const fs = require('fs');
const pathlib = require('path');
const mimeType = require('mime-types');
const chalk = require('chalk'); // 带色彩的控制台输出

// 递归创建目录 异步方法  
function mkdirs(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            // console.log(path.dirname(dirname));  
            mkdirs(pathlib.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
                console.log('在' + pathlib.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });  
        }  
    });  
}  
// 递归创建目录 同步方法
function mkdirsSync(dirname) {

    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(pathlib.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  export const base64_encode = (path) =>{
    return new Promise((resolve,reject) =>{
        let filePath = pathlib.resolve(path)
        if (!fs.existsSync(filePath)) reject("文件不存在")
        let fileName = filePath.split('\\').slice(-1)[0].split('.'); // 提取文件名
        let fileMimeType = mimeType.lookup(filePath); // 获取文件的 memeType
        // 如果不是图片文件，则退出
        if (!fileMimeType.toString().includes('image')) {
            console.log(chalk.red(`Failed! ${filePath}:\tNot image file!`));
            reject("不是图片文件")
        }
        try
        {
            // 读取文件数据
            let data = fs.readFileSync(filePath).toString('base64');
            //console.log(data)
            resolve(data)
        } catch (e) {
            // console.log(e.message)
            reject(e.message)
        }
    })
}
export const base64_decode = (base64str, path) => {
    return new Promise((resolve,reject) => {
        try {
            if (fs.existsSync(path)) resolve()
            if (mkdirsSync(pathlib.dirname(path))) {
                var bitmap = Buffer.from(base64str, 'base64');
                fs.writeFileSync(path, bitmap);
            }
            resolve()
        } catch (e) {
            reject(e.message)
        }
    })
}