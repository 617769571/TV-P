<template>
  <div class="device-detail app-container">
    <!-- title-box使用的全局样式 -->
    <div class="title-box">
      <div class="device-title">门店设备详情</div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/ottInfo/deviceList' }">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>门店设备详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content-container">
      <div class="store-info">
        <div class="store-title">门店信息</div>
        <div class="store-list">
          <el-row>
            <el-col :span="6"><div class="label-name">品牌：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.brandName }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">门店编号：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.internalId }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">门店外部编号：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.externalId || '--' }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">门店名称：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.name }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">合作状态：</div></el-col>
            <el-col :span="18"><div class="value">{{ PARTNERSHIP_STATUS[storeInfo.partnershipStatus] }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">区域经理：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.regionManagerName || '--' }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">门店地址：</div></el-col>
            <el-col :span="18"><div class="value">{{ [storeInfo.provinceName, storeInfo.cityName, storeInfo.districtName, storeInfo.address].join('&nbsp;') }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">联系方式：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.contactNumber }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="6"><div class="label-name">邮箱地址：</div></el-col>
            <el-col :span="18"><div class="value">{{ storeInfo.email || '--' }}</div></el-col>
          </el-row>
        </div>
      </div>

      <div class="device-info">
        <div class="table-title">门店设备信息</div>
        <el-table :data="storeList" stripe border class="device-table" @sort-change="handleSortChanged" @filter-change="filterChanged">
          <el-table-column :index="indexMethod" type="index" width="50"/>
          <el-table-column prop="roomNo" label="房间号" width="100" sortable/>
          <el-table-column
            :column-key="'roomTypeName'"
            :filter-multiple="false"
            :filters="roomTypeNames"
            :filter-method="filterRoomTypeName"
            prop="roomTypeName"
            label="房间类型"
            width="100"/>
          <el-table-column prop="deviceBrand" label="终端品牌" width="130"/>
          <el-table-column prop="deviceModel" label="终端型号" width="130"/>
          <el-table-column prop="deviceUuid" label="终端UUID" width="360">
            <template slot-scope="scope">
              <span class="has-underline" @click="showDeviceDetail(scope.row)">{{ scope.row.deviceUuid }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="apkVersion" label="apk版本号" width="180"/>
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
        </el-table>
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
    <device-detail-dialog :dialog-data="dialogData" :need-show="needShow" @close="showDialog"/>
  </div>
</template>

<script>
import DeviceDetailDialog from '../dialog/device-detail-dialog.vue'
import { STORE_DEVICE_DETAIL, DEVICE_DETAIL, GET_DEVICE_LIST } from '@/api/device/deviceManage'
import { GET_ALL_ROOM_TYPE } from '@/api/storeManage/storeManage'
import PARTNERSHIP_STATUS from '@/constants/PARTNERSHIP_STATUS'
import RoomTypeConfig from '@/constants/room-type-config'
export default {
  name: 'StoreDetail',
  components: {
    DeviceDetailDialog
  },
  data() {
    return {
      condition: {
        roomTypeName: null,
        status: null
      },
      roomTypeNames: [],
      storeInfo: {},
      needShow: false,
      storeList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      dialogData: {},
      PARTNERSHIP_STATUS,
      RoomTypeConfig,
      storeId: '',
      sortType: null
    }
  },
  beforeRouteEnter(to, from, next) {
    const storeId = to.params.storeId
    const fPath = from.path
    if (storeId) {
      next()
    } else {
      next(fPath)
    }
  },
  mounted() {
    this.storeId = this.$route.params.storeId
    this.getStoreDeviceDetail(this.storeId)
    this.getStoreDevices({ storeId: this.storeId })
    this.getAllRoomType()
  },
  methods: {
    handleSortChanged({ column, prop, order }) {
      this.sortType = order
      this.queryData(this.condition)
    },
    getAllRoomType() {
      GET_ALL_ROOM_TYPE().then(value => {
        this.filterStoreData(value, 'typeName', 'roomTypeNames')
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
      console.log(this.condition, filters)
      const key = Object.keys(filters)[0]
      if (!filters[key].length) {
        this.condition[key] = null
      } else {
        this.condition[key] = filters[key][0]
      }
      this.queryData(this.condition)
    },
    queryData(filterData) {
      const request = { storeId: this.storeId }
      if (JSON.stringify(filterData) === '{}') {
        this.getStoreDevices(request)
        return
      }
      if (Number.isSafeInteger(filterData.roomTypeName)) {
        filterData.roomTypeName = RoomTypeConfig[filterData.roomTypeName]
      }
      for (const p in filterData) {
        if (filterData[p] && p !== 'storeId') {
          request[p] = filterData[p]
        }
      }
      this.getStoreDevices(request)
    },
    showDeviceDetail(rowData) {
      DEVICE_DETAIL({ deviceUuid: rowData.deviceUuid }).then(value => {
        this.needShow = true
        this.dialogData = value
      }).catch(() => {})
    },
    showDialog(prop, value) {
      this[prop] = value
    },
    getStoreDeviceDetail(storeId) {
      STORE_DEVICE_DETAIL(storeId).then(value => {
        this.storeInfo = value
      }).catch(() => {
        this.storeInfo = {}
      })
    },
    getStoreDevices(data, pageIndex = this.pageIndex - 1, pageSize = this.pageSize) {
      if (Number.isSafeInteger(data.roomTypeName)) {
        data.roomTypeName = RoomTypeConfig[data.roomTypeName]
      }
      GET_DEVICE_LIST(data, pageIndex, pageSize, this.sortType).then(value => {
        this.storeList = value.list
        this.total = value.total
        if (!this.total || !value.list.length) {
          this.pageIndex = 1
          GET_DEVICE_LIST(data, this.pageIndex - 1, this.pageSize, this.sortType).then(value => {
            this.storeList = value.list
            this.total = value.total
          })
        }
      }).catch(() => {})
    },
    filterStoreData(array, key, targetKey) {
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
    pageChanged(value) {
      this.pageIndex = value
      const data = {}
      for (const p in this.condition) {
        if (!this.condition[p]) continue
        data[p] = this.condition[p]
      }
      this.getStoreDevices(Object.assign(data, { storeId: this.storeId }))
    },
    sizeChanged(pageSize) {
      this.pageSize = pageSize
      this.getStoreDevices({ storeId: this.storeId })
    },
    indexMethod(index) {
      return index + 1
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/variables.scss";
.device-detail {
  .title {
    font-family: $font-family;
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0;
    color: #676a6c;
    margin-bottom: 16px;
  }
  $bdc: #e7eaec;
  .base {
    border-top: 4px solid $bdc;
    background-color: #fff;
  }
  .device-title {
    @extend .title;
  }
  .store-info {
    @extend .base;
    margin-bottom: 30px;
    .store-title {
      @extend .title;
      border-bottom: 2px solid lighten($bdc, 5%);
      padding: 10px 20px;
    }
    .store-list {
      padding: 10px 20px;
      .label-name, .value {
        color: #676a6c;
        font-size: 13px;
        height: 24px;
        line-height: 24px;
      }
      .label-name {
        font-weight: bold;
      }
    }
  }
  .device-info {
    @extend .base;
    padding: 10px 20px 30px;
    .table-title {
      @extend .title;
    }
  }
  .device-table {
    margin-bottom: 20px;
  }
}
</style>
