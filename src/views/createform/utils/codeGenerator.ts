export function generateCode(components: Array<any>): string {
  let template = "<template>\n  <div>\n";
  let script =
    "<script lang=\"ts\">\nimport { defineComponent, ref } from 'vue';\n\nexport default defineComponent({\n  name: 'GeneratedComponent',\n  setup() {\n";
  let imports = "import { ";

  components.forEach((component, index) => {
    const componentName = `component${index}`;
    template += `    <${component.type} `;

    Object.entries(component.props).forEach(([key, value]) => {
      if (key === "modelValue") {
        template += `:${key}="${componentName}" @update:modelValue="update${componentName}" `;
        script += `    const ${componentName} = ref(${JSON.stringify(value)});\n`;
      } else {
        template += `${key}="${value}" `;
      }
    });

    template += "/>\n";

    if (!imports.includes(component.type)) {
      imports += `${component.type}, `;
    }
  });

  imports = imports.slice(0, -2) + " } from 'element-plus';\n\n";
  template += "  </div>\n</template>\n\n";
  script += "    return {\n";

  components.forEach((component, index) => {
    const componentName = `component${index}`;
    script += `      ${componentName},\n`;
    if (component.props.modelValue !== undefined) {
      script += `      update${componentName}: (val: any) => { ${componentName}.value = val; },\n`;
    }
  });

  script += "    };\n  },\n});\n</script>";

  return (
    imports +
    template +
    script +
    "\n\n<style scoped>\n/* Add your styles here */\n</style>"
  );
}
