'use babel';
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const _ = require('underscore');

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    console.log('path-to-file.active')
    this.subscriptionByURL = new Map()
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'path-to-file:vue': () => this.toggleVue(),
      'path-to-file:js-file': () => this.toggleJsFile(),
      'path-to-file:js-path': () => this.toggleJsPath()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.subscriptionByURL.forEach(disposable => disposable.dispose())
    this.subscriptionByURL.clear()
  },
  toggleFile (options) {
    // console.log('AtomPathToFile was toggled!');
    // console.log('atom.workspace', atom.workspace)
    // console.log('atom.workspace.getActiveTextEditor', atom.workspace.getActiveTextEditor())
    let rootDirectories = atom.project.rootDirectories
    let editor = atom.workspace.getActiveTextEditor()
    let isSelection = !!editor.getSelectedText()
    if (isSelection) {
      let text = editor.getSelectedText()
      let extName = path.extname(text)
      let basename = path.basename(text)
      let editedFilePath = editor.getPath()
      let dir = path.dirname(editedFilePath)
      let target = ''
      // console.log('text1', text)
      // console.log('editedFilePath', editedFilePath)
      // console.log('dir', dir)
      if (_.isEmpty(extName) && options && options.onExtNameEmpty) {
        text = options.onExtNameEmpty({selectedText: text, baseName: basename})
      }
      // console.log('text2', text)
      if (text.indexOf('@/') === 0) {
        if (editedFilePath.indexOf('\\src\\') >-1 ) {
          let s = editedFilePath.substr(0,editedFilePath.indexOf('\\src\\')+4)
          let t = text.substr(text.indexOf('@')+1)
          target = path.normalize(`${s}${t}`)
        } else {
          let f = _.filter(rootDirectories, (t) => {
            return editedFilePath.indexOf(t.realPath) >-1
          })
          // console.log('f', f, 'f[0].realPath', f[0].realPath)
          if (f) {
            let t = text.substr(text.indexOf('@')+1)
            target = path.normalize(`${f[0].realPath}\\src\\${t}`)
          }
        }
      } else {
        target = path.join(dir, text)
      }
      // console.log('target', target)
      if (fs.existsSync(target)) {
        atom.notifications.addWarning("file exist", {
          detail : `path:${target}`,
          dismissable : true
        })
      } else {
        fse.ensureFile(target)
        .then(() => {
          // console.log('success!')
          atom.notifications.addSuccess("create file success",{
            detail : `path:${target}`,
            dismissable : true
          })
        })
        .catch(err => {
          // console.error(err)
          atom.notifications.addWarning("create file fail", {
            detail : err.toString(),
            dismissable : true
          })
        })
      }
    }
  },
  toggleJsFile () {
    this.toggleFile({
      onExtNameEmpty: function (o) {
        o.selectedText += '.js'
        return o.selectedText
      }
    })
  },
  toggleJsPath () {
    this.toggleFile({
      onExtNameEmpty: function (o) {
        o.selectedText += '/index.js'
        return o.selectedText
      }
    })
  },
  toggleVue() {
    this.toggleFile({
      onExtNameEmpty: function (o) {
        if (o.baseName === 'index') {
          o.selectedText += '.vue'
        } else {
          o.selectedText += '/index.vue'
        }
        return o.selectedText
      }
    })
  }

};
