import React from 'react';
import Fetch from '../../../Base/base';
import { Message, Table, Button, Popconfirm, Layout, Row, Breadcrumb, Input, Divider } from 'antd';
import { GetApi } from '../../../Base/api';
import DeptEditor from './DeptEditor';
import '../BasicData.css';
import DeptView from './DeptVIew';
import Common from '../../../Base/common';

const { Content } = Layout;
const Search = Input.Search;
const buttonAuths = { displayName: 'dept', arr: ['view', 'create', 'edit', 'delete', 'orgUserList'] };//按钮初始化

class DeptList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      dataSource: [],
      editVisible: false,
      viewVisible: false,
      deptObj: {},
      buttonDisabled: Common.getButtonJurisdiction(buttonAuths),
    };
    this.pagesize = 20;
    this.total = 0;
  }

  componentDidMount() {
    this.setState({ searchText: sessionStorage.getItem('deptAbbr') });
    this._getDeptList();
  }
  _getDeptList = (pagination) => {
    this.setState({ loading: true });
    const deptAbbr = sessionStorage.getItem('deptAbbr');
    let apiUrl = GetApi("QueryDeptBySql");
    //第一次查询需要初始化分页
    if (!pagination) {
      pagination = { current: 1, pagesize: this.pagesize };
    }
    //拼接分页查询
    apiUrl = `${apiUrl}&pageIndex=${pagination.current}&pageSize=${pagination.pagesize}`;
    Fetch(apiUrl, [{ "Name": "Abbr", "Value": deptAbbr }]).then((data) => {
      this.total = data.Result.RecordCount;
      this.setState({
        loading: false,
        dataSource: data.Result.ResultSet
      });
    });
  }
  _initDeptList(deptList) {
    this.setState({ dataSource: deptList, count: deptList.length });
  }
  //设置弹出的Form
  _saveFormRef = (form) => {
    this.deptForm = form;
  }
  //查询输入框变化事件
  handleSearchChange = (event) => {
    this.setState({ searchText: event.target.value });
  }
  //查询按钮事件
  handleSearchClick = (text) => {
    sessionStorage.setItem('deptAbbr', text);
    this._getDeptList();
  }
  // 隐藏弹出框
  handleCancel = (operate) => {
    const visible = operate + 'Visible';
    this.setState({
      [visible]: false
    }, this._getDeptList())
  }
  //查看部门
  handleView = (obj) => {
    this.setState(
      { deptObj: obj, viewVisible: true }
    );
  }
  //添加部门
  handleAddDept = () => {
    let obj = { Id: '', DeptName: '', BranchName: '' };
    this.setState({ editVisible: true, deptObj: obj }, () => {
      let form = this.deptForm;
      form.setFieldsValue(obj);
    })
  }
  //编辑部门
  handleEditDept = (obj) => {
    this.setState(
      { deptObj: obj, editVisible: true }, () => {
        let form = this.deptForm;
        form.setFieldsValue(obj);
      }
    );
  }
  //删除部门
  handleDel = (record) => {
    Fetch(GetApi('DeleteDept'), { id: record.Id }, { method: 'GET' })
      .then((data) => {
        if (data.Code === "0") {
          Message.success('删除部门成功');
          this._getDeptList();
        }
        else {
          Message.error(data.Message);
        }
      });
  }
  handleOrgUser = () => {
    this.props.history.push('/Main/BasicData/User/OrgUserList')
  }
  render() {
    let { buttonDisabled } = this.state;
    let pagination = {
      total: this.total,
      defaultCurrent: 1,
      pageSize: this.pagesize,
      onChange: (current, pageSize) => {
        this._getDeptList({ current: current, pagesize: pageSize })
      },
      showTotal: (total) => {
        return `共 ${total} 条数据`;
      },
    };
    const columns = [{
      title: 'ID',
      dataIndex: 'SId',
      key: 'SId',
    },
    {
      title: '部门名称',
      dataIndex: 'DeptName',
      key: 'DeptName',
      render: (index, item) => {
        if (buttonDisabled["view"]) {
          return (<div className='itemActive' onClick={this.handleView.bind(this, item)}>{item.DeptName}</div>)
        }
        else {
          return item.DeptName;
        }
      }
    }, {
      title: '分公司名称',
      dataIndex: 'BranchName',
      key: 'BranchName',
    }, {
      title: '分公司标识',
      dataIndex: 'BranchID',
      key: 'BranchID',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <Button.Group type="ghost">
            <Button disabled={!buttonDisabled["edit"]} icon="edit" type="primary" onClick={this.handleEditDept.bind(this, record)}></Button>
            {
              buttonDisabled["delete"] ?
                <Popconfirm disabled={false} title="确定要删除吗？" onConfirm={this.handleDel.bind(this, record)}>
                  <Button disabled={false} icon="delete" type="dashed" ></Button>
                </Popconfirm>
                : <Button disabled={true} icon="delete" type="dashed" ></Button>
            }
          </Button.Group>
        );
      }
    }
    ];
    return (
      <Content style={{ padding: '0 10px 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', fontWeight: 'bold' }}>
          <Breadcrumb.Item style={{ color: '#cf1322' }}>部门列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className="base-nav">
          <Row>
            <div style={{ float: "right", display: "inline" }}>
              <Button disabled={!buttonDisabled["orgUserList"]} type="primary" size="large" icon="cluster" onClick={this.handleOrgUser}>组织人员关系</Button>
            </div>
            <div style={{ float: "right", display: "inline", marginRight: '10px' }}>
              <Button disabled={!buttonDisabled["create"]} type="primary" size="large" icon="plus" onClick={this.handleAddDept}>添加部门</Button>
            </div>
            <div style={{ float: "right", display: "inline", marginRight: '10px' }}>
              <Search
                placeholder="input search text"
                enterButton="查询"
                size="large"
                value={this.state.searchText}
                onChange={this.handleSearchChange.bind(this)}
                onSearch={this.handleSearchClick}
              />
            </div>
          </Row>
          <Row>
            <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
          </Row>
          <Row>
            <Table columns={columns} dataSource={this.state.dataSource} loading={this.state.loading}
              pagination={pagination} rowKey={row => row.Id} size="small" />
          </Row>
        </div>
        <DeptEditor
          deptObj={this.state.deptObj}
          ref={(form) => { this._saveFormRef(form) }}
          visible={this.state.editVisible}
          onCancel={this.handleCancel.bind(this, 'edit')}
        />
        <DeptView
          onOk={this.handleCancel.bind(this, 'view')}
          deptObj={this.state.deptObj}
          visible={this.state.viewVisible}
        />
      </Content>
    );
  }
}

export default DeptList;