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
              <img v-if="templateContent.contentImgUrl&&(thisInd==1)&&(thisInd==3)" style="width:100%;height:100%" :src="getImgUrl(templateContent.contentImgUrl)" alt="">
              <video v-if="templateContent.contentImgUrl&&(thisInd==2)" :src="getImgUrl(templateContent.contentImgUrl)"  style="width:100%;height:100%" controls="controls">
                Your browser does not support the video tag.
              </video>
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
            <video v-if="templateContent.contentImgUrl" style="width:100%;" :src="getImgUrl(templateContent.contentImgUrl)"  controls="controls"></video>
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
          <!-- <el-form-item  :label-width="labelWidth" label="添加内容">
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
          </el-form-item> -->
          <div class="content-box-left" style="float:left">
            <el-collapse v-model="collapseArr" @change="handleChange">
              <el-collapse-item v-for="(item,i) in smartPageList" :title="getSmartContentType(item.smartContentType)" :key="i" :name="item.smartContentType">
                <div class="floatBox" style="height:auto;"  v-if="item.smartContentType!=2">
                  <div v-for="(rt, index) in item.contentSecondPageBOList" :key="index" @click="setThisIndex(i,index)">
                    <div>{{getSmartContentType(item.smartContentType)+(index+1)}}</div>
                  </div>
                </div>
                <div class="floatBox" style="height:auto;" v-if="item.smartContentType==2">
                  <div @click="setThisIndex(i,0)">
                    <div>广告区域</div>
                  </div>
                </div>
              </el-collapse-item>
              
            </el-collapse>
          </div>
          <div class="content-box-right" style="float:left">
            <div v-if="collapseInds[0]==0">
              <el-form-item  :label-width="labelWidth" label="添加内容">
                <el-button @click="showAndGetData(1,['318x658'],true)">选择图片内容</el-button>
                <span style="color:#dcdfe6">只支持图片形式的内容，尺寸318x658，只能添加一个</span>
                <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
                  <img v-if="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl" style="width:100%;" :src="getImgUrl(smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl)" alt="">
                  <el-button v-if="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl" size="medium" class="btn-default" @click="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl='';smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentId=''">重置</el-button>
                </div>
              </el-form-item>
            </div>
            <div v-if="collapseInds[0]==1">
              <el-form-item  :label-width="labelWidth" label="添加内容">
                <el-button @click="showAndGetData(1,['1314x658'],false)">选择图片内容</el-button>
                <span style="color:#dcdfe6">只支持图片形式的内容，尺寸1314x658，可添加1～8个</span>
                <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
                  <div v-for="(item,index) in smartPageList[1].contentSecondPageBOList" :key="index">
                    <img style="width:100%;" :src="getImgUrl(item.contentImgUrl)" alt="" />
                    <el-form-item :label-width="labelWidth" label="关联二级页面">
                      <el-switch
                        v-model="secondPageFlagList[1][index]"
                        active-text="关联二级页面">
                        
                      </el-switch>
                      
                    </el-form-item>
                    <el-form-item v-if="secondPageFlagList[1][index]" :label-width="labelWidth" label="二级页面">
                      <el-select v-model="smartPageList[1].contentSecondPageBOList[index].secondPageId" placeholder="请选择">
                        <el-option
                        :key="0"
                        label="请选择"
                        :value="0">
                        </el-option>
                        <el-option
                          v-for="rt in secondPageList"
                          :key="rt.id"
                          :label="rt.pageName"
                          :value="rt.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-button  size="medium" class="btn-default" @click="smartPageList[1].contentSecondPageBOList.splice(index,1)">删除</el-button>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div v-if="collapseInds[0]==2">
              <el-form-item  :label-width="labelWidth" label="添加内容">
                <el-button @click="showAndGetData(1,['318x207'],true)">选择图片内容</el-button>
                <span style="color:#dcdfe6">只支持图片形式的内容，尺寸318x207，只能添加一个</span>
                <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
                  <img v-if="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl" style="width:100%;" :src="getImgUrl(smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl)" alt="" />
                  <el-form-item :label-width="labelWidth" label="关联二级页面">
                      <el-switch
                        v-model="secondPageFlagList[collapseInds[0]][collapseInds[1]]"
                        active-text="关联二级页面">
                      </el-switch>
                    </el-form-item>
                    <el-form-item v-if="secondPageFlagList[collapseInds[0]][collapseInds[1]]" :label-width="labelWidth" label="二级页面">
                      <el-select v-model="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].secondPageId" placeholder="请选择">
                        <el-option
                        :key="0"
                        label="请选择"
                        :value="null">
                        </el-option>
                        <el-option
                          v-for="item in secondPageList"
                          :key="item.id"
                          :label="item.pageName"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  <!-- <el-switch v-model=""></el-switch> -->
                  <el-button v-if="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl" size="medium" class="btn-default" @click="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl='';smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentId=''">重置</el-button>
                </div>
              </el-form-item>
            </div>
            <div v-if="collapseInds[0]==3">
              <el-form-item  :label-width="labelWidth" label="添加内容">
                <el-button @click="showAndGetData(1,['16:9'],true)">选择图片内容</el-button>
                <span style="color:#dcdfe6">只支持图片形式的内容，尺寸16:9，只能添加一个</span>
                <div style="width:500px;min-height:300px;margin-top:10px;text-align:center">
                  <img v-if="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl" style="width:100%;" :src="getImgUrl(smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl)" alt="">
                  <el-button v-if="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl" size="medium" class="btn-default" @click="smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentImgUrl='';smartPageList[collapseInds[0]].contentSecondPageBOList[collapseInds[1]].contentId=''">重置</el-button>
                </div>
              </el-form-item>
            </div>
          </div>
          <div style="clear:both"></div>
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
                    <el-button size="medium" class="btn-primary" @click="pageIndex=0;queryData()">查询</el-button>
                    <el-button size="medium" class="btn-default" @click="filterForm.contentName='';filterForm.contentTypes=[0]">重置</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="device-table-wrapper">
              <div class="floatBox" v-if="thisInd!=2">
                  <div class="flex-item" v-for="(item,index) in dataList" :key="index" @click="itemClick(index,item)">
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
              <div v-if="thisInd==2" style="width:100%;max-height:420px;overflow: auto;">
                <table class="videoTable" style="width:100%;">
                  <tr>
                    <td></td>
                    <td>内容名称</td>
                    <td>分类</td>
                    <td>尺寸&格式</td>
                  </tr>
                  <tr v-for="(item,index) in dataList" :key="index">
                    <td><el-radio v-model="videoChecked" :label="index" border></el-radio></td>
                    <td>{{item.contentName}}</td>
                    <td>{{getContentType(item.contentType)}}</td>
                    <td>
                      <el-select v-model="item.checked" placeholder="请选择">
                        <el-option
                          v-for="(option,index) in item.imgs"
                          :key="option.size"
                          :label="option.size"
                          :value="index">
                        </el-option>
                      </el-select>
                    </td>
                  </tr>
                </table>
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
import {getBaseAPI} from '@/api/contantLibraryAPI/contantLibraryAPI'
import {SECONDPAGE_FIND} from '@/api/secondPage/secondPage'

