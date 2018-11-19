<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">模板管理</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-container">
      <div class="detail-content">
        <div style="padding:10px">
          <el-form ref="addForm" :model="addForm">
            <el-form-item :label-width="labelWidth" label="版本名称" prop="templateName" style="white-space:nowrap">
              <el-input
                class="searchInput"
                v-model="addForm.editionName"
                placeholder="请输入版本名称搜索"
                />
            </el-form-item>
          </el-form>
        </div>
        <div class="select-wrapper">
          <div class="select-box">
            <!-- <el-row>
             
              <el-col :span="10">
                <el-form ref="filterForm" :model="filterForm" :inline="true" label-width="100px" class="filter-form">
                
                  <el-form-item label="" prop="template_name"  style="float:right;margin-right:20px;">
                    <el-input
                      class="searchInput"
                      v-model="filterForm.template_name"
                      placeholder="请输入模板名称搜索"
                     />
                     
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-button size="medium" class="btn-primary" @click="queryData(true)">查询</el-button>
               
              </el-col>
            </el-row> -->
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
              <el-form-item label="集团名称">
                <el-select @change="organizationChange" v-model="filterForm.organizationId" filterable placeholder="请选择">
                  <el-option
                    v-for="(item,index) in storeOrg"
                    :key="index"
                    :label="item.labelName"
                    :value="item.keyCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店编号">
                <el-input v-model="filterForm.storeId" placeholder="门店编号"></el-input>
              </el-form-item>
              <el-form-item label="门店外部编号">
                <el-input v-model="filterForm.externalId" placeholder="门店外部编号"></el-input>
              </el-form-item>
              <el-form-item label="品牌">
                <el-select  v-model="filterForm.brandId" placeholder="请选择品牌">
                  <el-option
                    v-for="item in storeBrands"
                    :key="item.keyCode"
                    :label="item.labelName"
                    :value="item.keyCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店名称">
                <el-select  v-model="filterForm.storeName" 
                  
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入门店名称"
                  :remote-method="storeNameChange"
                  :loading="loading">
                  <el-option
                    v-for="(rt,index) in storeNames"
                    :key="index"
                    :label="rt.key"
                    :value="rt.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属省">
                <el-select @change="getCitys()" v-model="filterForm.provinceId" placeholder="请选择">
                  <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属市">
                <el-select  v-model="filterForm.cityId" placeholder="请选择">
                  <el-option
                    v-for="item in citys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="终端UUID">
                <el-input v-model="filterForm.deviceUuid" placeholder="终端UUID"></el-input>
              </el-form-item>
              <el-form-item label="终端型号">
                <el-select v-model="filterForm.deviceModel" placeholder="请选择">
                  <el-option
                    v-for="item in deviceModels"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="终端品牌">
                <el-select @change="deviceBrandsChange" v-model="filterForm.deviceBrand" placeholder="请选择">
                  <el-option
                    v-for="item in deviceBrands"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房间类型">
                <el-select  v-model="filterForm.roomTypeName" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房间号">
                <el-input v-model="filterForm.roomNo" placeholder="房间号"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="medium" type="primary" @click="queryData(true)">查询</el-button>
                 <el-button size="medium" class="btn-default" @click="resetForm('filterForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
  
        <div class="device-table-wrapper">
          <el-table ref="deviceTable" :data="dataList" stripe border class="device-table" @selection-change="handleSelectionChange">
            <el-table-column type="selection"/>
            <el-table-column prop="organizationName" label="集团名称" width="100"/>
            <el-table-column prop="storeId" label="门店编号" width="200"/>
            <el-table-column prop="externalId" label="门店外部编号" width="100"/>
            <el-table-column prop="deviceBrand" label="品牌" width="150"/>
            <el-table-column prop="storeName" label="门店名称" width="150"/>
            <el-table-column prop="deviceUuid" label="终端UUID" width="150"/>
            <el-table-column prop="deviceModel" label="终端型号" width="200"/>
            <el-table-column prop="deviceBrand" label="终端品牌" width="200"/>
            <el-table-column prop="roomNo" label="房间号" width="100"/>
            <el-table-column prop="roomTypeName" label="房间类型" width="200"/>
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
    <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="goBack">返回</el-button>
        <el-button class="btn-primary" size="medium" @click="submitEdit">提交</el-button>
      </div>
  </div>
</template>

<script>
import EnabledType from './types/enable-type'
import { Message } from 'element-ui'
import DeviceDetailDialog from './dialog/device-detail-dialog.vue'
import {
  TEMPLATE_FIND,
  TEMPLATE_DEL,
  OTT_DEVICE_LIST,
  region_province,
  region_city,
  get_store_org,
  get_store_brand,
  get_device_brand,
  get_store,
  get_device_model,
  edition_check_join_device,
  template_publish
} from '@/api/templateAPI/templateAPI'

import RoomTypeConfig from '@/constants/room-type-config'

