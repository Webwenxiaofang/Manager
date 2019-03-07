import React from 'react';
import Fetch from '../../../Base/base';
import { Message, Table, Button, Popconfirm, Layout, Row,Breadcrumb, Divider } from 'antd';
import { GetApi } from '../../../Base/api';
import Common from '../../../Base/common'

const { Content } = Layout;
const buttonAuths = { displayName: 'role', arr: ['view', 'add', 'edit', 'delete'] };//按钮初始化

class RoleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      buttonDisabled: Common.getButtonJurisdiction(buttonAuths),
    };
  }
  componentDidMount() {
    this._getRoleList();
  }
  _getRoleList = () => {
    this.setState({ loading: true });
    Fetch(GetApi('QueryRole'), [{ "Name": "", "Value": "" }]).then((data) => {
      this.setState({
        loading: false,
        dataSource: data.Result.ResultSet
      });
    })
  }
  handleAddClick = (e) => {
    let url = {
      pathname: '/Main/BasicData/Role/RoleEditor',
      search: `?operate=edit`,
    }
    this.props.history.push(url);
  }
  handleView = (obj) => {

    let url = {
      pathname: '/Main/BasicData/Role/RoleEditor',
      search: `?roleId=${obj.Id}&operate=view`,
    }
    this.props.history.push(url);
  }
  handleEdit = (obj) => {
    let url = {
      pathname: '/Main/BasicData/Role/RoleEditor',
      search: `?roleId=${obj.Id}&operate=edit`,
    }

    this.props.history.push(url);
  }
  handleDel(record) {
    Fetch(GetApi('DeleteRole'), { id: record.Id }, { method: 'GET' })
      .then((data) => {
        if (data.Code === '0') {
          Message.success('删除角色成功');
          this._getRoleList();
        }
        else {
          Message.error(data.Message);
        }
      })
  }
  render() {
    let { buttonDisabled } = this.state;
    const columns = [{
      title: 'ID',
      key: 'SId',
      dataIndex: 'SId',
    },
    {
      title: '角色名称',
      key: 'RoleName',
      dataIndex: 'RoleName',
      render: (index, item) => {
        if (buttonDisabled["view"]) {
          return (<a className='itemActive' onClick={this.handleView.bind(this, item)}>{item.RoleName}</a>)
        }
        else {
          return item.RoleName;
        }
      }
    }, {
      title: '角色描述',
      key: 'RoleDescribe',
      dataIndex: 'RoleDescribe',
    }, {
      title: '用户列表',
      key: 'UserName',
      dataIndex: 'UserName',
      className: 'bug-title-width title-max-width-400',
      render: (item, record) => {
        return <span title={record.UserName}>{record.UserName}</span>
      }
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <Button.Group type="ghost">
            <Button icon="edit" type="primary" onClick={this.handleEdit.bind(this, record)}></Button>
            {
              buttonDisabled["delete"] ?
                <Popconfirm disabled={false} title="确定要删除吗？" onConfirm={() => this.handleDel(record)}>
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
          <Breadcrumb.Item style={{ color: '#cf1322' }}>角色列表</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: '10px 5px', background: '#fff' }}>
          <Row>
            <div style={{ float: "right", display: "inline" }}>
              <Button type="primary" disabled={!buttonDisabled["add"]} size="large" icon="usergroup-add" onClick={this.handleAddClick}>添加角色</Button>
            </div>
          </Row>
          <Row>
            <Divider style={{ marginTop: 10, marginBottom: 10 }}></Divider>
          </Row>
          <Row>
            <Table columns={columns} dataSource={this.state.dataSource} loading={this.state.loading} rowKey={row => row.Id} size="small" />
          </Row>
        </div>
      </Content>
    );
  }
}

export default RoleList;