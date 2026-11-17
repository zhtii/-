/**
 * 设备监控页面 - 业务逻辑
 */

const { createApp, ref, watch, onMounted, computed } = Vue;

const app = createApp({
  setup() {
    // ==========================================
    //  设备类型定义（3种）
    // ==========================================
    const DEVICE_TYPES = {
      spore:   { label: '孢子监测仪',     color: '#1890ff', icon: '🔬' },
      insect:  { label: '智能虫情测报灯', color: '#52c41a', icon: '🪲' },
      camera:  { label: '高清摄像机',     color: '#fa8c16', icon: '📷' },
    };

    const STATUS_MAP = {
      normal:  { label: '在线', color: '#52c41a' },
      alarm:   { label: '报警', color: '#f5222d' },
      offline: { label: '离线', color: '#8c8c8c' },
    };

    // ==========================================
    //  左侧设备树
    // ==========================================
    const treeSearch = ref('');
    const deviceFilter = ref('all');
    const deviceTree = ref(null);

    const treeProps = { children: 'children', label: 'label' };

    /** 页面显示设置 - 设备类型筛选 */
    const filterDialogVisible = ref(false);
    const visibleDeviceTypes = ref({ spore: true, insect: true, camera: true });

    const openFilterDialog = () => { filterDialogVisible.value = true; };
    const closeFilterDialog = () => { filterDialogVisible.value = false; };
    const saveFilterSettings = () => {
      applyDeviceTypeFilter();
      filterDialogVisible.value = false;
      ElementPlus.ElMessage.success('显示设置已保存');
    };

    const treeData = ref([
      {
        id: 'all', label: '全部设备 (36/40)',
        children: [
          {
            id: 'wx1', label: '巫溪基地A区 (20/22)',
            children: [
              { id: 'a1', label: '孢子监测仪01', deviceType: 'spore' },
              { id: 'a2', label: '孢子监测仪02', deviceType: 'spore' },
              { id: 'a3', label: '智能虫情测报灯01', deviceType: 'insect' },
              { id: 'a4', label: '智能虫情测报灯02', deviceType: 'insect' },
              { id: 'a5', label: '智能虫情测报灯03', deviceType: 'insect' },
              { id: 'a6', label: '高清摄像机01', deviceType: 'camera' },
              { id: 'a7', label: '高清摄像机02', deviceType: 'camera' },
            ],
          },
          {
            id: 'wx2', label: '巫溪基地B区 (16/18)',
            children: [
              { id: 'b1', label: '孢子监测仪01', deviceType: 'spore' },
              { id: 'b2', label: '智能虫情测报灯01', deviceType: 'insect' },
              { id: 'b3', label: '智能虫情测报灯02', deviceType: 'insect' },
              { id: 'b4', label: '高清摄像机01', deviceType: 'camera' },
              { id: 'b5', label: '高清摄像机02', deviceType: 'camera' },
              { id: 'b6', label: '高清摄像机03', deviceType: 'camera' },
            ],
          },
        ],
      },
    ]);

    const filterNode = (value, data) => !value || data.label.includes(value);
    watch(treeSearch, (val) => { if (deviceTree.value) deviceTree.value.filter(val); });

    const isDeviceNode = (data) => !!data.deviceType;

    // ==========================================
    //  设备数据（模拟）
    // ==========================================
    const deviceLocations = [
      // A区 - 孢子监测仪
      { id: 'a1', name: '孢子监测仪01', code: 'BZ-2025-001', lng: 109.628, lat: 31.402, type: 'spore', status: 'normal',
        data: { time: '2026-11-06 14:30:00', sporeConcentration: '1,280个/m³', sporeSpecies: '12种', temp: '18.5℃', humidity: '72%', windSpeed: '2.3m/s' } },
      { id: 'a2', name: '孢子监测仪02', code: 'BZ-2025-002', lng: 109.635, lat: 31.408, type: 'spore', status: 'alarm',
        data: { time: '2026-11-06 14:28:00', sporeConcentration: '3,560个/m³', sporeSpecies: '18种', temp: '18.2℃', humidity: '75%', windSpeed: '2.1m/s' } },
      // A区 - 虫情测报灯
      { id: 'a3', name: '智能虫情测报灯01', code: 'CQ-2025-001', lng: 109.632, lat: 31.405, type: 'insect', status: 'normal',
        data: { time: '2026-11-06 14:30:00', insectCount: '47头', insectTypes: '8种', temp: '18.5℃', humidity: '72%', light: '3200lux', lampStatus: '工作中' } },
      { id: 'a4', name: '智能虫情测报灯02', code: 'CQ-2025-002', lng: 109.640, lat: 31.410, type: 'insect', status: 'normal',
        data: { time: '2026-11-06 14:29:00', insectCount: '32头', insectTypes: '6种', temp: '18.3℃', humidity: '73%', light: '3100lux', lampStatus: '工作中' } },
      { id: 'a5', name: '智能虫情测报灯03', code: 'CQ-2025-003', lng: 109.625, lat: 31.398, type: 'insect', status: 'offline',
        data: { time: '2026-11-06 12:15:00', insectCount: '—', insectTypes: '—', temp: '—', humidity: '—', light: '—', lampStatus: '离线' } },
      // A区 - 摄像机
      { id: 'a6', name: '高清摄像机01', code: 'SP-2025-001', lng: 109.630, lat: 31.400, type: 'camera', status: 'normal',
        data: { time: '2026-11-06 14:30:00', resolution: '1920×1080', fps: '25fps', storage: '正常(82%)', lastCapture: '14:28:30', viewAngle: '120°' } },
      { id: 'a7', name: '高清摄像机02', code: 'SP-2025-002', lng: 109.638, lat: 31.406, type: 'camera', status: 'normal',
        data: { time: '2026-11-06 14:30:00', resolution: '2560×1440', fps: '30fps', storage: '正常(65%)', lastCapture: '14:29:55', viewAngle: '90°' } },
      // B区 - 孢子监测仪
      { id: 'b1', name: '孢子监测仪01', code: 'BZ-2025-003', lng: 109.680, lat: 31.450, type: 'spore', status: 'normal',
        data: { time: '2026-11-06 14:30:00', sporeConcentration: '960个/m³', sporeSpecies: '9种', temp: '17.8℃', humidity: '68%', windSpeed: '1.8m/s' } },
      // B区 - 虫情测报灯
      { id: 'b2', name: '智能虫情测报灯01', code: 'CQ-2025-004', lng: 109.685, lat: 31.455, type: 'insect', status: 'normal',
        data: { time: '2026-11-06 14:30:00', insectCount: '28头', insectTypes: '5种', temp: '17.8℃', humidity: '68%', light: '2900lux', lampStatus: '工作中' } },
      { id: 'b3', name: '智能虫情测报灯02', code: 'CQ-2025-005', lng: 109.690, lat: 31.448, type: 'insect', status: 'alarm',
        data: { time: '2026-11-06 14:27:00', insectCount: '156头', insectTypes: '14种', temp: '17.9℃', humidity: '70%', light: '3000lux', lampStatus: '告警' } },
      // B区 - 摄像机
      { id: 'b4', name: '高清摄像机01', code: 'SP-2025-003', lng: 109.682, lat: 31.452, type: 'camera', status: 'normal',
        data: { time: '2026-11-06 14:30:00', resolution: '1920×1080', fps: '25fps', storage: '正常(71%)', lastCapture: '14:30:00', viewAngle: '120°' } },
      { id: 'b5', name: '高清摄像机02', code: 'SP-2025-004', lng: 109.688, lat: 31.458, type: 'camera', status: 'offline',
        data: { time: '2026-11-06 11:20:00', resolution: '—', fps: '—', storage: '—', lastCapture: '11:20:00', viewAngle: '—' } },
      { id: 'b6', name: '高清摄像机03', code: 'SP-2025-005', lng: 109.692, lat: 31.445, type: 'camera', status: 'normal',
        data: { time: '2026-11-06 14:30:00', resolution: '3840×2160', fps: '20fps', storage: '正常(45%)', lastCapture: '14:29:48', viewAngle: '80°' } },
    ];

    // ==========================================
    //  各类型设备的弹窗字段
    // ==========================================
    /** 弹窗卡片详细字段 */
    const popupFields = {
      spore: [
        { key: 'sporeConcentration', label: '孢子浓度' },
        { key: 'sporeSpecies', label: '孢子种类数' },
        { key: 'temp', label: '温度' },
        { key: 'humidity', label: '湿度' },
        { key: 'windSpeed', label: '风速' },
      ],
      insect: [
        { key: 'insectCount', label: '虫情数量' },
        { key: 'insectTypes', label: '害虫种类' },
        { key: 'temp', label: '温度' },
        { key: 'humidity', label: '湿度' },
        { key: 'light', label: '光照强度' },
        { key: 'lampStatus', label: '诱捕灯状态' },
      ],
      camera: [
        { key: 'resolution', label: '分辨率' },
        { key: 'fps', label: '帧率' },
        { key: 'storage', label: '存储状态' },
        { key: 'lastCapture', label: '最后抓拍' },
        { key: 'viewAngle', label: '视角' },
      ],
    };

    const currentPopupFields = computed(() => {
      if (!popupData.value) return [];
      return popupFields[popupData.value.type] || [];
    });

    // ==========================================
    //  设备统计数据（按类型统计在线/离线数量）
    // ==========================================
    const deviceStats = computed(() => {
      const stats = {};
      for (const key of Object.keys(DEVICE_TYPES)) {
        const devices = deviceLocations.filter(d => d.type === key);
        stats[key] = {
          online: devices.filter(d => d.status === 'normal').length,
          offline: devices.filter(d => d.status === 'offline' || d.status === 'alarm').length,
          total: devices.length,
        };
      }
      return stats;
    });

    // ==========================================
    //  树交互
    // ==========================================
    const applyDeviceTypeFilter = () => {
      deviceMarkers.forEach((marker) => {
        const device = marker.getExtData();
        marker.setVisible(visibleDeviceTypes.value[device.type] !== false);
      });
    };

    const centerMapToDevice = (device) => {
      if (!mapInstance || !device) return;
      mapInstance.setCenter([device.lng, device.lat]);
      mapInstance.setZoom(15);
    };

    /** 树节点勾选变化（核心：统一处理勾选/取消 + 单击已勾选设备的定位） */
    const handleCheckChange = (data, checkedInfo) => {
      if (!isDeviceNode(data)) return;

      // checkedInfo 包含 checkedNodes / checkedKeys / halfCheckedNodes / halfCheckedKeys
      const isChecked = checkedInfo.checkedKeys.includes(data.id);

      // 更新对应标记的显示/隐藏
      const marker = deviceMarkers.find((m) => m.getExtData().id === data.id);
      if (marker) {
        const typeVisible = visibleDeviceTypes.value[data.type] !== false;
        marker.setVisible(isChecked && typeVisible);
      }

      // 勾选时 → 定位到该设备
      if (isChecked) {
        const device = deviceLocations.find((d) => d.id === data.id);
        if (device) centerMapToDevice(device);
      }
    };

    /** 树节点单击 - 直接定位（不依赖 checkedKeys 判断） */
    const handleNodeClick = (data) => {
      if (!isDeviceNode(data)) return;
      // 单击即定位，无需判断是否勾选
      const device = deviceLocations.find((d) => d.id === data.id);
      if (device) centerMapToDevice(device);
    };

    // ==========================================
    //  右键菜单
    // ==========================================
    const contextMenuVisible = ref(false);
    const contextMenuX = ref(0);
    const contextMenuY = ref(0);
    const selectedNode = ref(null);

    const handleNodeRightClick = (event, data) => {
      event.preventDefault();
      selectedNode.value = data;
      contextMenuX.value = event.clientX;
      contextMenuY.value = event.clientY;
      contextMenuVisible.value = true;
      // 右键与单击效果相同：始终定位到设备位置
      if (isDeviceNode(data)) {
        const device = deviceLocations.find((d) => d.id === data.id);
        if (device) centerMapToDevice(device);
      }
    };

    const hideContextMenu = () => { contextMenuVisible.value = false; };

    const handleMenuAction = (action) => {
      contextMenuVisible.value = false;
      if (!selectedNode.value || !isDeviceNode(selectedNode.value)) {
        ElementPlus.ElMessage.warning('请先选择一个设备');
        return;
      }
      const device = deviceLocations.find((d) => d.id === selectedNode.value.id);
      if (action === 'info' && device) {
        centerMapToDevice(device);
        showDevicePopup.value = true;
        popupData.value = device;
      } else {
        const labels = { upgrade: '设备升级', params: '参数配置', capture: '前端抓拍', traffic: '网络流量配置' };
        ElementPlus.ElMessage.success(`${labels[action]} - ${selectedNode.value.label}`);
      }
    };

    document.addEventListener('click', () => { contextMenuVisible.value = false; });

    // ==========================================
    //  高德地图
    // ==========================================
    const mapSearch = ref('');
    const isSatellite = ref(false);
    const isRanging = ref(false);
    const isMeasuringArea = ref(false);
    const mapToolsExpanded = ref(false);

    // 弹窗
    const showDevicePopup = ref(false);
    const popupData = ref(null);

    let mapInstance = null;
    let placeSearch = null;
    let rangingTool = null;
    let deviceMarkers = [];

    /** 生成标记点 HTML 内容（圆形图标 + 状态环） */
    const createMarkerContent = (device) => {
      const typeInfo = DEVICE_TYPES[device.type] || DEVICE_TYPES.camera;
      const statusInfo = STATUS_MAP[device.status] || STATUS_MAP.normal;
      return `
        <div class="custom-marker" style="position:relative;width:36px;height:36px;">
          <div style="
            width:36px;height:36px;border-radius:50%;
            background:${typeInfo.color};
            border:3px solid ${statusInfo.color};
            display:flex;align-items:center;justify-content:center;
            font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3);
            cursor:pointer;
          ">${typeInfo.icon}</div>
          ${device.status === 'alarm' ? '<div style="position:absolute;top:-2px;right:-2px;width:10px;height:10px;background:#f5222d;border-radius:50%;border:2px solid #fff;animation:pulse 1s infinite;"></div>' : ''}
        </div>`;
    };

    const initMap = () => {
      if (typeof AMap === 'undefined') {
        ElementPlus.ElMessage.error('高德地图加载失败，请检查网络或 Key 配置');
        return;
      }

      mapInstance = new AMap.Map('mapContainer', {
        zoom: 13,
        center: [109.66, 31.42],
        mapStyle: 'amap://styles/normal',
      });

      mapInstance.addControl(new AMap.ToolBar({ position: 'RB' }));
      mapInstance.addControl(new AMap.Scale());

      placeSearch = new AMap.PlaceSearch({ pageSize: 10, city: '重庆' });

      rangingTool = new AMap.RangingTool(mapInstance);
      rangingTool.on('end', () => { isRanging.value = false; });

      addDeviceMarkers();
    };

    const addDeviceMarkers = () => {
      deviceLocations.forEach((device) => {
        const marker = new AMap.Marker({
          position: [device.lng, device.lat],
          content: createMarkerContent(device),
          offset: new AMap.Pixel(-18, -18),
          extData: device,
        });

        // 点击显示弹窗卡片
        marker.on('click', () => {
          showDevicePopup.value = true;
          popupData.value = device;
        });

        mapInstance.add(marker);
        deviceMarkers.push(marker);
      });
    };

    const searchLocation = () => {
      if (!mapSearch.value.trim()) { ElementPlus.ElMessage.warning('请输入搜索地点'); return; }
      placeSearch.search(mapSearch.value, (status, result) => {
        if (status === 'complete' && result.poiList?.pois?.length > 0) {
          const poi = result.poiList.pois[0];
          mapInstance.setCenter([poi.location.lng, poi.location.lat]);
          mapInstance.setZoom(15);
          ElementPlus.ElMessage.success(`已定位到: ${poi.name}`);
        } else {
          ElementPlus.ElMessage.warning('未找到该地点');
        }
      });
    };

    const toggleSatellite = () => {
      isSatellite.value = !isSatellite.value;
      mapInstance.setMapStyle(isSatellite.value ? 'amap://styles/satellite' : 'amap://styles/normal');
    };

    const toggleRanging = () => {
      isRanging.value = !isRanging.value;
      if (isRanging.value) {
        if (isMeasuringArea.value) { isMeasuringArea.value = false; }
        rangingTool.turnOn();
        ElementPlus.ElMessage.info('测距模式已开启，点击地图开始测量');
      } else {
        rangingTool.turnOff();
      }
    };

    const measureArea = () => {
      isMeasuringArea.value = !isMeasuringArea.value;
      if (isMeasuringArea.value) {
        if (isRanging.value) { rangingTool.turnOff(); isRanging.value = false; }
        ElementPlus.ElMessage.info('面积测量模式已开启，在地图上点击绘制多边形，双击结束');
      } else {
        ElementPlus.ElMessage.info('面积测量已结束');
      }
    };

    // ==========================================
    //  底部面板
    // ==========================================
    const datePreset = ref('today');
    const dateRange = ref(['2026-05-09 14:30:33', '2026-05-09 14:30:33']);
    const bottomExpanded = ref(true);
    const pageSize = ref(10);
    const currentPage = ref(2);
    const jumpPage = ref('');

    const toggleBottomPanel = () => {
      bottomExpanded.value = !bottomExpanded.value;
      setTimeout(() => { if (mapInstance) mapInstance.resize(); }, 350);
    };

    const queryImages = () => { ElementPlus.ElMessage.success('查询成功'); };
    const resetQuery = () => {
      datePreset.value = 'today';
      dateRange.value = ['2026-05-09 14:30:33', '2026-05-09 14:30:33'];
      ElementPlus.ElMessage.info('已重置');
    };
    const jumpToPage = () => {
      if (jumpPage.value) { currentPage.value = Number(jumpPage.value); jumpPage.value = ''; }
    };

    // ==========================================
    //  生命周期
    // ==========================================
    onMounted(() => { initMap(); });

    // ==========================================
    //  暴露给模板
    // ==========================================
    return {
      DEVICE_TYPES, STATUS_MAP,
      treeSearch, deviceFilter, deviceTree, treeData, treeProps,
      filterNode, handleCheckChange, handleNodeClick,
      filterDialogVisible, visibleDeviceTypes,
      openFilterDialog, closeFilterDialog, saveFilterSettings,
      contextMenuVisible, contextMenuX, contextMenuY,
      handleNodeRightClick, hideContextMenu, handleMenuAction,
      mapSearch, isSatellite, isRanging, isMeasuringArea, mapToolsExpanded,
      searchLocation, toggleSatellite, toggleRanging, measureArea,
      showDevicePopup, popupData, currentPopupFields,
      deviceStats,
      datePreset, dateRange, bottomExpanded, pageSize, currentPage, jumpPage,
      toggleBottomPanel, queryImages, resetQuery, jumpToPage,
      navigateTo, goHome, toggleFullscreen,
    };
  },
});

app.use(ElementPlus);
registerGlobalMethods(app);
app.mount('#app');
