<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">内容库管理>内容详情</span>
      
    </div>
    <div class="content-container">
      <el-form ref="editForm" :model="editForm" :rules="editRules">
        <el-form-item :label-width="labelWidth" label="内容名称" prop="contentName" style="white-space:nowrap">
        <div>{{editForm.contentName}}</div>

        </el-form-item>
        
        <el-form-item :label-width="labelWidth" label="内容分类" prop="brandCode">
         
          <div>{{contentObj.contentType}}</div>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="展现形式" prop="showMode">
          
          <div>{{contentObj.showMode}}</div>
          <div v-if="editForm.showMode==1" class="imgsBox">
            <div v-if="editFormImgs[0].imgUrl" style="background:#F2F2F2;width:233px;height:233px;"
              class="avatar-uploader">
              <img v-if="editFormImgs[0].imgUrl" :src="getImgUrl(editFormImgs[0].imgUrl)" class="avatar" style="width:233px;height:233px;">
            </div>
            <div v-if="editFormImgs[1].imgUrl" style="background:#F2F2F2;width:144px;height:234px;"
              class="avatar-uploader">
              <img v-if="editFormImgs[1].imgUrl" :src="getImgUrl(editFormImgs[1].imgUrl)" class="avatar" style="width:144px;height:234px;">
            </div>
            <div v-if="editFormImgs[2].imgUrl" style="background:#F2F2F2;width:208px;height:104px;"
              class="avatar-uploader">
              <img v-if="editFormImgs[2].imgUrl" :src="getImgUrl(editFormImgs[2].imgUrl)" class="avatar" style="width:208px;height:104px;">
            </div>
            <div v-if="editFormImgs[3].imgUrl" style="background:#F2F2F2;width:207px;height:116px;"
              class="avatar-uploader">
              <img v-if="editFormImgs[3].imgUrl" :src="getImgUrl(editFormImgs[3].imgUrl)" class="avatar" style="width:207px;height:116px;">
            </div>
            <div v-if="editFormImgs[4].imgUrl" style="background:#F2F2F2;width:113px;height:74px;"
              class="avatar-uploader">
              <img v-if="editFormImgs[4].imgUrl" :src="getImgUrl(editFormImgs[4].imgUrl)" class="avatar" style="width:113px;height:74px;">
            </div>

          </div>
          
          <div v-if="editForm.showMode==2" class="imgsBox">
            <div v-if="editFormVideos[0].imgUrl" style="background:#F2F2F2;width:207px;height:116px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=VIDEO'"
              :show-file-list="false"
              :on-success="handleAvatar3Success"
              :before-upload="beforeAvatarUpload">
              <video v-if="editFormVideos[0].imgUrl" :src="getImgUrl(editFormVideos[0].imgUrl)" class="avatar" style="width:207px;height:116px;" controls="controls">
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-if="editFormVideos[1].imgUrl" style="background:#F2F2F2;width:207px;height:116px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=VIDEO'"
              :show-file-list="false"
              :on-success="handleAvatar3Success"
              :before-upload="beforeAvatarUpload">
              <video v-if="editFormVideos[1].imgUrl" :src="getImgUrl(editFormVideos[1].imgUrl)" class="avatar" style="width:207px;height:116px;" controls="controls">
                Your browser does not support the video tag.
              </video>
            </div>
            
          </div>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="触发方式" prop="triggerMode">
         
          <div>{{contentObj.triggerMode}}</div>
        </el-form-item>
        <el-form-item  v-if="editForm.triggerMode==1" :label-width="labelWidth" label="目标URL" prop="triggerParam">
       
          <div>{{contentObj.triggerParam}}</div>

        </el-form-item>
        <el-form-item v-if="editForm.triggerMode==2" :label-width="labelWidth" label="应用" prop="triggerId">
         
          <div>{{contentObj.triggerId}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="goBack">返回</el-button>
      </div>
    </div>
  
  </div>
</template>

<script>
import EnabledType from './types/enable-type'
import { Message } from 'element-ui'
import DeviceDetailDialog from './dialog/device-detail-dialog.vue'

import {
  GET_CONTANT_APP,
  CONTENT_CREATE,
  CONTANT_GET,
  CONTENT_UPDATE,
  getBaseAPI
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
    const validatetriggerModeA = (rule, value, callback) => {
      if ((Number.isSafeInteger(value * 1) && ('' + value)).trim().length < 1) {
        this.addForm.triggerMode = ''
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
      editOrAddFlag:false, //用于判断当前是新建还是编辑
      BASE_API:'',
      APILeft:'',
      contentTypes:[{ text: '影视', value: 1 }, { text: '直播', value: 2 }, { text: '广告', value: 3 }, { text: '购物', value: 4 }, { text: '服务', value: 5 }, { text: '周边', value: 6 }],
      editRules: {
        // storeName: [{ required: true, trigger: 'blur', validator: validateStoreNameE }],
        // brandCode: [{ required: true, trigger: 'blur', validator: validateBrandCodeE }],
        // typeCode: [{ required: true, trigger: 'blur', validator: validateTypeCodeE }],
        // // roomNo: [{ required: true, trigger: 'blur', validator: validateRoomNoE }],
        triggerMode: [{ required: true, trigger: 'blur', validator: validateRoomTypeE }],
       
      },
      addRules: {
        contentName: [
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
        contentName: '',
        contentType: '',
        showMode: 1,
        imgs:[],
        triggerMode: '',
        triggerParam: '',
        triggerId:''
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
      contentObj:''
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
      console.log(getBaseAPI());
      this.BASE_API = getBaseAPI().BASE_API;
      this.APILeft = getBaseAPI().IMG_URL;
  

      GET_CONTANT_APP().then(res=>{
        this.applications = res;
      })
      this.loading = true;
      this.editOrAddFlag = (this.$route.query.edit==false)||(this.$route.query.edit=='false');
      if(!this.editOrAddFlag){
        CONTANT_GET(this.$route.params.contentObj.id).then(res=>{
          this.contentObj = res;
          for(let i in this.editForm){
            this.editForm[i] = this.contentObj[i];
          }
          this.editForm.id = this.contentObj.id;
          // this.editFormImgs = this.contentObj.imgs;
          if(res.showMode==1){
            for(let j in this.contentObj.imgs){
              this.imgSort(this.contentObj.imgs[j])
            }

          }else{
            for(let j in this.contentObj.imgs){
              this.videoSort(this.contentObj.imgs[j])
            }
          }
          this.loading = false;
        })
        
      }
      
    },
    videoSort(imgObj){
      switch(imgObj.size){
        case '1920x1080':
          this.editFormVideos[0] = imgObj; 
          break;      
        case '1280x720':
          this.editFormVideos[1] = imgObj; 
          break;     
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
      this.editFormImgs[ind].imgUrl = res[0];
     
      this.editFormImgs[ind].mediaType = file.name.split('.')[1];

    },
    getImgUrl:function(url){
      let SRC = this.APILeft+url.split('$}')[1];
      return SRC;
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
    handleAvatar5Success(res, file,ind) {
      
      this.editFormVideos[0].imgUrl = res[0];
     
      this.editFormVideos[0].mediaType = file.name.split('.')[1];
    },
    handleAvatar6Success(res, file,ind) {
      
      this.editFormVideos[1].imgUrl = res[0];
     
      this.editFormVideos[1].mediaType = file.name.split('.')[1];
    },
    beforeAvatarUpload(file) {
      let isJPG = false;
      if(this.editForm.showMode == 1){
        if(file.type === 'image/jpeg'||file.type === 'image/png'||file.type === 'image/gif'){
          isJPG = true;
        }
      }else{
        if(file.type === 'video/mp4'||file.type === 'video/ts'){
          isJPG = true;
        }
      }

      const isLt2M = file.size / 1024 / 1024 < 30;

      if (!isJPG) {
        this.$message.error(`上传${(this.editForm.showMode == 1)?'图片':'视频'}只能是 ${(this.editForm.showMode == 1)?'png':'mp4/ts'} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 30MB!');
      }
      return isJPG && isLt2M;
    },
    handleBrandChange(val) {
      this.deviceModels = []
      if (!val) {
        this.filterForm.deviceModel = ''
        return
      }
  
    },
    handleBrandChangeAdd(val) {
      this.deviceModels = []
      if (!val) {
        return
      }
    
    },
    handleBrandChangeEdit(val) {
      this.editForm.typeCode = ''
      this.deviceModels = []
      if (!val) {
        return
      }
      
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

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.queryData()
    },
 
    submitEdit(){
      if(this.editForm.showMode==1){
        this.editForm.imgs = [];
        for(let i in this.editFormImgs){
          if(this.editFormImgs[i].imgUrl){
            this.editForm.imgs.push(this.editFormImgs[i]);

          }
        }
        // this.editForm.imgs = this.editFormImgs;
      }else{
        this.editForm.imgs = [];
        for(let i in this.editFormVideos){
          if(this.editFormVideos[i].imgUrl){
            this.editForm.imgs.push(this.editFormVideos[i]);

          }
        }
      
      }
      
      if(this.editOrAddFlag){
          CONTENT_CREATE(this.editForm).then(res=>{
            Message({ showClose: true, message: '创建成功', type: 'success' })
            history.go(-1);
          })

      }else{
        CONTENT_UPDATE(this.editForm).then(res=>{
          Message({ showClose: true, message: '编辑成功', type: 'success' })
            history.go(-1);
        })
      }
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
.content-container{
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
}
</style>
