<template>
  <div v-if="needShow" class="device-detail-dialog">
    <div class="dialog-box">
      <div class="dialog-content animated bounceInDown">
        <div class="dialog-header clearfix">
          <span class="device-title">设备详情</span>
          <span class="status">{{ dialogData.status === 2 ? '已启用' : dialogData.status === 4 ? '禁用' : '' }}</span>
          <span class="time">{{ dialogData.updateTime | formatDate }}</span>
        </div>
        <div class="solid-line"/>
        <div class="info-item">
          <div class="info-title"><span>门店信息</span></div>
          <div class="list-content clearfix">
            <el-row :gutter="20" class="list-item">
              <el-col :span="12"><div class="no-wrap">所属集团：{{ dialogData.organizationName }}</div></el-col>
              <el-col :span="12"><div class="no-wrap">所属品牌：{{ dialogData.brandName || '--' }}</div></el-col>
            </el-row>
            <el-row :gutter="20" class="list-item">
              <el-col :span="12"><div class="no-wrap">门店编号：{{ dialogData.internalId }}</div></el-col>
              <el-col :span="12"><div class="no-wrap">门店外部编号：{{ dialogData.externalId || '--' }}</div></el-col>
              <el-col :span="12"><div class="no-wrap">所属门店：{{ dialogData.storeName }}</div></el-col>
            </el-row>
          </div>
        </div>
        <div class="info-item">
          <div class="info-title"><span>设备信息</span></div>
          <div class="list-content clearfix">
            <el-row :gutter="20" class="list-item">
              <el-col :span="14"><div class="no-wrap">设备品牌：{{ dialogData.deviceBrand }}</div></el-col>
              <el-col :span="10"><div class="no-wrap">设备型号：{{ dialogData.deviceModel }}</div></el-col>
            </el-row>
            <el-row :gutter="20" class="list-item">
              <el-col :span="14"><div class="no-wrap">设备UUID：{{ dialogData.deviceUuid }}</div></el-col>
              <el-col :span="10"><div class="no-wrap">安装时间：{{ dialogData.createdTime | formatDate }}</div></el-col>
            </el-row>
            <el-row :gutter="20" class="list-item">
              <el-col :span="14"><div class="no-wrap">APK版本号：{{ dialogData.apkVersion }}</div></el-col>
              <el-col :span="10"><div class="no-wrap">设备状态：{{ dialogData.status === 2 ? '启用' : '禁用' }}</div></el-col>
            </el-row>
          </div>
        </div>
        <div class="info-item">
          <div class="info-title"><span>安装信息</span></div>
          <div class="list-content clearfix">
            <el-row :gutter="20" class="list-item">
              <el-col :span="12"><div class="no-wrap">所属房间：{{ dialogData.roomNo }}</div></el-col>
              <el-col :span="12"><div class="no-wrap">房间类型：{{ dialogData.roomTypeName }}</div></el-col>
            </el-row>
          </div>
        </div>
        <div class="placeholder"/>
        <div class="close-btn" title="关闭" @click="$emit('close', 'needShow', false)">&times;</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
export default {
  name: 'DeviceDetailDialog',
  filters: {
    formatDate(val) {
      return formatTime(val)
    }
  },
  props: {
    'need-show': {
      default: false,
      type: Boolean
    },
    dialogData: {
      default: null,
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
  $font-family: "microsoft yahei", "Avenir", Helvetica, Arial, sans-serif;
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
          /*height: 80px;*/
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
    .no-wrap {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
