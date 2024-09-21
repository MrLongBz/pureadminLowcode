import {
  Edit,
  Select,
  CircleCheck,
  Check,
  Switch,
  Odometer,
  Calendar,
  Star,
  Brush,
  Grid,
  Upload,
  Tickets,
  Stopwatch,
  Timer,
  Picture,
  PictureFilled,
  Crop,
  Aim
} from "@element-plus/icons-vue";

export const componentCategories = [
  {
    name: "基础组件",
    components: [
      { type: "el-input", name: "输入框", icon: Edit },
      { type: "el-input-number", name: "数字输入框", icon: Odometer },
      { type: "el-select", name: "选择器", icon: Select },
      { type: "el-radio", name: "单选框", icon: CircleCheck },
      { type: "el-checkbox", name: "复选框", icon: Check },
      { type: "el-switch", name: "开关", icon: Switch },
      { type: "el-slider", name: "滑块", icon: Switch },
      { type: "el-time-picker", name: "时间选择器", icon: Timer },
      { type: "el-date-picker", name: "日期选择器", icon: Calendar },
      { type: "el-rate", name: "评分", icon: Star },
      { type: "el-color-picker", name: "颜色选择器", icon: Brush }
    ]
  },
  {
    name: "表单组件",
    components: [
      { type: "el-form", name: "表单", icon: Tickets },
      { type: "el-button", name: "按钮", icon: Aim }
    ]
  },
  {
    name: "数据组件",
    components: [
      { type: "el-table", name: "表格", icon: Grid },
      { type: "el-pagination", name: "分页", icon: Stopwatch }
    ]
  },
  {
    name: "上传组件",
    components: [{ type: "el-upload", name: "上传", icon: Upload }]
  },
  {
    name: "其他组件",
    components: [
      { type: "el-image", name: "图片", icon: Picture },
      { type: "el-avatar", name: "头像", icon: PictureFilled },
      { type: "el-progress", name: "进度条", icon: Crop }
    ]
  }
];
