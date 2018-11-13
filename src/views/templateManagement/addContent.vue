<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">模板管理>{{!editOrAddFlag?'编辑':'新建'}}模板>{{pageTitle}}</span>
    </div>
    <div class="content-box">
      <!-- <h5 class="container-header">{{pageTitle}}展示</h5> -->
      
      <el-form ref="editForm" :model="editForm">
        <el-form-item  :label-width="labelWidth" :label="pageTitle+'展示'">
          <div class="TVBox" >
            <img src="../../assets/templateImg/TV.png" width="581" alt="">
            <div class="tvScreen">
              
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="appSwitch[0].isThis" :label-width="labelWidth" label="添加内容">
          <el-button @click="showAndGetData(1,['16:9'],true)">选择图片内容</el-button>
          <span style="color:#dcdfe6">只支持图片形式的内容，尺寸16:9，只能添加一个</span>
          <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
            <img v-if="templateContent.contentImgUrl" style="width:100%;" :src="getImgUrl(templateContent.contentImgUrl)" alt="">
            <el-button v-if="templateContent.contentImgUrl" size="medium" class="btn-default" @click="templateContent.contentImgUrl='';templateContent.contentId=''">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="appSwitch[1].isThis" :label-width="labelWidth" label="添加内容">
          <el-button @click="showAndGetData(2,['1920x1080','1280x720'],true)">选择视频内容</el-button>
          <span style="color:#dcdfe6">只支持视频形式的内容，1920x1080或1280x720，只能添加一个</span>
          <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
            <img v-if="templateContent.contentImgUrl" style="width:100%;" :src="getImgUrl(templateContent.contentImgUrl)" alt="">
            <el-button v-if="templateContent.contentImgUrl" size="medium" class="btn-default" @click="templateContent.contentImgUrl='';templateContent.contentId=''">重置</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="appSwitch[2].isThis" :label-width="labelWidth" label="添加内容">
          <el-button @click="showAndGetData(1,['16:9'],true)">选择图片内容</el-button>
          <span style="color:#dcdfe6">只支持图片形式的内容，尺寸16:9，只能添加一个</span>
          <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
            <img v-if="templateContent.contentImgUrl" style="width:100%;" :src="getImgUrl(templateContent.contentImgUrl)" alt="">
            <el-button v-if="templateContent.contentImgUrl" size="medium" class="btn-default" @click="templateContent.contentImgUrl='';templateContent.contentId=''">重置</el-button>
          </div>
        </el-form-item>
        <div v-if="appSwitch[3].isThis">
          <el-form-item  :label-width="labelWidth" label="添加内容">
            <el-button @click="showAndGetData(1,['1:1'],false)">选择内容</el-button>
            <span style="color:#dcdfe6">只支持图片形式的内容，尺寸1:1，个数限制在2～15个</span>
            <div style="width:100%;min-height:300px;">
              <div class="flex" v-if="contentMapper2.length>0">
                <div class="flex-item" v-for="(item,index) in contentMapper2">
                    <div >
                        <img :src="getImgUrl(item.imgs.imgUrl)" >
                    </div>
                    <div style="text-align:center;margin-top:8px;">{{item.contentName}}<el-button size="medium" class="btn-default" @click="contentMapper2.splice(index,1);">删除</el-button></div>
                    <div class="checkBox" v-if="item.checked">
                      <img src="../../assets/templateImg/check.png" alt="">
                    </div>
                </div>
                <div style="clear:both"></div>
                
            </div>
              <div></div>
            </div>
          </el-form-item>

        </div>
   
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="goBack">返回</el-button>
        <el-button class="btn-primary" size="medium" @click="submitEdit">完成</el-button>
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
                        <el-select v-model="filterForm.contentType" placeholder="请选择内容分类">
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
                    <el-button size="medium" class="btn-default" @click="filterForm.contentName='';filterForm.contentType=''">重置</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="device-table-wrapper">
              <div class="floatBox" v-if="thisInd!=2">
                  <div class="flex-item" v-for="(item,index) in dataList"  @click="itemClick(index)">
                      <div >
                          <img :src="getImgUrl(item.imgs.imgUrl)">
                      </div>
                      <div style="text-align:center;margin-top:8px;">{{item.contentName}}</div>
                      <div class="checkBox" v-if="item.checked">
                        <img src="../../assets/templateImg/check.png" alt="">
                      </div>
                  </div>
                  <div style="clear:both"></div>
              </div>
              <div v-if="thisInd==2" style="width:100%;max-height:420px;">
                <!-- <div  v-for="(item,index) in dataList"  @click="itemClick(index)">
                  <div >
                      <img :src="getImgUrl(item.imgs.imgUrl)">
                  </div>
                  <div style="text-align:center;margin-top:8px;">{{item.contentName}}</div>
                  <div class="checkBox" v-if="item.checked">
                    <img src="../../assets/templateImg/check.png" alt="">
                  </div>
                </div> -->
                
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
          
    </el-dialog>
  </div>
    
</template>

<script>
import { Message } from 'element-ui'
import {
  SECONDPAGE_CREATE,
  SECONDPAGE_GET,
  SECONDPAGE_UPDATE
} from '@/api/secondPage/secondPage'
import {
  GET_CONTANT_FIND
} from '@/api/contantLibraryAPI/contantLibraryAPI'
import { GET_ROOM_TYPE, GET_ALL_ROOM_TYPE } from '@/api/storeManage/storeManage'

