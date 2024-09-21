<template>
  <el-dialog
    v-model="dialogVisible"
    title="生成的表单预览"
    width="80%"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="预览" name="preview">
        <div class="preview-container">
          <el-form
            :model="form"
            :label-position="formConfig.labelPosition"
            :label-width="formConfig.labelWidth + 'px'"
            :size="formConfig.size"
          >
            <el-row :gutter="20">
              <el-col
                v-for="(comp, index) in formComponents"
                :key="index"
                :span="comp.props.colSpan || 24"
              >
                <el-form-item
                  v-if="comp.type !== 'el-button'"
                  :label="comp.props.label"
                >
                  <component
                    :is="comp.type"
                    v-bind="comp.props"
                    v-model="form[comp.props.id]"
                  />
                </el-form-item>
                <el-button
                  v-else
                  v-bind="comp.props"
                  @click="onButtonClick(comp.props.id)"
                >
                  {{ comp.props.label }}
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="代码" name="code">
        <pre><code>{{ generatedCode }}</code></pre>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleCopyCode"> 复制代码 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, reactive } from "vue";
import { ElMessage } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { FormConfig, FormComponent } from "../types";

export default defineComponent({
  name: "GeneratedFormPreview",
  components: {
    ...ElementPlusIconsVue
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    formComponents: {
      type: Array as PropType<FormComponent[]>,
      required: true
    },
    formConfig: {
      type: Object as PropType<FormConfig>,
      required: true
    }
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const activeTab = ref("preview");
    const dialogVisible = computed({
      get: () => props.visible,
      set: value => emit("update:visible", value)
    });

    const form = reactive({});

    props.formComponents.forEach(comp => {
      if (comp.type !== "el-button") {
        form[comp.props.id] = "";
      }
    });

    const generatedCode = computed(() => {
      return generateFormCode(props.formComponents, props.formConfig);
    });

    const handleClose = () => {
      dialogVisible.value = false;
    };

    const handleCopyCode = () => {
      navigator.clipboard
        .writeText(generatedCode.value)
        .then(() => {
          ElMessage.success("代码已复制到剪贴板");
        })
        .catch(err => {
          console.error("无法复制代码: ", err);
          ElMessage.error("复制失败，请手动复制");
        });
    };

    const onButtonClick = (id: string) => {
      console.log(`Button ${id} clicked`);
      // 这里可以添加按钮点击的具体逻辑
    };

    return {
      activeTab,
      dialogVisible,
      generatedCode,
      handleClose,
      handleCopyCode,
      form,
      onButtonClick
    };
  }
});

function generateFormCode(
  components: FormComponent[],
  config: FormConfig
): string {
  let code = "<template>\n";
  code += `  <el-form :model="form" label-position="${config.labelPosition}" `;
  code += `label-width="${config.labelWidth}px" size="${config.size}">\n`;
  code += '    <el-row :gutter="20">\n';
  components.forEach(comp => {
    code += `      <el-col :span="${comp.props.colSpan || 24}">\n`;
    if (comp.type === "el-button") {
      code += `        <el-button`;
      Object.entries(comp.props).forEach(([key, value]) => {
        if (key !== "id" && key !== "colSpan") {
          code += ` ${key}="${value}"`;
        }
      });
      code += `>${comp.props.label}</el-button>\n`;
    } else {
      code += `        <el-form-item label="${comp.props.label}">\n`;
      code += `          <${comp.type} `;

      // 检查是否有 vModel 属性，如果有，使用它来生成 v-model 绑定
      if (comp.props.vModel) {
        code += `v-model="form.${comp.props.vModel}" `;
      }

      Object.entries(comp.props).forEach(([key, value]) => {
        if (
          key !== "id" &&
          key !== "label" &&
          key !== "colSpan" &&
          key !== "vModel"
        ) {
          code += `${key}="${value}" `;
        }
      });
      code += "/>\n";
      code += "        </el-form-item>\n";
    }
    code += "      </el-col>\n";
  });
  code += "    </el-row>\n";
  code += "  </el-form>\n</template>\n\n";
  code += '<script lang="ts">\n';
  code += "import { defineComponent, reactive } from 'vue';\n\n";
  code += "export default defineComponent({\n";
  code += "  setup() {\n";
  code += "    const form = reactive({\n";
  components.forEach(comp => {
    if (comp.type !== "el-button" && comp.props.vModel) {
      code += `      ${comp.props.vModel}: '',\n`;
    }
  });
  code += "    });\n\n";
  code += "    return {\n";
  code += "      form,\n";
  code += "    };\n";
  code += "  },\n";
  code += "});\n";
  code += "<\/script>\n";
  return code;
}
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.preview-container {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
