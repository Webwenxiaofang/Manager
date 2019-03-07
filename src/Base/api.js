
let Api = {
    ReleaseModel: /10.4.7.57:8001/.test(window.location.host) ? true : false,//发布模式
    InnerNetwork: true,
    Host: '',
    Host_Formal: {
        InnerToken: 'http://10.4.7.27:8002/',
        //Inner: 'http://110.4.7.27:8888/',
        Inner: 'http://10.4.7.27:8004/',
        Outer: 'http://110.4.7.27:8889/',
    },
    //测试_内网
    Host_Test: {
        InnerToken: 'http://10.4.7.27:8002/',
        // Inner: 'http://10.4.7.27:8888/',
        Inner: 'http://nnservice.dev.jzt/',
        Outer: 'http://10.4.7.27:8889/',
    },
    GtRegisterInfo: 'SysService/api/RegisterManager/GetRegisterInfo?isIntnet=true',
    GetUser: 'api/Basis/GetUserInfo',//获取用户  
    QueryBySqlName: 'api/CommonQuery/GetDataSetBySqlName',//Query通用方法
    //基础数据
    AddOrUpdateUser: 'api/Basis/AddOrUpdateUser',//保存用户
    DeleteUser: 'api/Basis/DeleteUser',//删除
    QueryDept: 'api/Basis/QueryDept',
    DeleteDept: 'api/Basis/DeleteDept',//删除部门
    AddOrUpdateDept: 'api/Basis/AddOrUpdateDept',
    //QueryUser: 'api/Basis/QueryUser',
    QueryHRStaffName: 'api/Basis/QueryHRStaffName',//获取HR人员信息
    QueryRole: 'api/CommonQuery/Query?sqlName=GetRoleAll',//获取角色列表
    QueryErpBranchName: 'api/Basis/QueryErpBranchName',//获取erp分公司信息
    getassignment: 'api/assignment/getassignment',
    getDictitemList: 'api/Dictitem/QueryList',//  查询字典
    getAllDictList: 'api/CommonQuery/Query', // 字典列表查询
    deleteDictCode: 'api/Dictitem/DeleteDictCode', //删除字典
    deleteDictitem: 'api/Dictitem/DeleteDictitem', // 删除字典项
    addOrUpdateDictitem: 'api/Dictitem/AddOrUpdateDictitem', // 新增/编辑字典
    GetFunctionByRoleID: 'api/Role/GetFunctionByRoleID',//  查询角色的详细信息
    GetUserByUserID: 'api/Basis/GetUserByUserID',//获取用户可以指派的用户列表
    QueryUser: 'api/CommonQuery/Query?sqlName=QueryUser',//分页显示用户
    AddOrUpdateRole: 'api/Role/AddOrUpdateRole',//保存角色
    QueryFunction: 'api/Role/GetFunction',//获取所有权限树
    AddOrUpdateSqlScript: 'api/SqlScript/AddOrUpdateSqlScript',//添加sqlscript
    QuerySqlScript: 'api/CommonQuery/Query?sqlName=GetSqlScript&isPaged=true',//分页显示sql语句列表
    GetRequireAndAssign: 'api/CommonQuery/Query?sqlName=GetRequireAndAssign&isPaged=false',//根据输入的条件查询任务列表
    DeleteSqlScript: 'api/SqlScript/DeleteSqlScript',//删除sql
    DeleteRole: 'api/Role/DeleteRole',//删除角色
    QueryDeptBySql: 'api/CommonQuery/Query?sqlName=GetDeptAll&isPaged=true',//分页查询组织列表
    WorkHours: 'api/Basis/WorkHours',//计算工时
    //API访问权限
    getAcls: 'api/acl/getAcls',//查询API列表信息
    saveAcl: 'api/acl/saveAcl',//保存API配置信息
    getUserAcl: 'api/acl/getUserAcl',//查询用户API配置信息
    saveUserAcl: 'api/acl/saveUserAcl',//保存用户API配置信息
    //组织关系维护
    GetBranchStaffAll: 'api/CommonQuery/Query?sqlName=GetBranchStaffAll&isPaged=true',//查看带有人员分配的分公司列表
    AddOrUpdateBranchStaff: 'api/Basis/AddOrUpdateBranchStaff',//保存分公司人员分配
    GetBranchStaff: 'api/basis/GetBranchStaff',//查看分公司人员详情
    //产品
    productindex: 'api/product/index',//接口测试
    //addproduct: 'api/product/addproduct',//添加产品
    updateproduct: 'api/product/addorupdateproduct',//更新或添加产品，不传主键ID区分
    getproduct: 'api/product/getproduct',//产品详情
    //allproduct: 'api/product/getallproduct',//所有产品
    //allproduct: 'api/commonquery/query?sqlName=GetAllProduct&isPaged=true&pageIndex=1&pageSize=50',
    allproduct: 'api/commonquery/query?sqlName=GetAllProduct',
    deleteproduct: 'api/product/deleteproduct',//删除产品
    closeproduct: 'api/product/closeproduct',//关闭产品
    getuserall: 'api/Basis/GetUserAll',//获取所有用户
    getrepository: 'api/codeversionctl/getprojects',//获取版本库信息 
    //?svnType=tfs&svnUrl=http://10.3.80.50:8080/tfs/defaultcollection&userName=030586&pwd=Aq1sw2de
    // getproductname:'api/basis/geterpmenu',
    getproductname: 'api/product/GetProductModule',
    syncmodule: 'api/Product/SyncModule',//同步产品模块
    getproductsid: 'api/product/GetProductBySId',//获取产品通过SID
    AssignedModulePerson: 'api/product/AssignedModulePerson',//指派模块负责人
    GetUserByRoleName: 'api/Basis/GetUserByRoleName',//通过角色名获取用户列表

    //项目
    projectindex: 'api/project/index',//测试接口
    //addproject: 'api/project/addproject',//添加项目
    updateproject: 'api/project/addorupdateproject',//更新或添加
    updateprojectstate: 'api/project/updateprojectstate',//更新项目状态
    //allproject: 'api/project/getallproject',//所有
    //allproject: 'api/commonquery/query?sqlName=GetAllProject&isPaged=true&pageIndex=1&pageSize=100',//所有分页
    allproject: 'api/commonquery/query?sqlName=GetAllProject',
    getproject: 'api/project/getproject',//项目详情
    deleteproject: 'api/project/deleteproject',//删除
    getteamname: 'api/product/retrieveproduct',//检索产品
    getproductmodule: 'api/product/RetrieveProductModule',//获取产品模块下拉框
    getprojectteamname: 'api/project/retrieveproject',//获得团队下拉框
    getprojecttfs: 'api/codeversionctl/getprojects',//获取项目tfs信息
    getProjectByProductID: 'api/commonquery/query?sqlName=GetProjectByProductID&isPaged=false',//通过ProductID查询项目
    getproductmodulenew: 'api/product/RetrieveProductModuleNew',//新检索产品模块(菜单分级)
    getprojectsid: 'api/Project/GetProjectBySId',//获取项目通过SID
    //团队
    addorupdate: 'api/projectmember/addorupdatepromember',//
    deletemember: 'api/projectmember/deletepromember',//删除
    querymember: 'api/projectmember/querylist',//查询
    memberindex: 'api/projectmember/index',//首页
    querydept: 'api/Basis/QueryDept',//获取部门下拉框
    queryteam: 'api/project/RetrieveTeamName',//团队下拉框
    getmemberbydeptid: 'api/ProjectMember/GetProMemberByDeptID',//通过部门id得到成员
    getmemberbyproductid: 'api/CommonQuery/Query?sqlName=GetProductMember',//通过产品id得到成员
    getstaffrole: 'api/CommonQuery/Query?sqlName=GetRoleListByUserID&isPaged=false',//得到staff的角色
    getteammember: 'api/ProjectMember/QueryList',//获取团队成员
    deptretrieve: 'api/CommonQuery/Query?sqlName=GetUserAndMemByDeptID',//部门下拉框

    //版本计划
    addOrUpdateVersionPlan: "api/VersionPlan/AddOrUpdateVersionPlan",// 新增或修改版本计划
    getVersionPlan: "api/VersionPlan/GetVersionPlan",//查询版本计划
    retrieveproduct: "api/product/Retrieveproduct",//检索产品
    getVerPlanReldBug: "api/Bug/GetVerPlanReldBug", //查询版本计划已关联的BUG
    getVerPlanNotReldBug: "api/Bug/GetVerPlanNotReldBug",// 查询版本计划未关联的BUG
    getVerPlanByID: "api/VersionPlan/GetVerPlanByID",//根据版本计划ID查询
    getRequirement: "api/Requirement/GetRequirement",//查询已关联版本需求
    addVerPlanRelBug: "api/VersionPlan/AddVerPlanRelBug",//新增版本计划与BUG关联关系
    deleteVerPlanRelBug: "api/VersionPlan/DeleteVerPlanRelBug",// 移除版本计划关联的BUG 
    upVerPlanRelState: "api/VersionPlan/UpVerPlanRelState",//版本计划发布接口地址
    getLastVerPlanByID: "api/VersionPlan/GetLastVerPlanByID",//查询上一个版本计划接口地址
    queryNotVerPlanDemand: "api/Requirement/QueryNoVerPlan",//查询未分配版本计划的需求
    addVerPlanRelDemand: "api/VersionPlan/AddVerPlanRelDemand",//新增版本计划与需求关联关系
    deleteVerPlanRelDemand: "api/VersionPlan/DeleteVerPlanRelDemand",//移除版本计划关联的需求
    printQuery: "api/VersionPlan/PrintQuery",//打印查询
    VersionPlanWorkHours: "api/basis/VersionPlanWorkHours",//计算工时(单位小时)
    WorkDays: "api/basis/WorkDays",//计算工时（单位天）
    expBugColumn: "api/Export/GetExportFileds",//获取导出列-BUG
    expExcel: "api/Export/ExportVerPlanReld",//导出Excel数据接口
    DevTaskCount: 'api/CommonQuery/Query?sqlName=GetUserAssignment',//任务统计
    DeleteVersionPlan: 'api/VersionPlan/DeleteVersionPlan',//删除版本计划
    QueryVerPlanReq: 'api/Requirement/QueryVerPlanReq',//通过版本计划id查询需求
    GetChangeSetByVerPlan:'api/CommonQuery/Query?sqlName=GetChangeSetByVerPlan',//版本对应的程序集
    ExportSqlHistoryByVerPlan:"api/Export/ExportSqlHistoryByVerPlan",//根据版本计划导出sql语句变更集
    ExportTableUpdateByVerPlan:"api/Export/ExportTableUpdateByVerPlan",//通过版本计划导出表结构变更集

    //需求卡片
    QueryCardList: 'api/RequirementCard/Query',//获取需求卡片
    AddCard: 'api/RequirementCard/AddRequirementCard',//添加需求卡片
    GetCardDetail: 'api/RequirementCard/QueryRequirementCard',//获取卡片详情
    CloseReqCard: 'api/RequirementCard/UpdateCloseReqCard',//需求卡片关闭
    DesiReqCard: 'api/RequirementCard/UpdateDesiReqCard',//需求卡片指派给
    UpdateCard: 'api/RequirementCard/UpdateRequirementCard',//保存需求卡片
    GetUserInfoByUserID: 'api/Basis/GetUserInfoByUserID',//根据用户ID得到用户相关信息    UserID
    GetUserByBranchId: 'api/Basis/GetUserByBranchId',//根据用户ID得到用户相关信息    UserID
    //上传
    UploadBytesWithExt: 'api/Attachment/UploadBytesWithExt',  //上传附件
    //Token
    Token: 'connect/token',
    //用户菜单
    GetMenuByStaffNO: "api/Basis/GetMenuByStaffNO",
    GetEntityHistory: 'api/EntityChange/GetEntityHistory',//查看历史记录
    UpdatePassWord: 'api/Basis/UpdatePassWord',//修改密码
    GetDetailBySId: 'api/Basis/IsExist',//根据SID得到详细信息
    //日历相关
    GetNoWorkDays: 'api/basis/getalltime',
    GetTimeZone: 'api/basis/getalltimezone',
    UpdateNoWorkDays: 'api/basis/addorupdatetime',
    UpdateTimeZone: 'api/basis/addorupdatetimezone',
    UpdateEntityHistoryNote: 'api/EntityChange/UpdateEntityHistoryNote',//修改备注

    //变更集
    GetProjectChangesets: 'api/codeversionctl/getprojectchangesets',//获取项目变更集
    QuerySqlHistory: 'api/Basis/QuerySqlHistory',//获取变更SQL(ERP)
    QueryTableUpdate: 'api/Basis/QueryTableUpdate',//获取表结构SQL(ERP)

    //文档管理
    SearchDocuments: 'api/CommonQuery/Query?sqlName=GetAllOnlDocument',//查询文档
    AddTemplet: 'api/Templet/AddTemplet',//新增模板
    DeleteTemplet: 'api/Templet/DeleteTemplet',//删除模板
    GetTemplet: 'api/Templet/GetTemplet',//查询模板列表
    GetTempletByID: 'api/Templet/GetTempletByID',//根据SID查询模板详情
    QueryHisDoc: 'api/OnlineDocumentHis/QueryHisDoc',//历史文档查询
    GetDocHis: 'api/OnlineDocumentHis/GetHisDocByCondition',//根据ID或SID查询历史文档
    UpdateDocuments: 'api/OnlineDocument/AddOrUpdateDoc',//新建或者编辑文档
    GetDocByIDorSID: 'api/OnlineDocument/GetDocByCondition',//根据条件查询文档
    DeleteDoc: 'api/OnlineDocument/DeleteDoc',//删除文档
    AddOrUpdatePer: 'api/OnlineDocument/AddOrUpdatePer',//文档共享权限保存
    GetDocPer: 'api/OnlineDocument/GetDocPer',//根据条件查询文档共享权限

    //脚本处理
    GetSqlscriptingAll: 'api/Commonquery/Query?sqlName=GetSqlscriptingAll',//脚本处理
    SaveSqlScript: 'api/SqlScript/AddOrUpdateSqlScripting',//添加或者修改脚本处理
    GetSqlScripting: 'api/SqlScript/GetSqlScript',//查看脚本详情
    DeleteSqlScripting: 'api/SqlScript/DeleteSqlScripting',//删除指定的处理脚本
    AssignedPerson: 'api/SqlScript/AssignedPerson',//指派给
    RunOrStopSqlScripting: 'api/SqlScript/RunOrStopSqlScripting',//通过或者驳回
    InputSqlScripting: 'api/SqlScript/InputSqlScripting',//导入excel
}


let _GetApi = function (apiname) {
    return Api.ReleaseModel ? Api.Host_Formal.Inner + Api[apiname] : Api.Host_Test.Inner + Api[apiname];
}

export function GetApi(apiname) {
    return _GetApi(apiname);
};

export function GetToken() {
    return Api.ReleaseModel ? Api.Host_Formal.InnerToken + Api.Token : Api.Host_Test.InnerToken + Api.Token;
};
//export let ProdImageHost = 'http://static.yyjzt.com/MedicinedePository_new/';
export default Api




