<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">内容库管理</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-container">
      <div class="detail-content">
        <div class="select-wrapper">
          <div class="select-box">
            <el-row>
              <el-col :span="19">
                <el-form ref="filterForm" :model="filterForm" :inline="true" label-width="100px" class="filter-form">
                  <el-form-item label="" prop="daterange">
                    <span>添加时间：</span>
                    <el-date-picker
                      v-model="filterForm.daterange"
                      class="data-picker"
                      type="daterange"
                      align="right"
                      value-format="yyyy-mm-dd"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      remote
                      clearable
                      filterable
                      size="medium"></el-date-picker>
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
        <div class="buttons">
          <el-button size="small" class="btn-primary" @click="showDialog(false)">新建内容</el-button>
          <!-- <el-button :disabled="multipleSelection.length < 1" type="warning" size="small" @click="enableDevice">启用设备</el-button>
          <el-button :disabled="multipleSelection.length < 1" type="danger" size="small" @click="disabledDevice">禁用设备</el-button> -->
        </div>
        <div class="device-table-wrapper">
          <el-table :data="dataList" stripe border class="device-table" style="width:100%" @sort-change="handleSortChanged" @selection-change="handleSelectionChange" @filter-change="filterChanged">
            <el-table-column type="selection"/>
            <el-table-column prop="contentName" label="内容名称" width="160">
              <template slot-scope="scope">
                <span class="has-underline" @click="navToDeviceDetail(scope.row)">{{ scope.row.contentName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :column-key="'contentTypes'"
              :filters="[{ text: '影视', value: 1 }, { text: '直播', value: 2 }, { text: '广告', value: 3 }, { text: '购物', value: 4 }, { text: '服务', value: 5 }, { text: '周边', value: 6 }]"
              prop="contentType"
              label="内容分类"
              width="100"/>
            <el-table-column
              :column-key="'showModes'"
              :filters="[{ text: '图片', value: 1 }, { text: '视频', value: 2 }]"
              prop="showMode"
              label="展现形式"
              width="100"/>
            <el-table-column
              :column-key="'imgSizes'"
              :filters="[{ text: '16:9', value: '16:9' }, { text: '1:1', value: '1:1' }, { text: '318x658', value: '318x658' }, { text: '1314x658', value: '1314x658' }, { text: '318x207', value: '318x207' }]"
              prop="imgSizes"
              label="尺寸"
              width="100"
              filter-placement="bottom-end"/>
            <el-table-column
              :column-key="'triggerModes'"
              :filters="[{ text: '打开网址', value: 1 }, { text: '打开应用', value: 2 }, { text: '无触发', value: 3 }]"
              prop="triggerMode"
              label="触发形式"
              width="100"/>
            <el-table-column prop="createTime" label="添加时间" width="160" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column prop="edit" label="操作" width="100" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="btn-primary" @click="showDialog(true,scope.row)">编辑</el-button>
              </template>
            </el-table-column> 
          </el-table>
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
import DeviceDetailDialog from './dialog/device-detail-dialog.vue'
import {
  GET_MODEL_LIST,
  GET_DEVICE_LIST,
  GET_STORES,
  GET_CONTANT_FIND,
  CHANGE_DEVICE_STATUS,
  UPDATE_INFO,
  DEVICE_DETAIL,
  REGISTER_CHECK,
  REGISTER_DEVICE
} from '@/api/contantLibraryAPI/contantLibraryAPI'
import { GET_ROOM_TYPE, GET_ALL_ROOM_TYPE } from '@/api/storeManage/storeManage'
import RoomTypeConfig from '@/constants/room-type-config'

export default {
  name: 'DeviceList',
  components: {
    DeviceDetailDialog
  },
  data() {
    const validateStoreNameE = (rule, value, callback) => {
      if (value.length < 1) {
        this.editForm.storeName = ''
        callback(new Error('内容名称不能为空'))
      } else {
        callback()
      }
    }
    const validateBrandCodeE = (rule, value, callback) => {
      if (value.length < 1) {
        this.editForm.brandCode = ''
        callback(new Error('设备品牌必填'))
      } else {
        callback()
      }
    }
    const validateTypeCodeE = (rule, value, callback) => {
      if (value.length < 1) {
        this.editForm.typeCode = ''
        callback(new Error('设备型号必填'))
      } else {
        callback()
      }
    }
    const validateRoomNoE = (rule, value, callback) => {
      if (value.trim().length < 1) {
        this.editForm.roomNo = ''
        callback(new Error('房间号必须填'))
      } else {
        callback()
      }
    }
    const validateRoomTypeE = (rule, value, callback) => {
      if ((Number.isSafeInteger(value * 1) && ('' + value)).trim().length < 1) {
        this.editForm.roomType = ''
        callback(new Error('房间类型必填'))
      } else {
        callback()
      }
    }
    const validateUuidE = (rule, value, callback) => {
      if (value.trim().length < 1) {
        this.editForm.uuid = ''
        callback(new Error('uuid必须填'))
      } else {
        callback()
      }
    }

    const validateBrandCodeA = (rule, value, callback) => {
      if (value.length < 1) {
        this.addForm.brandCode = ''
        callback(new Error('设备品牌必填'))
      } else {
        callback()
      }
    }
    const validateTypeCodeA = (rule, value, callback) => {
      if (value.length < 1) {
        this.addForm.typeCode = ''
        callback(new Error('设备型号必填'))
      } else {
        callback()
      }
    }
    const validateRoomNoA = (rule, value, callback) => {
      if (value.trim().length < 1) {
        this.addForm.roomNo = ''
        callback(new Error('房间号必须填'))
      } else {
        callback()
      }
    }
    const validateRoomTypeA = (rule, value, callback) => {
      if ((Number.isSafeInteger(value * 1) && ('' + value)).trim().length < 1) {
        this.addForm.roomType = ''
        callback(new Error('房间类型必须填'))
      } else {
        callback()
      }
    }
    const validateUuidA = (rule, value, callback) => {
      if (value.trim().length < 1) {
        this.addForm.uuid = ''
        callback(new Error('uuid必须填'))
      } else {
        callback()
      }
    }
    return {
      pageIndex:0,
      pageSize:20,
      editRules: {
        storeName: [{ required: true, trigger: 'blur', validator: validateStoreNameE }],
        brandCode: [{ required: true, trigger: 'blur', validator: validateBrandCodeE }],
        typeCode: [{ required: true, trigger: 'blur', validator: validateTypeCodeE }],
        roomNo: [{ required: true, trigger: 'blur', validator: validateRoomNoE }],
        roomType: [{ required: true, trigger: 'blur', validator: validateRoomTypeE }],
        uuid: [{ required: true, trigger: 'blur', validator: validateUuidE }]
      },
      addRules: {
        storeId: [
          { required: true, message: '请输入内容名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        // brandCode: [{ required: true, trigger: 'blur', validator: validateBrandCodeA }],
        // typeCode: [{ required: true, trigger: 'blur', validator: validateTypeCodeA }],
        // roomNo: [{ required: true, trigger: 'blur', validator: validateRoomNoA }],
        // roomType: [{ required: true, trigger: 'blur', validator: validateRoomTypeA }],
        // uuid: [{ required: true, trigger: 'blur', validator: validateUuidA }]
      },
      dialogData: {},
      multipleSelection: [],
      EnabledType,
      enableType: EnabledType.NONE, // 启用/禁用设备
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      editForm: {
        storeId: '',
        storeName: '',
        brandCode: '',
        typeCode: '',
        model: '',
        roomNo: 1,
        roomType: '',
        uuid: '',
        linkAdd:'',
        http:''
      },
      addForm: {
        storeId: '',
        storeName: '',
        brandCode: '',
        typeCode: '',
        model: '',
        roomNo: 1,
        roomType: '',
        uuid: '',
        linkAdd:'',
        http:''
      },
      needShow: false,
      deviceBrands: [],
      deviceModels: [],
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
        {text: '无触发',value:3}
      ], // 设备管理列表表格筛选
      storeNames: [],
      selStoreList: [], // 编辑对话框/所属门店
      loading: false,
      roomTypes: [], // 编辑对话框/设备房间类型
      condition: {
        roomTypeName: null,
        status: null
      },
      RoomTypeConfig,
      sortType: null,
      editOrAddFlag:false, //用于判断当前是新建还是编辑
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
      this.queryData();
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
        item.imgSizes+=item.imgs[i].size+',';
      }
      item.createTime = this.timestampToTime(item.createTime);
      return item;
      
    },
    timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = ((String(date.getHours()).length==2)?String(date.getHours()):('0'+String(date.getHours()))) + ':';
        var m = ((String(date.getMinutes()).length==2)?String(date.getMinutes()):('0'+String(date.getMinutes()))) + ':';
        var s = (String(date.getSeconds()).length==2)?String(date.getSeconds()):('0'+String(date.getSeconds()));
        return Y+M+D+h+m+s;
    },

    filterChanged(filters) {
      for(let i in filters){
        this.filterDataF[i] = filters[i];
      }
      
        this.queryData(true)
    },
    pageChanged(value) {
      this.pageIndex = value;
      
      this.queryData();
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
      this.multipleSelection = selections
    },
    handleSortChanged({ column, prop, order }) {
      this.sortType = order
      // this.queryForm('filterForm', Object.assign({}, this.condition, this.filterForm))
    },

    showDialog(editFlag, item) {
      if(editFlag){
        this.$router.push({ name: 'editContant', query: { edit: editFlag },params:{contentObj:item}});
      }else{
        this.$router.push({ name: 'editContant', query: { edit: editFlag }});
      }
    },
    navToDeviceDetail(item) {
      this.$router.push({ name: 'previewContant', query: { edit: true },params:{contentObj:item}});
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
</style>
