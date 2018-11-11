<template>
  <div class="device-list app-container">
    <div class="content-container">
      <div class="detail-content">
        <div class="select-wrapper">
          <div class="select-box">
            <el-row>
              <el-col :span="19">
                <el-form ref="filterForm" :model="filterForm" :inline="true" label-width="100px" class="filter-form">
                  <el-form-item label="" prop="contentType">
                        <el-select v-model="editForm.contentType" placeholder="请选择内容分类">
                            <el-option v-for="(rt, index) in contentTypes" :key="index" :label="rt.text" :value="rt.value">
                            {{ rt.text }}
                            </el-option>
                        </el-select>
                  </el-form-item>
                    
                  <el-form-item label="" prop="contentName">
                   
                    <el-input
                      v-model="filterForm.contentName"
                      placeholder="请输入内容名称"
                     >
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="5">
                <el-button size="medium" class="btn-primary" @click="queryData">查询</el-button>
                <el-button size="medium" class="btn-default" @click="resetForm('filterForm')">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
       
        <div class="device-table-wrapper">
          <div class="flex">
              <div :v-for="item in dataList" >
                  <div>
                      <img :src="item.img.imgUrl" >
                  </div>
                  <div>{{item.contentName}}</div>
              </div>
          </div>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            :total="total"
            :current-page="pageIndex"
            :page-sizes="[20, 50, 100]"
            :page-size="pageSize"
            class="text-center"
            background
            layout="prev, pager, next, jumper, sizes, total"
            @current-change="pageChanged"
            @size-change="sizeChanged"/>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
import EnabledType from './types/enable-type'
import { Message } from 'element-ui'
import {
  GET_CONTANT_FIND
} from '@/api/contantLibraryAPI/contantLibraryAPI'
import { GET_ROOM_TYPE, GET_ALL_ROOM_TYPE } from '@/api/storeManage/storeManage'
import RoomTypeConfig from '@/constants/room-type-config'