export default {
  name: 'DeviceList',
 
  data() {
    
    return {
      collapseArr:[1],
      videoChecked:'',
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
      APILeft:'',
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
        daterange: '',
        contentTypes:[0]
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
      collapseInds:[0,0],
      secondPageFlagList:[
        [false],
        [false,false,false,false,false,false,false,false],
        [false,false,false,false,false],
        [false]
      ],
      contentTypes:[
          { text: '全部', value: 0 }, 
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
      smartPageList: [
        {
          smartContentType:1,
          contentSecondPageBOList:[
            {
              contentId:null,
              imgId:null,
              contentImgUrl:null,
            }
          ]
        },
        {
          smartContentType:2,
          contentSecondPageBOList:[
            //初始化为空数组
          ]
        },
        {
          smartContentType:3,
          contentSecondPageBOList:[
            {
              contentId:null,
              imgId:null,
              contentImgUrl:null,
              secondPageId:null,

              contentOrder:1
            },
            {
              contentId:null,
              imgId:null,
              contentImgUrl:null,
              secondPageId:null,

              contentOrder:2

            },
            {
              contentId:null,
              imgId:null,
              contentImgUrl:null,
              secondPageId:null,

              contentOrder:3

            },{
              contentId:null,
              imgId:null,
              contentImgUrl:null,
              secondPageId:null,

              contentOrder:4

            },{
              contentId:null,
              imgId:null,
              contentImgUrl:null,
              secondPageId:null,

              contentOrder:5

            }
          ]
        },{
          smartContentType:4,
          contentSecondPageBOList:[
            {
              contentId:null,
              imgId:null,
              contentImgUrl:null,

            }
          ],
        },
      ],
      secondPageList:[]
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
      SECONDPAGE_FIND({pageSize:30,pageIndex:0}).then(res=>{
        this.secondPageList = res.list
      })
      this.APILeft = getBaseAPI().IMG_URL;

      this.thisInd = this.$route.query.index;
      this.editOrAddFlag = (this.$route.query.edit==false)||(this.$route.query.edit=='false');
      let tpObj = JSON.parse(window.sessionStorage.templateObj);
      debugger;
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
        if(JSON.stringify(tpObj.templateContentList)!='[]'){
          for(let i in tpObj.templateContentList){
            if(tpObj.templateContentList[i].pageContentType==this.thisInd){
              let spl = tpObj.templateContentList[i].smartPageList
              for(let j in spl){
                this.smartPageList[spl[j].smartContentType-1] = spl[j]
              }
              // this.smartPageList = tpObj.templateContentList[i].smartPageList;
              this.templateContentIndex = i;
              break;
            }else{
              // this.templateContentIndex = '';
            }
          }
          for(let i in this.smartPageList){
            for(let j in this.smartPageList[i].contentSecondPageBOList){
              if(this.smartPageList[i].contentSecondPageBOList[j].secondPageId){
                this.secondPageFlagList[i][j]=true;
              }
            }
          }
        }
      }
      
   
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
    getSmartPageListToSess(){
      if(this.appSwitch[3].isThis){
        for(let i in this.templateContent){
          if(this.templateContent[i].smartContentType == 2){
            return this.templateContent[i]
          }
        }

      }else{
        return false;
      }
    },
    getContentType(type){
      switch(type){
        case 1:
          return '影视';
          break;
        case 2:
          return '直播';
          break;
        case 3:
          return '广告';
          break;
        case 4:
          return '购物';
          break;
        case 5:
          return '服务';
          break;
        case 6:
          return '周边';
          break;
      }
    },
    getSmartContentType(type){
      // 1-LOGO区域, 2-广告区域, 3-应用区域, 4-背景
      switch(type){
        case 1:
          return 'LOGO区域';
          break;
        case 2:
          return '广告区域';
          break;
        case 3:
          return '应用区域';
          break;
        case 4:
          return '背景';
          break;
        
      }
    },
    setThisIndex(i, index){
      console.log(i,index);
      this.collapseInds = [i,index];
    },
    handleChange(val){
      console.log(val);
      console.log(this.collapseArr);
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
                
        let str = JSON.stringify(value)
        this.dataList = JSON.parse(str).list;
        this.total = value.total;
        if(this.thisInd!=2){
          for(let i = 0;i<value.list.length;i++){
            for(let j = 0;j<value.list[i].imgs.length;j++){
              this.dataList[i].imgs = [];
              if(this.thisInd!=2){
                if(value.list[i].imgs[j].size == this.filterForm.imgSizes[0]){
                  this.dataList[i].imgs = value.list[i].imgs[j];
                  break;
                }
              }else{
                if((value.list[i].imgs[j].size == this.filterForm.imgSizes[0])||(value.list[i].imgs[j].size == this.filterForm.imgSizes[1])){
                  this.dataList[i].imgs.push(value.list[i].imgs[j]);
                }
              }
            }
            this.dataList[i].checked = (this.thisInd!=2)?false:0;
          }
        }else{
          for(let i = 0;i<value.list.length;i++){
            this.dataList[i].checked = (this.thisInd!=2)?false:0;

          }
        }
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
        
        // if(this.templateContentIndex!=''){
        //   tpObj.templateContentList[this.templateContentIndex] = this.templateContent;
        // }else{
        //   tpObj.templateContentList = [this.templateContent]
        // }
        tpObj.templateContentList[this.getTemplateContentListIndex()] = this.templateContent;
      }else{
        for(let i in this.smartPageList){
          if(this.smartPageList[i].smartContentType == 2){
            if(this.smartPageList[i].contentSecondPageBOList.length<1){
              return this.$message.error('广告区域不能为空');
            }else if(this.smartPageList[i].contentSecondPageBOList.length>8){
              this.smartPageList[i].contentSecondPageBOList.length = 8;
            }
          }else if(this.smartPageList[i].smartContentType == 3){
            for(let j in this.smartPageList[i].contentSecondPageBOList){
              if(!this.smartPageList[i].contentSecondPageBOList[j].contentId){
                return this.$message.error('应用区域不能为空');

              }
            }
          }else if(this.smartPageList[i].smartContentType == 1){
            if(this.smartPageList[i].contentSecondPageBOList.length!=1){
              return this.$message.error('logo区域不能为空');
            }
          }else if(this.smartPageList[i].smartContentType == 4){
            if(this.smartPageList[i].contentSecondPageBOList.length!=1){
              return this.$message.error('背景图不能为空');
            }
          }
        }
        let list4 = {}
        let str = JSON.stringify(this.smartPageList);
        list4.pageContentType = 4;
        list4.smartPageList = JSON.parse(str);
        for(let i in this.secondPageFlagList){
          for(let j in this.secondPageFlagList[i]){
            if(!this.secondPageFlagList[i][j]){
              if(list4.smartPageList[i].contentSecondPageBOList[j]){
                list4.smartPageList[i].contentSecondPageBOList[j].secondPageId = null;
              }
            }
          }
        }
        // if(this.templateContentIndex!=''){
        //   tpObj.templateContentList[this.templateContentIndex] = list4;
        // }else{
        //   tpObj.templateContentList = [list4]
        // }
        tpObj.templateContentList[this.getTemplateContentListIndex()] = list4;

        
      }
      window.sessionStorage.templateObj = JSON.stringify(tpObj);
      this.goBack();
    },
    getTemplateContentListIndex(){
      let tpObj = JSON.parse(window.sessionStorage.templateObj)
      if((typeof tpObj.templateContentList == 'object')&&tpObj.templateContentList.length>0){
        let flag = false;
        for(let i = 0; i<tpObj.templateContentList.length;i++){
          if(tpObj.templateContentList[i].pageContentType==this.thisInd){
            flag=true;
            return i;
          }
        }
        if(!flag){
          return tpObj.templateContentList.length;
        }
      }else{
        return 0;
      }
    },
    showAndGetData(type,size,checked){
      this.pageIndex = 0;
      this.dialogVisible = true;
      this.filterForm.imgSizes = size;
      this.filterForm.showModes = [type];
      this.filterForm.contentTypes = [0];
      this.dialogChecked = checked;
      this.queryData();

    },
    itemClick(index,item){
      
      if(this.dialogChecked){
        for(let i in this.dataList){
          this.dataList[i].checked = false;
        }
        this.dataList[index].checked = !this.dataList[index].checked;
      }else{
        this.dataList[index].checked = !this.dataList[index].checked;

      }
      
      console.log(item.checked);
    },
    takeImgData(){
      if(this.thisInd!=4){
        if(this.thisInd!=2){
          for(let i in this.dataList){
            if(this.dataList[i].checked){
              this.contentMapper1 = this.dataList[i]
              break;
            }
          }
          this.templateContent.pageContentType = this.thisInd;
          this.templateContent.contentId = this.contentMapper1.id;
          this.templateContent.contentImgUrl = this.contentMapper1.imgs.imgUrl;
          this.templateContent.imgId = this.contentMapper1.imgs.id;
          
          this.templateContent.smartPageList = null;
        }else{
          this.contentMapper1 = this.dataList[Number(this.videoChecked)]
          this.templateContent.pageContentType = this.thisInd;
          this.templateContent.contentId = this.contentMapper1.id;
          this.templateContent.contentImgUrl = this.contentMapper1.imgs[Number(this.contentMapper1.checked)].imgUrl;
          this.templateContent.imgId = this.contentMapper1.imgs[Number(this.contentMapper1.checked)].id;

          this.templateContent.smartPageList = null;
        }

        
      }else{
        if(this.collapseInds[0]!=1){
          
          for(let i in this.dataList){
            if(this.dataList[i].checked){
              this.contentMapper1 = this.dataList[i]
              break;
            }
          }
          this.smartPageList[this.collapseInds[0]].smartContentType = this.collapseInds[0]+1;
          this.smartPageList[this.collapseInds[0]].contentSecondPageBOList[this.collapseInds[1]].contentId = this.contentMapper1.id;
          this.smartPageList[this.collapseInds[0]].contentSecondPageBOList[this.collapseInds[1]].imgId = this.contentMapper1.imgs.id;
          this.smartPageList[this.collapseInds[0]].contentSecondPageBOList[this.collapseInds[1]].contentOrder = this.collapseInds[1]+1;
          this.smartPageList[this.collapseInds[0]].contentSecondPageBOList[this.collapseInds[1]].contentImgUrl = this.contentMapper1.imgs.imgUrl;
        }else{
          // this.contentMapper2 = []
          for(let i in this.dataList){
            if(this.dataList[i].checked){
              this.contentMapper2.push(this.dataList[i]);
            
            }
          }
          this.smartPageList[this.collapseInds[0]].smartContentType = this.collapseInds[0]+1;
          if(typeof this.smartPageList[this.collapseInds[0]].contentSecondPageBOList != 'object'){
            this.smartPageList[this.collapseInds[0]].contentSecondPageBOList = []

          }
          // let toolArr = [];
          for(let j in this.contentMapper2){
            let obj = new Object();
            obj.contentId = this.contentMapper2[j].id;
          
              if(this.contentMapper2[j].imgs.size==this.filterForm.imgSizes[0]){
                obj.imgId = this.contentMapper2[j].imgs.id;
                obj.contentImgUrl = this.contentMapper2[j].imgs.imgUrl;

              }
            
            obj.contentOrder = this.collapseInds[1]+1;
            this.smartPageList[this.collapseInds[0]].contentSecondPageBOList.push(obj);
          }
          
        }
      }
     
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
          object-fit: cover;
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
  .content-box-left{
    width: 300px;
    box-sizing: border-box;
  }
  .content-box-right{
    width: calc(100% - 300px);
    box-sizing: border-box;

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
