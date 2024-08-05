// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabBarList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      console.log("目标路径:", path);
    
      // 获取当前页面栈
      const pages = getCurrentPages();
      // 获取当前页面的实例（最后一个元素）
      const currentPage = pages[pages.length - 1];
    
      // 获取当前页面路径
      const currentPath = `/${currentPage.route}`;
      console.log("当前路径:", currentPath);
    
      // 比较当前页面路径与目标路径
      if (currentPath === path) {
        console.log("当前页面与目标页面相同，不进行跳转");
        return; // 如果路径相同，则不执行跳转
      }
    
      // 如果路径不同，执行跳转
      wx.redirectTo({
        url: path
      });
    }
  }
})
