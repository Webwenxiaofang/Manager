import React from "react";
import { Modal, Form, Input, AutoComplete, Message } from 'antd';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

class DeptEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoBranchCompleteResult: [],
        };
        this.title = '添加部门';
        this.branchId = '';
        //this.branchName = this.props.deptObj ? this.props.deptObj.branchName : '';
    }

    handleBranchChange = (value) => {
        let autoCompleteValue = [];
        if (!value) {
            autoCompleteValue = [];
            this.setState({ autoBranchCompleteResult: autoCompleteValue });
        } else {
            //远程根据ZIY码获取HR人员信息
            Fetch(GetApi('QueryErpBranchName'), { Abbr: value }, { method: 'GET' }).then((data) => {
                if (data.Code === '0') {
                    autoCompleteValue = data.Result;
                    this.setState({ autoBranchCompleteResult: autoCompleteValue });
                    //判断如果选择了ZIY码，则带出真实姓名
                    if (data.Result.length === 1) {
                        this.props.deptObj.BranchID = data.Result[0].BRANCHID;
                        this.props.deptObj.BranchName = data.Result[0].ORGNAME;
                    }
                }

            })
        }
    }
    handleSave = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (this.props.deptObj.BranchID === '') {
                Message.warning('请选择所属公司');
                return;
            }
            console.log('this.props.deptObj', this.props.deptObj);
            if (this.props.deptObj.BranchName !== values.BranchName) {
                Message.warning('所属公司不正确');
                return;
            }
            values.BranchId = this.props.deptObj.BranchID;
            if (this.props.deptObj.Id !== '') {
                values.Id = this.props.deptObj.Id;
            }
            Fetch(GetApi('AddOrUpdateDept'), values).then((data) => {
                if (data.Code === '0') {
                    Message.success('保存成功');
                    if (this.props.onCancel) {
                        this.props.onCancel();
                    }
                }
                else {
                    Message.error(data.Message);
                }
            })
        });
    }
    render() {
        const { visible, onCancel, form, deptObj } = this.props;
        const { getFieldDecorator } = form;
        const { autoBranchCompleteResult } = this.state;
        const FormItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        if (deptObj.Id !== '') {
            this.title = '修改部门';
        }
        const branchOptions = autoBranchCompleteResult.map(item => (
            <AutoCompleteOption key={item.ORGNAME}>{item.ORGNAME}</AutoCompleteOption>
        ));

        return (
            <Modal
                visible={visible}
                title={this.title}
                okText="确认"
                onCancel={onCancel}
                onOk={this.handleSave.bind(this)}
                closable={false}
            >
                <Form layout="horizontal">
                    <FormItem label="部门名称："  {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('DeptName', {
                            rules: [{
                                required: true, message: '请输入部门名称：',
                            }],
                        })(
                            <Input autoComplete="off"></Input>
                        )}
                    </FormItem>
                    <FormItem label="所属公司："  {...FormItemLayout}>
                        {getFieldDecorator('BranchName')(
                            <AutoComplete
                                minChars={3}
                                dataSource={branchOptions}
                                onChange={this.handleBranchChange}
                                placeholder="请输入公司名称或分公司标识"
                            >
                                <Input />
                            </AutoComplete>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
DeptEditor = Form.create()(DeptEditor);
export default DeptEditor;