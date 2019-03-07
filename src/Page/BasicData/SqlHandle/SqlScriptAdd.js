import React, { Component } from 'react';
import { Input, Layout, Row, Col, Form, Spin, Select, Table, Upload, Button, Message } from 'antd'
import Common from '../../../Base/common'
import Fetch from '../../../Base/base'
import { GetApi } from '../../../Base/api'
import BasicDataController from '../BasicDataController'

const FormItem = Form.Item
const Content = Layout.Content
const Option = Select.Option
const twoItemLayout = {
  style: {
    height: '15px'
  },
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const oneItemLayout = {
  style: {
    height: '15px',

  },
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
const tailFormItemLayout = {
  wrapperCol: {
    span: 12,
    offset: 11,
  },
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
  dataIndex: 'SqlRowStatusName'
}]
const urlPath = { pathname: '/Main/SqlHandle/SqlScriptList', search: '?op=back' }
class SqlScriptAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodListJsonData: this.props.location.prodListJsonData,
      loading: false,
      dataSource: null,
      fileList: [],
      designateId: null,
      userList: null,//指派人列表
      supportStaffIdList: [],//支持人员列表
    }
  }
  componentDidMount() {
    //加载改公司对应的支持人员
    this._getOrgUserByBranchId(Common.BranchId)
  }
  _getUserByUserId(userList) {
    this.setState({ userList, loading: false })
  }
  _getOrgUserByBranchId(branchId) {
    this.setState({ loading: true })
    Fetch(GetApi('GetBranchStaff'), { 'BranchID': branchId }, { 'method': 'GET' }).then(res => {
      let SupportStaffIdList = []
      for (let staffInfo of res.Result) {
        if (staffInfo.StaffType === 'support') {
          SupportStaffIdList.push(staffInfo.BranchStaffID)
        }
      }
      this.setState({ supportStaffIdList: SupportStaffIdList }, () => {
        BasicDataController.GetUserByUserId(this._getUserByUserId.bind(this));
      })
    })
  }
  /**
   *导入excel
   *
   * @memberof SqlScriptAdd
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

  /**
   *创建脚本处理
   *
   * @memberof SqlScriptAdd
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true })
        let newSqlInfo = {
          sqlScriptingRow: this.state.dataSource, creatorId: Common.Id, creator: Common.StaffName,
          branchId: Common.BranchId, branchName: Common.OrgName, productId: values.ProductId
        }
        let designateList = []
        for (let designateId of values.SupportStaffIdList) {
          designateList.push({ designateId: designateId })
        }
        newSqlInfo.DesignateList = designateList
        newSqlInfo.Desc = values.Desc
        Fetch(GetApi('SaveSqlScript'), newSqlInfo).then((res) => {
          if (res.Code === '0') {
            Message.success('脚本创建成功')
            this.props.history.push(urlPath)
          }
          else {
            Message.error(res.Message);
          }
          this.setState({ loading: false })
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { prodListJsonData, supportStaffIdList, userList } = this.state
    return (
      <Content className='addproductform' style={{ padding: '0 10px 10px', textalign: 'center' }}>
        <h3 style={{ margin: '10px 0' }}>脚本处理 > 创建</h3>
        <Spin spinning={this.state.loading}>
          <Form className="form-info" onSubmit={this.handleSubmit} style={{ background: '#fff' }}>
            <Row style={{ paddingTop: 5 }}>
              <Col span={10}>
                <FormItem {...twoItemLayout} label="所属产品">
                  {prodListJsonData ? getFieldDecorator('ProductId',
                    {
                      rules: [{
                        required: true, message: '请选择所属产品',
                      }],
                      initialValue: sessionStorage.getItem('productId') ? (sessionStorage.getItem('productId') + '') : null,
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children">
                        {prodListJsonData.map((item, i) =>
                          <Option key={item.Id} value={item.Id}>{item.ProductName}</Option>
                        )}
                      </Select>
                    ) : null}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...twoItemLayout} label="分公司">
                  {getFieldDecorator('BranchName', {
                    initialValue: Common.OrgName
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
                    initialValue: Common.StaffName
                  })(
                    <Input readOnly />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...twoItemLayout} label="指派给" hasFeedback>

                  {userList ? getFieldDecorator('SupportStaffIdList', {
                    rules: [{
                      required: true, message: '请选择指派人员',
                    }],
                    initialValue: supportStaffIdList
                  })(
                    <Select mode="multiple" placeholder="请选择用户" showSearch
                      optionFilterProp="children">
                      {userList.map(item => <Option key={item.Id} value={item.Id}>{item.StaffName}</Option>)}
                    </Select>
                  ) : <Select></Select>}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <FormItem {...oneItemLayout} label='脚本描述' hasFeedback>
                  {
                    getFieldDecorator('Desc', {
                      rules: [{
                        required: true, message: '请输入脚本描述'
                      }]
                    })(
                      <Input autoComplete="off" type="text" />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5, marginTop: 5 }}>
              <Col span={20}>
                <FormItem {...oneItemLayout} label="sql列表">
                  <Upload style={{ float: "right" }} accept=".xls,.xlsx" showUploadList={false} customRequest={this._customRequest} >
                    <Button type='primary' icon="upload">导入Excel
                    </Button>
                  </Upload>
                  <Table columns={columns}
                    dataSource={this.state.dataSource} size="small"
                    rowKey={row => row.Num} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <FormItem {...tailFormItemLayout}>
                  <Button style={{ marginRight: "10px" }} type="primary" htmlType="submit">保存</Button>
                  <Button type="ghost" onClick={() => { this.props.history.push(urlPath) }}>返回</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Content>
    );
  }
}
SqlScriptAdd = Form.create()(SqlScriptAdd);
export default SqlScriptAdd;