/**
 * Xử lý logic cho mặt User
 */
const userUI = {
    globalUsers: [],
    userModalObj: null,
    statusModalObj: null,

    getUserModal() {
        if (!this.userModalObj) this.userModalObj = new bootstrap.Modal(document.getElementById('userModal'));
        return this.userModalObj;
    },

    getStatusModal() {
        if (!this.statusModalObj) this.statusModalObj = new bootstrap.Modal(document.getElementById('statusModal'));
        return this.statusModalObj;
    },

    async loadUsers() {
        try {
            const res = await api.get('/users');
            this.globalUsers = res.data;
            this.renderTable();
        } catch (err) {
            console.error(err);
        }
    },

    updateRoleSelect(roles) {
        const select = document.getElementById('formUserRole');
        select.innerHTML = '<option value="">-- No Role --</option>' +
            roles.map(r => `<option value="${r._id}">${r.name}</option>`).join('');
    },

    renderTable() {
        const tbody = document.getElementById('userTableBody');
        if (!this.globalUsers.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center">Chưa có User nào</td></tr>`;
            return;
        }

        tbody.innerHTML = this.globalUsers.map(u => `
      <tr>
        <td><img src="${u.avatarUrl}" class="avatar-sm"></td>
        <td>
          <div class="fw-bold">${u.username}</div>
          <small class="text-muted">${u.fullName}</small>
        </td>
        <td>${u.email}</td>
        <td><span class="badge bg-secondary">${u.role ? u.role.name : 'Unknown'}</span></td>
        <td>
          <span class="badge badge-status ${u.status ? 'active' : 'inactive'} px-2 py-1">
            <i class="bi ${u.status ? 'bi-check-circle' : 'bi-dash-circle'} me-1"></i>
            ${u.status ? 'Active' : 'Disabled'}
          </span>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-info me-1" title="Toggle Status" onclick="userUI.openStatusModal('${u._id}', ${u.status})">
            <i class="bi bi-toggle-${u.status ? 'on' : 'off'}"></i>
          </button>
          <button class="btn btn-sm btn-outline-primary" onclick="userUI.openEditModal('${u._id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="userUI.deleteUser('${u._id}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    },

    openCreateModal() {
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('userModalTitle').innerText = 'Add User';

        // Yêu cầu pass
        document.getElementById('formPassword').required = true;
        document.getElementById('pwdHelp').style.display = 'none';
    },

    openEditModal(id) {
        const u = this.globalUsers.find(x => x._id === id);
        if (!u) return;

        document.getElementById('userForm').reset();
        document.getElementById('userId').value = u._id;
        document.getElementById('userModalTitle').innerText = 'Edit User';

        document.getElementById('formUsername').value = u.username;
        document.getElementById('formEmail').value = u.email;
        document.getElementById('formFullName').value = u.fullName;
        document.getElementById('formUserRole').value = u.role ? u.role._id : '';

        // Edit không bắt nhập pass
        document.getElementById('formPassword').required = false;
        document.getElementById('pwdHelp').style.display = 'block';

        this.getUserModal().show();
    },

    async handleSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('userId').value;

        const data = {
            username: document.getElementById('formUsername').value,
            email: document.getElementById('formEmail').value,
            fullName: document.getElementById('formFullName').value,
        };

        const pwd = document.getElementById('formPassword').value;
        if (pwd) data.password = pwd; // Chỉ gửi pass nếu có nhập

        const role = document.getElementById('formUserRole').value;
        if (role) data.role = role;

        try {
            if (id) {
                await api.put(`/users/${id}`, data);
            } else {
                await api.post(`/users`, data);
            }
            this.getUserModal().hide();
            this.loadUsers();
        } catch (err) { }
    },

    async deleteUser(id) {
        if (!confirm('Chắc chắn xoá(mềm) User này?')) return;
        try {
            await api.delete(`/users/${id}`);
            this.loadUsers();
        } catch (err) { }
    },

    // === STATUS HANDLER (ENABLE / DISABLE) ===
    openStatusModal(id, currentStatus) {
        const u = this.globalUsers.find(x => x._id === id);
        if (!u) return;

        document.getElementById('statusForm').reset();
        document.getElementById('statusUserId').value = u._id;
        document.getElementById('statusEmail').value = u.email;
        document.getElementById('statusUsername').value = u.username;
        document.getElementById('statusToggle').checked = currentStatus;

        this.getStatusModal().show();
    },

    async handleStatusSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('statusUserId').value;
        const email = document.getElementById('statusEmail').value;
        const username = document.getElementById('statusUsername').value;
        const isChecked = document.getElementById('statusToggle').checked;

        const endpoint = isChecked ? '/users/enable' : '/users/disable';

        try {
            await api.post(endpoint, { email, username });
            this.getStatusModal().hide();
            this.loadUsers();
        } catch (err) {
            // Revert toggle UI if failed
            document.getElementById('statusToggle').checked = !isChecked;
        }
    }
};
