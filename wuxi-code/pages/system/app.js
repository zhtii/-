/**
 * 系统管理页面 - 业务逻辑
 */
const { createApp } = Vue;

const systemApp = createApp({
  data() {
    return {
      activeModule: 'user',

      // ===== 用户管理 =====
      userFilter: { keyword: '', role: '', status: '' },
      userList: [
        { id: 1, username: 'admin', realName: '系统管理员', phone: '13800000001', role: '超级管理员', orgName: '巫溪县农业局', status: '启用', createTime: '2026-01-01 08:00', lastLogin: '2026-11-06 09:30' },
        { id: 2, username: 'zhangsan', realName: '张三', phone: '13800000002', role: '农技员', orgName: '宁厂镇农业站', status: '启用', createTime: '2026-03-15 10:00', lastLogin: '2026-11-05 14:20' },
        { id: 3, username: 'lisi', realName: '李四', phone: '13800000003', role: '专家', orgName: '巫溪县农业局', status: '启用', createTime: '2026-02-20 09:00', lastLogin: '2026-11-04 11:00' },
        { id: 4, username: 'wangwu', realName: '王五', phone: '13800000004', role: '农技员', orgName: '上磺镇农业站', status: '禁用', createTime: '2026-04-10 14:00', lastLogin: '2026-10-20 16:00' },
        { id: 5, username: 'zhaoliu', realName: '赵六', phone: '13800000005', role: '普通用户', orgName: '凤凰镇木龙村', status: '启用', createTime: '2026-05-01 08:30', lastLogin: '2026-11-06 08:00' },
        { id: 6, username: 'sunqi', realName: '孙七', phone: '13800000006', role: '系统管理员', orgName: '巫溪县农业局', status: '启用', createTime: '2026-01-15 09:00', lastLogin: '2026-11-05 17:30' },
      ],
      userDetailVisible: false,
      currentUser: null,
      userFormVisible: false,
      userFormTitle: '新增用户',
      userForm: { username: '', realName: '', phone: '', role: '', orgId: [] },

      // 分配角色
      assignRoleVisible: false,
      selectedRoles: [],
      allRoles: ['超级管理员', '系统管理员', '农技员', '专家', '普通用户'],

      // ===== 角色管理 =====
      roleFilter: { keyword: '' },
      roleList: [
        { id: 1, name: '超级管理员', description: '拥有系统所有功能权限', userCount: 1, createTime: '2026-01-01', menuPerms: [1, 2, 3, 4, 5] },
        { id: 2, name: '系统管理员', description: '系统配置与用户管理权限', userCount: 2, createTime: '2026-01-01', menuPerms: [1, 5] },
        { id: 3, name: '农技员', description: '设备监控、预警查看、诊断请求提交', userCount: 15, createTime: '2026-02-01', menuPerms: [1, 2, 3] },
        { id: 4, name: '专家', description: '诊断工作台、案例库查看', userCount: 5, createTime: '2026-02-01', menuPerms: [3, 4] },
        { id: 5, name: '普通用户', description: '仅查看地图监控和统计报表', userCount: 30, createTime: '2026-03-01', menuPerms: [1, 4] },
      ],
      currentRole: null,
      roleFormVisible: false,
      roleFormTitle: '新增角色',
      roleForm: { name: '', description: '' },

      // 菜单权限
      menuPermVisible: false,
      menuTreeData: [
        { id: 1, label: '地图监控', children: [] },
        { id: 2, label: '预警配置', children: [] },
        { id: 3, label: '专家诊断', children: [] },
        { id: 4, label: '统计分析', children: [] },
        { id: 5, label: '系统管理', children: [
          { id: 51, label: '用户管理' },
          { id: 52, label: '角色管理' },
          { id: 53, label: '组织机构' },
        ]},
      ],

      // 数据权限
      dataPermVisible: false,
      dataScope: 'all',

      // ===== 组织机构 =====
      orgTree: [
        {
          id: 1, name: '巫溪县农业局', level: '区级', code: 'ORG-001', leader: '局长', phone: '023-51000001', userCount: 8,
          children: [
            {
              id: 11, name: '宁厂镇农业站', level: '镇级', code: 'ORG-011', leader: '站长', phone: '023-51000011', userCount: 5,
              children: [
                { id: 111, name: '双溪村服务点', level: '村级', code: 'ORG-111', leader: '村长', phone: '023-51000111', userCount: 2, children: [] },
                { id: 112, name: '盐井村服务点', level: '村级', code: 'ORG-112', leader: '村长', phone: '023-51000112', userCount: 1, children: [] },
              ],
            },
            {
              id: 12, name: '上磺镇农业站', level: '镇级', code: 'ORG-012', leader: '站长', phone: '023-51000012', userCount: 4,
              children: [
                { id: 121, name: '四湾村服务点', level: '村级', code: 'ORG-121', leader: '村长', phone: '023-51000121', userCount: 2, children: [] },
              ],
            },
            {
              id: 13, name: '凤凰镇农业站', level: '镇级', code: 'ORG-013', leader: '站长', phone: '023-51000013', userCount: 3,
              children: [],
            },
            {
              id: 14, name: '通城镇农业站', level: '镇级', code: 'ORG-014', leader: '站长', phone: '023-51000014', userCount: 3,
              children: [],
            },
          ],
        },
      ],
      orgFormVisible: false,
      orgFormTitle: '新增机构',
      orgForm: { name: '', level: '镇级', code: '', leader: '', phone: '' },
      editingOrgId: null,
      parentOrgId: null,
    };
  },
  computed: {
    orgCascaderOptions() {
      return this.orgTree.map(org => ({
        value: org.id,
        label: org.name,
        children: org.children?.map(c => ({ value: c.id, label: c.name })),
      }));
    },
  },
  methods: {
    levelTagType(level) {
      const map = { '区级': '', '镇级': 'warning', '村级': 'success' };
      return map[level] || 'info';
    },

    // ===== 用户管理 =====
    searchUsers() {
      ElementPlus.ElMessage.success('查询完成');
    },
    viewUser(row) {
      this.currentUser = row;
      this.userDetailVisible = true;
    },
    toggleUserStatus(row) {
      const action = row.status === '启用' ? '禁用' : '启用';
      ElementPlus.ElMessageBox.confirm(`确定${action}用户「${row.realName}」？`, '提示', { type: 'warning' })
        .then(() => {
          row.status = row.status === '启用' ? '禁用' : '启用';
          ElementPlus.ElMessage.success(`已${action}`);
        })
        .catch(() => {});
    },
    resetPassword(row) {
      ElementPlus.ElMessageBox.confirm(`确定重置用户「${row.realName}」的密码？`, '提示', { type: 'warning' })
        .then(() => {
          ElementPlus.ElMessage.success('密码已重置为默认密码');
        })
        .catch(() => {});
    },
    assignRole(row) {
      this.currentUser = row;
      this.selectedRoles = [row.role];
      this.assignRoleVisible = true;
    },
    saveAssignRole() {
      if (this.currentUser) {
        this.currentUser.role = this.selectedRoles[0] || '普通用户';
        ElementPlus.ElMessage.success('角色已分配');
      }
      this.assignRoleVisible = false;
    },
    deleteUser(row) {
      ElementPlus.ElMessageBox.confirm(`确定删除用户「${row.realName}」？`, '提示', { type: 'warning' })
        .then(() => {
          const idx = this.userList.indexOf(row);
          if (idx > -1) this.userList.splice(idx, 1);
          ElementPlus.ElMessage.success('已删除');
        })
        .catch(() => {});
    },
    openAddUser() {
      this.userFormTitle = '新增用户';
      this.userForm = { username: '', realName: '', phone: '', role: '', orgId: [] };
      this.userFormVisible = true;
    },
    saveUser() {
      if (!this.userForm.username || !this.userForm.realName) {
        ElementPlus.ElMessage.warning('请填写用户名和姓名');
        return;
      }
      const orgName = this.findOrgName(this.userForm.orgId);
      this.userList.push({
        id: this.userList.length + 1,
        ...this.userForm,
        orgName: orgName || '—',
        status: '启用',
        createTime: formatDate(new Date()),
        lastLogin: '—',
      });
      ElementPlus.ElMessage.success('用户已添加');
      this.userFormVisible = false;
    },
    findOrgName(orgId) {
      if (!orgId || orgId.length === 0) return '';
      for (const org of this.orgTree) {
        if (org.id === orgId[0]) {
          if (orgId.length === 1) return org.name;
          for (const child of org.children || []) {
            if (child.id === orgId[1]) return child.name;
          }
          return org.name;
        }
      }
      return '';
    },

    // ===== 角色管理 =====
    searchRoles() {
      ElementPlus.ElMessage.success('查询完成');
    },
    openAddRole() {
      this.roleFormTitle = '新增角色';
      this.roleForm = { name: '', description: '' };
      this.roleFormVisible = true;
    },
    saveRole() {
      if (!this.roleForm.name) {
        ElementPlus.ElMessage.warning('请填写角色名称');
        return;
      }
      this.roleList.push({
        id: this.roleList.length + 1,
        ...this.roleForm,
        userCount: 0,
        createTime: formatDate(new Date(), 'YYYY-MM-DD'),
        menuPerms: [],
      });
      ElementPlus.ElMessage.success('角色已添加');
      this.roleFormVisible = false;
    },
    deleteRole(row) {
      ElementPlus.ElMessageBox.confirm(`确定删除角色「${row.name}」？`, '提示', { type: 'warning' })
        .then(() => {
          const idx = this.roleList.indexOf(row);
          if (idx > -1) this.roleList.splice(idx, 1);
          ElementPlus.ElMessage.success('已删除');
        })
        .catch(() => {});
    },
    configMenuPermission(row) {
      this.currentRole = row;
      this.menuPermVisible = true;
    },
    saveMenuPerm() {
      if (this.currentRole && this.$refs.menuTree) {
        this.currentRole.menuPerms = this.$refs.menuTree.getCheckedKeys();
        ElementPlus.ElMessage.success('菜单权限已保存');
      }
      this.menuPermVisible = false;
    },
    configDataPermission(row) {
      this.currentRole = row;
      this.dataScope = 'all';
      this.dataPermVisible = true;
    },
    saveDataPerm() {
      ElementPlus.ElMessage.success('数据权限已保存');
      this.dataPermVisible = false;
    },

    // ===== 组织机构 =====
    openAddOrg() {
      this.orgFormTitle = '新增机构';
      this.orgForm = { name: '', level: '镇级', code: '', leader: '', phone: '' };
      this.editingOrgId = null;
      this.parentOrgId = null;
      this.orgFormVisible = true;
    },
    editOrg(row) {
      this.orgFormTitle = '编辑机构';
      this.orgForm = { name: row.name, level: row.level, code: row.code, leader: row.leader, phone: row.phone };
      this.editingOrgId = row.id;
      this.parentOrgId = null;
      this.orgFormVisible = true;
    },
    addChildOrg(row) {
      this.orgFormTitle = '新增下级机构';
      const levelMap = { '区级': '镇级', '镇级': '村级', '村级': '村级' };
      this.orgForm = { name: '', level: levelMap[row.level] || '村级', code: '', leader: '', phone: '' };
      this.editingOrgId = null;
      this.parentOrgId = row.id;
      this.orgFormVisible = true;
    },
    saveOrg() {
      if (!this.orgForm.name) {
        ElementPlus.ElMessage.warning('请填写机构名称');
        return;
      }
      if (this.editingOrgId) {
        // 编辑
        this.updateOrgNode(this.orgTree, this.editingOrgId, this.orgForm);
        ElementPlus.ElMessage.success('机构已更新');
      } else if (this.parentOrgId) {
        // 添加下级
        const parent = this.findOrgNode(this.orgTree, this.parentOrgId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push({
            id: Date.now(),
            ...this.orgForm,
            userCount: 0,
            children: [],
          });
        }
        ElementPlus.ElMessage.success('下级机构已添加');
      } else {
        // 新增顶级
        this.orgTree.push({
          id: Date.now(),
          ...this.orgForm,
          userCount: 0,
          children: [],
        });
        ElementPlus.ElMessage.success('机构已添加');
      }
      this.orgFormVisible = false;
    },
    findOrgNode(nodes, id) {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = this.findOrgNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    updateOrgNode(nodes, id, form) {
      for (const node of nodes) {
        if (node.id === id) {
          Object.assign(node, form);
          return true;
        }
        if (node.children && this.updateOrgNode(node.children, id, form)) return true;
      }
      return false;
    },
    deleteOrg(row) {
      ElementPlus.ElMessageBox.confirm(`确定删除机构「${row.name}」及其下级？`, '提示', { type: 'warning' })
        .then(() => {
          this.removeOrgNode(this.orgTree, row.id);
          ElementPlus.ElMessage.success('已删除');
        })
        .catch(() => {});
    },
    removeOrgNode(nodes, id) {
      const idx = nodes.findIndex(n => n.id === id);
      if (idx > -1) {
        nodes.splice(idx, 1);
        return true;
      }
      for (const node of nodes) {
        if (node.children && this.removeOrgNode(node.children, id)) return true;
      }
      return false;
    },
  },
}).use(ElementPlus);
registerGlobalMethods(systemApp);
systemApp.mount('#app');
