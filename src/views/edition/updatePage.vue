<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">版本管理>{{!editOrAddFlag?'编辑':'新建'}}版本</span>
      
    </div>
    <div class="content-container">
      
      <div class="cont">
        
        <div class="cont_right">
          <div style="line-height:80px;padding-left:10px;">编辑版本</div>
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

import {
  EDITION_UPDATE,
  EDITION_DETAIL

} from '@/api/editionAPI/editionAPI'
import {getBaseAPI} from '@/api/contantLibraryAPI/contantLibraryAPI'

export default {
  name: 'editionUpDate',
  data() {
    
    return {

      editOrAddFlag:false, //用于判断当前是新建还是编辑
      APILeft:'',
      pageLayoutTypes:[{ text: '电视布局', value: 1 }],
      EnabledType,
      enableType: EnabledType.NONE, // 启用/禁用设备
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      editForm: {
        
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
          EDITION_DETAIL(this.$route.params.contentObj.id).then(res=>{
            let objStr = JSON.stringify(res);
            let str2 = objStr.replace(/"templateContentVOList"/gm,'"templateContentList"').replace(/"templateSmartPageVOList"/gm,'"smartPageList"').replace(/"contentSecondPageVOList"/gm,'"contentSecondPageBOList"');
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
messageSwich(id){
      
        switch(id){
          case 1:
            this.$message.error('请添加开机画面!');
            break;
          case 2:
            this.$message.error('请添加开机视频!');
            break;
          case 3:
            this.$message.error('请添加欢迎页!');
            break;
          case 4:
            this.$message.error('请添加智能主页*/!');
            break;
          
        }
      
      
    },
    verifyData(data){
      let verifyObj = [false,false,false,false];
      for(let i in data.templateContentList){
        verifyObj[data.templateContentList[i].pageContentType-1] = true;
      }
      
      switch(this.editForm.showMode){
        case 1:
          if(verifyObj[0]&&verifyObj[1]&&verifyObj[2]&&verifyObj[3]){
            return true;
          }else{
            for(let j in verifyObj){
              if(!verifyObj[j]){
                this.messageSwich(Number(j)+1);
                break;
              }
            }
            return false;
          }
          break;
        case 2:
          if(verifyObj[0]&&verifyObj[1]&&verifyObj[3]){
            return true;
          }else{
            if(!verifyObj[0]){
              this.messageSwich(1)
            }else if(!verifyObj[1]){
              this.messageSwich(2)
            }else if(!verifyObj[3]){
              this.messageSwich(4)
            }
           
            return false;
          }
          break;
        case 3:
          if(verifyObj[0]&&verifyObj[1]&&verifyObj[2]){
            return true;
          }else{
            if(verifyObj[0]&&verifyObj[1]&&verifyObj[2]){
            return true;
          }else{
            if(!verifyObj[0]){
              this.messageSwich(1)
            }else if(!verifyObj[1]){
              this.messageSwich(2)
            }else if(!verifyObj[2]){
              this.messageSwich(3)
            }
           
            return false;
          }
            return false;
          }
          break;
        case 4:
          if(verifyObj[0]&&verifyObj[1]){
            return true;
          }else{
            if(verifyObj[0]&&verifyObj[1]&&verifyObj[3]){
            return true;
          }else{
            if(!verifyObj[0]){
              this.messageSwich(1)
            }else if(!verifyObj[1]){
              this.messageSwich(2)
            }
           
            return false;
          }
            return false;
          }
          break;
        default:
          return false;
          break;
      }
    },
   
    submitEdit(){
      var thisdata = window.sessionStorage.templateObj.replace(/"contentImgUrl":".*?",/gm,'').replace(/"contentImgUrl":null,/gm,'').replace(/,"contentImgUrl":".*?"/gm,'').replace(/,"contentImgUrl":null/gm,'').replace(/"secondPageId":null,/gm,'').replace(/,"secondPageId":null/gm,'').replace(/"secondPageId":0,/gm,'').replace(/,"secondPageId":0/gm,'')
      let data= JSON.parse(thisdata);
      
        data.showMode = this.editForm.showMode;
     if(!this.verifyData(data)){
        return;
      }
        EDITION_UPDATE(data).then(res=>{
          Message({ showClose: true, message: '编辑成功', type: 'success' })
            history.go(-1);
        })
      
    },
    goToAddContent(index){
      let tpObj = new Object();
      if(window.sessionStorage.templateObj){
        tpObj = JSON.parse(window.sessionStorage.templateObj);
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
