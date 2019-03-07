import { GetApi } from "../../Base/api";
import Fetch from '../../Base/base';
const productAllCacheName = "versionPlan-ProductAll-";
const userAllCacheName = "versionPlan-UserAll-";
const tablePageSize = "versionPlan-Table-PageSize";
//版本计划中使用的共享组件
const VresionBaseData = {
    newGuid: function () {
        let guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i === 8) || (i === 12) || (i === 16) || (i === 20))
                guid += "-";
        }
        return guid;
    },
    setCacheProductID: function (productID)
    {
        localStorage.setItem('ProductID-Version', productID);
    },
    getCacheProductID: function ()
    {
        return localStorage.getItem('ProductID-Version');
    },
    //人员
    setCacheUserAll: function (branchID, initdata) { 
            Fetch(GetApi("getuserall"), {
                BranchID: "",
            }, { method: 'GET' }
            ).then((resultData) => {
                if (resultData !== null && resultData !== undefined) {
                    if (resultData.StatusCode === 200 && resultData.Code === "0") {
                        if (resultData.Result !== null && resultData.Result.length > 0) {
                            localStorage.setItem(userAllCacheName, JSON.stringify(resultData.Result));
                            if (initdata !== null && initdata !== undefined) {
                                initdata();
                            }
                        }
                    }
                }
            }).catch((error) => {
                console.log(error);
            }); 
    },
    getCacheUserAll: function (branchID) {
        let cachename = userAllCacheName;
        let data = JSON.parse(localStorage.getItem(cachename));
        return data;
    },
    //产品 
    setCacheProduct: function (branchID, initdata,userId) {
        let cachename = productAllCacheName + "";
        Fetch(GetApi("retrieveproduct"), {
            Branchid: "",
            Id: userId,
        }, { method: 'GET' }
        ).then((data) => {
            if (data.StatusCode === 200 && data.Code === "0") {
                if (data.Result !== null && data.Result.length > 0) {
                    localStorage.removeItem(cachename);
                    localStorage.setItem(cachename, JSON.stringify(data.Result));
                    if (initdata !== null && initdata !== undefined) {
                        initdata();
                    }
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    },
    getCacheProduct: function (branchID) {
        let cachename = productAllCacheName + "";
        let data = JSON.parse(localStorage.getItem(cachename));
        return data;
    },
    //公司
    setCacheBranch:function()
    {
        Fetch(GetApi('QueryErpBranchName'), { Abbr: "" }, { method: 'GET' }).then((data) => { 
            if (data.StatusCode ===200 &&  data.Code === '0') { 
                localStorage.setItem('BranchAll-Version', JSON.stringify(data.Result));
            }
        })

    },
    getCacheBranch:function()
    {
        let data = JSON.parse(localStorage.getItem('BranchAll-Version'));
        return data; 
    },
    //Table每页显示行数
    setTablePageSize:function(size)
    {       
        localStorage.setItem(tablePageSize,  size)
    },
    getTablePageSize:function()
    {
        let pagesize = 20
        let data = localStorage.getItem(tablePageSize); 
        if (data !== null)
        {
            pagesize = parseInt(data)
        } 
        return pagesize; 
    },
    setCacheDict:function(code)
    {
        if (code && code.length>0)
        {
        Fetch(GetApi("getDictitemList"), { DictCode: code }, { method: 'POST' }).then((res) => { 
            if (res.StatusCode ===200 && res.Code === '0' && res.Result.length > 0) { 
                localStorage.setItem('Dict-Version-'+code, JSON.stringify(res.Result));
      
            }
          })
        }
    },
    // 获取字典数据 
    getDictList:function (code){
        if (code && code.length>0)
        {
        let data = JSON.parse(localStorage.getItem('Dict-Version-'+code));
        return data; 
        }else{
            return null;
        }
    }
}

export default VresionBaseData;