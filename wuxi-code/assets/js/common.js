/**
 * 渝富数智管理后台 - 全局公共脚本
 * 导航跳转、工具函数等所有页面共用的逻辑
 */

/**
 * 菜单路由配置
 * 新增页面时在此处添加映射
 */
const MENU_ROUTES = {
  '地图监控':   'device-monitor',
  '预警配置':   'warning-config',
  '专家诊断':   'expert-diagnosis',
  '统计分析':   'statistics',
  '系统管理':   'system',
};

/**
 * 跳转到指定菜单页面
 * @param {string} menuName - 菜单名称（需与 MENU_ROUTES 的 key 一致）
 */
function navigateTo(menuName) {
  const path = MENU_ROUTES[menuName];
  if (!path) {
    ElementPlus.ElMessage.warning(`页面「${menuName}」尚未开发`);
    return;
  }
  // 从 pages/xxx/ 目录跳转，需先回到上级目录
  window.location.href = `../${path}/index.html`;
}

/**
 * 返回首页
 */
function goHome() {
  window.location.href = '../../index.html';
}

/**
 * 全屏切换
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/**
 * 格式化日期
 * @param {Date|string} date
 * @param {string} format - 默认 'YYYY-MM-DD HH:mm:ss'
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MM', pad(d.getMonth() + 1))
    .replace('DD', pad(d.getDate()))
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()));
}

/**
 * 注册全局方法到 Vue 应用实例
 * 让所有页面的模板都能直接使用 navigateTo、goHome、toggleFullscreen
 * @param {object} app - Vue createApp 返回的实例
 */
function registerGlobalMethods(app) {
  app.config.globalProperties.navigateTo = navigateTo;
  app.config.globalProperties.goHome = goHome;
  app.config.globalProperties.toggleFullscreen = toggleFullscreen;
  app.config.globalProperties.formatDate = formatDate;
}
