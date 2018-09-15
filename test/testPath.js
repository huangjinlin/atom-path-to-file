const path = require('path');

let filePath = `D:\\workspace\\web_hi\\web_hi-trunk\\src\\index\\router\\routes.js`
let target = '@/index/pages/operate/test'

let extName = path.extname(filePath)
let extName2 = path.extname(target)
console.log('extName', extName)
console.log('extName2', extName2, extName2 === '')

let basename = path.basename(filePath)
let basename2 = path.basename(target)
console.log('basename', basename)
console.log('basename2', basename2)

let dirname = path.dirname(filePath);
console.log('dirname', dirname)

filePath.indexOf('\\src\\')
let src = filePath.substr(0,filePath.indexOf('\\src\\')+4)
let _target = target.substr(target.indexOf('@')+1)
console.log('src', src)
console.log('_target', _target)
console.log('join1', path.join(src, _target))
console.log('join2', path.join(filePath, '../test.js'))
console.log('json3', path.join(filePath, './test.js'))

console.log('normalize.src', path.normalize(src))
console.log('normalize._target', path.normalize(_target))
