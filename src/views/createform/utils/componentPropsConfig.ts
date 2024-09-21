export type PropConfig = {
  type: "string" | "number" | "boolean" | "select" | "color";
  description: string;
  default?: any;
  options?: string[];
};

export type ComponentPropsConfig = {
  [componentType: string]: {
    [propName: string]: PropConfig;
  };
};

export const componentPropsConfig: ComponentPropsConfig = {
  "el-input": {
    placeholder: { type: "string", description: "输入框占位文本", default: "" },
    type: {
      type: "select",
      description: "类型",
      options: ["text", "textarea", "password"],
      default: "text"
    },
    maxlength: { type: "number", description: "最大输入长度", default: 0 },
    minlength: { type: "number", description: "最小输入长度", default: 0 },
    showWordLimit: {
      type: "boolean",
      description: "是否显示输入字数统计",
      default: false
    },
    clearable: { type: "boolean", description: "是否可清空", default: false },
    disabled: { type: "boolean", description: "禁用", default: false },
    size: {
      type: "select",
      description: "输入框尺寸",
      options: ["large", "default", "small"],
      default: "default"
    }
  },
  "el-select": {
    placeholder: { type: "string", description: "占位符" },
    disabled: { type: "boolean", description: "是否禁用" },
    clearable: { type: "boolean", description: "是否可以清空选项" },
    multiple: { type: "boolean", description: "是否多选" },
    collapseTags: {
      type: "boolean",
      description: "多选时是否将选中值按文字的形式展示"
    },
    size: {
      type: "select",
      description: "输入框尺寸",
      options: ["large", "default", "small"]
    }
  },
  "el-radio": {
    disabled: { type: "boolean", description: "是否禁用" },
    border: { type: "boolean", description: "是否显示边框" },
    size: {
      type: "select",
      description: "单选框的尺寸",
      options: ["large", "default", "small"]
    }
  },
  "el-checkbox": {
    disabled: { type: "boolean", description: "是否禁用" },
    border: { type: "boolean", description: "是否显示边框" },
    size: {
      type: "select",
      description: "多选框的尺寸",
      options: ["large", "default", "small"]
    }
  },
  "el-switch": {
    disabled: { type: "boolean", description: "是否禁用" },
    activeText: { type: "string", description: "switch 打开时的文字描述" },
    inactiveText: { type: "string", description: "switch 关闭时的文字描述" },
    activeColor: { type: "color", description: "switch 打开时的背景色" },
    inactiveColor: { type: "color", description: "switch 关闭时的背景色" }
  },
  "el-button": {
    type: {
      type: "select",
      description: "类型",
      options: ["primary", "success", "warning", "danger", "info", "text"]
    },
    size: {
      type: "select",
      description: "尺寸",
      options: ["large", "default", "small"]
    },
    plain: { type: "boolean", description: "是否朴素按钮" },
    round: { type: "boolean", description: "是否圆角按钮" },
    circle: { type: "boolean", description: "是否圆形按钮" },
    disabled: { type: "boolean", description: "是否禁用状态" }
  }
};
