<template>
  <div class="low-code-canvas" @dragover.prevent @drop="handleDrop">
    <el-form :label-position="globalLabelPosition">
      <el-row :gutter="20">
        <el-col
          v-for="(comp, index) in components"
          :key="comp.props.id"
          :span="comp.props.colSpan"
          class="mb-4"
        >
          <div
            class="component-wrapper"
            draggable="true"
            @dragstart="event => handleDragStart(event, index)"
            @dragover.prevent
            @drop.stop="event => handleInternalDrop(event, index)"
            @click.stop="() => selectComponent(comp)"
          >
            <!-- ... 其他现有的内容 ... -->

            <el-form-item
              v-if="shouldShowLabel(comp.type)"
              :label="comp.props.label || getDefaultLabel(comp.type)"
            >
              <component
                :is="comp.type"
                v-if="comp.type !== 'el-upload' && comp.type !== 'el-button'"
                v-bind="comp.props"
                :model-value="formData[comp.props.vModel]"
                @update:model-value="updateFormData(comp.props.vModel, $event)"
              >
                {{ getDefaultContent(comp.type) }}
              </component>
              <el-upload
                v-else
                v-bind="comp.props"
                :on-change="file => handleFileChange(file, comp.props.id)"
              >
                <el-button type="primary">点击上传</el-button>
              </el-upload>
              <!-- ... el-upload 和 el-button 的处理保持不变 ... -->
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { Close, Expand } from "@element-plus/icons-vue";
import { FormComponent } from "../types";
import { componentPropsConfig } from "../utils/componentPropsConfig";

export default defineComponent({
  name: "LowCodeCanvas",
  components: {
    Close,
    Expand
  },
  props: {
    components: {
      type: Array as PropType<FormComponent[]>,
      required: true
    },
    globalLabelPosition: {
      type: String as PropType<"top" | "left" | "right">,
      default: "top"
    }
  },
  emits: ["select-component", "update-components"],
  setup(props, { emit }) {
    const formData = ref({});

    const updateFormData = (field: string, value: any) => {
      formData.value[field] = value;
    };

    const getDefaultLabel = (componentType: string): string => {
      const labelMap: { [key: string]: string } = {
        "el-input": "输入框",
        "el-input-number": "数字输入框",
        "el-select": "下拉选择框",
        "el-radio": "单选框",
        "el-checkbox": "复选框",
        "el-switch": "开关",
        "el-slider": "滑块",
        "el-time-picker": "时间选择器",
        "el-date-picker": "日期选择器",
        "el-rate": "评分",
        "el-color-picker": "颜色选择器",
        "el-button": "按钮",
        "el-upload": "上传"
        // 可以根据需要添加更多组件类型
      };

      return labelMap[componentType] || `${componentType} 标签`;
    };

    const emitUpdateComponents = () => {
      emit("update-components", props.components);
    };

    const handleDrop = (event: DragEvent) => {
      const componentType = event.dataTransfer?.getData("component-type");
      if (componentType) {
        const defaultProps: FormComponent["props"] = {
          id: `${componentType}-${Date.now()}`,
          label: getDefaultLabel(componentType),
          colSpan: 24
        };
        const componentProps = componentPropsConfig[componentType] || {};
        for (const [key, config] of Object.entries(componentProps)) {
          const typedConfig = config as { type: string; default?: any };
          defaultProps[key] =
            typedConfig.default !== undefined
              ? typedConfig.default
              : typedConfig.type === "boolean"
                ? false
                : typedConfig.type === "number"
                  ? 0
                  : "";
        }

        // 特别处理上传组件
        if (componentType === "el-upload") {
          defaultProps.action = "#"; // 设置一个默认的上传地址
          defaultProps.autoUpload = false; // 默认不自动上传
          defaultProps["on-change"] = "handleFileChange"; // 设置文件改变时的处理函数
        }

        const newComponent: FormComponent = {
          type: componentType,
          props: defaultProps
        };
        emit("update-components", [...props.components, newComponent]);
      }
    };

    const deleteComponent = (index: number) => {
      const updatedComponents = [...props.components];
      updatedComponents.splice(index, 1);
      emit("update-components", updatedComponents);
    };

    const selectComponent = component => {
      emit("select-component", component);
    };

    const cycleColSpan = component => {
      const spans = [24, 12, 8, 6, 4, 3, 2, 1];
      const currentIndex = spans.indexOf(component.props.colSpan);
      if (currentIndex !== -1) {
        component.props.colSpan = spans[(currentIndex + 1) % spans.length];
      } else {
        component.props.colSpan = 24;
      }
      emitUpdateComponents();
    };

    const updateComponent = (updatedComponent: FormComponent) => {
      const index = props.components.findIndex(
        c => c.props.id === updatedComponent.props.id
      );
      if (index !== -1) {
        const updatedComponents = [...props.components];
        updatedComponents[index] = updatedComponent;
        emit("update-components", updatedComponents);
      }
    };

    const shouldShowLabel = (componentType: string): boolean => {
      const noLabelComponents = ["el-button", "el-divider"];
      return !noLabelComponents.includes(componentType);
    };

    const getDefaultContent = (componentType: string): string => {
      const contentMap = {
        "el-button": "按钮"
        // ... 添加更多组件类型的默认内容
      };
      return contentMap[componentType] || "";
    };

    const getUploadProps = comp => {
      return {
        ...comp.props,
        action: "#",
        "auto-upload": false,
        "on-change": file => {
          console.log("File selected:", file);
          // 这里可以添加文件处理逻辑
        }
      };
    };
    const handleFileChange = (file: any, id: string) => {
      console.log(`File changed for upload component ${id}:`, file);
      // 这里可以添加文件处理逻辑
    };
    const handleDragStart = (event: DragEvent, index: number) => {
      event.dataTransfer?.setData("text/plain", index.toString());
    };

    const handleInternalDrop = (event: DragEvent, targetIndex: number) => {
      const sourceIndex = parseInt(
        event.dataTransfer?.getData("text/plain") || "-1"
      );
      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        const updatedComponents = [...props.components];
        const [movedComponent] = updatedComponents.splice(sourceIndex, 1);
        updatedComponents.splice(targetIndex, 0, movedComponent);
        emit("update-components", updatedComponents);
      }
    };

    return {
      handleDrop,
      handleDragStart,
      handleInternalDrop,
      selectComponent,
      deleteComponent,
      cycleColSpan,
      updateComponent,
      shouldShowLabel,
      getDefaultLabel,
      getDefaultContent,
      getUploadProps,
      handleFileChange,
      formData,
      updateFormData
    };
  }
});
</script>

<style scoped>
.low-code-canvas {
  width: 100%;
  height: 100%;
  border: 1px dashed #dcdfe6;
  padding: 20px;
  min-height: 400px;
}

.component-wrapper {
  position: relative;
  cursor: move;
  padding: 10px;
  border: 1px solid transparent;
  transition: all 0.3s;
  background-color: #f5f7fa;
  border-radius: 4px;
  height: 100%;
}

.component-wrapper:hover {
  border-color: #409eff;
}

.delete-icon,
.resize-icon {
  position: absolute;
  top: 5px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1;
}

.delete-icon {
  right: 5px;
  color: #f56c6c;
}

.delete-icon:hover {
  color: #f78989;
}

.resize-icon {
  right: 30px;
  color: #409eff;
}

.resize-icon:hover {
  color: #66b1ff;
}

.el-form-item {
  margin-bottom: 0;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
