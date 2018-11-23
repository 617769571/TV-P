<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">模板管理>{{!editOrAddFlag?'编辑':'新建'}}模板</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-container">
      <el-form ref="editForm" :model="editForm" >
        <el-form-item :label-width="labelWidth" label="模板名称" prop="templateName" style="white-space:nowrap">
          <el-input v-model="editForm.templateName" placeholder="请输入内容名称" :maxlength="30"/><span style="color:#dcdfe6">&nbsp;{{editForm.templateName.length}}/30</span>
        </el-form-item>
      </el-form>
      <div class="cont">
        <div class="cont_left">
          <div style="line-height:80px;">页面展现方式</div>
          <!-- [{ text: '开机画面+开机视频+欢迎页+智能主页', value: 1 }, { text: '开机画面+开机视频+智能主页', value: 2 }, { text: '开机画面+开机视频+欢迎页', value: 3 }, { text: '开机画面+开机视频', value: 4 }] -->
          <div :class="editForm.showMode==1?'bgf2 left_list':'left_list'" @click="editForm.showMode=1"><span>A</span>开机画面+开机视频+欢迎页+智能主页</div>
          <div :class="editForm.showMode==2?'bgf2 left_list':'left_list'" @click="editForm.showMode=2"><span>B</span>开机画面+开机视频+智能主页</div>
          <div :class="editForm.showMode==3?'bgf2 left_list':'left_list'" @click="editForm.showMode=3"><span>C</span>开机画面+开机视频+欢迎页</div>
          <div :class="editForm.showMode==4?'bgf2 left_list':'left_list'" @click="editForm.showMode=4"><span>D</span>开机画面+开机视频</div>
        </div>
        <div class="cont_right">
          <div style="line-height:80px;padding-left:10px;">编辑模版</div>
            <div class="left_list flex" @click="goToAddContent(1)" >
              <div>
                <img src="../../assets/templateImg/1.jpg" width="200" alt="">
              </div>
              <div style="margin-left:10px;">
                <div style="color:#000;line-height:36px;">
                  开机画面
                </div>
                <div>
                  可加入需要运营的图片内容
                </div>
              </div>
            </div>
            <div class="left_list flex" @click="goToAddContent(2)" >
              <div>
                <img src="../../assets/templateImg/2.jpg" width="200" alt="">
              </div>
              <div style="margin-left:10px;">
                <div style="color:#000;line-height:36px;">
                  开机视频
                </div>
                <div>
                  可加入需要运营的视频内容
                </div>
              </div>
            </div>
            <div class="left_list flex" @click="goToAddContent(3)" v-if="(editForm.showMode!=2)&&(editForm.showMode!=4)">
              <div>
                <img src="../../assets/templateImg/3.jpg" width="200" alt="">
              </div>
              <div style="margin-left:10px;">
                <div style="color:#000;line-height:36px;">
                  欢迎页
                </div>
                <div>
                  可加入需要运营的图片内容
                </div>
              </div>
            </div>
            <div class="left_list flex" @click="goToAddContent(4)" v-if="(editForm.showMode!=3)&&(editForm.showMode!=4)">
              <div>
                <img src="../../assets/templateImg/4.jpg" width="200" alt="">
              </div>
              <div style="margin-left:10px;">
                <div style="color:#000;line-height:36px;">
                  智能主页
                </div>
                <div>
                  可编辑整个智能主页
                </div>
              </div>
            </div>
        </div>
      </div>
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
// import {
//   GET_CONTANT_APP,
//   GET_MODEL_LIST,
//   GET_DEVICE_LIST,
//   GET_STORES,
//   GET_CONTANT_FIND,
//   CHANGE_DEVICE_STATUS,
//   UPDATE_INFO,
//   DEVICE_DETAIL,
//   REGISTER_CHECK,
//   REGISTER_DEVICE
// } from '@/api/contantLibraryAPI/contantLibraryAPI'
import {
  
  TEMPLATE_ADD,
  TEMPLATE_DETAIL,
  TEMPLATE_UPDATE

} from '@/api/templateAPI/templateAPI'
import { GET_ROOM_TYPE, GET_ALL_ROOM_TYPE } from '@/api/storeManage/storeManage'
import RoomTypeConfig from '@/constants/room-type-config'
import {getBaseAPI} from '@/api/contantLibraryAPI/contantLibraryAPI'

