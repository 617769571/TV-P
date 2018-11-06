<template>
  <div class="device-list app-container">
    <div class="title-box">
      <span class="main-title">设备管理列表</span>
      <span class="device-tip">（点击门店名称查看门店详情、点击终端UUID查看设备详情）</span>
    </div>
    <div class="content-container">
      <div class="detail-content">
        <div class="select-wrapper">
          <div class="select-box">
            <el-row>
              <el-col :span="20">
                <el-form ref="filterForm" :model="filterForm" :inline="true" label-width="100px" class="filter-form">
                  <el-form-item label="" prop="internalId">
                    <el-input v-model="filterForm.internalId" size="medium" placeholder="门店编号/门店外部编号"/>
                  </el-form-item>
                  <el-form-item label="" prop="storeId">
                    <!-- 点击清空表单数据 -->
                    <el-select
                      v-model="filterForm.storeId"
                      :remote-method="searchStoreList"
                      :loading="loading"
                      remote
                      clearable
                      filterable
                      size="medium"
                      placeholder="请输入门店名称或关键字"
                      @focus="selStoreList = []">
                      <el-option v-for="(item, index) in selStoreList" :key="index" :label="item.key" :value="item.value"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="deviceBrand">
                    <el-select
                      v-model="filterForm.deviceBrand"
                      clearable
                      filterable
                      size="medium"
                      placeholder="设备品牌"
                      @change="handleBrandChange"
                      @blur="handleBrandChange(filterForm.deviceBrand)">
                      <el-option v-for="item in deviceBrands" :key="item" :value="item"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="filterForm.deviceBrand" label="" prop="deviceModel">
                    <el-select v-model="filterForm.deviceModel" clearable filterable size="medium" placeholder="设备型号">
                      <el-option v-for="item in deviceModels" :key="item" :value="item"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="roomNo">
                    <el-input v-model="filterForm.roomNo" size="medium" placeholder="请输入房间号"/>
                  </el-form-item>
                  <el-form-item label="" prop="deviceUuid">
                    <el-input v-model="filterForm.deviceUuid" size="medium" placeholder="UUID"/>
                  </el-form-item>
                  <el-form-item label="" prop="apkVersion">
                    <el-input v-model="filterForm.apkVersion" size="medium" placeholder="精确输入apkVersion" title="apkVersion仅支持精确查询"/>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="4">
                <el-button size="medium" class="btn-primary" @click="queryData">查询</el-button>
                <el-button size="medium" class="btn-default" @click="resetForm('filterForm')">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="buttons">
          <el-button size="small" class="btn-primary" @click="showDialog('addVisible', true)">添加设备</el-button>
          <el-button :disabled="multipleSelection.length < 1" type="warning" size="small" @click="enableDevice">启用设备</el-button>
          <el-button :disabled="multipleSelection.length < 1" type="danger" size="small" @click="disabledDevice">禁用设备</el-button>
        </div>
        <div class="device-table-wrapper">
          <el-table :data="dataList" stripe border class="device-table" @sort-change="handleSortChanged" @selection-change="handleSelectionChange" @filter-change="filterChanged">
            <el-table-column type="selection"/>
            <el-table-column prop="internalId" label="门店编号" width="80"/>
            <el-table-column prop="externalId" label="门店外部编号" width="100"/>
            <el-table-column prop="storeName" label="门店名称" width="160">
              <template slot-scope="scope">
                <span class="has-underline" @click="navToDeviceDetail(scope.row)">{{ scope.row.storeName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="roomNo" label="房间号" width="90" sortable="'custom'"/>
            <el-table-column
              :column-key="'roomTypeName'"
              :filter-multiple="false"
              :filters="roomTypeNames"
              :filter-method="filterRoomTypeName"
              prop="roomTypeName"
              label="房间类型"
              width="100"/>
            <el-table-column prop="deviceBrand" label="终端品牌" width="130"/>
            <el-table-column prop="deviceModel" label="终端型号" width="120"/>
            <el-table-column prop="deviceUuid" label="终端UUID" width="280">
              <template slot-scope="scope">
                <span class="has-underline" @click="showDeviceDetail(scope.row)">{{ scope.row.deviceUuid }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="apkVersion" label="apk版本号" width="110"/>
            <el-table-column
              :column-key="'status'"
              :filter-multiple="false"
              :filters="[{text: '启用', value: 2}, {text: '禁用', value: 4}]"
              :filter-method="filterStatus"
              prop="status"
              label="状态"
              width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.status === 2 ? '启用' : scope.row.status === 4 ? '禁用' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="edit" label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="btn-primary" @click="handleEdit(scope.row)">编辑</el-button>
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

    <device-detail-dialog :dialog-data="dialogData" :need-show="needShow" @close="showDialog"/>

    <el-dialog :before-close="handleCloseE" :close-on-click-modal="false" :visible.sync="editVisible" class="edit-form" title="设备编辑">
      <el-form ref="editForm" :model="editForm" :rules="editRules">
        <el-form-item :label-width="labelWidth" label="所属门店" prop="storeName">
          <el-select
            v-model="editForm.storeName"
            :remote-method="searchStoreList"
            :loading="loading"
            remote
            clearable
            filterable
            placeholder="请输入门店名称或关键字"
            @change="handleStoreName($event, 'editForm')">
            <el-option v-for="(item, index) in selStoreList" :key="index" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备品牌" prop="brandCode">
          <el-select v-model="editForm.brandCode" placeholder="请选择设备品牌" @change="handleBrandChangeEdit">
            <el-option v-for="item in deviceBrands" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备型号" prop="typeCode">
          <el-select v-model="editForm.typeCode" placeholder="请选择设备型号" @focus="handleBrandChangeEdit(editForm.brandCode)">
            <el-option v-for="item in deviceModels" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="房间号" prop="roomNo">
          <el-input v-model="editForm.roomNo" placeholder="请输入房间号"/>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备房间类型" prop="roomType">
          <el-select v-model="editForm.roomType" placeholder="请选择设备房间类型">
            <el-option v-for="(rt, index) in roomTypes" :key="index" :label="rt.typeName" :value="rt.typeCode">
              {{ rt.typeName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备UUID" prop="uuid">
          <el-input :value="editForm.uuid" disabled placeholder="请输入设备UUID"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="cancelSubmit('editForm', 'editVisible')">取消</el-button>
        <el-button class="btn-primary" size="medium" @click="submitEdit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :before-close="handleCloseA" :close-on-click-modal="false" :visible.sync="addVisible" class="edit-form" title="添加设备">
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item :label-width="labelWidth" label="所属门店" prop="storeId">
          <el-select
            v-model="addForm.storeId"
            :remote-method="searchStoreList"
            :loading="loading"
            remote
            clearable
            filterable
            placeholder="请输入门店名称或关键字"
            @change="handleStoreName($event, 'addForm')">
            <el-option v-for="(item, index) in selStoreList" :key="index" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备品牌" prop="brandCode">
          <el-select v-model="addForm.brandCode" placeholder="请选择设备品牌" @change="handleBrandChangeAdd">
            <el-option v-for="item in deviceBrands" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addForm.brandCode" :label-width="labelWidth" label="设备型号" prop="typeCode">
          <el-select v-model="addForm.typeCode" placeholder="请选择设备型号">
            <el-option v-for="item in deviceModels" :key="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="房间号" prop="roomNo">
          <el-input v-model="addForm.roomNo" placeholder="请输入房间号"/>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备房间类型" prop="roomType">
          <el-select v-model="addForm.roomType" placeholder="请选择设备房间类型">
            <el-option v-for="(rt, index) in roomTypeNames" :key="index" :label="rt.text" :value="rt.value">
              {{ rt.text }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="设备UUID" prop="uuid">
          <el-input v-model="addForm.uuid" placeholder="请输入设备UUID"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button class="btn-default" size="medium" @click="cancelSubmit('addForm', 'addVisible')">取消</el-button>
        <el-button class="btn-primary" size="medium" @click="submitAdd">确定</el-button>
      </div>
    </el-dialog>

    <!-- 启用/禁用设备 -->
    <el-dialog
      :show-close="false"
      :visible="enableVisible"
      title="设备状态"
      class="enable-status-dialog"
      width="30%"
      center>
      <div class="enable-text">{{ enableText }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="btn-default" @click="enableType = EnabledType.NONE">取消</el-button>
        <el-button size="medium" class="btn-primary" type="primary" @click="submitEnableType(enableType)">确定</el-button>
      </span>
    </el-dialog>
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
  GET_DEVICE_BRAND,
  CHANGE_DEVICE_STATUS,
  UPDATE_INFO,
  DEVICE_DETAIL,
  REGISTER_CHECK,
  REGISTER_DEVICE
} from '@/api/device/deviceManage'
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
        callback(new Error('门店名称不能为空'))
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
      editRules: {
        storeName: [{ required: true, trigger: 'blur', validator: validateStoreNameE }],
        brandCode: [{ required: true, trigger: 'blur', validator: validateBrandCodeE }],
        typeCode: [{ required: true, trigger: 'blur', validator: validateTypeCodeE }],
        roomNo: [{ required: true, trigger: 'blur', validator: validateRoomNoE }],
        roomType: [{ required: true, trigger: 'blur', validator: validateRoomTypeE }],
        uuid: [{ required: true, trigger: 'blur', validator: validateUuidE }]
      },
      addRules: {
        brandCode: [{ required: true, trigger: 'blur', validator: validateBrandCodeA }],
        typeCode: [{ required: true, trigger: 'blur', validator: validateTypeCodeA }],
        roomNo: [{ required: true, trigger: 'blur', validator: validateRoomNoA }],
        roomType: [{ required: true, trigger: 'blur', validator: validateRoomTypeA }],
        uuid: [{ required: true, trigger: 'blur', validator: validateUuidA }]
      },
      dialogData: {},
      multipleSelection: [],
      EnabledType,
      enableType: EnabledType.NONE, // 启用/禁用设备
      labelWidth: '120px',
      editVisible: false,
      addVisible: false,
      editForm: {
        storeName: '',
        storeId: '',
        brandCode: '',
        typeCode: '',
        roomNo: '',
        roomType: 0,
        uuid: '',
        devicesId: ''
      },
      addForm: {
        storeId: '',
        storeName: '',
        brandCode: '',
        typeCode: '',
        model: '',
        roomNo: '',
        roomType: '',
        uuid: ''
      },
      needShow: false,
      pageIndex: 1,
      pageSize: 20,
      deviceBrands: [],
      deviceModels: [],
      filterForm: {
        internalId: '',
        storeId: '',
        deviceBrand: '',
        deviceModel: '',
        roomNo: '',
        deviceUuid: '',
        apkVersion: ''
      },
      dataList: [],
      total: 0,
      roomTypeNames: [], // 设备管理列表表格筛选
      storeNames: [],
      selStoreList: [], // 编辑对话框/所属门店
      loading: false,
      roomTypes: [], // 编辑对话框/设备房间类型
      condition: {
        roomTypeName: null,
        status: null
      },
      RoomTypeConfig,
      sortType: null
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
    // 获取品牌
    this.getDeviceBrands()
    // 首次获取前20条数据
    this.fetchData({})
    // 获取所有房间类型
    this.getAllRoomType()
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
    getAllRoomType() {
      GET_ALL_ROOM_TYPE().then(value => {
        this.filterData(value, 'typeName', 'roomTypeNames')
      }).catch(() => {})
    },
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
    getDeviceBrands() {
      GET_DEVICE_BRAND().then(value => {
        this.deviceBrands = value
      }).catch(() => {})
    },
    filterRoomTypeName(value, row, column) {
      const property = column['property']
      this.condition.roomTypeName = value
      return row[property] === RoomTypeConfig[value]
    },
    filterStatus(value, row, column) {
      const property = column['property']
      this.condition.status = value
      return row[property] === value
    },
    filterChanged(filters) {
      const key = Object.keys(filters)[0]
      if (!filters[key].length) {
        this.condition[key] = null
      } else {
        this.condition[key] = filters[key][0]
      }
      this.queryData()
    },
    navToDeviceDetail(rowData) {
      this.$router.push('/ott/storeDetail/' + rowData.storeId)
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
    fetchData(data) { // 获取表格数据
      GET_DEVICE_LIST(data, this.pageIndex - 1, this.pageSize, this.sortType).then(value => {
        this.dataList = value.list
        this.total = value.total
        if (this.total && !value.list.length) {
          this.pageIndex = 1
          GET_DEVICE_LIST(data, this.pageIndex - 1, this.pageSize, this.sortType).then(value => {
            this.dataList = value.list
            this.total = value.total
          })
        }
      }).catch(() => {})
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.queryData()
    },
    queryData() {
      this.queryForm('filterForm', Object.assign({}, this.condition, this.filterForm))
    },
    queryForm(formName, filterData) {
      const data = {}
      if (Number.isSafeInteger(filterData.roomTypeName)) {
        filterData.roomTypeName = RoomTypeConfig[filterData.roomTypeName]
      }
      for (const p in filterData) {
        if (filterData[p]) {
          data[p] = filterData[p]
        }
      }
      // 空对象，不提交数据请求
      if (JSON.stringify(data) === '{}') {
        this.fetchData({})
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fetchData(data)
        } else {
          return false
        }
      })
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
    handleSelectionChange(selections) {
      this.multipleSelection = selections
    },
    handleSortChanged({ column, prop, order }) {
      this.sortType = order
      this.queryForm('filterForm', Object.assign({}, this.condition, this.filterForm))
    },
    enableDevice() {
      if (this.checkSelection()) {
        this.enableType = EnabledType.ENABLED
      }
    },
    disabledDevice() {
      if (this.checkSelection()) {
        this.enableType = EnabledType.DISABLED
      }
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
      this.editVisible = true
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
    padding-right: $pr;
    text-align: right;
  }
  .device-table-wrapper, .pagination-wrapper {
    padding: 15px $pr 15px $pl;
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
  width: 600px;
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
    padding-right: 30px;
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
</style>
