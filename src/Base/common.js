const Common = {
    _branchId: '',
    _token: "",
    _id: "",
    _sex: '',
    _staffId: '',
    _staffName: '',
    _staffNo: '',
    _orgName: '',
    _mobile: '',
    _deptId: '',
    _deptName: '',
    _lastLoginTime: '',
    _loginCount: '',
    _functList: [],//权限列表
    _roleList: [],//角色列表
    _userList: [],//指派人列表 
    _cloudUrl: "http://obs.cn-north-1.myhwclouds.com/niuniu/",
    _referrer: null,//上一个页面地址
    get Referrer() {
        return this._referrer
    },
    set Referrer(value) {
        this._referrer = value
    },
    get Token() {
        if (this._token === null || this._token === undefined || this._token.length < 1) {
            this._getCacheCommon()
        }
        return this._token
    },
    set Token(value) {
        this._token = value
    },
    get Id() {
        if (this._id === null || this._id === undefined || this._id.length < 1) {
            this._getCacheCommon()
        }
        return this._id
    },
    set Id(value) {
        this._id = value
    },
    get Sex() {
        if (this._sex === null || this._sex === undefined || this._sex.length < 1) {
            this._getCacheCommon()
        }
        return this._sex
    },
    set Sex(value) {
        this._sex = value
    },
    get BranchId() {
        if (this._branchId === null || this._branchId === undefined || this._branchId.length < 1) {
            this._getCacheCommon()
        }
        return this._branchId
    },
    set BranchId(value) {
        this._branchId = value
    },
    get StaffId() {
        if (this._staffId === null || this._staffId === undefined || this._staffId.length < 1) {
            this._getCacheCommon()
        }
        return this._staffId
    },
    set StaffId(value) {
        this._staffId = value
    },
    get StaffName() {
        if (this._staffName === null || this._staffName === undefined || this._staffName.length < 1) {
            this._getCacheCommon()
        }
        return this._staffName
    },
    set StaffName(value) {
        this._staffName = value
    },
    get StaffNo() {
        if (this._staffNo === null || this._staffNo === undefined || this._staffNo.length < 1) {
            this._getCacheCommon()
        }
        return this._staffNo
    },
    set StaffNo(value) {
        this._staffNo = value
    },
    get OrgName() {
        if (this._orgName === null || this._orgName === undefined || this._orgName.length < 1) {
            this._getCacheCommon()
        }
        return this._orgName
    },
    set OrgName(value) {
        this._orgName = value
    },
    get Mobile() {
        if (this._mobile === null || this._mobile === undefined || this._mobile.length < 1) {
            this._getCacheCommon()
        }
        return this._mobile
    },
    set Mobile(value) {
        this._mobile = value
    },
    get DeptId() {
        if (this._deptId === null || this._deptId === undefined || this._deptId.length < 1) {
            this._getCacheCommon()
        }
        return this._deptId
    },
    set DeptId(value) {
        this._deptId = value
    },
    get DeptName() {
        if (this._deptName === null || this._deptName === undefined || this._deptName.length < 1) {
            this._getCacheCommon()
        }
        return this._deptName
    },
    set DeptName(value) {
        this._deptName = value
    },
    get LastLoginTime() {
        if (this._lastLoginTime === null || this._lastLoginTime === undefined || this._lastLoginTime.length < 1) {
            this._getCacheCommon()
        }
        return this._lastLoginTime
    },
    set LastLoginTime(value) {
        this._lastLoginTime = value
    },
    get LoginCount() {
        if (this._loginCount === null || this._loginCount === undefined || this._loginCount.length < 1) {
            this._getCacheCommon()
        }
        return this._loginCount
    },
    set LoginCount(value) {
        this._loginCount = value
    },
    get FunctList() {
        if (this._functList === null || this._functList === undefined || this._functList.length < 1) {
            this._getCacheCommon()
        }
        return this._functList
    },
    set FunctList(value) {
        this._functList = value
    },
    get RoleList() {
        if (this._roleList === null || this._roleList === undefined || this._roleList.length < 1) {
            this._getCacheCommon()
        }
        return this._roleList
    },
    set RoleList(value) {
        this._roleList = value
    },
    get UserList() {
        if (this._userList === null || this._userList === undefined || this._userList.length < 1) {
            this._getCacheCommon()
        }
        return this._userList
    },
    set UserList(value) {
        this._userList = value
    },
    get CloudUrl() {
        if (this._cloudUrl === null || this._cloudUrl === undefined || this._cloudUrl.length < 1) {
            this._getCacheCommon()
        }
        return this._cloudUrl
    },
    set CloudUrl(value) {
        this._cloudUrl = value
    },
    _getCacheCommon: function () {
        let userCommon = JSON.parse(localStorage.getItem('Common'));
        console.log("userCommon", userCommon);
        if (userCommon) {
            let userObj = userCommon.Common
            if (userObj !== null) {
                this._token = userObj.Token
                this._branchId = userObj.BranchId
                this._id = userObj.Id
                this._sex = userObj.Sex
                this._staffId = userObj.StaffId
                this._staffNo = userObj.StaffNo
                this._staffName = userObj.StaffName
                this._mobile = userObj.Mobile
                this._deptId = userObj.DeptId
                this._deptName = userObj.DeptName
                this._lastLoginTime = userObj.LastLoginTime
                this._loginCount = userObj.LoginCount
                this._orgName = userObj.OrgName
                this._functList = userObj.FunctList ? userObj.FunctList : []
                this._roleList = userObj.RoleList ? userObj.RoleList : []
                this._userList = userObj.UserList ? userObj.UserList : []
                this._cloudUrl = userObj.CloudUrl
            }
        } else {
            console.log('Authorization', document.referrer);
            localStorage.clear();
            window.location.href = "#/Login"
        }
    },
    getday: function getday(type) {
        var date_ = new Date();
        var year = date_.getFullYear();
        var month = date_.getMonth() + 1;

        if (type === 1) {
            return year + '-' + month + '-01' //本月第一天
        }
        else if (type === 2) {
            var day = new Date(year, month, 0);
            return year + '-' + month + '-' + day.getDate(); //下个月
        }
        else if (type === 0) {
            return year + '-' + month + '-' + date_.getDate(); //当日
        }
        else if (type === 3) {
            var curDate = new Date();
            var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); //后一天
            return nextDate;
        }
    },
    dateformat: function (date) {
        var date_ = new Date(date);
        var result = date_.getFullYear() + '年' + (date_.getMonth() + 1) + '月' + date_.getDate() + '日  ' + date_.getHours() + ':' + date_.getMinutes() + ':' + date_.getSeconds();
        return result;
    },
    getUrlParam: function (url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.substr(1).match(reg);
        // if (r!=null) return unescape(r[2]);
        if (r != null) return r[2];
        return null;
    },
    /**
     * 按钮权限获取
     * @param {*} obj {displayName: 'test',arr: ['view', 'create']}
     */
    getButtonJurisdiction: function (obj) {
        let FunctList = this.FunctList
        let filterArr = []
        FunctList.filter((item) => {
            // 只会返回个长度为1的数组
            return item.DisplayName === obj.displayName
        }).map((item) => 
            FunctList.filter((k) => {
                return item.Id === k.ParentID && k.ResourceType === 'button'
            }).map((item) => 
                filterArr.push(item.DisplayName)
            )
        )
        let arr = obj.arr, jurisdictionObj = {}
        arr.map((item) => function(item){
            if (filterArr.indexOf(item) > -1) {
                //jurisdictionArr.push(true)
                jurisdictionObj[item] = true
            } else {
                //jurisdictionArr.push(false)
                jurisdictionObj[item] = false
            }
        })
        return jurisdictionObj
    }
}
export default Common;