export default {
  name: 'DeviceList',
 
  data() {
  
    return {

      editOrAddFlag:false, //用于判断当前是新建还是编辑
      APILeft:'',
      pageLayoutTypes:[{ text: '电视布局', value: 1 }],
   
      dialogData: {},
      multipleSelection: [],
      EnabledType,
      enableType: EnabledType.NONE, // 启用/禁用设备
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      editForm: {
        templateName: '',
        showMode: 1,
        templateContentList:[],

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
      this.APILeft = getBaseAPI().IMG_URL;

      this.editOrAddFlag = (this.$route.query.edit==false)||(this.$route.query.edit=='false');
      if(window.sessionStorage.templateObj){
        this.editForm = JSON.parse(window.sessionStorage.templateObj);
      }else{
        if(!this.editOrAddFlag){
          // this.loading = true;
          TEMPLATE_DETAIL(this.$route.params.contentObj.id).then(res=>{
            let objStr = JSON.stringify(res);
            let str2 = objStr.replace(/"templateContentVOList"/gm,'"templateContentList"').replace(/"templateSmartPageVOList"/gm,'"smartPageList"').replace(/"contentSecondPageVOList"/gm,'"contentSecondPageBOList"');
            this.editForm.templateName = JSON.parse(str2).templateName;
            this.editForm.showMode = JSON.parse(str2).showMode;
            this.editForm.id = JSON.parse(str2).id;
            this.editForm.templateContentList = JSON.parse(str2).templateContentList;
            window.sessionStorage.templateObj = JSON.stringify(this.editForm);

          })
          
        }

      }
      
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

    submitEdit(){
      var thisdata = window.sessionStorage.templateObj.replace(/"contentImgUrl":".*?",/gm,'').replace(/"contentImgUrl":null,/gm,'').replace(/,"contentImgUrl":".*?"/gm,'').replace(/,"contentImgUrl":null/gm,'').replace(/"secondPageId":null,/gm,'').replace(/,"secondPageId":null/gm,'').replace(/"secondPageId":0,/gm,'').replace(/,"secondPageId":0/gm,'')
      let data= JSON.parse(thisdata);
      if(!this.editForm.templateName){
        this.$message({
          message: '模版名称不能为空',
          type: 'warning'
        });
        return;
      }else{
        data.templateName = this.editForm.templateName;
        data.showMode = this.editForm.showMode;
      }
      if(this.editOrAddFlag){
          TEMPLATE_ADD(data).then(res=>{
            Message({ showClose: true, message: '创建成功', type: 'success' })
            history.go(-1);
          })

      }else{
        TEMPLATE_UPDATE(data).then(res=>{
          Message({ showClose: true, message: '编辑成功', type: 'success' })
            history.go(-1);
        })
      }
    },
    goToAddContent(index){
      let tpObj = new Object();
      if(window.sessionStorage.templateObj){
        tpObj = JSON.parse(window.sessionStorage.templateObj);
        tpObj.templateName = this.editForm.templateName;
        tpObj.showMode = this.editForm.showMode;
      }else{
        tpObj = this.editForm;
      }
      window.sessionStorage.templateObj = JSON.stringify(tpObj);
      this.$router.push({ name: 'addContent', query: { index: index ,edit:!this.editOrAddFlag}});

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
  .cont{
    width: 100%;
    display: flex;
    min-height: 400px;
    border-top: 1px #f2f2f2 dotted;
    
    .cont_left{
      min-width: 400px;
      line-height: 60px;
    
      span{
        font-weight: 700;
        display: inline-block;
        margin-right: 30px;
      }
    }
    .left_list{
      color: #666666;
      padding-left: 50px;
    }
    .cont_right{
      margin-left:10px;
      border-left: 1px #f2f2f2 dotted;
    }
  }
}
.bgf2{
  background: #f2f2f2;
}
.flex{
  display: flex;
  margin-bottom: 13px;
}
</style>