export default {
  name: 'contentDialod',
  data() {
    return {
      condition:{},
      pageIndex:0,
      pageSize:20,
      filterForm: {//用于条件筛选搜索的表单内容
        contentName: '',
        daterange: ''
      },
      filterDataF:{},
      dataList: [],
      total: 0,
      roomTypeNames: [
        {text: '打开网址',value:1},
        {text: '打开应用',value:2},
        {text: '无触发',value:0}
      ], // 设备管理列表表格筛选
      contentTypes:[
          { text: '影视', value: 1 }, 
          { text: '直播', value: 2 }, 
          { text: '广告', value: 3 }, 
          { text: '购物', value: 4 }, 
          { text: '服务', value: 5 }, 
          { text: '周边', value: 6 }
      ],
      storeNames: [],
      selStoreList: [], // 编辑对话框/所属门店
      loading: false,

      condition: {
        roomTypeName: null,
        status: null
      },
  
      applications:[
        {
          text:'爱奇艺',
          value:'1'
        },{
          text:'腾讯视频',
          value:'2'
        },{
          text:'Bilibili',
          value:'3'
        },{
          text:'优酷',
          value:'4'
        },
        
      ]
    }
  },
  computed: {
    enableText() {
      return this.enableType === EnabledType.ENABLED ? '确认启用所选设备？' : this.enableType === EnabledType.DISABLED ? '确认禁用所选设备？' : ''
    },
    enableVisible() {
      return this.enableType === EnabledType.ENABLED || this.enableType === EnabledType.DISABLED
    }
  },
  mounted() {
    // // 获取品牌
    this.getContantLibraryAPI()
    // // 首次获取前20条数据
    // this.fetchData({})
    // // 获取所有房间类型
    // this.getAllRoomType()
  },
  methods: {
    filterData(array, key, targetKey) {
      if (!Array.isArray(array)) return
      const set = new Set()
      const res = []
      for (const item of array) {
        const name = item[key]
        if (set.has(name)) continue
        set.add(name)
        res.push({ text: name, value: item.typeCode })
      }
      this[targetKey] = res
    },
    // getAllRoomType() {
    //   GET_ALL_ROOM_TYPE().then(value => {
    //     this.filterData(value, 'typeName', 'roomTypeNames')
    //   }).catch(() => {})
    // },
    handleBrandChange(val) {
      this.deviceModels = []
      if (!val) {
        this.filterForm.deviceModel = ''
        return
      }
      GET_MODEL_LIST(val).then(deviceModels => {
        this.deviceModels = deviceModels
      }).catch(() => {
        this.deviceModels = []
      })
    },
    handleBrandChangeAdd(val) {
      this.deviceModels = []
      if (!val) {
        return
      }
      GET_MODEL_LIST(val).then(deviceModels => {
        this.deviceModels = deviceModels
        this.addForm.typeCode = ''
      }).catch(() => {
        this.deviceModels = []
      })
    },
    handleBrandChangeEdit(val) {
      this.editForm.typeCode = ''
      this.deviceModels = []
      if (!val) {
        return
      }
      GET_MODEL_LIST(val).then(deviceModels => {
        this.deviceModels = deviceModels
        this.editForm.typeCode = ''
      }).catch(() => {
        this.deviceModels = []
      })
    },
    getContantLibraryAPI(data) {
      const that = this;
      let params = {
        pageIndex:that.pageIndex,
        pageSize:that.pageSize
      }
      GET_CONTANT_FIND(params,data?data:{}).then(value => {
        this.dataList = [];
        this.total = value.total;
        for(let i in value.list){
          this.dataList.push(this.fieldConversion(value.list[i]))
        }
      

      }).catch(() => {})
      
    },

    fieldConversion(item){
      switch(item.status){
        case 0:
          item.status='禁用';
          break;
        case 1:
          item.status='开启';
          break;
      }
      switch(item.showMode){
        case 1:
          item.showMode='图片';
          break;
        case 2:
          item.showMode='视频';
          break;
      }
      switch(item.triggerMode){
        case 1:
          item.triggerMode='打开网址';
          break;
        case 2:
          item.triggerMode='打开应用';
          break;
        case 3:
          item.triggerMode='无触发';
          break;
      }
      // 1-影视, 2-直播,3-广告,4-购物, 5-服务, 6-周边
      switch(item.contentType){
        case 1:
          item.contentType='影视';
          break;
        case 2:
          item.contentType='直播';
          break;
        case 3:
          item.contentType='广告';
          break;
        case 4:
          item.contentType='购物';
          break;
        case 5:
          item.contentType='服务';
          break;
        case 6:
          item.contentType='周边';
          break;
      }
      item.imgSizes='';
      for(let i = 0;i < item.imgs.length; i++){
        item.imgSizes+=item.imgs[i].size+' ';
      }
      item.createTime = this.timestampToTime(item.createTime);
      return item;
      
    },
    timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    },

    // filterRoomTypeName(value, row, column) {
    //   const property = column['property']
    //   this.condition.roomTypeName = value
    //   return row[property] === RoomTypeConfig[value]
    // },
    // filterShowType(value, row, column){

    // },
    // filterSize(value, row, column){

    // },
    // filterStatus(value, row, column) {
    //   const property = column['property']
    //   this.condition.status = value
    //   return row[property] === value
    // },
    filterChanged(filters) {
      for(let i in filters){
        this.filterDataF[i] = filters[i];
      }
   
        this.queryData(true)
        
      
    },
  

    navToDeviceDetail(rowData) {
      this.$router.push('/ott/storeDetail/' + rowData.storeId)
    },
    pageChanged(value) {
      this.pageIndex = value;
      this.queryData()
    },
    sizeChanged(pageSize) {
      this.pageSize = pageSize
      this.queryData()
    },
    showDeviceDetail(rowData) {
      DEVICE_DETAIL({ deviceUuid: rowData.deviceUuid }).then(value => {
        this.needShow = true
        this.dialogData = value
      }).catch(() => {})
    },
    fetchData(data) { // 获取表格数据
      GET_DEVICE_LIST(data, this.pageIndex, this.pageSize, this.sortType).then(value => {
        this.dataList = value.list
        this.total = value.total
        if (this.total && !value.list.length) {
          this.pageIndex = 1
          GET_DEVICE_LIST(data, this.pageIndex, this.pageSize, this.sortType).then(value => {
            this.dataList = value.list
            this.total = value.total
          })
        }
      }).catch(() => {})
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.queryData()
    },
    queryData(flag) {
      
      if(!flag){
        this.filterDataF = {};
       
      }else{
        this.pageIndex = 0;

      }
      this.filterDataF.contentName = this.filterForm.contentName;
      if(JSON.stringify(this.filterForm.daterange)!='[]'){
        this.filterDataF.createStartTime = this.filterForm.daterange[0];
        this.filterDataF.createEndTime = this.filterForm.daterange[1];
      }
      
      this.getContantLibraryAPI(this.filterDataF);

    },
   
    submitEnableType(status) {
      if (this.multipleSelection.length === 0) {
        Message.info('应当选择一条数据')
        return
      }
      // 获取选中的单元格行数据
      const uSet = new Set()
      for (const item of this.multipleSelection) {
        if (item.deviceUuid) {
          uSet.add(item.deviceUuid)
        }
      }
      CHANGE_DEVICE_STATUS([...uSet], { status: status })
        .then(value => value)
        .catch(() => {})
        .finally(() => {
          this.queryForm('filterForm', Object.assign({}, this.condition, this.filterForm))
        })
      this.enableType = EnabledType.NONE
    },
    handleSelectionChange(selections) {
      debugger
      this.multipleSelection = selections
    },
    handleSortChanged({ column, prop, order }) {
      this.sortType = order
      // this.queryForm('filterForm', Object.assign({}, this.condition, this.filterForm))
    },

    showDialog(editFlag, item) {
      // if(prop == 'addVisible'){
      //   this.editOrAddFlag = true;
      // }else{
      //   this.editOrAddFlag = false;
      // }
      // this[prop] = value
      if(editFlag){
        this.$router.push({ name: 'editContant', query: { edit: editFlag },params:{contentObj:item}});
        
      }else{
        this.$router.push({ name: 'editContant', query: { edit: editFlag }});

      }
      
    },
    cancelSubmit(form, visibleType) {
      this[visibleType] = false
      this.resetForm(form)
    },
    handleCloseE(done) {
      this.resetForm('editForm')
      done()
    },
    handleCloseA(done) {
      this.resetForm('addForm')
      done()
    },
    
    
  }
}
</script>