export default {
  name: 'DeviceList',
  components: {
    DeviceDetailDialog
  },
  data() {
    return {
      addForm:{
        templateId: 0,
        editionName: '',
        deviceIdList: []
      },
      pageIndex: 0,
      pageSize: 20,
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      needShow: false,
      deviceModels: [],
      filterForm: {
        deviceId:'',
        brandId:'',
        //主键
        organizationId:'',
        //所属集团编号
     
        //所属集团
        storeId:'',
        //门店编号
        internalId:'',
        //门店内部编号
        externalId:'',
        //门店外部编码
        storeName:'',
        //所属门店
        deviceBrand:'',
        //设备品牌
        deviceModel:'',
        //设备型号
        roomNo:'',
        //所属房间
        roomTypeName:'',
        //房间类型
        createdTime:'',
        //安装时间
        updateTime:'',
        //更新时间
        apkVersion:'',
        //apk版本号
        status:'',
        //设备状态:2-启用，4-停用
  
        provinceId:'',
        //省代码
        cityId:'',
        //市代码
    
        deviceUuid:'',
        },
      dataList: [],
      total: 0,

     
      loading: false,
      options:[],
      province:[],
      citys:[],
      storeOrg:[],
      storeBrands:[],
      deviceBrands:[],
      storeNames:[],
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
    // this.getDeviceBrands()
    // // 首次获取前20条数据
    this.addForm.templateId =this.$route.query.id;
    this.fetchData({pageIndex:this.pageIndex,pageSize:this.pageSize})
    // // 获取所有房间类型
    // this.getAllRoomType()
    window.addEventListener('pageshow', this.onShow);
    this.onShow();
  },
  methods: {
    onShow(){
      this.fetchData({pageIndex:this.pageIndex,pageSize:this.pageSize})
      region_province().then(res=>{
        this.province = res;
      })
      get_store_org().then(res=>{
        this.storeOrg = res;
      })
      get_device_brand().then(res=>{
        this.deviceBrands = res;
      })
      
    },
    organizationChange(){
      get_store_brand({organization_id:this.filterForm.organizationId}).then(res=>{
        this.filterForm.storeBrand = null;
        this.storeBrands = res;
      })
    },
    deviceBrandsChange(){
      get_device_model(deviceBrand).then(res=>{
        this.deviceModels = res;
      })
    },
    storeNameChange(query){
      if (query !== '') {
          this.loading = true;
          // setTimeout(() => {
          //   this.loading = false;
          //   this.options4 = this.list.filter(item => {
          //     return item.label.toLowerCase()
          //       .indexOf(query.toLowerCase()) > -1;
          //   });
          // }, 200);
          console.log(query);
           get_store({storeName:query.toLowerCase()}).then(res=>{
             this.filterForm.storeName = '';
              this.storeNames = res;
               this.loading = false;

            })
        } else {
          this.storeNames = [];
        }
     
    },
    getCitys(){
      region_city({parent_id:this.filterForm.provinceId}).then(res=>{
        this.filterForm.cityId = '';
        this.citys = res;
      })
    },
    filterData(array, key, targetKey) {
      
    },
    filterChanged(filters){
      
      this.filterForm.show_modes = filters.show_modes;
      this.queryData();

    },
    handleEdit(){},
    pageChanged(value) {
      this.pageIndex = value
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
    fetchData(params,data) { // 获取表格数据
      OTT_DEVICE_LIST(params,data).then(res=>{
        this.dataList = res.list;
        this.total = res.total;
        for(let i =0;i<res.list.length;i++){
          this.dataList[i].pageLayoutType=(res.list[i].pageLayoutType==1)?'电视样式':''
        }
      })
    },
    resetForm(formName) {
      for(let i in this[formName]){
        this[formName][i] = '';
      }
      this.queryData()
    },
    queryData(flag){

      if(flag){
        this.pageIndex = 0;
      }
      let params = {
        pageIndex: this.pageIndex,
        pageSize:this.pageSize,
      }
      // if(this.filterForm.show_modes.length>0){
      //   params.show_modes = this.filterForm.show_modes.join(',');
      // }
      this.fetchData(params,flag?this.filterForm:{});
    },
    showDialog(editFlag, item) {
      
      window.sessionStorage.templateObj = '';
      if(editFlag){

        this.$router.push({ name: 'editTemplate', query: { edit: editFlag },params:{contentObj:item}});
        
      }else{
      
        this.$router.push({ name: 'editTemplate', query: { edit: editFlag }});

      }
      
    },
    delTemplate(item){
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           
            TEMPLATE_DEL(item.id).then(res=>{
             
              this.fetchData({pageIndex:this.pageIndex,pageSize:this.pageSize})

              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     
    },
    goBack(){
      history.go(-1);
    },
    handleSelectionChange(val){
      var arr = [];
      for(let i in val){
        arr.push(val[i].deviceId);
      }
      this.addForm.deviceIdList = arr;
      console.log(this.addForm.deviceIdList);
      
    },
    submitEdit(){
      if(this.addForm.templateName == ''){
        this.$message({
            type: 'info',
            message: '模版名称不能为空',
          }); 
          return;
      }
      edition_check_join_device({editionId:0,deviceIdList:this.addForm.deviceIdList}).then(res=>{
        if(res.value == '0'){
          this.addEdition();
        }else{
          this.$confirm(`当前有${res.value}个设备在使用其它版本，确认发布该版本？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addEdition();  
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消版本发布'
          });          
        });
        }
      })
    },
    addEdition(){
     
      this.addForm.deviceIdList = this.addForm.deviceIdList;
      template_publish(this.addForm).then(res=>{
        debugger;
         this.$message({
        type: 'success',
        message: '发布成功!'
      });
      })
    }
  
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
.searchInput .el-input__inner{
  vertical-align: top;
}
div.el-input{
  max-width: 500px;
}
</style>
