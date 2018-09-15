const path = require('path');
const fs = require('fs');
const fse = require('fs-extra')
let filePath = `D:\\workspace\\web_hi\\web_hi-trunk\\src\\index\\router\\routes.js`
// let target = '@/index/pages/operate/test'
let target = `D:\\workspace\\web_hi\\web_hi-trunk\\src\\index\\pages\\operate\\test\\first\\index.vue`
console.log('isExist', fs.existsSync(filePath))
// console.log('dirname', path.dirname(target))
// fs.mkdirSync(path.dirname(target))
// fs.writeFileSync(target, '')
fse.ensureFile(target)
.then(() => {
  console.log('success!')
})
.catch(err => {
  console.error(err)
})