<style lang="scss">
@import "../../styles/variables";
.device-list {}

$pl: 20px;
$pr: 24px;
.detail-content {
  background-color: #fff;
  border-top: 1px solid #e5e6e7;
  border-bottom: 1px solid #e5e6e7;
  padding-bottom: 50px;
  .select-wrapper {
    padding: 15px $pr 15px $pl;
    .select-box {
      background-color: #fff;
      border: 1px solid #e5e6e7;
      padding: 23px 11px 23px 16px;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .buttons {
    margin-bottom: 14px;
    padding: 15px $pr 15px $pl;
    text-align: left;
  }
  .device-table-wrapper, .pagination-wrapper {
    padding: 0 $pr 0 $pl;
  }
  .pagination-wrapper {
    padding-bottom: 0;
    .el-pagination__jump {
      margin-right: 24px;
    }
  }
}
.device-detail-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 9999;
  background-color: rgba(0,0,0,.5);
  width: 100%;
  .dialog-box {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .dialog-content {
    position: relative;
    background-color: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    .dialog-header {
      padding: 24px 16px 20px 16px;
      border-bottom: 1px solid #d3dce6;
      .device-title {
        font-size: 26px;
        font-family: $font-family;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 1px;
        color: #676a6c;
      }
      .time {
        margin-right: 20px;
      }
      .status {
        margin-right: 8px;
      }
      .status, .time {
        float: right;
        margin-top: 15px;
        font-family: $font-family;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        color: #1ab394;
      }
    }
    .dotted-line {
      border: solid 1px #333;
    }
    .info-item {
      padding-left: 30px;
      padding-right: 30px;
      .info-title {
        padding-top: 12px;
        padding-bottom: 12px;
        > span {
          padding-left: 10px;
          border-left: 2px solid #1ab394;
          height: 19px;
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0;
          color: #676a6c;
        }
      }
      .list-content {
        width: 746px;
        border: solid 1px #e5e6e7;
        padding-left: 25px;
        padding-right: 25px;
        .list-item {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .placeholder {
      padding-top: 43px;
    }
    .close-btn {
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
      width: 20px;
      height: 20px;
      font-weight: bold;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      line-height: 20px;
      text-align: center;
      color: #999;
      -webkit-transition: all .2s;
      -moz-transition: all .2s;
      -o-transition: all .2s;
      transition: all .2s;
      &:hover {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
        background-color: lighten(#eab, 15%);
      }
    }
  }
}
.edit-form .el-dialog {
  // width: 600px;
  $bdc: lighten($primary-color, 35%);
  .el-dialog__header {
    padding-bottom: 22px;
    padding-left: 16px;
    border-bottom: 1px solid $bdc;
  }
  .el-dialog__title {
    font-family: $font-family;
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #676a6c;
  }
  .el-dialog__body {
    padding-right: 46px;
    padding-bottom: 0;
  }
  .el-dialog__footer {
    border-top: 1px solid $bdc;
    padding-top: 20px;
  }
  .el-select {
    width: 100%;
  }
}
.enable-status-dialog {
  .enable-text {
    font-size: 20px;
  }
}
.el-input .el-select .el-input {
    width: 130px;
  }
div.el-input{
  max-width: 500px;
}
.flex{
    display: flex;
    width: 100%;
    height: 300px;
    justify-content: space-around;
    flex-wrap: wrap;
}
.flex-item{
    padding: 6px;
    box-sizing: border-box;
    width: 20%;
    img{
        width: 100%;
        height: 100%;
    }
}
</style>
