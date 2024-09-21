export interface FormConfig {
  labelPosition: "left" | "right" | "top";
  labelWidth: number;
  size: "large" | "default" | "small";
}

export const defaultFormConfig: FormConfig = {
  labelPosition: "right",
  labelWidth: 100,
  size: "small"
};

export interface FormComponent {
  type: string;
  props: {
    id: string;
    label: string;
    colSpan?: number;
    [key: string]: any;
  };
}
