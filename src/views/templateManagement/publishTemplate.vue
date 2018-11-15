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
                <el-button size="medium" class="btn-default" @click="resetForm('filterForm')">重置</el-button>
              </el-col>
            </el-row> -->
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
              <el-form-item label="集团名称">
                <el-select v-model="filterForm.organizationName" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
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
                <el-select v-model="filterForm.deviceBrand" placeholder="请选择品牌">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="门店名称">
                <el-select v-model="filterForm.organizationName" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属省">
                <el-select v-model="filterForm.provinceId" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属市">
                <el-select v-model="filterForm.cityId" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="终端UUID">
                <el-input v-model="filterForm.externalId" placeholder="终端UUID"></el-input>
              </el-form-item> -->
              <!-- <el-form-item label="终端型号">
                <el-select v-model="filterForm.cityId" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item label="终端品牌">
                <el-select v-model="filterForm.cityId" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="房间类型">
                <el-select v-model="filterForm.roomTypeName" placeholder="请选择">
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
                <el-button type="primary" @click="queryData">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        
        <div class="device-table-wrapper">
          <el-table :data="dataList" stripe border class="device-table" @filter-change="filterChanged">
            <el-table-column type="selection"/>
            <el-table-column prop="templateName" label="模板名称" width="240"/>
            <el-table-column
              :column-key="'show_modes'"
              :filters="[{ text: '开机画面+开机视频+欢迎页+智能主页', value: 1 }, { text: '开机画面+开机视频+智能主页', value: 2 }, { text: '开机画面+开机视频+欢迎页', value: 3 }, { text: '开机画面+开机视频', value: 4 }]"
              prop="showModeName" 
              label="页面展现方式" 
              width="200"/>
            <el-table-column prop="updateTimeStr" label="更新时间" width="200"/>
            <el-table-column prop="edit" label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="handleEdit(scope.row)">预览</el-button>
                <el-button type="primary" size="mini" class="btn-primary" @click="showDialog(true,scope.row)">编辑</el-button>
                <el-button type="primary" size="mini" class="btn-primary" @click="delTemplate(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" class="btn-primary">发布</el-button>
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
  TEMPLATE_FIND,
  TEMPLATE_DEL
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
        deviceId:"",//($int32)
        //主键
        organizationId:"",//
        //所属集团编号
        organizationName:"",//
        //所属集团
        storeId:"",//
        //门店编号
        internalId:"",//
        //门店内部编号
        externalId:"",//
        //门店外部编码
        storeName:"",//
        //所属门店
        deviceBrand:"",//
        //设备品牌
        deviceModel:"",//
        //设备型号
        roomNo:"",//
        //所属房间
        roomTypeName:"",//
        //房间类型
        createdTime:"",//($date-time)
        //安装时间
        updateTime:"",//($date-time)
        //更新时间
        apkVersion:"",//
        //apk版本号
        status:"",//($int32)
        //设备状态:2//-启用，4-停用
        brandCode:"",//
        //品牌备用编码
        typeCode:"",//
        //品牌备用编码
        provinceId:"",//($int32)
        //省代码
        cityId:"",//($int32)
        //市代码
        editionId:"",//($int64)
        //版本主键
        deviceJoinEditionStatus:"",//($int32)
        //设备关联版本状态:0-未关联,1//-已关联
        deviceUuid:"",//
        },
      dataList: [],
      total: 0,

     
      loading: false,
      options:[],
     
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
    this.fetchData({pageIndex:this.pageIndex,pageSize:this.pageSize})
    // // 获取所有房间类型
    // this.getAllRoomType()
  },
  methods: {
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
    fetchData(params) { // 获取表格数据
      TEMPLATE_FIND(params).then(res=>{
        this.dataList = res.list;
        this.total = res.total;
        for(let i =0;i<res.list.length;i++){
          this.dataList[i].pageLayoutType=(res.list[i].pageLayoutType==1)?'电视样式':''
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.queryData()
    },
    queryData(flag){
      if(flag){
        this.pageIndex = 0;
      }
      let params = {
        pageIndex: this.pageIndex,
        pageSize:this.pageSize,
        template_name:this.filterForm.template_name
        
      }
      if(this.filterForm.show_modes.length>0){
        params.show_modes = this.filterForm.show_modes.join(',');
      }
      this.fetchData(params);
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
