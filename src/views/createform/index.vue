<template>
  <el-container class="app-container">
    <el-aside width="280px" class="component-list">
      <h3 class="aside-title">组件列表</h3>
      <el-scrollbar height="calc(100vh - 60px)">
        <el-collapse v-model="activeCategories" accordion>
          <el-collapse-item
            v-for="category in componentCategories"
            :key="category.name"
            :title="category.name"
            :name="category.name"
          >
            <div class="component-grid">
              <DraggableItem
                v-for="comp in category.components"
                :key="comp.type"
                :component-type="comp.type"
                class="small-draggable"
              >
                <el-tooltip
                  :content="comp.name"
                  placement="top"
                  :show-after="500"
                >
                  <el-button size="small">
                    <el-icon><component :is="comp.icon" /></el-icon>
                    <span class="component-name">{{ comp.name }}</span>
                  </el-button>
                </el-tooltip>
              </DraggableItem>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-main class="canvas-container">
        <h3 class="section-title">画布</h3>
        <LowCodeCanvas
          ref="canvas"
          :components="components"
          :global-label-position="globalLabelPosition"
          @select-component="selectComponent"
          @update-components="handleUpdateComponents"
        />
      </el-main>
      <el-aside width="300px" class="property-container">
        <h3 class="section-title">属性面板</h3>
        <el-form-item label="全局标签位置">
          <el-select
            v-model="globalLabelPosition"
            @change="updateGlobalLabelPosition"
          >
            <el-option label="顶部" value="top" />
            <el-option label="左侧" value="left" />
            <el-option label="右侧" value="right" />
          </el-select>
        </el-form-item>
        <PropertyPanel
          :selected-component="selectedComponent"
          :available-fields="availableFields"
          @update="handleComponentUpdate"
        />
        <div class="code-generator">
          <el-button type="primary" @click="showGeneratedForm"
            >生成表单代码</el-button
          >
          <GeneratedFormPreview
            v-model:visible="previewVisible"
            :form-components="components"
            :form-config="formConfig"
          />
        </div>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import {
  ElButton,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElRadio,
  ElCheckbox,
  ElSwitch,
  ElSlider,
  ElTimePicker,
  ElDatePicker,
  ElRate,
  ElColorPicker,
  ElTable,
  ElUpload
} from "element-plus";
import DraggableItem from "./components/DraggableItem.vue";
import LowCodeCanvas from "./components/LowCodeCanvas.vue";
import PropertyPanel from "./components/PropertyPanel.vue";
import GeneratedFormPreview from "./components/GeneratedFormPreview.vue";
import { componentCategories } from "./utils/componentList";
import { FormConfig, FormComponent, defaultFormConfig } from "./types";

export default defineComponent({
  name: "CreateForm",
  components: {
    DraggableItem,
    LowCodeCanvas,
    PropertyPanel,
    GeneratedFormPreview,
    ElButton,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElRadio,
    ElCheckbox,
    ElSwitch,
    ElSlider,
    ElTimePicker,
    ElDatePicker,
    ElRate,
    ElColorPicker,
    ElTable,
    ElUpload
  },
  setup() {
    const globalLabelPosition = ref<"top" | "left" | "right">("top");
    const selectedComponent = ref<FormComponent | null>(null);
    const canvas = ref(null);
    const components = ref<FormComponent[]>([]);
    const activeCategories = ref([componentCategories[0].name]);
    const previewVisible = ref(false);
    const formConfig = reactive<FormConfig>({ ...defaultFormConfig });

    // 预定义的可用字段数组
    const predefinedFields = [
      "username",
      "email",
      "password",
      "firstName",
      "lastName",
      "age",
      "address",
      "phoneNumber",
      "birthDate",
      "gender"
    ];

    const availableFields = computed(() => {
      // 合并预定义字段和组件ID
      const componentFields = components.value
        .map(comp => comp.props.id)
        .filter(Boolean);
      return [...new Set([...predefinedFields, ...componentFields])];
    });

    const updateGlobalLabelPosition = (position: "top" | "left" | "right") => {
      globalLabelPosition.value = position;
    };

    const selectComponent = component => {
      selectedComponent.value = component;
    };

    const handleComponentUpdate = (updatedComponent: FormComponent) => {
      const index = components.value.findIndex(
        c => c.props.id === updatedComponent.props.id
      );
      if (index !== -1) {
        components.value[index] = updatedComponent;
        components.value = [...components.value]; // 强制更新
        selectedComponent.value = updatedComponent;
      }
      if (canvas.value) {
        canvas.value.updateComponent(updatedComponent);
      }
    };

    const updateComponent = updatedComponent => {
      if (canvas.value) {
        canvas.value.updateComponent(updatedComponent);
      }
      selectedComponent.value = updatedComponent;
    };

    const handleUpdateComponents = updatedComponents => {
      components.value = updatedComponents;
    };

    const showGeneratedForm = () => {
      previewVisible.value = true;
    };

    return {
      componentCategories,
      selectedComponent,
      selectComponent,
      handleComponentUpdate,
      canvas,
      components,
      activeCategories,
      globalLabelPosition,
      updateGlobalLabelPosition,
      handleUpdateComponents,
      previewVisible,
      showGeneratedForm,
      formConfig,
      availableFields
    };
  }
});
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.component-list {
  border-right: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.aside-title,
.section-title {
  padding: 15px;
  margin: 0;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
}

.small-draggable {
  width: 100%;
}

.small-draggable :deep(.el-button) {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.component-name {
  margin-top: 5px;
  font-size: 12px;
}

.canvas-container {
  background-color: #ffffff;
  border-right: 1px solid #dcdfe6;
}

.property-container {
  background-color: #f5f7fa;
  overflow-y: auto;
}

.code-generator {
  margin-top: 20px;
  padding: 0 15px;
}

.code-generator .el-button {
  width: 100%;
  margin-bottom: 10px;
}
</style>
