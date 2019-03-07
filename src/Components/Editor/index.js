import React, { Component } from 'react';
import { GetApi } from '../../Base/api';
import Fetch from '../../Base/base';
import Common from '../../Base/common';
import './index.css';
//编辑器
import BraftEditor from 'braft-editor'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-aspnet'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-csharp'

import 'braft-extensions/dist/table.css'
import Table from 'braft-extensions/dist/table'


const options = {
  syntaxs: [
    { name: 'JavaScript', syntax: 'javascript' },
    { name: 'HTML', syntax: 'html' },
    { name: 'CSS', syntax: 'css' },
    { name: 'Java', syntax: 'java', },
    { name: 'PHP', syntax: 'php' },
    { name: 'aspnet', syntax: 'aspnet' },
    { name: 'sql', syntax: 'sql' },
    { name: 'c#', syntax: 'csharp' }
  ]
}

const tableoptions = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
}


const controlsList = [
  'undo', 'redo', 'separator',
  'font-size', 'line-height', 'letter-spacing', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'superscript', 'subscript', 'remove-styles', 'emoji', 'text-align', 'separator',
  'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
  'link', 'separator', 'hr', 'separator', 'media', 'separator', 'clear', 'separator', 'table', 'fullscreen'
]

BraftEditor.use(CodeHighlighter(options))
BraftEditor.use(Table(tableoptions))


export default class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editor: this.props.value ? BraftEditor.createEditorState(this.props.value) : BraftEditor.createEditorState(null),
      controls: controlsList,
      readonly: this.props.readonly
    }
  }

  componentDidMount() {

    if (this.state.readonly) { this.setState({ controls: ['fullscreen'] }) }

  }

  componentWillUpdate(props) { }

  componentWillReceiveProps(nextProps) {

    this.setState({ readonly: nextProps.readonly }, () => {
      this.state.readonly ? this.setState({ controls: ['fullscreen'] }) : this.setState({ controls: controlsList })
    })
  }


  handleEditorChange = (editor) => {

    if (!this.state.readonly) {
      this.setState({ editor }, () => { })
    }
    else {
      this.setState({ editor: this.state.editor })
    }
  }

  getValue = (mode) => {
    let value = this.state.editor.toHTML();
    if (mode == 1) { value = this.state.editor.toRAW(); }
    else if (mode == 2) { value = this.state.editor.toRAW(true); }
    return value
  }

  setValue = (value, func) => {
    this.setState({ editor: BraftEditor.createEditorState(value) }, () => { if (func) { func() } })
  }

  myUploadFn = (param) => {

    var reader = new FileReader();
    reader.readAsDataURL(param.file);
    reader.onload = function (e) {
      let base64Code = this.result;
      base64Code = base64Code.substring(base64Code.indexOf(',') + 1)
      let ExtName = param.file.name.substring(param.file.name.indexOf('.') + 1)

      let data = { Base64: base64Code, ExtName: ExtName }
      Fetch(GetApi("UploadBytesWithExt"), data).then((res) => {
        let url = Common.CloudUrl;
        param.success({
          url: url + res.Result,
          meta: {
            id: '', title: '', alt: '', loop: true, autoPlay: true, controls: true,
            poster: url + res.Result,
          }
        })

      }).catch((error) => { param.error({ msg: error.Message }) });

    }
  }

  onInsert = (param) => { }
  onChange = (data) => {
  }


  render() {
    return (
      <BraftEditor
        value={this.state.editor}
        onChange={this.handleEditorChange}
        className="editor"
        contentClassName="editorcontent"
        contentStyle={this.props.Style}
        media={{ uploadFn: this.myUploadFn, onInsert: this.onInsert, onChange: this.onChange }}
        controls={this.state.controls}
      />

    );
  }
}

