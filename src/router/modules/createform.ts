// 最简代码，也就是这些字段必须有
export default {
  path: "/createform",
  meta: {
    title: "表单设计"
  },
  children: [
    {
      path: "/createform/index",
      name: "Createform",
      component: () => import("@/views/createform/index.vue"),
      meta: {
        title: "表单设计"
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "404"
      }
    }
  ]
};
