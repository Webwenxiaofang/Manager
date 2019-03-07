import React, { Component } from 'react';
import { Input, Layout, Row, Col, Form, Spin, Select, Table, Upload, Button, Message, Divider, Modal, Badge } from 'antd'
import Fetch from '../../../Base/base'
import { GetApi } from '../../../Base/api'
import BaseDataController from '../BasicDataController'
import Common from '../../../Base/common'
import SqlConfirm from './SqlConfirm'

const { Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const TextArea = Input.TextArea
const statusMap = ['default', 'processing', 'success', 'error', 'error', 'processing'];
const twoItemLayout = {
  style: { height: '15px' },
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const oneItemLayout = {
  style: { height: '15px', },
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
const tailFormItemLayout = {
  wrapperCol: { span: 12, offset: 11 }
};
const columns = [{
  title: '行号',
  key: 'Num',
  dataIndex: 'Num'
},
{
  title: '执行脚本',
  key: 'SqlScript',
  dataIndex: 'SqlScript',
  className: 'bug-title-width title-max-width-400',
  render: (item, record) => {
    return <span title={record.SqlScript}>{record.SqlScript}</span>
  }
},
{
  title: '执行状态',
  key: 'SqlRowStatusName',
  dataIndex: 'SqlRowStatusName',
  filters: [
    { text: '审核中', value: '1' },
    { text: '通过', value: '2' },
    { text: '未通过', value: '3' },
    { text: '驳回', value: '4' },
    { text: '执行中', value: '5' }
  ],
  onFilter: (value, record) => record.SqlRowStatus === value,
  render(item, record) {
    return <Badge status={statusMap[record.SqlRowStatus]} text={record.SqlRowStatusName} />;
  },
}]
const listUrl = { pathname: '/Main/SqlHandle/SqlScriptList', search: '?op=back' }
const buttonAuths = { displayName: 'SqlHandle', arr: ['assign', 'edit', 'delete', 'pass', 'reject'] };//按钮初始化
class SqlScriptEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      prodListJsonData: this.props.location.prodListJsonData,
      supportStaffIdList: [],
      userList: null,
      isEdit: Common.getUrlParam(this.props.location.search, 'isEdit') === 'true' ? true : false,//是否是编辑状态
      sqlInfo: {},//脚本实体对象
      opinion: '',//审核意见
      confirmVisible: false,
      dataSource: null,
      buttonEnable: Common.getButtonJurisdiction(buttonAuths),
    }
    this.sqlId = Common.getUrlParam(this.props.location.search, 'sqlId')
  }
  componentDidMount() {
    this._initProdList();
    //获取指定脚本详情
    this._getSqlDetailInfo(this.sqlId);
  }
  //初始化右上角功能按钮
  _initButtonGroup() {
    let { sqlInfo } = this.state;
    return (
      <span style={{ float: "right" }}>
        <Button disabled={this._initbuttonDisabled(sqlInfo, 'assign')} size="small" name='designate' icon="right-square" style={{ marginRight: 10 }} onClick={this.handleOperate}> 指派</Button>
        <Button disabled={this._initbuttonDisabled(sqlInfo, 'edit')} size="small" name='edit' icon="edit" style={{ marginRight: 10 }} onClick={this.handleOperate}> 编辑</Button>
        <Button disabled={this._initbuttonDisabled(sqlInfo, 'delete')} size="small" name='delete' icon="delete" style={{ marginRight: 10 }} onClick={this.handleOperate}> 删除</Button>
        <Button size="small" name='back' onClick={this.handleOperate} icon="step-backward"> 返回</Button>
      </span>
    )
  }
  _initbuttonDisabled(item, operate) {
    console.log(item)
    let designateIdList = []
    if (item.DesignateList) {
      for (let obj of item.DesignateList) {
        designateIdList.push(obj.DesignateID)
      }
    }
    //创建者自身可以点击编辑按钮
    if (operate === 'delete') {
      return !this.state.buttonEnable[operate] || item.SqlStatus !== '4' || !designateIdList.includes(Common.Id)
    }
    //指派人和当前登录着不一致按钮变为不可用
    return !this.state.buttonEnable[operate] || !designateIdList.includes(Common.Id)
  }
  /**
   *根据id获取脚本详情
   *
   * @param {*} id
   * @memberof SqlScriptEdit
   */
  _getSqlDetailInfo(id) {
    this.setState({ loading: true })
    Fetch(GetApi('GetSqlScripting'), { id: id }, { method: 'GET' }).then((res) => {
      if (res.Code === '0') {
        this.setState({ sqlInfo: res.Result, dataSource: res.Result.SqlScriptingRow }, () => {
          BaseDataController.GetUserByUserId((userList) => { this.setState({ userList }) });
        })
      }
      else {
        Message.error(res.Message)
      }
      this.setState({ loading: false })
    })
  }
  _deleteSqlScript(id) {
    Fetch(GetApi('DeleteSqlScripting'), { Id: id }).then((res) => {
      if (res.Code === '0') {
        Message.success('脚本删除成功')
        this.props.history.push(listUrl)
      }
      else {
        Message.error(res.Message);
      }
    })
  }
  _initProdList() {
    if (!this.state.prodListJsonData) {
      Fetch(GetApi('getteamname'), { Id: Common.Id }, { method: 'GET' }).then((data) => {
        this.setState({ prodListJsonData: data.Result })
      })
    }
  }
  /**
   *导入excel
   *
   * @memberof SqlScriptEdit
   */
  _customRequest = (param) => {
    let reader = new FileReader();
    let sqlThis = this;
    sqlThis.setState({ loading: true })
    reader.readAsDataURL(param.file);
    reader.onload = function (e) {
      let base64Codeimage = this.result;
      let base64Code = base64Codeimage.substring(base64Codeimage.indexOf(',') + 1)
      let ExtName = param.file.name.substring(param.file.name.indexOf('.') + 1)
      let data = { Base64: base64Code, ExtName: ExtName }
      let fileData = { uid: param.file.uid, name: param.file.name, type: param.file.type, size: param.file.size, status: 'uploading', url: base64Codeimage, thumbUrl: base64Codeimage, percent: 0, }
      let fileList = [];
      fileList.push(fileData)

      Fetch(GetApi("UploadBytesWithExt"), data).then((res) => {
        let url = Common.CloudUrl;
        fileList.map((item) =>function (item, index) {
          if (item.uid === param.file.uid) { item.percent = 100 }
        })
        url = url + res.Result
        setTimeout(function () {
          fileList.map((item) =>function (item, index) {
            if (item.percent === 100) {
              Fetch(GetApi('InputSqlScripting'), { url: url }, { method: 'GET' }).then(res => {
                if (res.Code === '0') {
                  try {
                    let dataSource = JSON.parse(res.Result)
                    sqlThis.setState({ dataSource: dataSource.sqlScriptingRow })
                  }
                  catch{
                    Message.error('模板格式不正确')
                  }
                } else {
                  Message.error(res.Message)
                }
                sqlThis.setState({ loading: false })
              })
            }
          })
        }, 500)
      }).catch((error) => {
        Message.error(`导入失败!`);
        sqlThis.setState({ loading: false })
      });
    }
  }
  handleTextChange = (e) => {
    this.setState({ opinion: e.target.value })
  }
  handleOperate = (e) => {
    let operate = e.target.name
    switch (operate) {
      case "edit":
        this.setState({ isEdit: true })
        break;
      case "delete":
        Modal.confirm({
          title: '删除脚本',
          content: '确定删除该脚本？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this._deleteSqlScript(this.sqlId)
        })
        break;
      case "designate":
        this.setState({ confirmVisible: true })
        break;
      case "back":
        this.props.history.push(listUrl);
        break;
      default:
        console.log('handleOperate', e.target.name);
    }
  }
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        let sqlData = { ...this.state.sqlInfo }
        let designateList = []
        for (let designateId of values.designateIdList) {
          designateList.push({ designateId: designateId })
        }
        sqlData.DesignateList = designateList //指派给列表
        sqlData.Desc = values.Desc
        sqlData.SqlScriptingRow = this.state.dataSource //sql语句
        console.log('this.props.values', JSON.stringify(sqlData));
        Fetch(GetApi('SaveSqlScript'), sqlData).then((res) => {
          if (res.Code === '0') {
            Message.success('脚本修改成功')
            this.props.history.push(listUrl)
          }
          else {
            Message.error(res.Message);
          }
          this.setState({ loading: false })
        })
      }
    })
  }
  handleAudit = (e) => {
    e.preventDefault();
    if (!this.state.opinion || this.state.opinion === '') {
      Message.warning('请输入处理意见')
      return;
    }
    this.setState({ loading: true })
    let auditName = e.target.name
    let auditInfo = { opinion: this.state.opinion, id: this.sqlId, SqlStatus: auditName === 'pass' ? 2 : 4 }
    Fetch(GetApi('RunOrStopSqlScripting'), auditInfo).then((res) => {
      if (res.Code === '0') {
        Message.success(`脚本${auditName === 'pass' ? "通过" : "驳回"}成功`)
        this.props.history.push(listUrl)
      }
      else {
        Message.error(res.Message);
      }
      this.setState({ loading: false })
    })
  }
  renderEditProdSelect(prodListJsonData, sqlInfo) {
    const { getFieldDecorator } = this.props.form
    return (
      <FormItem {...twoItemLayout} label="所属产品">
        {
          prodListJsonData ? getFieldDecorator('ProductId',
            {
              rules: [{
                required: true, message: '请选择所属产品',
              }],
              initialValue: sqlInfo.ProductID,
            })(
              <Select
                showSearch
                optionFilterProp="children">
                {prodListJsonData.map((item, i) =>
                  <Option key={item.Id} value={item.Id}>{item.ProductName}</Option>
                )}
              </Select>
            ) : null
        }
      </FormItem>
    )
  }
  renderViewProdText(sqlInfo) {
    const { getFieldDecorator } = this.props.form
    return (
      <FormItem {...twoItemLayout} label="所属产品">
        {
          getFieldDecorator('ProductId', {
            initialValue: sqlInfo.ProductName
          })(
            <Input readOnly></Input>
          )
        }
      </FormItem>
    )
  }
  renderDesignateEdit(userList, sqlInfo) {
    const { getFieldDecorator } = this.props.form
    let staffIdList = []
    if (sqlInfo.DesignateList) {
      for (var row of sqlInfo.DesignateList) {
        staffIdList.push(row.DesignateID)
      }
    }
    return (
      <FormItem {...twoItemLayout} label="指派给" hasFeedback>
        {
          userList ? getFieldDecorator('designateIdList', {
            rules: [{
              required: true, message: '请选择指派人员',
            }],
            initialValue: staffIdList
          })(
            <Select mode="multiple" placeholder="请选择用户" showSearch
              optionFilterProp="children">
              {userList.map(item => <Option key={item.Id} value={item.Id}>{item.StaffName}</Option>)}
            </Select>
          ) : <Select></Select>
        }
      </FormItem>
    )
  }
  renderDesignateView(sqlInfo) {
    const { getFieldDecorator } = this.props.form
    let staffNameList = ''
    if (sqlInfo.DesignateList) {
      for (var row of sqlInfo.DesignateList) {
        staffNameList = staffNameList + row.DesignateName + ';'
      }
    }
    return (
      <FormItem {...twoItemLayout} label="指派给">
        {
          getFieldDecorator('designateIdList', {
            initialValue: staffNameList
          })(
            <Input readOnly></Input>
          )
        }
      </FormItem>
    )
  }
  render() {
    const { isEdit, prodListJsonData, sqlInfo, userList, opinion, dataSource } = this.state
    const { getFieldDecorator } = this.props.form
    const parentMethods = {
      onCancel: () => { this.setState({ confirmVisible: false }) },
      onSubmit: () => { this.setState({ confirmVisible: false }, () => { this.props.history.push(listUrl) }) },
    };
    const parentInfos = {
      sqlSid: sqlInfo.SId,
      sqlBranchName: sqlInfo.BranchName,
      sqlId: this.sqlId,
    }
    return (
      <Spin spinning={this.state.loading}>
        <h3 style={{ margin: '10px 10px' }}>脚本处理 > 编辑</h3>
        <Content style={{ padding: '0 10px 10px', background: '#fff' }}>
          <Row>
            <div className="title-flex-box">
              <div className="title-flex-item card-info">
                <span className="prefix">
                  <strong>  {sqlInfo.SId}</strong>
                </span>
                <strong>
                  {sqlInfo.Desc}
                </strong>
              </div>
              <div className="title-button-box">
                {
                  isEdit ? <ul style={{ float: "right" }}>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleSave}>保存</Button>
                    <Button type="primary" name='back' onClick={this.handleOperate}>取消</Button>
                  </ul> :
                    this._initButtonGroup()
                }
              </div>
            </div>
          </Row>
          <Row>
            <Divider style={{ marginTop: 0, marginBottom: 5, background: '#C9C9C9' }}></Divider>
          </Row>
          <Form className="form-info" style={{ background: '#fff' }}>
            <Row style={{ paddingTop: 5 }}>
              <Col span={10}>
                {
                  isEdit ? this.renderEditProdSelect(prodListJsonData, sqlInfo) : this.renderViewProdText(sqlInfo)
                }
              </Col>
              <Col span={10}>
                <FormItem {...twoItemLayout} label="分公司">
                  {getFieldDecorator('BranchName', {
                    initialValue: sqlInfo.BranchName
                  })(
                    <Input readOnly />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem {...twoItemLayout} label="提交人">
                  {getFieldDecorator('Creator', {
                    initialValue: sqlInfo.Creator
                  })(
                    <Input readOnly />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                {
                  isEdit ? this.renderDesignateEdit(userList, sqlInfo) : this.renderDesignateView(sqlInfo)
                }
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <FormItem {...oneItemLayout} label='脚本描述' hasFeedback>
                  {
                    getFieldDecorator('Desc', {
                      rules: [{
                        required: true, message: '请输入脚本描述'
                      }],
                      initialValue: sqlInfo.Desc
                    })(
                      <Input readOnly={!isEdit} autoComplete='off' />

                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5 }}>
              <Col span={20}>
                <FormItem {...oneItemLayout} label="sql列表">
                  {isEdit && <Upload style={{ float: "right" }} customRequest={this._customRequest} accept=".xls,.xlsx" showUploadList={false}>
                    <Button type='primary' icon="upload">导入Excel
                    </Button>
                  </Upload>}
                  <Table columns={columns}
                    dataSource={dataSource} size="small"
                    rowKey={row => row.Num} />
                </FormItem>
              </Col>
            </Row>
            {
              !isEdit ? <Row >
                <Col span={20}>
                  <FormItem {...oneItemLayout} label="处理意见">
                    <TextArea readOnly={isEdit} rows={3} onChange={this.handleTextChange} value={opinion}></TextArea>
                  </FormItem>
                </Col>
              </Row> : null
            }
            {
              !isEdit ? <Row>
                <Col span={20}>
                  <FormItem {...tailFormItemLayout}>
                    <Button disabled={this._initbuttonDisabled(sqlInfo, 'pass')} name='pass' style={{ marginRight: "10px" }} type="primary" onClick={this.handleAudit}>执行通过</Button>
                    <Button disabled={this._initbuttonDisabled(sqlInfo, 'reject')} name='reject' type="danger" onClick={this.handleAudit}>驳回</Button>
                  </FormItem>
                </Col>
              </Row> : null
            }

          </Form>
          <SqlConfirm
            visible={this.state.confirmVisible}
            {...parentInfos}
            {...parentMethods}
          />
        </Content>
      </Spin>
    );
  }
}
SqlScriptEdit = Form.create()(SqlScriptEdit);
export default SqlScriptEdit;
