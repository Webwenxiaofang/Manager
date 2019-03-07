import React, { Component } from 'react';
import { Upload, Icon, message, Modal,Button } from 'antd';
import { GetApi } from '../../Base/api';
import Fetch from '../../Base/base';
import Common from '../../Base/common';
import './index.css';




export default class PmpUpload extends Component {


  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type ? this.props.type : "normal",
      showRemoveIcon: this.props.type === "display" ? false : true,
      showPreviewIcon: true,
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  }

  componentDidMount() { }

  componentWillUpdate(props) { }

  componentWillReceiveProps(nextProps) {

    this.setState({
      type: nextProps.type ? nextProps.type : "normal",
      showRemoveIcon: nextProps.type === "display" ? false : true,
    })
  }

  customRequest = (param) => {
    let reader = new FileReader();
    reader.readAsDataURL(param.file);
    let _this = this;
    reader.onload = function (e) {
      let base64Codeimage = this.result;
      let base64Code = base64Codeimage.substring(base64Codeimage.indexOf(',') + 1)
      let ExtName = param.file.name.substring(param.file.name.indexOf('.') + 1)
      let data = { Base64: base64Code, ExtName: ExtName }
      let fileData = { uid: param.file.uid, name: param.file.name, type: param.file.type, size: param.file.size, status: 'uploading', url: base64Codeimage, thumbUrl: base64Codeimage, percent: 0, }
      let fileList = _this.state.fileList;
      fileList.push(fileData)
      _this.setState({ fileList: fileList })

      Fetch(GetApi("UploadBytesWithExt"), data).then((res) => {
        let url = Common.CloudUrl;
        _this.state.fileList.map(function (item, index) {
          if (item.uid === param.file.uid) { item.percent = 100 }
        })
        _this.setState({ fileList: _this.state.fileList }, () => {
          //完成
          setTimeout(function () {
            _this.state.fileList.map(function (item, index) {
              if (item.uid === param.file.uid) {
                item.status = "done"
                item.url = url + res.Result
                item.thumbUrl = url + res.Result
              }
            })
            _this.setState({ fileList: _this.state.fileList }, () => { message.success(`上传成功!`); })
          }, 500)
        })
      }).catch((error) => {
        _this.state.fileList.map(function (item, index) {
          if (item.uid === param.file.uid) { item.status = "error" }
          _this.setState({ fileList: _this.state.fileList }, () => { message.error(`上传失败!`); })
        })
      });
    }
  }
  beforeUpload = (file) => { }
  onProgress = (res, file) => { }
  onSuccess = (res, file) => { }
  onChange = (e) => {
    if (e.file.status === "removed") {
      let fileList = this.state.fileList.filter(t => t.uid !== e.file.uid)
      this.setState({ fileList: fileList }, () => { message.success(`删除成功！`); })
    }
  }

  onPreview = (file) => {
     window.open(file.url) 
   /* if (file.type && file.type.indexOf("image") != -1) { this.setState({ previewImage: file.url, previewVisible: true }); }
    else { window.location.href = file.url }*/
  }

  //弹层
  handleCancel = () => this.setState({ previewVisible: false })

  //out
  getValue = (mode) => {
    let list = [];
    this.state.fileList.forEach(function (item, index) {
      let model = item.url
      list.push(model)
    })
    let value = list;
    if (mode === 1) { value = this.state.fileList }
    return value
  }

  setValue = (value, func) => {
    let list = [];
    value.forEach(function (item, index) {
      let splist = item.url.split('.');
      let type = splist[splist.length - 1]
      if (type === "png" || type === "jpg" || type === "jpeg" || type === "bmp" || type === "gif") { type = "image/" + type }
      else { type = "file/" + type }
      let model = { uid: index, name: item.name, status: 'done', url: item.url, thumbUrl: item.url, type: type }
      list.push(model)
    })

    this.setState({ fileList: list }, () => { if (func) { func() } })
  }

  render() {
    const { previewVisible, previewImage, fileList, type, showPreviewIcon, showRemoveIcon, readonly } = this.state;
    const uploadButton = (
      <Button>
        <Icon type="upload" />上传
      </Button>
    );
    return (
      <div className="clearfix">
        <Upload
          disabled={false}
          multiple={true}
          listType={'picture'} //picture-card
          //directory = {true}
          //showUploadList={false}
          showUploadList={{ showPreviewIcon: showPreviewIcon, showRemoveIcon: showRemoveIcon }}
          customRequest={this.customRequest}
          fileList={fileList}
          onSuccess={this.onSuccess}
          onProgress={this.onProgress}
          beforeUpload={this.beforeUpload}
          onChange={this.onChange}
          onPreview={this.onPreview}
        >

          {type === "display" ? null : uploadButton}
        </Upload>
        <Modal width='50%' visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="showimg" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

