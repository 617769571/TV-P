<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">内容库管理>{{!editOrAddFlag?'编辑':'新建'}}内容</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-container">
      <el-form ref="editForm" :model="editForm">
        <el-form-item :label-width="labelWidth" label="内容名称" prop="contentName" style="white-space:nowrap">
          <el-input v-model="editForm.contentName" placeholder="请输入内容名称" :maxlength="30"/><span style="color:#dcdfe6">&nbsp;{{editForm.contentName.length}}/30</span>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="内容分类" prop="brandCode">
          <el-select v-model="editForm.contentType" placeholder="请选择内容分类">
            <el-option v-for="(rt, index) in contentTypes" :key="index" :label="rt.text" :value="rt.value">
              {{ rt.text }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="展现形式" prop="showMode">
          <el-radio-group v-model="editForm.showMode">
            <el-radio-button :disabled="!editOrAddFlag" label="1">图片</el-radio-button>
            <el-radio-button :disabled="!editOrAddFlag" label="2">视频</el-radio-button>
          </el-radio-group>
          <div v-if="editForm.showMode==1" class="imgsBox">
            <div>只支持PNG、JPG、BMP格式，
          大小：建议PNG不超过 1MB；JPG不超过300K；BMP不超过5MB</div>
            <el-upload style="background:#F2F2F2;width:233px;height:233px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=PICTURE'"
              :show-file-list="false"
              :on-success="handleAvatar0Success"
              :before-upload="beforeAvatarUpload">
              <img v-if="editFormImgs[0].imgUrl" :src="getImgUrl(editFormImgs[0].imgUrl)" class="avatar" style="width:233px;height:233px;">
              <span  v-if="!editFormImgs[0].imgUrl">1:1</span>
            </el-upload>
            <el-upload style="background:#F2F2F2;width:144px;height:234px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=PICTURE'"
              :show-file-list="false"
              :on-success="handleAvatar1Success"
              :before-upload="beforeAvatarUpload">
              <img v-if="editFormImgs[1].imgUrl" :src="getImgUrl(editFormImgs[1].imgUrl)" class="avatar" style="width:144px;height:234px;">
              <span  v-if="!editFormImgs[1].imgUrl">318x658</span>
            </el-upload>
            <el-upload style="background:#F2F2F2;width:208px;height:104px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=PICTURE'"
              :show-file-list="false"
              :on-success="handleAvatar2Success"
              :before-upload="beforeAvatarUpload">
              <img v-if="editFormImgs[2].imgUrl" :src="getImgUrl(editFormImgs[2].imgUrl)" class="avatar" style="width:208px;height:104px;">
              <span  v-if="!editFormImgs[2].imgUrl">1314x658</span>
            </el-upload>
            <el-upload style="background:#F2F2F2;width:207px;height:116px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=PICTURE'"
              :show-file-list="false"
              :on-success="handleAvatar3Success"
              :before-upload="beforeAvatarUpload">
              <img v-if="editFormImgs[3].imgUrl" :src="getImgUrl(editFormImgs[3].imgUrl)" class="avatar" style="width:207px;height:116px;">
              <span  v-if="!editFormImgs[3].imgUrl">16:9</span>
            </el-upload>
            <el-upload style="background:#F2F2F2;width:113px;height:74px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=PICTURE'"
              :show-file-list="false"
              :on-success="handleAvatar4Success"
              :before-upload="beforeAvatarUpload">
              <img v-if="editFormImgs[4].imgUrl" :src="getImgUrl(editFormImgs[4].imgUrl)" class="avatar" style="width:113px;height:74px;">
              <span  v-if="!editFormImgs[4].imgUrl">318x207</span>
            </el-upload>

          </div>
          
          <div v-if="editForm.showMode==2" class="imgsBox">
            <el-upload style="background:#F2F2F2;width:207px;height:116px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=VIDEO'"
              :show-file-list="false"
              :on-success="handleAvatar5Success"
              :before-upload="beforeAvatarUpload">
              <!-- <img v-if="editFormVideos[0].imgUrl" :src="getImgUrl(editFormVideos[0].imgUrl)" class="avatar" style="width:207px;height:116px;"> -->
              <video v-if="editFormVideos[0].imgUrl" :src="getImgUrl(editFormVideos[0].imgUrl)" class="avatar" style="width:207px;height:116px;" controls="controls">
                Your browser does not support the video tag.
              </video>
              <span  v-if="!editFormVideos[0].imgUrl">1920x1080</span>
            </el-upload>
            <el-upload style="background:#F2F2F2;width:207px;height:116px;"
              class="avatar-uploader"
              :action="BASE_API+'/upload/file/upload?file-type=VIDEO'"
              :show-file-list="false"
              :on-success="handleAvatar6Success"
              :before-upload="beforeAvatarUpload">
              <!-- <img v-if="editFormVideos[1].imgUrl" :src="getImgUrl(editFormVideos[1].imgUrl)" class="avatar" style="width:207px;height:116px;"> -->
              <video v-if="editFormVideos[1].imgUrl" :src="getImgUrl(editFormVideos[1].imgUrl)" class="avatar" style="width:207px;height:116px;" controls="controls">
                Your browser does not support the video tag.
              </video>
              <span  v-if="!editFormVideos[1].imgUrl">1280x720</span>
            </el-upload>
            
          </div>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="触发方式" prop="triggerMode">
          <el-select v-model="editForm.triggerMode" placeholder="请选择触发方式">
            <el-option v-for="(rt, index) in roomTypeNames" :key="index" :label="rt.text" :value="rt.value">
              {{ rt.text }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="editForm.triggerMode==1" :label-width="labelWidth" label="目标URL" prop="triggerParam">
          <!-- <el-input placeholder="请输入内容" v-model="editForm.triggerParam" class="input-with-select">
            <el-select v-model="editForm.http" slot="prepend" placeholder="请选择">
              <el-option label="Http://" value="Http://"></el-option>
              <el-option label="Https://" value="Https://"></el-option>
            </el-select>
          </el-input> -->
          <el-input v-model="editForm.triggerParam" placeholder="请输入目标URL" />
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
    
    return {
      editOrAddFlag:false, //用于判断当前是新建还是编辑
      BASE_API:'',
      APILeft:'',
      contentTypes:[{ text: '影视', value: 1 }, { text: '直播', value: 2 }, { text: '广告', value: 3 }, { text: '购物', value: 4 }, { text: '服务', value: 5 }, { text: '周边', value: 6 }],
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
      this.BASE_API = getBaseAPI().BASE_API;
      this.APILeft = getBaseAPI().IMG_URL;
  

      
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
          GET_CONTANT_APP().then(res=>{
        this.applications = res;
      })
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
        debugger
        if(file.type === 'video/mp4'||file.type === 'video/vnd.dlna.mpeg-tts'){
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
        case 0:
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
    disclose(){
      
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
      if(this.editForm.contentName.length<1){
        return this.$message.error('请输入内容名称!');
      }
      if(!this.editForm.contentType){
        return this.$message.error('请选择内容分类!');
      }
      if(this.editForm.imgs.length<1){
        return this.$message.error('请上传图片!');
      }
      if(this.editForm.triggerMode.length<1){
        return this.$message.error('请选择触发方式!');
      }
      if(this.editForm.triggerMode==1&&!this.editForm.triggerParam){
        return this.$message.error('请输入网址!');
      }
      if(this.editForm.triggerMode==2&&!this.editForm.triggerId){
        return this.$message.error('请选择应用!');
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
