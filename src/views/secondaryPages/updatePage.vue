<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">二级页面管理>{{!editOrAddFlag?'编辑':'新建'}}二级页面</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-box">
      <el-form ref="editForm" :model="editForm" >
        <el-form-item :label-width="labelWidth" label="二级页面名称" prop="pageName" style="white-space:nowrap">
          <el-input v-model="editForm.pageName" placeholder="请输入内容名称" :maxlength="30"/><span style="color:#dcdfe6">&nbsp;{{editForm.pageName.length}}/30</span>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="布局样式" prop="pageLayoutType">
          <el-select v-model="editForm.pageLayoutType" placeholder="请选择内容分类">
            <el-option v-for="(rt, index) in pageLayoutTypes" :key="index" :label="rt.text" :value="rt.value">
              {{ rt.text }}
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item :label-width="labelWidth" label="背景图">
          <el-button @click="showAndGetData(1,'16:9',true)">选择内容</el-button>
          <span style="color:#dcdfe6">只支持图片形式的内容，尺寸16:9，只能添加一个</span>
          <div style="width:100%;min-height:300px;margin-top:10px;">
            <img v-if="contentMapper1" style="width: 600px;" :src="getImgUrl(contentMapper1.imgs.imgUrl)" alt="">
            <el-button v-if="contentMapper1" size="medium" class="btn-default" @click="contentMapper1=''">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item  :label-width="labelWidth" label="广告内容">
          <el-button @click="showAndGetData(1,'1:1',false)">选择内容</el-button>
          <span style="color:#dcdfe6">只支持图片形式的内容，尺寸1:1，个数限制在2～15个</span>
          <div style="width:100%;min-height:300px;">
            <div class="floatBox" v-if="contentMapper2.length>0">
              <div class="flex-item" v-for="(item,index) in contentMapper2">
                  <div>
                      <img :src="getImgUrl(item.imgs.imgUrl)">
                  </div>
                  <div style="text-align:center;margin-top:8px;">{{item.contentName}}&nbsp;&nbsp;&nbsp;<el-button size="medium" class="btn-default" @click="contentMapper2.splice(index,1);">删除</el-button></div>
             
              </div>
              <div style="clear:both"></div>
              
          </div>
            <div></div>
          </div>
        </el-form-item>
        <el-form-item v-if="editForm.triggerMode==2" :label-width="labelWidth" label="应用" prop="triggerId">
          <el-select v-model="editForm.triggerId" placeholder="请选择触发方式">
            <!-- <el-option label="" value=""></el-option> -->
            <el-option v-for="(rt, index) in applications" :key="index" :label="rt.value" :value="rt.key">
              {{ rt.value }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="goBack">返回</el-button>
        <el-button class="btn-primary" size="medium" @click="submitEdit">提交</el-button>
      </div>
    </div>
    <el-dialog
        title="选择内容"
        :visible.sync="dialogVisible"
        width="1000px"
       >
       <div class="">
    <div class="content-box">
      <div class="detail-content">
        <div class="select-wrapper">
          <div class="select-box">
            <el-row>
              <el-col :span="19">
                <el-form ref="filterForm" :model="filterForm" :inline="true" label-width="100px" class="filter-form">
                  <el-form-item label="" prop="contentType">
                    <el-select v-model="filterForm.contentTypes[0]" placeholder="请选择内容分类">
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
                <el-button size="medium" class="btn-default" @click="filterForm.contentName='';filterForm.contentTypes=''">重置</el-button>

              </el-col>
            </el-row>
          </div>
        </div>
       
        <div class="device-table-wrapper">
          <div class="floatBox">
              <div class="flex-item" v-for="(item,index) in dataList"  @click="itemClick(index)">
                  <div >
                      <img :src="getImgUrl(item.imgs.imgUrl)" >
                  </div>
                  <div style="text-align:center;margin-top:8px;">{{item.contentName}}</div>
                  <div class="checkBox" v-if="item.checked">
                    <img src="../../assets/templateImg/check.png" alt="">
                  </div>
              </div>
              <div style="clear:both"></div>
              
          </div>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            :total="total"
            :current-page="pageIndex"
           
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
        <el-button class="btn-default" size="medium" @click="dialogVisible=false">取消</el-button>
        <el-button class="btn-primary" size="medium" @click="takeImgData">确定</el-button>
      </div>
  </div>
        <!-- <contentDialod></contentDialod> -->
      </el-dialog>
  </div>
    
</template>

<script>
import EnabledType from './types/enable-type'
import { Message } from 'element-ui'
// import contentDialod from './dialog/device-detail-dialog.vue'

import {
  SECONDPAGE_CREATE,
  SECONDPAGE_GET,
  SECONDPAGE_UPDATE

} from '@/api/secondPage/secondPage'
import {
  GET_CONTANT_FIND
} from '@/api/contantLibraryAPI/contantLibraryAPI'
import { GET_ROOM_TYPE, GET_ALL_ROOM_TYPE } from '@/api/storeManage/storeManage'
import RoomTypeConfig from '@/constants/room-type-config'

export default {
  name: 'DeviceList',
 
  data() {
    return {
      editOrAddFlag:false, //用于判断当前是新建还是编辑
      APILeft:'http://192.168.16.170:80',
      pageLayoutTypes:[{ text: '电视布局', value: 1 }],
    
      dialogData: {},
      multipleSelection: [],
      EnabledType,
      enableType: EnabledType.NONE, // 启用/禁用设备
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      editForm: {
        pageName: '',
        pageLayoutType: '',
        contentMapper:[],

      },
    editFormImgs:[
      {
        imgUrl:'',
        description:'',
        size:'1:1',
        imgType:1,
        mediaType:'未知'
      },
      {
        imgUrl:'',
        description:'',
        size:'318x658',
        imgType:1,
        mediaType:'未知'
      },
      {
        imgUrl:'',
        description:'',
        size:'1314x658',
        imgType:1,
        mediaType:'未知'
      },
      {
        // id:integer($int64),
        imgUrl:'',
        description:'',
        // goodsSource:integer($int32),//来源
        //商品来源，0-如家；1-其它
        size:'16:9',
        imgType:1,
        mediaType:'未知'
        //影像类型:1-图片,2-视频
        
        // createTime:string($date-time),
      },
      {
        imgUrl:'',
        description:'',
        size:'318x207',
        imgType:1,
        mediaType:'未知'
      }
      ],
      editFormVideos:[{
        imgUrl:'',
        description:'',
        size:'1920x1080',
        imgType:2,
        mediaType:'未知'
      },{
        imgUrl:'',
        description:'',
        size:'1280x720',
        imgType:2,
        mediaType:'未知'
      }],
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
       
      },
      needShow: false,
      deviceBrands: [],
      deviceModels: [],
      filterForm: {//用于条件筛选搜索的表单内容
        contentName: '',
        daterange: ''
      },
     
      roomTypeNames: [
        {text: '打开网址',value:1},
        {text: '打开应用',value:2},
        {text: '无触发',value:0}
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
      applications:[
        // {
        //   text:'爱奇艺',
        //   value:'1'
        // },{
        //   text:'腾讯视频',
        //   value:'2'
        // },{
        //   text:'Bilibili',
        //   value:'3'
        // },{
        //   text:'优酷',
        //   value:'4'
        // },
        
      ],
      contentObj:'',
      dialogVisible:false,
      condition:{},
      pageIndex:0,
      pageSize:10,
      filterForm: {//用于条件筛选搜索的表单内容
        contentName: '',
        contentTypes:[0],
        imgSizes:''
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
          { text: '全部', value: '' }, 
          { text: '影视', value: 1 }, 
          { text: '直播', value: 2 }, 
          { text: '广告', value: 3 }, 
          { text: '购物', value: 4 }, 
          { text: '服务', value: 5 }, 
          { text: '周边', value: 6 }
      ],
      dialogChecked:false,//判断当前框是单选还是多选
      contentMapper1:'',
      contentMapper2:[],
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
    window.addEventListener('pageshow', this.onShow);
    this.onShow();
  },
  methods: {
    onShow(){
      this.editOrAddFlag = (this.$route.query.edit==false)||(this.$route.query.edit=='false');
      if(!this.editOrAddFlag){
      this.loading = true;
        SECONDPAGE_GET(this.$route.params.contentObj.id).then(res=>{
    
          this.editForm.id = res.id
          this.editForm.pageName= res.pageName;
          this.editForm.pageLayoutType= res.pageLayoutType;
          this.contentMapper2 = [];
          for(let i in res.contents){
            if(res.contents[i].type==1){
              this.contentMapper1 = res.contents[i];
              this.contentMapper1.imgs = res.contents[i].imgs[0];
            }else{
              res.contents[i].imgs = res.contents[i].imgs[0];
              this.contentMapper2.push(res.contents[i]);
            }
          }
          debugger;
          this.loading = false;
          this.oldSecondPage = this.editFormatData();
          for (let i in this.oldSecondPage){
            this.oldSecondPage[i].operateType = 3;
          }
        })
        
      }
      
    },
    imgSort(imgObj){
      switch(imgObj.size){
        case '1:1':
          this.editFormImgs[0] = imgObj; 
          break;      
        case '318x658':
          this.editFormImgs[1] = imgObj; 
          break;      
        case '1314x658':
          this.editFormImgs[2] = imgObj; 
          break;      
        case '16:9':
          this.editFormImgs[3] = imgObj; 
          break;      
        case '318x207':
          this.editFormImgs[4] = imgObj; 
          break;
      }
      
            
    },
    handleAvatarSuccess(res, file,ind) {
      // this.editFormImgs[ind].imgUrl = URL.createObjectURL(file.raw);
      this.editFormImgs[ind].imgUrl = this.APILeft+res[0].split('$}')[1];
     
      this.editFormImgs[ind].mediaType = file.name.split('.')[1];

    },
    handleAvatar0Success(res, file,ind) {
      this.handleAvatarSuccess(res, file,0)
    },
    handleAvatar1Success(res, file,ind) {
      this.handleAvatarSuccess(res, file,1)
    },
    handleAvatar2Success(res, file,ind) {
      this.handleAvatarSuccess(res, file,2)
    },
    handleAvatar3Success(res, file,ind) {
      this.handleAvatarSuccess(res, file,3)
    },
    handleAvatar4Success(res, file,ind) {
      this.handleAvatarSuccess(res, file,4)
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
    getImgUrl:function(url){
      debugger;
      let SRC = this.APILeft+url.split('$}')[1];
      return SRC;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.queryData()
    },
 queryData(){
   
   this.getContantLibraryAPI(this.filterForm)
 },
 getContantLibraryAPI(data) {
      const that = this;
      let params = {
        pageIndex:that.pageIndex,
        pageSize:that.pageSize
      }
      debugger;
      GET_CONTANT_FIND(params,data?data:{}).then(value => {
 
        this.dataList = [];
        this.total = value.total;
        for(let i = 0;i<value.list.length;i++){
          for(let j = 0;j<value.list[i].imgs.length;j++){
            if(value.list[i].imgs[j].size == this.filterForm.imgSizes[0]){
              value.list[i].imgs = value.list[i].imgs[j]
            }
          }
          value.list[i].checked = false
        }
        this.dataList = value.list;
      
       console.log(this.dataList);
      }).catch(() => {})
      
    },
    pageChanged(value) {
      this.pageIndex = value;
      this.queryData()
    },
    sizeChanged(pageSize) {
      this.pageSize = pageSize
      this.queryData()
    },
    submitEdit(){
     
      if(this.editOrAddFlag){
        this.editForm.contentMapper = this.editFormatData();
          SECONDPAGE_CREATE(this.editForm).then(res=>{
            Message({ showClose: true, message: '创建成功', type: 'success' })
            history.go(-1);
          })

      }else{
        let contMapArr = this.editFormatData();
        for(let j in contMapArr){
          delete contMapArr[j].id;
        }
        this.editForm.contentMapper = this.oldSecondPage.concat(contMapArr)
        
        SECONDPAGE_UPDATE(this.editForm).then(res=>{
          Message({ showClose: true, message: '编辑成功', type: 'success' })
            history.go(-1);
        })
      }
    },
    showAndGetData(type,size,checked){
      this.dialogVisible = true;
      this.filterForm.imgSizes = [size];
      // this.filterForm.contentTypes = [type];
      delete this.filterForm.contentTypes;
      this.dialogChecked = checked;
      this.queryData();
      this.filterForm.contentTypes = [];
    },
    itemClick(index){
      if(this.dialogChecked){
        for(let i in this.dataList){
          this.dataList[i].checked = false;
        }
        this.dataList[index].checked = !this.dataList[index].checked;
      }else{
        this.dataList[index].checked = !this.dataList[index].checked;

      }
      console.log(this.dataList[index]);
    },
    takeImgData(){
      if(this.filterForm.imgSizes[0] == '16:9'){
        for(let i in this.dataList){
          if(this.dataList[i].checked){
            this.dataList[i].contentId = this.dataList[i].id;

            this.contentMapper1 = this.dataList[i]
            break;
          }
        }
      }else{
        for(let i in this.dataList){
          if(this.dataList[i].checked){
            this.dataList[i].contentId = this.dataList[i].id;
            this.contentMapper2.push(this.dataList[i]);
          }
        }
        if(this.contentMapper2.length>=15){
          this.contentMapper2.length=15
        }
      }
      this.dialogVisible = false;
    },
    editFormatData(){
      debugger;
      let contentMapper = [];
      if(!this.editOrAddFlag){
        if(this.contentMapper1){
        let obj = {};
        obj.id = this.contentMapper1.id;
        obj.contentId = this.contentMapper1.contentId;
        obj.contentOrder = 1;
        obj.type = 1;
        obj.imgId = this.contentMapper1.imgs.id;
        obj.operateType = 1;
        contentMapper.push(obj);
      }
      for(let i = 0;i<this.contentMapper2.length;i++){
        let obj = {}
        obj.id = this.contentMapper2[i].id;
        obj.contentId = this.contentMapper2[i].contentId;
        obj.contentOrder = i+1;
        obj.type = 2;
        obj.imgId = this.contentMapper2[i].imgs.id;
        obj.operateType = 1;
        contentMapper.push(obj);
      }
      return contentMapper;
      }
      if(this.contentMapper1){
        let obj = {};
        obj.contentId = this.contentMapper1.id;
        obj.contentOrder = 1;
        obj.type = 1;
        obj.imgId = this.contentMapper1.imgs.id;
        contentMapper.push(obj);
      }
      for(let i = 0;i<this.contentMapper2.length;i++){
        let obj = {}
        obj.contentId = this.contentMapper2[i].id;
        obj.contentOrder = i+1;
        obj.type = 2;
        obj.imgId = this.contentMapper2[i].imgs.id;

        contentMapper.push(obj);
      }
      return contentMapper;
    },
    goBack(){
      history.go(-1);
    }
  }
}
</script>

<style lang="scss">
@import "../../styles/variables";
.device-list {}

$pl: 20px;
$pr: 24px;
.content-box{
  background: #fff;
  padding: 10px;
  .el-input{
    max-width: 500px;
  }
  .imgsBox{
    width: 750px;
    height: 250px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .avatar-uploader{
    margin-top: 13px;
    margin-right: 13px;
    vertical-align: middle;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    span{
      color: #676a6c;
      // display: block;
      width: 100%;
      height: 100%;
      vertical-align: middle;

    }
    .el-form-item__content{
      line-height: 0 !important;
    }
  }
  .floatBox{
    // display: flex;
    width: 100%;
    height: 420px;
    overflow: auto;
    .flex-item{
      position: relative;
      float: left;
      padding: 6px;
      box-sizing: border-box;
      width: 20%;
      img{
          width: 100%;
          height: 171px;
      }
      .checkBox{
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    
}
}
</style>
