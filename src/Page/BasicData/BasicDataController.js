import Fetch from '../../Base/base';
import { GetApi } from '../../Base/api';
import Common from '../../Base/common';

const BasicDataController = {
    QueryDept: function (_initDeptList) {
        Fetch(GetApi("QueryDept"), null, { method: 'GET' }
        ).then((data) => {
            _initDeptList(data.Result);

        });
    },
    QueryRole: function (_initRoleList) {
        Fetch(GetApi('QueryRole'), [{ "Name": "", "Value": "" }]).then((data) => {
            _initRoleList(data.Result.ResultSet);
        });
    },
    QueryDictItem: function (_initDictItemList, params) {
        Fetch(GetApi('getDictitemList'), params).then((data) => {
            _initDictItemList(data.Result);
        });
    },
    GetUserByUserId: function (_getUserByUserId) {
        Fetch(GetApi('GetUserByUserID'), { UserID: Common.Id }, { method: 'GET' }).then((data) => {
            _getUserByUserId(data.Result);
        });
    },
    GetUserByRoleName: function (_GetUserByRoleName, ROLENAME) {
        Fetch(GetApi('GetUserByRoleName'), { RoleName: ROLENAME }, { method: 'GET' }).then((data) => {
            _GetUserByRoleName(data.Result)
        })
    },
    QueryFunction: function (_InitFunctionTree) {
        Fetch(GetApi('QueryFunction'), null, { method: 'GET' }).then((data) => {
            _InitFunctionTree(data.Result);
        });
    },
    QueryAllUser: function (_InitUserList) {
        Fetch(GetApi('QueryUser'), [{ "Name": "Abbr", "Value": null }, { "Name": "DeptID", "Value": null }]).then((data) => {
            _InitUserList(data.Result.ResultSet);
        });
    },
    GetUserByBranchId: function (_InitBranchUserList) {
        Fetch(GetApi('GetUserByBranchId'), null, { method: 'GET' }).then((data) => {
            _InitBranchUserList(data.Result);
        });
    },
    QueryHistoryData: function (_InitHistoryData, params) {
        Fetch(GetApi('GetEntityHistory'), params, { method: 'GET' }).then((res) => {
            if (res.Code === '0') {
                _InitHistoryData(res.Result);
                // this.setState({ historyArr: res.Result });
            }
        })
    }
}
export default BasicDataController;