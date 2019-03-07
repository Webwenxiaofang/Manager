import React, { Component, Fragment } from 'react';
import { Form, Input, Row, Layout, Breadcrumb, Button, Message } from 'antd';
import Fetch from '../../../Base/base';
import { GetApi } from '../../../Base/api';
import StandardTable from '../../../Components/Common/StandardTable'
import OrgUserEdit from './OrgUserEdit'
import BasicDataController from '../BasicDataController'
import Common from '../../../Base/common'

const { Content } = Layout;
const { Search } = Input;
const buttonAuths = { displayName: 'dept', arr: ['batchOrgUser', 'editOrgUser'] };//按钮初始化


class OrgUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      loading: false,
      selectedRows: [],
      data: {
        list: [],
        pagination: null
      },
      modalVisible: false,
      orgUserInfo: {},//指定分公司的维护人员信息
      userList: [],
      buttonDisabled: Common.getButtonJurisdiction(buttonAuths),
    }
  };
  columns = [
    {
      title: '分公司标识',
      dataIndex: 'BranchID',
      key: 'BranchID'
    },
    {
      title: '上级公司',
      dataIndex: 'UpBranchName',
      key: 'UpBranchName'
    },
    {
      title: '分公司名称',
      dataIndex: 'BranchName',
      key: 'BranchName'
    },
    {
      title: '支持人员',
      dataIndex: 'SupportStaffName',
      key: 'SupportStaffName'
    },
    {
      title: '需求人员',
      dataIndex: 'DemandStaffName',
      key: 'DemandStaffName'
    },
    {
      title: '值班人员',
      dataIndex: 'DutyStaffName',
      key: 'DutyStaffName'
    },
    {
      title: '操作',
      render: (text, record) => (
        <Button.Group type="ghost">
          <Button disabled={!this.state.buttonDisabled["editOrgUser"]} icon="edit" type="primary" title='操作' onClick={this.handleEditModal.bind(this, record)}></Button>
        </Button.Group>
      )
    }
  ];
  pagination = {
    total: 0,
    current: 1,
    pageSize: 10,
    showTotal: (total) => {
      return `共 ${total} 条数据`;
    },
  }
  componentDidMount() {
    this.setState({ searchText: sessionStorage.getItem('orgUserAbbr') });
    BasicDataController.QueryAllUser(this._InitUserList.bind(this));
    this._getOrgList();
  }
  _InitUserList(userList) {
    this.setState({ userList })
  }
  /**
   *查询分公司列表信息
   *
   * @param {*} [pagination=this.pagination] 分页信息
   * @memberof OrgUserList
   */
  _getOrgList() {
    this.setState({ loading: true, selectedRows: [] })
    const orgUserAbbr = sessionStorage.getItem('orgUserAbbr');
    //let apiUrl = GetApi('QueryErpBranchName')
    let apiUrl = GetApi("GetBranchStaffAll");
    apiUrl = `${apiUrl}&pageIndex=${this.pagination.current}&pageSize=${this.pagination.pageSize}`;
    Fetch(apiUrl, [{ "Name": "Abbr", "Value": orgUserAbbr }]).then((res) => {
      this.pagination.total = res.Result.RecordCount
      this.setState({
        loading: false,
        data: { list: res.Result.ResultSet, pagination: this.pagination }
      }, () => { console.log('_getOrgList2', this.state.data.pagination) });
    });
  }

  /**
   *编辑某个分公司对弈相关人员
   *
   * @param {*} item 分公司对象
   * @memberof OrgUserList
   */
  handleEditModal(item) {
    // Fetch(GetApi("QueryDeptBySql"), [{ "Name": "Abbr" }]).then((res) => {
    //   this.setState({
    //     modalVisible: true,
    //     orgUserInfo: res.result || {},
    //   });
    // })
    Fetch(GetApi('GetBranchStaff'), { 'BranchID': item.BranchID }, { 'method': 'GET' }).then(res => {
      let DemandStaffIdList = [], SupportStaffIdList = [], DutyStaffIdList = []
      for (let staffInfo of res.Result) {
        if (staffInfo.StaffType === 'demand') {
          DemandStaffIdList.push(staffInfo.BranchStaffID)
        } else if (staffInfo.StaffType === 'support') {
          SupportStaffIdList.push(staffInfo.BranchStaffID)
        } else if (staffInfo.StaffType === 'duty') {
          DutyStaffIdList.push(staffInfo.BranchStaffID)
        }
      }
      this.setState({
        modalVisible: true, selectedRows: [], orgUserInfo: {
          BranchID: item.BranchID,
          BranchName: item.BranchName,
          DemandStaffIdList: DemandStaffIdList,
          SupportStaffIdList: SupportStaffIdList,
          DutyStaffIdList: DutyStaffIdList,
        }
      })
    })
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value })
  }
  handleSearchClick = (text) => {
    sessionStorage.setItem('orgUserAbbr', text);
    this._getOrgList();
  }
  /**
  *列表勾选复选框
  *
  * @memberof OrgUserList
  */
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };
  /**
   *表格分页触发的方法
   *
   * @memberof OrgUserList
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.pagination.current = pagination.current
    this.pagination.pageSize = pagination.pageSize
    this._getOrgList()
  }
  /**
   *保存弹出框
   *
   * @memberof OrgUserList
   */
  handleModalSubmit = () => {
    this.setState({ modalVisible: false }, () => {
      this._getOrgList();
    })
  }
  /**
   *关闭弹出框
   *
   * @memberof OrgUserList
   */
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  /**
   *批量编辑
   *
   * @memberof OrgUserList
   */
  handlePatchEdit = () => {
    if (this.state.selectedRows.length === 0) {
      Message.warn('请选择要编辑的分公司')
      return
    }
    this.setState({
      modalVisible: true, orgUserInfo: {
        DemandStaffIdList: [],
        SupportStaffIdList: [],
        DutyStaffIdList: [],
      }
    })
  }
  /**
   *操作区域
   *
   * @returns
   * @memberof OrgUserList
   */
  renderQuery() {
    return (
      <Fragment>
        <div style={{ float: "right", display: "inline" }}>
          <Button type="primary" size="large" icon="rollback" onClick={() => { this.props.history.push('/Main/BasicData/User/DeptList') }}>返回</Button>
        </div>
        <div style={{ float: "right", display: "inline", marginRight: '10px' }}>
          <Button disabled={!this.state.buttonDisabled["batchOrgUser"]} type="primary" size="large" icon="user-add" onClick={this.handlePatchEdit}>批量编辑</Button>
        </div>
        <div style={{ float: "right", display: "inline", marginRight: '10px' }}>
          <Search
            placeholder="input search text"
            enterButton="查询"
            size="large"
            value={this.state.searchText}
            onSearch={this.handleSearchClick}
            onChange={this.handleSearchChange}
          />
        </div>
      </Fragment>
    )
  }
  render() {
    const { loading, selectedRows, data, modalVisible, orgUserInfo, userList } = this.state
    const parentMethods = {
      onCancel: this.handleModalCancel,
      onSubmit: this.handleModalSubmit,
    };
    const parentInfos = {
      orgUserInfo: orgUserInfo,
      userList: userList,
      selectedRows: selectedRows,
    }
    return (
      <Content style={{ padding: '0 10px 10px' }}>
        <Breadcrumb style={{ margin: '10px 0', fontWeight: 'bold' }}>
          <Breadcrumb.Item style={{ color: '#cf1322' }}>组织人员关系</Breadcrumb.Item>
        </Breadcrumb>
        <div className="base-nav">
          <Row>
            {this.renderQuery()}
          </Row>
          <Row style={{ paddingTop: 10 }}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={row => row.SId}
              size="small"
            />
          </Row>
        </div>
        <OrgUserEdit visible={modalVisible}
          {...parentInfos}
          {...parentMethods}
        ></OrgUserEdit>
      </Content>
    );
  }
}
OrgUserList = Form.create()(OrgUserList);
export default OrgUserList;