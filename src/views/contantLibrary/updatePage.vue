<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">内容库管理>{{editOrAddFlag?'编辑':'新建'}}内容</span>
      <!-- <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span> -->
    </div>
    <div class="content-container">
      <el-form ref="editForm" :model="editForm" :rules="editRules">
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
        <el-form-item :label-width="labelWidth" label="展现形式" prop="roomNo">
          <el-radio-group v-model="editForm.roomNo">
            <el-radio-button :disabled="editOrAddFlag" label="1">图片</el-radio-button>
            <el-radio-button :disabled="editOrAddFlag" label="2">视频</el-radio-button>
          </el-radio-group>
          <el-form-item v-if="editForm.roomNo==1" :label-width="labelWidth" label="上传图片：" prop="images"></el-form-item>
          <el-form-item v-if="editForm.roomNo==2" :label-width="labelWidth" label="上传视频：" prop="videos">
            
          </el-form-item>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="触发方式" prop="roomType">
          <el-select v-model="editForm.roomType" placeholder="请选择触发方式">
            <el-option v-for="(rt, index) in roomTypeNames" :key="index" :label="rt.text" :value="rt.value">
              {{ rt.text }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="editForm.roomType==1" :label-width="labelWidth" label="目标URL" prop="uuid">
          <el-input placeholder="请输入内容" v-model="editForm.uuid" class="input-with-select">
            <el-select v-model="editForm.http" slot="prepend" placeholder="请选择">
              <el-option label="Http://" value="Http://"></el-option>
              <el-option label="Https://" value="Https://"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item v-if="editForm.roomType==2" :label-width="labelWidth" label="应用" prop="uuid">
          <el-select v-model="editForm.uuid" placeholder="请选择触发方式">
            <el-option v-for="(rt, index) in applications" :key="index" :label="rt.text" :value="rt.value">
              {{ rt.text }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="cancelSubmit('editForm', 'editVisible')">取消</el-button>
        <el-button class="btn-primary" size="medium" @click="submitEdit">确定</el-button>
      </div>
    </div>
  
  </div>
</template>

<script>
import EnabledType from './types/enable-type'
import { Message } from 'element-ui'
import DeviceDetailDialog from './dialog/device-detail-dialog.vue'
import {
  GET_MODEL_LIST,
  GET_DEVICE_LIST,
  GET_STORES,
  GET_CONTANT_FIND,
  CHANGE_DEVICE_STATUS,
  UPDATE_INFO,
  DEVICE_DETAIL,
  REGISTER_CHECK,
  REGISTER_DEVICE
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
    const validateRoomTypeA = (rule, value, callback) => {
      if ((Number.isSafeInteger(value * 1) && ('' + value)).trim().length < 1) {
        this.addForm.roomType = ''
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
      contentTypes:[{ text: '影视', value: 1 }, { text: '直播', value: 2 }, { text: '广告', value: 3 }, { text: '购物', value: 4 }, { text: '服务', value: 5 }, { text: '周边', value: 6 }],
      editRules: {
        storeName: [{ required: true, trigger: 'blur', validator: validateStoreNameE }],
        brandCode: [{ required: true, trigger: 'blur', validator: validateBrandCodeE }],
        typeCode: [{ required: true, trigger: 'blur', validator: validateTypeCodeE }],
        roomNo: [{ required: true, trigger: 'blur', validator: validateRoomNoE }],
        roomType: [{ required: true, trigger: 'blur', validator: validateRoomTypeE }],
        uuid: [{ required: true, trigger: 'blur', validator: validateUuidE }]
      },
      addRules: {
        storeId: [
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
        storeId: '',
        storeName: '',
        brandCode: '',
        typeCode: '',
        model: '',
        roomNo: 1,
        roomType: '',
        uuid: '',
        linkAdd:'',
        http:''
      },
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
        http:''
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
        {
          text:'爱奇艺',
          value:'1'
        },{
          text:'腾讯视频',
          value:'2'
        },{
          text:'Bilibili',
          value:'3'
        },{
          text:'优酷',
          value:'4'
        },
        
      ],
      contId:''
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
    this.editOrAddFlag = this.$route.query.edit;
    if(this.editOrAddFlag){
      this.contId = this.$route.query.id;
    }
  },
  methods: {
    filterData(array, key, targetKey) {
      if (!Array.isArray(array)) return
      const set = new Set()
      const res = []
      for (const item of array) {
        const name = item[key]
        if (set.has(name)) continue
        set.add(name)
        res.push({ text: name, value: item.typeCode })
      }
      this[targetKey] = res
    },
    // getAllRoomType() {
    //   GET_ALL_ROOM_TYPE().then(value => {
    //     this.filterData(value, 'typeName', 'roomTypeNames')
    //   }).catch(() => {})
    // },
    handleBrandChange(val) {
      this.deviceModels = []
      if (!val) {
        this.filterForm.deviceModel = ''
        return
      }
      GET_MODEL_LIST(val).then(deviceModels => {
        this.deviceModels = deviceModels
      }).catch(() => {
        this.deviceModels = []
      })
    },
    handleBrandChangeAdd(val) {
      this.deviceModels = []
      if (!val) {
        return
      }
      GET_MODEL_LIST(val).then(deviceModels => {
        this.deviceModels = deviceModels
        this.addForm.typeCode = ''
      }).catch(() => {
        this.deviceModels = []
      })
    },
    handleBrandChangeEdit(val) {
      this.editForm.typeCode = ''
      this.deviceModels = []
      if (!val) {
        return
      }
      GET_MODEL_LIST(val).then(deviceModels => {
        this.deviceModels = deviceModels
        this.editForm.typeCode = ''
      }).catch(() => {
        this.deviceModels = []
      })
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
    showDeviceDetail(rowData) {
      DEVICE_DETAIL({ deviceUuid: rowData.deviceUuid }).then(value => {
        this.needShow = true
        this.dialogData = value
      }).catch(() => {})
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.queryData()
    },
 
  
    submitEnableType(status) {
      if (this.multipleSelection.length === 0) {
        Message.info('应当选择一条数据')
        return
      }
      // 获取选中的单元格行数据
      const uSet = new Set()
      for (const item of this.multipleSelection) {
        if (item.deviceUuid) {
          uSet.add(item.deviceUuid)
        }
      }
      CHANGE_DEVICE_STATUS([...uSet], { status: status })
        .then(value => value)
        .catch(() => {})
        .finally(() => {
          this.queryForm('filterForm', Object.assign({}, this.condition, this.filterForm))
        })
      this.enableType = EnabledType.NONE
    },
 

    handleStoreName(storeId, form) {
      const result = this.selStoreList.filter(item => item.value === storeId)
      const name = result[0] && result[0].key || ''
      if (!result.length || !name) {
        Message({ showClose: true, message: '门店名称不能为空', type: 'error' })
        return
      }
      this[form].storeName = name
      this[form].storeId = storeId
    },
    submitAdd() {
      if (JSON.stringify(this.addForm) === '{}') {
        Message({ showClose: true, message: '必填字段不能为空', type: 'error' })
        return
      }
      const name = this.addForm.storeName || ''
      if (!name && !name.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '门店名称不能为空', type: 'error' })
        return
      }
      const brandCode = this.addForm.brandCode || ''
      if (!brandCode && !brandCode.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '设备品牌不能为空', type: 'error' })
        return
      }
      const typeCode = this.addForm.typeCode || ''
      if (!typeCode && !typeCode.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '设备型号不能为空', type: 'error' })
        return
      }
      const roomNo = this.addForm.roomNo || ''
      if (!roomNo && !roomNo.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '房间号不能为空', type: 'error' })
        return
      }
      const roomType = this.addForm.roomType || ''
      if (!roomType && !roomType.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '设备房间类型不能为空', type: 'error' })
        return
      }
      const uuid = this.addForm.uuid || ''
      if (!uuid && !uuid.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: 'uuid不能为空', type: 'error' })
        return
      }
      // 检查是否已经存在
      REGISTER_CHECK(this.addForm.uuid).then(result => {
        if (result.value) {
          Message({ showClose: true, message: '此设备已注册', type: 'error' })
          return
        }
        // 注册
        REGISTER_DEVICE({
          brandCode: this.addForm.brandCode,
          typeCode: this.addForm.typeCode,
          roomNo: this.addForm.roomNo,
          roomType: this.addForm.roomType,
          storeId: this.addForm.storeId,
          uuid: this.addForm.uuid
        }).then(value => {
          this.resetForm('addForm')
          this.deviceModels = []
          Message({ showClose: true, message: '添加成功', type: 'success' })
        }).catch(() => {
          this.resetForm('addForm')
          this.deviceModels = []
          Message({ showClose: true, message: '添加失败', type: 'error' })
        }).finally(() => {
          this.addVisible = false
        })
      })
    },
    checkSelection() {
      if (this.multipleSelection.length < 1) {
        Message.info('选择一条数据')
        return
      }
      return true
    },
    handleEdit(data) {
      this.editOrAddFlag = false;
      this.editVisible = true;
      GET_ROOM_TYPE({ storeId: data.storeId }).then(value => {
        this.roomTypes = value
        this.editForm.storeName = data.storeName
        this.editForm.storeId = data.storeId
        this.editForm.brandCode = data.deviceBrand
        this.editForm.typeCode = data.deviceModel
        this.editForm.roomNo = data.roomNo
        this.editForm.roomType = (() => {
          switch (data.roomTypeName) {
            case '智能电视':
              return 1001
            case '影音房':
              return 1002
          }
        })()
        this.editForm.uuid = data.deviceUuid
        this.editForm.devicesId = data.deviceId
      })
    },
    showDialog(prop, value) {
      if(prop == 'addVisible'){
        this.editOrAddFlag = true;
      }else{
        this.editOrAddFlag = false;
      }
      this[prop] = value
    },
    cancelSubmit(form, visibleType) {
      this[visibleType] = false
      this.resetForm(form)
    },
    handleCloseE(done) {
      this.resetForm('editForm')
      done()
    },
    handleCloseA(done) {
      this.resetForm('addForm')
      done()
    },
    submitEdit() {
      let result = {}
      for (const item of this.roomTypes) {
        if (item && item.typeCode === this.editForm.roomType && !item.status) {
          result = item
          break
        }
      }
      if (result.typeCode) {
        Message({ showClose: true, message: '当前门店尚未开启' + result.typeName + '业务', type: 'error' })
        return
      }
      if (JSON.stringify(this.editForm) === '{}') {
        Message({ showClose: true, message: '必填字段不能为空', type: 'error' })
        return
      }
      const name = this.editForm.storeName || ''
      if (!name && !name.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '门店名称不能为空', type: 'error' })
        return
      }
      const brandCode = this.editForm.brandCode || ''
      if (!brandCode && !brandCode.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '设备品牌不能为空', type: 'error' })
        return
      }
      const brandModel = this.editForm.typeCode || ''
      if (!brandModel && !brandModel.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '设备型号不能为空', type: 'error' })
        return
      }
      const roomNo = this.editForm.roomNo || ''
      if (!roomNo && !roomNo.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '房间号不能为空', type: 'error' })
        return
      }
      const roomType = this.editForm.roomType || ''
      if (!roomType && !roomType.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: '设备房间类型不能为空', type: 'error' })
        return
      }
      const uuid = this.editForm.uuid || ''
      if (!uuid && !uuid.replace(/\s+$|^\s+/, '')) {
        Message({ showClose: true, message: 'uuid不能为空', type: 'error' })
        return
      }
      // 校验是否已经开通`电视门户/影音房`业务
      GET_ROOM_TYPE({ storeId: this.editForm.storeId }).then(value => {
        for (let i = 0; i < value.length; i++) {
          const item = value[i]
          if (!item.status && item.typeCode === this.editForm.roomType) {
            return Message({ showClose: true, message: '当前门店尚未开启' + item.typeName + '业务', type: 'error' })
          }
        }
        // 开通过则可更新数据
        UPDATE_INFO({
          brandCode: this.editForm.brandCode,
          typeCode: this.editForm.typeCode,
          devicesId: this.editForm.devicesId,
          roomNo: this.editForm.roomNo,
          roomType: this.editForm.roomType,
          storeId: this.editForm.storeId,
          uuid: this.editForm.uuid
        }).then(value => {
          this.editVisible = false
          this.resetForm('editForm')
          this.queryData()
        }).catch(() => {})
      })
    },
    searchStoreList(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          GET_STORES(query).then(value => {
            this.selStoreList = value.filter(item => {
              return item.key.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.selStoreList = []
      }
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
}
</style>
