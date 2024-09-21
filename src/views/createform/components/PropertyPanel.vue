<template>
  <div v-if="localComponent" class="property-panel">
    <h3>{{ localComponent.type }} 属性</h3>
    <el-form label-position="top" size="small">
      <el-form-item label="组件ID">
        <el-input v-model="localComponent.props.id" @input="updateComponent" />
      </el-form-item>
      <el-form-item label="标签文本">
        <el-input
          v-model="localComponent.props.label"
          @input="updateComponent"
        />
      </el-form-item>
      <el-form-item label="占据列数">
        <el-slider
          v-model="localComponent.props.colSpan"
          :min="1"
          :max="24"
          :step="1"
          :show-input="true"
          @change="updateComponent"
        />
      </el-form-item>

      <!-- 通用属性 -->
      <el-form-item v-if="hasPlaceholder" label="占位文本">
        <el-input
          v-model="localComponent.props.placeholder"
          @input="updateComponent"
        />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch
          v-model="localComponent.props.disabled"
          @change="updateComponent"
        />
      </el-form-item>
      <el-form-item v-if="hasClearable" label="是否可清空">
        <el-switch
          v-model="localComponent.props.clearable"
          @change="updateComponent"
        />
      </el-form-item>

      <!-- 特定组件属性 -->
      <template v-if="localComponent.type === 'el-input'">
        <el-form-item label="输入类型">
          <el-select
            v-model="localComponent.props.type"
            @change="updateComponent"
          >
            <el-option label="文本" value="text" />
            <el-option label="文本域" value="textarea" />
            <el-option label="密码" value="password" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="localComponent.props.type !== 'textarea'"
          label="最大长度"
        >
          <el-input-number
            v-model="localComponent.props.maxlength"
            :min="0"
            @change="updateComponent"
          />
        </el-form-item>
        <el-form-item
          v-if="localComponent.props.type === 'textarea'"
          label="显示字数统计"
        >
          <el-switch
            v-model="localComponent.props.showWordLimit"
            @change="updateComponent"
          />
        </el-form-item>
      </template>

      <template v-else-if="localComponent.type === 'el-select'">
        <el-form-item label="是否多选">
          <el-switch
            v-model="localComponent.props.multiple"
            @change="updateComponent"
          />
        </el-form-item>
        <el-form-item label="选项">
          <el-button @click="addOption">添加选项</el-button>
          <div
            v-for="(option, index) in localComponent.props.options"
            :key="index"
          >
            <el-input
              v-model="option.label"
              placeholder="选项标签"
              @input="updateComponent"
            />
            <el-input
              v-model="option.value"
              placeholder="选项值"
              @input="updateComponent"
            />
            <el-button @click="removeOption(index)">删除</el-button>
          </div>
        </el-form-item>
      </template>

      <!-- 可以继续添加其他组件的特定属性 -->
      <el-form-item label="数据绑定 (v-model)">
        <el-select
          v-model="localComponent.props.vModel"
          filterable
          allow-create
          default-first-option
          @change="updateComponent"
        >
          <el-option
            v-for="field in availableFields"
            :key="field"
            :label="field"
            :value="field"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from "vue";
import { FormComponent } from "../types";

export default defineComponent({
  name: "PropertyPanel",
  props: {
    selectedComponent: {
      type: Object as PropType<FormComponent>,
      required: true
    },
    availableFields: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  emits: ["update"],
  setup(props, { emit }) {
    const localComponent = ref<FormComponent>(
      JSON.parse(JSON.stringify(props.selectedComponent))
    );

    watch(
      () => props.selectedComponent,
      newValue => {
        localComponent.value = JSON.parse(JSON.stringify(newValue));
      },
      { deep: true }
    );

    const hasPlaceholder = computed(() => {
      const placeholderComponents = [
        "el-input",
        "el-select",
        "el-date-picker",
        "el-time-picker"
      ];
      return placeholderComponents.includes(localComponent.value.type);
    });

    const hasClearable = computed(() => {
      const clearableComponents = [
        "el-input",
        "el-select",
        "el-date-picker",
        "el-time-picker"
      ];
      return clearableComponents.includes(localComponent.value.type);
    });

    const updateComponent = () => {
      emit("update", JSON.parse(JSON.stringify(localComponent.value)));
    };

    const addOption = () => {
      if (!localComponent.value.props.options) {
        localComponent.value.props.options = [];
      }
      localComponent.value.props.options.push({ label: "", value: "" });
      updateComponent();
    };

    const removeOption = (index: number) => {
      localComponent.value.props.options.splice(index, 1);
      updateComponent();
    };

    return {
      localComponent,
      hasPlaceholder,
      hasClearable,
      updateComponent,
      addOption,
      removeOption
    };
  }
});
</script>

<style scoped>
.property-panel {
  padding: 20px;
}
</style>
