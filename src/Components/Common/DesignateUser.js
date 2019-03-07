import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Select } from 'antd';
import { GetApi } from "../../Base/api";
import Fetch from '../../Base/base';
import Common from '../../Base/common';
import BasicDataController from '../../Page/BasicData/BasicDataController'

const Option = Select.Option;
//查询人员组件
class DesignateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Staff: [],
            UserList: [],
            value: undefined,
            placeholder: this.props.placeholder,
            size: "default",
        }
        this.SelectData = [];
    }

    componentWillMount() {
        //BasicDataController.GetUserByUserId(this._getUserByUserId.bind(this));
        this.setState({ Staff: this.props.designateUserList, UserList: this.props.designateUserList });
        this.SelectData = this.props.designateUserList;
    }
    //查找默认选择的人是否在下拉框中
    _findStaffIdInUserList(staffId) {
        for (let user of this.props.designateUserList) {
            console.log(user.Id + '|' + staffId)
            if (user.Id === staffId) return true
        }
        return false
    }
    //输入值
    handleSearch = (value) => {
        this.fetch(value.trim(), data => {
            this.setState({ Staff: data });
        });
    }
    //选中
    handleChange = (value, option) => {
        this.setState({ value });
        let name = "";
        if (value !== undefined) {
            name = option.props.children[0].props.children;
        }

        console.log("value", value);
        this.props.onSelectedItem(value, name, option);
    }

    componentWillReceiveProps = (nextProps) => {
        console.log('nextProps.setUserID', nextProps.setUserID)
        if (nextProps.setUserID && nextProps.setUserID.length > 0) {
            if (this._findStaffIdInUserList(nextProps.setUserID)) {
                this.setState({ value: nextProps.setUserID });
            }
            else {
                this.setState({ value: Common.Id });
            }
        } else {
            this.setState({ value: undefined });
        }
    }

    //输入过滤
    fetch = (value, callback) => {
        let dc = this.SelectData.length;
        let newData = [];
        let id = "";
        let name = "";
        let zjm = "";
        if (this.SelectData !== null && this.SelectData !== undefined) {
            if (dc > 0) {
                for (var i = 0; i < dc; i++) {
                    id = this.SelectData[i].StaffID;
                    name = this.SelectData[i].StaffName;

                    zjm = this.SelectData[i].ZJM;
                    if (id !== null && id !== undefined) {
                        if (id.toUpperCase().indexOf(value.toUpperCase()) > -1) {
                            newData.push(this.SelectData[i]);
                            continue;
                        }
                    }
                    if (name !== null && name !== undefined) {
                        if (name.toUpperCase().indexOf(value.toUpperCase()) > -1) {
                            newData.push(this.SelectData[i]);
                            continue;
                        }
                    }
                    if (zjm !== null && zjm !== undefined) {
                        if (zjm.toUpperCase().indexOf(value.toUpperCase()) > -1) {
                            newData.push(this.SelectData[i]);
                            continue;
                        }
                    }
                }
                callback(newData);
            }
        }
    }
    render() {
        const options = this.state.Staff.map(d => <Option className="ant-select-item-version"
            key={d.Id} value={d.Id} label={d.StaffName}><span style={{ width: '80px', display: 'inline-block' }}>{d.StaffName}</span>
            <span id={d.DeptName + "-span"} style={{ width: '120px', display: 'inline-block' }}>{d.DeptName}</span></Option>);
        return (
            (this.state.UserList && this.state.UserList.length > 0 ?
                <Select
                    className="ant-select-version"
                    placeholder={this.state.placeholder}
                    showSearch
                    size={this.props.size}
                    value={this.state.value}
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onSearch={this.handleSearch.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    notFoundContent={null}
                    optionLabelProp="label"
                    dropdownClassName="ant-select-items-version"
                >
                    {options}
                </Select> : <Select></Select>
            )
        );
    }
}

export default withRouter(DesignateUser);