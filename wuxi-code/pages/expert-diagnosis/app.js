/**
 * 专家诊断页面 - 业务逻辑
 */
const { createApp } = Vue;

const diagnosisApp = createApp({
  data() {
    return {
      activeView: 'workspace',

      // ===== 工作台 - 任务队列 =====
      activeTaskTab: 'pending',
      taskTabs: [
        { key: 'pending', label: '待接诊', count: 3 },
        { key: 'processing', label: '处理中', count: 1 },
        { key: 'completed', label: '已完成', count: 2 },
      ],
      selectedTaskId: 1,
      tasks: [
        { id: 1, submitter: '李农户', cropType: '水稻', diseaseType: '稻瘟病', description: '叶片出现大量褐色斑点，伴有枯黄现象，面积约2亩', timeAgo: '10分钟前', status: 'pending', urgent: true },
        { id: 2, submitter: '王合作社', cropType: '玉米', diseaseType: '赤霉病', description: '玉米棒子顶端发霉，有粉色霉层，影响收成', timeAgo: '1小时前', status: 'pending', urgent: false },
        { id: 3, submitter: '赵村民', cropType: '小麦', diseaseType: '白粉病', description: '小麦叶片正面出现白色粉状斑，逐渐扩大连片', timeAgo: '3小时前', status: 'pending', urgent: false },
        { id: 4, submitter: '孙农技', cropType: '水稻', diseaseType: '纹枯病', description: '水稻基部叶鞘出现云纹状病斑，湿度大时有菌丝', timeAgo: '昨天', status: 'processing', urgent: false },
        { id: 5, submitter: '周植保', cropType: '蔬菜', diseaseType: '霜霉病', description: '黄瓜叶片背面出现白色霉层，正面有黄斑', timeAgo: '2天前', status: 'completed', urgent: false },
        { id: 6, submitter: '吴农户', cropType: '果树', diseaseType: '炭疽病', description: '柑橘果实出现圆形凹陷病斑，有同心轮纹', timeAgo: '3天前', status: 'completed', urgent: false },
      ],

      // ===== 工作台 - 图像工具 =====
      activeTool: '圈注',
      imageTools: ['移动', '圈注', '箭头', '文字'],

      // ===== 工作台 - 问诊讨论区 =====
      chatInput: '',
      chatMessages: [
        { role: 'farmer', name: '李农户', time: '2026-10-26 09:00', text: '专家您好，这水稻叶子这两天突然这样了，麻烦您看看是怎么回事？', desc: '前天打过一次杀虫剂，昨天开始出现斑点。', image: '现场照片1.jpg', isOwner: true },
        { role: 'expert', name: '张教授', time: '2026-10-26 09:15', text: '从图片看初步判断是稻瘟病。请问最近当地是不是持续阴雨天气？湿度比较大？' },
        { role: 'farmer', name: '李农户', time: '2026-10-26 09:30', text: '是的，这几天一直在下雨，田里积水很多。', replyTo: '张教授', replyText: '从图片看初步判断是稻瘟病...' },
      ],

      // ===== 工作台 - 诊断表单 =====
      diagForm: { diseaseName: '水稻稻瘟病', cause: '连续阴雨高湿环境导致病菌孢子萌发。', treatment: '1. 立即排水晒田；\n2. 停止施用氮肥。', medication: '建议使用 75%三环唑可湿性粉剂 30克/亩，兑水50公斤喷雾。' },

      // ===== 案例库 =====
      caseFilter: { keyword: '', cropType: '', diseaseCategory: '' },
      caseList: [
        { id: 1, diseaseName: '水稻稻瘟病', cropType: '水稻', archiveDate: '2026-10-25', symptoms: '叶片出现梭形病斑，中央灰白色，边缘褐色，严重时叶片枯死。', cause: '连续阴雨高湿环境导致病菌孢子萌发，且前期偏施氮肥，植株抗病性下降。', treatment: '1. 立即排水晒田，降低田间湿度；\n2. 停止施用氮肥，增施磷钾肥。', medication: '建议使用 75%三环唑可湿性粉剂 30克/亩，兑水50公斤喷雾。', hot: true },
        { id: 2, diseaseName: '玉米赤霉病', cropType: '玉米', archiveDate: '2026-10-20', symptoms: '玉米穗顶部出现粉色霉层，籽粒腐烂变轻，影响产量和品质。', cause: '收获期遇连续阴雨，病菌从花丝侵入果穗。', treatment: '1. 适时收获，避免在雨天收割；\n2. 收获后及时晾晒干燥。', medication: '发病初期喷施 50%多菌灵可湿性粉剂 500倍液。', hot: false },
        { id: 3, diseaseName: '番茄白粉病', cropType: '蔬菜', archiveDate: '2026-09-15', symptoms: '叶片正面出现白色粉状斑，逐渐扩大连片，严重时叶片枯黄脱落。', cause: '通风不良、湿度大、光照不足时易发病。', treatment: '1. 加强通风透光；\n2. 及时清除病叶。', medication: '喷施 15%三唑酮可湿性粉剂 1000倍液，每隔7天一次。', hot: false },
        { id: 4, diseaseName: '小麦纹枯病', cropType: '小麦', archiveDate: '2026-09-01', symptoms: '茎基部叶鞘出现云纹状病斑，湿度大时有白色菌丝。', cause: '播种过早、密度过大、氮肥过多。', treatment: '1. 适期播种，合理密植；\n2. 控制氮肥用量。', medication: '拔节期喷施 5%井冈霉素水剂 100ml/亩。', hot: false },
        { id: 5, diseaseName: '柑橘炭疽病', cropType: '果树', archiveDate: '2026-08-20', symptoms: '果实出现圆形凹陷病斑，褐色，有同心轮纹，潮湿时有粉红色孢子堆。', cause: '高温多雨季节易发，伤口侵入为主。', treatment: '1. 加强果园管理，增强树势；\n2. 及时清除病果病枝。', medication: '发病初期喷施 25%咪鲜胺乳油 1000倍液。', hot: true },
        { id: 6, diseaseName: '水稻螟虫', cropType: '水稻', archiveDate: '2026-08-10', symptoms: '水稻心叶出现枯心苗，剥开可见螟虫幼虫，茎秆有虫孔。', cause: '秸秆未处理，虫源基数大，适宜温度下大量繁殖。', treatment: '1. 秸秆还田处理，减少虫源；\n2. 释放赤眼蜂生物防治。', medication: '幼虫孵化高峰期喷施 Bt乳剂 200ml/亩。', hot: false },
      ],

      // ===== 案例详情 =====
      caseDetailVisible: false,
      currentCase: null,
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(t => t.status === this.activeTaskTab);
    },
    selectedTask() {
      return this.tasks.find(t => t.id === this.selectedTaskId) || null;
    },
  },
  methods: {
    selectTask(task) {
      this.selectedTaskId = task.id;
      // 切换任务时更新讨论区和表单
      this.chatMessages = [
        { role: 'farmer', name: task.submitter, time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'), text: `专家您好，我的${task.cropType}出现了问题，麻烦您看看。`, desc: task.description, isOwner: true },
        { role: 'expert', name: '张教授', time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'), text: '收到，正在查看您提交的图片和描述...' },
      ];
      this.diagForm = { diseaseName: '', cause: '', treatment: '', medication: '' };
    },

    // 发送消息
    sendChat() {
      if (!this.chatInput.trim()) return;
      const task = this.selectedTask;
      this.chatMessages.push({
        role: 'expert',
        name: '张教授',
        time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        text: this.chatInput,
      });
      this.chatInput = '';
      this.$nextTick(() => {
        const el = this.$refs.chatHistory;
        if (el) el.scrollTop = el.scrollHeight;
      });
      // 模拟农户回复
      setTimeout(() => {
        this.chatMessages.push({
          role: 'farmer',
          name: task?.submitter || '农户',
          time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
          text: '收到，正在分析您提供的信息...',
          replyTo: '张教授',
          replyText: this.chatMessages[this.chatMessages.length - 1].text,
        });
        this.$nextTick(() => {
          const el = this.$refs.chatHistory;
          if (el) el.scrollTop = el.scrollHeight;
        });
      }, 1000);
    },

    // 图像工具
    clearAnnotations() {
      ElementPlus.ElMessage.info('标注已清空');
    },

    // 诊断提交
    saveDraft() {
      ElementPlus.ElMessage.success('草稿已保存');
    },
    submitDiagnosis() {
      if (!this.diagForm.diseaseName) {
        ElementPlus.ElMessage.warning('请填写病害名称');
        return;
      }
      ElementPlus.ElMessageBox.confirm('确定提交诊断结论并归档到案例库？', '提示', { type: 'info' })
        .then(() => {
          // 添加到案例库
          this.caseList.unshift({
            id: this.caseList.length + 1,
            diseaseName: this.diagForm.diseaseName,
            cropType: this.selectedTask?.cropType || '—',
            archiveDate: formatDate(new Date(), 'YYYY-MM-DD'),
            symptoms: this.selectedTask?.description || '—',
            cause: this.diagForm.cause,
            treatment: this.diagForm.treatment,
            medication: this.diagForm.medication,
            hot: false,
          });
          // 更新任务状态
          const task = this.tasks.find(t => t.id === this.selectedTaskId);
          if (task) task.status = 'completed';
          ElementPlus.ElMessage.success('诊断已提交并归档入库');
          this.activeView = 'caselib';
        })
        .catch(() => {});
    },

    // 案例库
    searchCases() {
      ElementPlus.ElMessage.success('检索完成');
    },
    openCaseDetail(caseItem) {
      this.currentCase = caseItem;
      this.caseDetailVisible = true;
    },
  },
}).use(ElementPlus);

registerGlobalMethods(diagnosisApp);
diagnosisApp.mount('#app');
