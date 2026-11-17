/**
 * 预警配置页面 - 业务逻辑
 */
const { createApp, ref, reactive, computed } = Vue;

const warningApp = createApp({
  data() {
    return {
      // 当前选中的菜单类型
      currentType: 'pest',

      // 抽屉状态
      drawerVisible: false,
      drawerTitle: '新建预警规则',
      editingRuleId: null,

      // 规则列表（模拟数据）
      allRules: [
        { id: 1, type: 'pest', name: '东区水稻虫情监测', scope: '测报灯1号 (稻飞虱)', threshold: '蓝色: >30 | 黄色: >50 | 橙色: >200 | 红色: >500', push: '短信, 邮件, APP', status: true },
        { id: 2, type: 'pest', name: '西区玉米虫情监测', scope: '测报灯2号 (玉米螟)', threshold: '蓝色: >30 | 黄色: >50 | 橙色: >200 | 红色: >500', push: 'APP', status: false },
        { id: 3, type: 'spore', name: '水稻病害监测', scope: '孢子仪-A (稻瘟病)', threshold: '蓝色: >10 | 黄色: >50 | 橙色: >100 | 红色: >300', push: '短信, APP', status: true },
        { id: 4, type: 'offline', name: '设备离线预警', scope: '全部设备', threshold: '蓝色: ≥10分钟 | 黄色: ≥20分钟 | 橙色: ≥30分钟 | 红色: ≥40分钟', push: '短信', status: true },
        { id: 5, type: 'fault', name: '设备故障预警', scope: '全部设备', threshold: '硬件损坏/网络异常/存储异常', push: '短信, 邮件', status: true },
      ],

      // 规则表单
      ruleForm: {
        name: '',
        devices: [],
        targets: [],
        smsEnabled: true,
        smsPhone: '',
        smsContent: '{deviceName}于{gpsTime}在{gpsPosition}发生{alarmLevel}{alarmType}，当前{alarmValue}，请处置。',
        emailEnabled: true,
        emailAddress: '',
        emailSubject: '【预警通知】{alarmLevel}{alarmType}',
        emailContent: '{deviceName}于{gpsTime}在{gpsPosition}发生{alarmLevel}{alarmType}，当前{alarmValue}，请处置。',
        appEnabled: true,
        appReceiver: 'all',
        appTitle: '{alarmLevel}告警：{alarmType}',
        appContent: '设备发生{alarmLevel}{alarmType}，当前值为{alarmValue}，请及时处理。',
        faultEnabled: true,
        faultTypes: ['硬件损坏', '网络异常', '存储异常'],
      },

      // 分级阈值配置
      warningLevels: [
        { name: '蓝色预警', class: 'level-blue', boxClass: 'box-blue', enabled: true, threshold: 30, days: 3, thresholdMin: 30, labelName: '当日虫口密度', unit: '头/天' },
        { name: '黄色预警', class: 'level-yellow', boxClass: 'box-yellow', enabled: true, threshold: 50, days: 3, thresholdMin: 50, labelName: '当日虫口密度', unit: '头/天' },
        { name: '橙色预警', class: 'level-orange', boxClass: 'box-orange', enabled: true, threshold: 200, days: 3, thresholdMin: 200, labelName: '当日虫口密度', unit: '头/天' },
        { name: '红色预警', class: 'level-red', boxClass: 'box-red', enabled: true, threshold: 500, days: 3, thresholdMin: 500, labelName: '当日虫口密度', unit: '头/天' },
      ],
    };
  },

  computed: {
    // 页面标题
    pageTitle() {
      const titleMap = {
        'pest': '虫情监测规则列表',
        'spore': '病害监测规则列表',
        'offline': '设备离线规则列表',
        'fault': '设备故障规则列表'
      };
      return titleMap[this.currentType] || '预警规则列表';
    },

    // 当前类型的规则列表
    currentRules() {
      return this.allRules.filter(r => r.type === this.currentType);
    },

    // 可用设备列表
    availableDevices() {
      if (this.currentType === 'pest') {
        return ['1号测报灯 (东区)', '2号测报灯 (西区)'];
      } else if (this.currentType === 'spore') {
        return ['孢子仪-A', '孢子仪-B'];
      } else {
        return ['全部设备'];
      }
    },

    // 可用目标列表（虫种或作物）
    availableTargets() {
      if (this.currentType === 'pest') {
        return ['稻飞虱', '玉米螟', '螟虫', '蚜虫'];
      } else if (this.currentType === 'spore') {
        return ['水稻', '小麦', '玉米'];
      }
      return [];
    },

    // APP推送是否启用
    appPushEnabled() {
      return this.ruleForm.appEnabled;
    }
  },

  methods: {
    // 切换菜单
    filterList(type) {
      this.currentType = type;
    },

    // 切换规则状态
    toggleRuleStatus(rule) {
      ElementPlus.ElMessage.success(`规则「${rule.name}」已${rule.status ? '启用' : '停用'}`);
    },

    // 打开抽屉
    openDrawer(mode, id = null) {
      this.drawerVisible = true;
      this.editingRuleId = id;
      
      if (mode === 'create') {
        this.drawerTitle = '新建预警规则';
        this.resetForm();
      } else {
        this.drawerTitle = '编辑预警规则';
        this.loadRuleData(id);
      }
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false;
      this.editingRuleId = null;
    },

    // 重置表单
    resetForm() {
      this.ruleForm = {
        name: '',
        devices: [...this.availableDevices],
        targets: [],
        smsEnabled: true,
        smsPhone: '',
        smsContent: '{deviceName}于{gpsTime}在{gpsPosition}发生{alarmLevel}{alarmType}，当前{alarmValue}，请处置。',
        emailEnabled: true,
        emailAddress: '',
        emailSubject: '【预警通知】{alarmLevel}{alarmType}',
        emailContent: '{deviceName}于{gpsTime}在{gpsPosition}发生{alarmLevel}{alarmType}，当前{alarmValue}，请处置。',
        appEnabled: true,
        appReceiver: 'all',
        appTitle: '{alarmLevel}告警：{alarmType}',
        appContent: '设备发生{alarmLevel}{alarmType}，当前值为{alarmValue}，请及时处理。',
        faultEnabled: true,
        faultTypes: ['硬件损坏', '网络异常', '存储异常'],
      };
    },

    // 加载规则数据（编辑模式）
    loadRuleData(id) {
      const rule = this.allRules.find(r => r.id === id);
      if (rule) {
        this.ruleForm.name = rule.name;
        // 其他字段可以根据需要加载
      }
    },

    // 保存规则
    saveRule() {
      if (!this.ruleForm.name) {
        ElementPlus.ElMessage.warning('请填写规则名称');
        return;
      }

      // 生成阈值描述
      let thresholdDesc = '';
      if (this.currentType === 'fault') {
        thresholdDesc = this.ruleForm.faultTypes.join('/');
      } else {
        thresholdDesc = this.warningLevels
          .filter(l => l.enabled)
          .map(l => `${l.name.replace('预警', '')}: ≥${l.threshold}`)
          .join(' | ');
      }

      // 生成推送渠道描述
      const pushChannels = [];
      if (this.ruleForm.smsEnabled) pushChannels.push('短信');
      if (this.ruleForm.emailEnabled) pushChannels.push('邮件');
      if (this.ruleForm.appEnabled) pushChannels.push('APP');

      if (this.editingRuleId) {
        // 编辑模式
        const rule = this.allRules.find(r => r.id === this.editingRuleId);
        if (rule) {
          rule.name = this.ruleForm.name;
          rule.threshold = thresholdDesc;
          rule.push = pushChannels.join(', ');
        }
        ElementPlus.ElMessage.success('规则已更新');
      } else {
        // 新建模式
        const newRule = {
          id: Date.now(),
          type: this.currentType,
          name: this.ruleForm.name,
          scope: this.ruleForm.devices.join(', ') || '未配置',
          threshold: thresholdDesc,
          push: pushChannels.join(', '),
          status: true
        };
        this.allRules.push(newRule);
        ElementPlus.ElMessage.success('规则已添加');
      }

      this.closeDrawer();
    },

    // 删除规则
    deleteRule(rule) {
      ElementPlus.ElMessageBox.confirm(`确定删除规则「${rule.name}」？`, '提示', {
        type: 'warning',
        confirmButtonClass: 'el-button--primary'
      })
        .then(() => {
          const idx = this.allRules.indexOf(rule);
          if (idx > -1) {
            this.allRules.splice(idx, 1);
            ElementPlus.ElMessage.success('已删除');
          }
        })
        .catch(() => {});
    },
  },
}).use(ElementPlus);

registerGlobalMethods(warningApp);
warningApp.mount('#app');
