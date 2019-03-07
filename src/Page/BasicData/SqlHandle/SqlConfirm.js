import React, { Component } from "react";
import { Modal, Form, Button, Select, Message } from 'antd';
import BasicDataController from '../BasicDataController';
import Editor from '../../../Components/Editor';
import Fetch from '../../../Base/base'
import { GetApi } from '../../../Base/api'

const FormItem = Form.Item;
const Option = Select.Option;

class SqlConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],//查询指派的用户列表
      designateToId: '',//指派人
    }
    this.EditorNote = null;
  }
  componentDidMount() {
    this.EditorNote && this.EditorNote.setValue('<p></p>');
    BasicDataController.GetUserByUserId(this._getUserByUserId.bind(this));
  }
  //获取当前用户可以指派的用户列表
  _getUserByUserId(userList) {
    this.setState({ userList });
  }
  handleCancel = () => {
    this.EditorNote.setValue('');
    this.props.form.resetFields()
    this.props.onCancel && this.props.onCancel();
  }
  handleCreate = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let note = this.EditorNote.getValue();
        let designateList = []
        for (let designateId of values.designateIdList) {
          designateList.push({ designateId: designateId })
        }
        values = { designateList: designateList, Note: note, Id: this.props.sqlId }
        this.EditorNote.setValue('')
        this.props.form.resetFields()
        Fetch(GetApi('AssignedPerson'), values).then((res) => {
          if (res.Code === '0') {
            Message.success('脚本指派成功')
            this.props.onSubmit && this.props.onSubmit()
          }
          else {
            Message.error(res.Message);
          }
        })
      }
    })

  }
  //选择指派人
  handleDesignateChange = (value) => {
    this.setState({ designateToId: value })
  }

  render() {
    const { visible, form, sqlSid, sqlBranchName } = this.props;
    const { userList } = this.state
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 19 },
    };
    return (
      <Modal
        footer={null}
        width="70%"
        className="card-info"
        visible={visible}
        title={
          <div>
            <span className="prefix">
              <strong>{sqlSid}</strong>
            </span>
            <strong>
              {sqlBranchName}&nbsp;&nbsp;>&nbsp;&nbsp;指派给</strong></div>
        }
        onCancel={this.handleCancel}
      >
        <Form className="addproductform card-info" layout="horizontal" onSubmit={this.handleCreate}>
          <FormItem {...formItemLayout} label="指派给" hasFeedback>
            {
              userList ? getFieldDecorator('designateIdList', {
                rules: [{
                  required: true, message: '请选择指派人员',
                }]
              })(
                <Select mode="multiple" placeholder="请选择用户" showSearch
                  optionFilterProp="children">
                  {userList.map(item => <Option key={item.Id} value={item.Id}>{item.StaffName}</Option>)}
                </Select>
              ) : <Select></Select>
            }
          </FormItem>
          <FormItem label="备注："  {...formItemLayout}>
            {getFieldDecorator('Note')(
              <Editor Style={{ height: "120px" }} ref={(m) => { this.EditorNote = m; }}></Editor>
            )}
          </FormItem>
          <FormItem wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 14, offset: 10 },
          }}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{ margin: "0 5px" }} onClick={this.handleCancel}>返回</Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

SqlConfirm = Form.create()(SqlConfirm);
export default SqlConfirm;