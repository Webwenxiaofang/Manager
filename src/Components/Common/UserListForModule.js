import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Select } from 'antd';
import BasicDataController from '../../Page/BasicData/BasicDataController'

const Option = Select.Option;
//查询人员组件
class DesignateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Staff: [{ Id: "", StaffID: "", StaffName: "" }],
            value: undefined,
            placeholder: this.props.placeholder,
            size: "default",
        }
        this.SelectData = [];
    }

    componentDidMount() {
        console.log(this)
        if(this.props.RoleName){
            BasicDataController.GetUserByRoleName(this._GetUserByRoleName.bind(this),this.props.RoleName);
        }
        else{
            BasicDataController.GetUserByUserId(this._getUserByUserId.bind(this));
        }
    }
     //获取当前用户可以指派的用户列表
     _GetUserByRoleName(userList) {
        this.setState({ Staff: userList, UserList: userList });
        this.SelectData = userList;
    }
    //获取当前用户可以指派的用户列表
    _getUserByUserId(userList) {
        this.setState({ Staff: userList });
        this.SelectData = userList;
    }
    //输入值
    handleSearch = (value) => {
        this.fetch(value.trim(), data => {
            this.setState({ Staff: data });
        });
    }
    initStaff = () =>{
        let SelectData = this.SelectData
        this.setState({
            Staff:SelectData
        })
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
        console.log(nextProps.SelectData)
        console.log('nextProps.setUserID', nextProps.setUserID)
        if (nextProps.setUserID && nextProps.setUserID.length > 0) {
            this.setState({ value: nextProps.setUserID });
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
        console.log(this)
        console.log(this.props.staticContext)
        // this.props.staticContext = ''
        const options = this.state.Staff.map(d => <Option className="ant-select-item-version"
            key={d.Id} value={d.Id} label={d.StaffName}><span style={{ width: '80px', display: 'inline-block' }}>{d.StaffName}</span>
            <span id={d.DeptName + "-span"} style={{ width: '120px', display: 'inline-block' }}>{d.DeptName}</span></Option>);
        return (
            this.state.Staff.length > 0 ?
            <Select
                className="ant-select-version"
                style={{ width: "100%" }}
                placeholder={this.state.placeholder}
                showSearch
                size={this.props.size}
                value={this.state.value}
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={this.handleSearch.bind(this)}
                onChange={this.handleChange.bind(this)}
                onFocus = {this.initStaff.bind(this)}
                notFoundContent={null}
                optionLabelProp="label"
                dropdownClassName="ant-select-items-version"
            >
                {options}
            </Select> : <Select onFocus = {this.initStaff.bind(this)} showSearch onSearch={this.handleSearch.bind(this)} onChange={this.handleChange.bind(this)}></Select>
        );
    }
}

export default withRouter(DesignateUser);