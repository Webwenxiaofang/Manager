import React, { Component } from 'react';
import { Form, Select, Input, Modal, Message } from 'antd';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class OrgUserEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, done: false };
  }
  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { orgUserInfo: { BranchID }, selectedRows } = this.props
        let dataList = []//待保存的数据
        //批量保存
        if (selectedRows.length > 0) {
          for (let row of selectedRows) {
            let orgUser = { BranchID: row.BranchID, BranchStaff: [] }
            if (values.DemandStaffIdList && values.DemandStaffIdList.length > 0) {
              for (let staffId of values.DemandStaffIdList) {
                orgUser.BranchStaff.push({
                  "BranchStaffID": staffId,
                  "StaffType": "demand",
                })
              }
            }
            if (values.SupportStaffIdList && values.SupportStaffIdList.length > 0) {
              for (let staffId of values.SupportStaffIdList) {
                orgUser.BranchStaff.push({
                  "BranchStaffID": staffId,
                  "StaffType": "support",
                  "BranchID": row.BranchID,
                })
              }
            }
            if (values.DutyStaffIdList && values.DutyStaffIdList.length > 0) {
              for (let staffId of values.DutyStaffIdList) {
                orgUser.BranchStaff.push({
                  "BranchStaffID": staffId,
                  "StaffType": "duty",
                  "BranchID": row.BranchID,
                })
              }
            }
            dataList.push(orgUser)
          }
        }
        //单个保存
        else {
          let orgUser = { BranchID: BranchID, BranchStaff: [] }
          if (values.DemandStaffIdList && values.DemandStaffIdList.length > 0) {
            for (let staffId of values.DemandStaffIdList) {
              orgUser.BranchStaff.push({
                "BranchStaffID": staffId,
                "StaffType": "demand",
              })
            }
          }
          if (values.SupportStaffIdList && values.SupportStaffIdList.length > 0) {
            for (let staffId of values.SupportStaffIdList) {
              orgUser.BranchStaff.push({
                "BranchStaffID": staffId,
                "StaffType": "support",
              })
            }
          }
          if (values.DutyStaffIdList && values.DutyStaffIdList.length > 0) {
            for (let staffId of values.DutyStaffIdList) {
              orgUser.BranchStaff.push({
                "BranchStaffID": staffId,
                "StaffType": "duty",
              })
            }
          }
          dataList.push(orgUser)
        }
        Fetch(GetApi('AddOrUpdateBranchStaff'), dataList).then((res) => {
          if (res.Code === '0') {
            Message.success('保存成功');
            this.props.onSubmit();
          }
          else {
            Message.error(res.Message);
          }
        })
      }
    })
  }
  render() {
    const { form: { getFieldDecorator }, visible, onCancel, orgUserInfo, userList, orgUserInfo: { DemandStaffIdList, SupportStaffIdList, DutyStaffIdList }, selectedRows } = this.props
    let branchIdList = '', branchNameList = ''
    if (selectedRows.length > 0) {
      for (var row of selectedRows) {
        branchIdList += row.BranchID + ';'
        branchNameList += row.BranchName + ';'
      }
    }
    else {
      branchIdList = orgUserInfo.BranchID
      branchNameList = orgUserInfo.BranchName
    }
    return (
      <Modal
        destroyOnClose
        visible={visible}
        title='组织人员关系编辑'
        okText="保存"
        onOk={this.handleSubmit}
        onCancel={onCancel}
        width='60%'
      >
        <Form>
          <FormItem key="branchIdList" label="分公司标识" {...this.formLayout}>
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} value={branchIdList} readOnly />
          </FormItem>
          <FormItem key="branchNameList" label="分公司名称" {...this.formLayout}>
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} value={branchNameList} readOnly />
          </FormItem>
          <FormItem key="SupportStaffName" label="支持人员" {...this.formLayout}>
            {getFieldDecorator('SupportStaffIdList', {
              initialValue: SupportStaffIdList
            })(
              <Select mode="multiple" placeholder="请选择用户" showSearch
                optionFilterProp="children">
                {userList.map(item => <Option key={item.Id} value={item.Id}>{item.StaffName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem key="DemandStaffName" label="需求人员" {...this.formLayout}>
            {getFieldDecorator('DemandStaffIdList', {
              initialValue: DemandStaffIdList
            })(
              <Select mode="multiple" placeholder="请选择用户" showSearch
                optionFilterProp="children">
                {userList.map(item => <Option key={item.Id} value={item.Id}>{item.StaffName}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem key="DutyStaffName" label="值班人员" {...this.formLayout}>
            {getFieldDecorator('DutyStaffIdList', {
              initialValue: DutyStaffIdList
            })(
              <Select mode="multiple" placeholder="请选择用户" showSearch
                optionFilterProp="children">
                {userList.map(item => <Option key={item.Id} value={item.Id}>{item.StaffName}</Option>)}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
OrgUserEdit = Form.create()(OrgUserEdit);
export default OrgUserEdit;