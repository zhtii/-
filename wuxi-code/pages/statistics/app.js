/**
 * 统计分析页面 - 业务逻辑
 */
const { createApp } = Vue;

const statsApp = createApp({
  data() {
    return {
      timeDimension: 'week',
      locationFilter: [],
      diseaseFilter: '',
      trendChartType: 'line',

      // 区域选项
      locationOptions: [
        {
          value: '巫溪县',
          label: '巫溪县',
          children: [
            { value: '宁厂镇', label: '宁厂镇', children: [{ value: '双溪村', label: '双溪村' }, { value: '盐井村', label: '盐井村' }] },
            { value: '上磺镇', label: '上磺镇', children: [{ value: '四湾村', label: '四湾村' }, { value: '龙庄村', label: '龙庄村' }] },
            { value: '凤凰镇', label: '凤凰镇', children: [{ value: '木龙村', label: '木龙村' }, { value: '龙井村', label: '龙井村' }] },
            { value: '通城镇', label: '通城镇', children: [{ value: '龙池村', label: '龙池村' }, { value: '青云村', label: '青云村' }] },
            { value: '城厢镇', label: '城厢镇', children: [{ value: '渔渡村', label: '渔渡村' }, { value: '白鹿村', label: '白鹿村' }] },
          ],
        },
      ],

      // 概览卡片
      overviewCards: [
        { title: '监测设备总数', value: '320', color: '#1890ff', trend: '↑ 较上月 +12', trendClass: 'trend-up' },
        { title: '本月预警次数', value: '86', color: '#fa8c16', trend: '↑ 较上月 +23%', trendClass: 'trend-up' },
        { title: '已完成诊断', value: '45', color: '#52c41a', trend: '↑ 较上月 +8', trendClass: 'trend-up' },
        { title: '设备在线率', value: '92.5%', color: '#00a854', trend: '↓ 较上月 -1.2%', trendClass: 'trend-down' },
      ],

      // 图表实例
      trendChartInstance: null,
      pieChartInstance: null,
      townChartInstance: null,
      deviceChartInstance: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts();
    });
  },
  beforeUnmount() {
    // 销毁图表实例
    [this.trendChartInstance, this.pieChartInstance, this.townChartInstance, this.deviceChartInstance]
      .forEach(chart => chart && chart.dispose());
  },
  methods: {
    initCharts() {
      this.initTrendChart();
      this.initPieChart();
      this.initTownChart();
      this.initDeviceChart();
    },

    initTrendChart() {
      this.trendChartInstance = echarts.init(this.$refs.trendChart);
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['稻瘟病', '纹枯病', '螟虫', '蚜虫'], bottom: 0 },
        grid: { left: 50, right: 20, top: 20, bottom: 40 },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: { type: 'value', name: '次数' },
        series: [
          { name: '稻瘟病', type: 'line', smooth: true, data: [12, 18, 15, 22, 28, 20, 16], itemStyle: { color: '#1890ff' } },
          { name: '纹枯病', type: 'line', smooth: true, data: [8, 12, 10, 15, 18, 14, 11], itemStyle: { color: '#52c41a' } },
          { name: '螟虫', type: 'line', smooth: true, data: [5, 8, 12, 10, 15, 18, 14], itemStyle: { color: '#fa8c16' } },
          { name: '蚜虫', type: 'line', smooth: true, data: [20, 15, 18, 12, 10, 8, 6], itemStyle: { color: '#f5222d' } },
        ],
      };
      this.trendChartInstance.setOption(option);
    },

    initPieChart() {
      this.pieChartInstance = echarts.init(this.$refs.pieChart);
      const option = {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: 0 },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
            label: { show: true, formatter: '{b}\n{d}%' },
            data: [
              { value: 120, name: '稻瘟病', itemStyle: { color: '#1890ff' } },
              { value: 85, name: '纹枯病', itemStyle: { color: '#52c41a' } },
              { value: 65, name: '螟虫', itemStyle: { color: '#fa8c16' } },
              { value: 45, name: '蚜虫', itemStyle: { color: '#f5222d' } },
              { value: 25, name: '其他', itemStyle: { color: '#bfbfbf' } },
            ],
          },
        ],
      };
      this.pieChartInstance.setOption(option);
    },

    initTownChart() {
      this.townChartInstance = echarts.init(this.$refs.townChart);
      const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: 60, right: 20, top: 20, bottom: 40 },
        xAxis: {
          type: 'category',
          data: ['宁厂镇', '上磺镇', '凤凰镇', '通城镇', '城厢镇'],
        },
        yAxis: { type: 'value', name: '预警次数' },
        series: [
          {
            type: 'bar',
            data: [
              { value: 28, itemStyle: { color: '#f5222d' } },
              { value: 22, itemStyle: { color: '#fa8c16' } },
              { value: 18, itemStyle: { color: '#e6a23c' } },
              { value: 12, itemStyle: { color: '#52c41a' } },
              { value: 6, itemStyle: { color: '#1890ff' } },
            ],
            barWidth: '50%',
          },
        ],
      };
      this.townChartInstance.setOption(option);
    },

    initDeviceChart() {
      this.deviceChartInstance = echarts.init(this.$refs.deviceChart);
      const option = {
        tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
        grid: { left: 50, right: 20, top: 20, bottom: 40 },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
        },
        yAxis: { type: 'value', name: '在线率(%)', min: 80, max: 100 },
        series: [
          {
            type: 'line',
            smooth: true,
            data: [95, 93, 91, 89, 92, 94, 90, 88, 91, 93, 92.5],
            itemStyle: { color: '#00a854' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 168, 84, 0.3)' },
                { offset: 1, color: 'rgba(0, 168, 84, 0.02)' },
              ]),
            },
          },
        ],
      };
      this.deviceChartInstance.setOption(option);
    },

    updateTrendChart() {
      if (!this.trendChartInstance) return;
      const type = this.trendChartType;
      const option = {
        series: [
          { type: type, smooth: type === 'line' },
          { type: type, smooth: type === 'line' },
          { type: type, smooth: type === 'line' },
          { type: type, smooth: type === 'line' },
        ],
      };
      this.trendChartInstance.setOption(option);
    },

    refreshCharts() {
      ElementPlus.ElMessage.success('数据已刷新');
      // 模拟数据刷新
      this.initCharts();
    },

    resetFilters() {
      this.timeDimension = 'week';
      this.locationFilter = [];
      this.diseaseFilter = '';
      ElementPlus.ElMessage.success('筛选条件已重置');
    },
  },
}).use(ElementPlus);
registerGlobalMethods(statsApp);
statsApp.mount('#app');
