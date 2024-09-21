<template>
  <div class="draggable-item" draggable="true" @dragstart="handleDragStart">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DraggableItem",
  props: {
    componentType: {
      type: String,
      required: true
    }
  },
  methods: {
    handleDragStart(event: DragEvent) {
      event.dataTransfer?.setData("component-type", this.componentType);
    }
  }
});
</script>

<style scoped>
.draggable-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #dcdfe6;
  cursor: move;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

.draggable-item:hover {
  background-color: #e6e8eb;
  transform: scale(1.05);
}
</style>