export default {
  name: 'DeviceList',
 
  data() {
    
    return {
      //开机画面+开机视频+欢迎页+智能主页
      pageTitle:'',
      thisInd:'',
      appSwitch:[
        {
          header:'开机画面',
          isThis:false
        },{
          header:'开机视频',
          isThis:false
        },{
          header:'欢迎页',
          isThis:false
        },{
          header:'智能主页',
          isThis:false
        }
      ],
      editOrAddFlag:false, //用于判断当前是新建还是编辑
      APILeft:'http://192.168.16.170:80',
      pageLayoutTypes:[{ text: '电视布局', value: 1 }],
     
      dialogData: {},
 
     
      labelWidth: '120px',
     
      editForm: {
        pageName: '',
        pageLayoutType: '',
        contentMapper:[],

      },
     
      filterForm: {//用于条件筛选搜索的表单内容
        contentName: '',
        daterange: ''
      },
     
    
      loading: false,
    
      sortType: null,
     
      contentObj:'',
      dialogVisible:false,
     
      pageIndex:0,
      pageSize:10,
   
      filterDataF:{},
      dataList: [],
      total: 0,
    
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
      templateContent:{

        contentImgUrl: ""
      },
      templateContentIndex:'',
    }
  },
  computed: {
    
  },
  mounted() {
    window.addEventListener('pageshow', this.onShow);
    this.onShow();
  },
  methods: {
    getHeader(){
      let header;
      for(let i in this.appSwitch){
        if(this.appSwitch[i].isThis){
          header = this.appSwitch[i].header;
        }
      }
      return header;
    },
    onShow(){
      this.thisInd = this.$route.query.index;
      this.editOrAddFlag = (this.$route.query.edit==false)||(this.$route.query.edit=='false');
      let tpObj = JSON.parse(window.sessionStorage.templateObj);
      if(this.thisInd != 4){
        if(JSON.stringify(tpObj.templateContentList)!='[]'){
          for(let i in tpObj.templateContentList){
            if(tpObj.templateContentList[i].pageContentType==this.thisInd){
              this.templateContent = tpObj.templateContentList[i];
              this.templateContentIndex = i;
              break;
            }else{
              this.templateContentIndex = '';
            }
          }
        }
        this.templateContent.pageContentType = this.thisInd;
      }else{
        
      }
      
      /**
       * pageContentType*	integer($int32)
minimum: 1
maximum: 4

页面内容类型:1-开机画面, 2-开机视频, 3-欢迎页, 4-智能主页
contentId	integer($int64)

内容主键
imgId	integer($int32)
       */
      switch(this.$route.query.index){
        case 1:
          this.appSwitch[0].isThis = true;
          break;
        case 2:
          this.appSwitch[1].isThis = true;
          break;
        case 3:
          this.appSwitch[2].isThis = true;
          break;
        case 4:
          this.appSwitch[3].isThis = true;
          break;
      }
      if(!this.editOrAddFlag){
      // this.loading = true;
      //   SECONDPAGE_GET(this.$route.params.contentObj.id).then(res=>{
      //     this.contentObj = res;
      //     for(let i in this.editForm){
      //       this.editForm[i] = this.contentObj[i];
      //     }
      //     this.editForm.id = this.contentObj.id;
          
      //     this.loading = false;
      //   })
        
      }
      this.pageTitle = this.getHeader();
      
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
 queryData(){
   
   this.getContantLibraryAPI(this.filterForm)
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
      let tpObj = JSON.parse(window.sessionStorage.templateObj)
      if(this.thisInd!=4){
        
        if(this.templateContentIndex!=''){
          tpObj.templateContentList[this.templateContentIndex] = this.templateContent;
        }else{
          tpObj.templateContentList = [this.templateContent]
        }
      }else{
        
      }
      window.sessionStorage.templateObj = JSON.stringify(tpObj);
    },
    showAndGetData(type,size,checked){
      this.dialogVisible = true;
      this.filterForm.imgSizes = size;
      this.filterForm.showModes = [type];
      this.filterForm.contentTypes = [];
      this.dialogChecked = checked;
      this.queryData();

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
      if(this.thisInd!=4){
        for(let i in this.dataList){
          if(this.dataList[i].checked){
            this.contentMapper1 = this.dataList[i]
            break;
          }
        }
        this.templateContent.pageContentType = this.thisInd;
        this.templateContent.contentId = this.contentMapper1.id;
        this.templateContent.contentImgUrl = this.contentMapper1.imgs.imgUrl;
        this.templateContent.templateSmartPageVOList = null;
      }
      // if(this.dialogChecked){
      //   for(let i in this.dataList){
      //     if(this.dataList[i].checked){
      //       this.contentMapper1 = this.dataList[i]
      //       break;
      //     }
      //   }
      // }else{
      //   for(let i in this.dataList){
      //     if(this.dataList[i].checked){
      //       this.contentMapper2.push(this.dataList[i]);
      //     }
      //   }
      //   if(this.contentMapper2.length>=15){
      //     this.contentMapper2.length=15
      //   }
      // }
      // this.dialogVisible = false;
      // debugger
    },
    getImgUrl:function(url){
      
      let SRC = this.APILeft+url.split('$}')[1];
      return SRC;
    },
    editFormatData(){
      let contentMapper = [];
      if(this.contentMapper1){
        let obj = {};
        obj.contentId = this.contentMapper1.id;
        obj.contentOrder = 1;
        obj.type = 1;
        contentMapper.push(obj);
      }
      for(let i = 0;i<this.contentMapper2.length;i++){
        let obj = {}
        obj.contentId = this.contentMapper2[i].id;
        obj.contentOrder = i+1;
        obj.type = 2;
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
    // height: 420px;
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
  .TVBox{
    width: 581px;
    height: 362px;
    position: relative;
    .tvScreen{
      position: absolute;
      width: 569px;
      height: 282px;
      top: 5px;
      left: 6px;
      border-radius: 1px;
    } 
  }
}
</style>
