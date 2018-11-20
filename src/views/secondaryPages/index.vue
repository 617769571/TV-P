<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">二级页面管理</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-container">
      <div class="detail-content">
        <div class="select-wrapper">
          <div class="select-box">
            <el-row>
              <el-col :span="10">
                <el-button size="small" class="btn-primary" @click="showDialog(false)">新建二级页面</el-button>
               
              </el-col>
              <el-col :span="10">
                <el-form ref="filterForm" :model="filterForm" :inline="true" label-width="100px" class="filter-form">
                
                  <el-form-item label="" prop="pageName"  style="float:right;margin-right:20px;">
                    <el-input
                      class="searchInput"
                      v-model="filterForm.pageName"
                      placeholder="请输入二级页面名称搜索"
                     />
                     
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-button size="medium" class="btn-primary" @click="queryData(true)">查询</el-button>
                <!-- <el-button size="medium" class="btn-default" @click="resetForm('filterForm')">重置</el-button> -->
              </el-col>
            </el-row>
          </div>
        </div>
        
        <div class="device-table-wrapper">
          <el-table :data="dataList" stripe border class="device-table" >
            <el-table-column type="selection"/>
            <el-table-column prop="pageName" label="二级页面名称" width="240"/>
            <el-table-column prop="pageLayoutType" label="布局样式" width="200"/>
            <el-table-column prop="contentNum" label="内容个数" width="200"/>
            <el-table-column prop="edit" label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="handleEdit(scope.row)">预览</el-button>
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
      <el-dialog
        title="预览"
        :visible.sync="previewDialog"
        width="1000px"
        :before-close="handleEdit">
        <div style="width:960px;height:540px;background:#0f0;position:relative;">
          <div style="width:100%;height:100%;">
            <img :src="getImgUrl(backgroundUrl)" style="width:100%;height:100%;" alt="">
          </div>
          <div style="font-family: FZZhongDengXian&DevaIdeal-Book;
            font-size: 25px;
            font-weight: normal;
            position:absolute;
            top:78px;
            left:58px;
            color: #ffffff;">
            {{secondName}}
          </div>
          <div style="width:339px;height:339px;position:absolute;top:131px;left:58px;">
            <img :src="advertisList[0]?getImgUrl(advertisList[0]):''" style="width:100%;height:100%;" alt="">

          </div>
          <div style="width:166px;height:166px;position:absolute;top:131px;left:404px;">
            <img :src="advertisList[1]?getImgUrl(advertisList[1]):''" style="width:100%;height:100%;" alt="">

          </div>
          <div style="width:166px;height:166px;position:absolute;top:304px;left:404px;">
            <img :src="advertisList[2]?getImgUrl(advertisList[2]):''" style="width:100%;height:100%;" alt="">

          </div>
          <div style="width:166px;height:166px;position:absolute;top:131px;left:577px;">
            <img :src="advertisList[3]?getImgUrl(advertisList[3]):''" style="width:100%;height:100%;" alt="">

          </div>
          <div style="width:166px;height:166px;position:absolute;top:304px;left:577px;">
            <img :src="advertisList[4]?getImgUrl(advertisList[4]):''" style="width:100%;height:100%;" alt="">

          </div>
          <div style="width:166px;height:166px;position:absolute;top:131px;left:750px;">
            <img :src="advertisList[5]?getImgUrl(advertisList[5]):''" style="width:100%;height:100%;" alt="">

          </div>
          <div style="width:166px;height:166px;position:absolute;top:304px;left:750px;">
            <img :src="advertisList[6]?getImgUrl(advertisList[6]):''" style="width:100%;height:100%;" alt="">

          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="previewDialog = false">返回</el-button>
        </span>
      </el-dialog>
  </div>

</template>

<script>
import EnabledType from './types/enable-type'
import { Message } from 'element-ui'
import DeviceDetailDialog from './dialog/device-detail-dialog.vue'
import {
  SECONDPAGE_FIND,
  SECONDPAGE_GET
} from '@/api/secondPage/secondPage'

import RoomTypeConfig from '@/constants/room-type-config'
import {getBaseAPI} from '@/api/contantLibraryAPI/contantLibraryAPI'


export default {
  name: 'DeviceList',
  components: {
    DeviceDetailDialog
  },
  data() {
    return {
      pageIndex: 0,
      pageSize: 20,
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      needShow: false,
      deviceModels: [],
      filterForm: {//用于条件筛选搜索的表单内容
        pageName: '',
      },
      dataList: [],
      total: 0,
      loading: false,
      previewDialog:false,
      previewCont:'',
      backgroundUrl:'',
      APILeft:'',
      advertisList:[],
      secondName:'',

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
    this.APILeft = getBaseAPI().IMG_URL;
    // // 获取所有房间类型
    // this.getAllRoomType()
  },
  methods: {
    filterData(array, key, targetKey) {
      
    },
    handleEdit(item){
      if(item){
        SECONDPAGE_GET(item.id).then(res=>{
          this.previewCont = res;
          this.secondName = res.pageName;
          for(let i in res.contents){
            if(res.contents[i].type==1){
              for(let j in res.contents[i].imgs){
                if(res.contents[i].imgs[j].size == '16:9'){
                  this.backgroundUrl = res.contents[i].imgs[j].imgUrl;
                  break;
                }
              }
              // this.backgroundUrl = res.contents[i].imgs[0].;
              // this.backgroundUrl.imgs = res.contents[i].imgs[0];
            }else{
              // res.contents[i].imgs = res.contents[i].imgs[0];
              for(let j in res.contents[i].imgs){
                if(res.contents[i].imgs[j].size == '1:1'){
                  this.advertisList.push(res.contents[i].imgs[j].imgUrl);

                  break;
                }
              }
            }
          }
          
        })
      }else{
        this.previewCont = '';
      }
      this.previewDialog = !this.previewDialog;
      
    },
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
      SECONDPAGE_FIND(params).then(res=>{
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
     getImgUrl:function(url){
      let SRC = this.APILeft+url.split('$}')[1];
      return SRC;
    },
    queryData(flag){
      if(flag){
        this.pageIndex = 0;
      }
      let params = {
        pageIndex: this.pageIndex,
        pageSize:this.pageSize,
        pageName:this.filterForm.pageName
      }
      this.fetchData(params);
    },
    showDialog(editFlag, item) {
      
      if(editFlag){
        this.$router.push({ name: 'editSecondPage', query: { edit: editFlag },params:{contentObj:item}});
        
      }else{
        this.$router.push({ name: 'editSecondPage', query: { edit: editFlag }});

      }
      
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
  .el-carousel__container{
    height: 100%;
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
