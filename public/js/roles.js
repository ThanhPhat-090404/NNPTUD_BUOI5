/**
 * Xử lý logic mặt Role
 */
const roleUI = {
    globalRoles: [],
    modalObj: null,

    getModal() {
        if (!this.modalObj) this.modalObj = new bootstrap.Modal(document.getElementById('roleModal'));
        return this.modalObj;
    },

    async loadRoles() {
        try {
            const res = await api.get('/roles');
            this.globalRoles = res.data;
            this.renderTable();

            // Update select box trong user form
            userUI.updateRoleSelect(this.globalRoles);
        } catch (err) {
            console.error(err);
        }
    },

    renderTable() {
        const tbody = document.getElementById('roleTableBody');
        if (!this.globalRoles.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center">Chưa có Role nào</td></tr>`;
            return;
        }

        tbody.innerHTML = this.globalRoles.map(role => `
      <tr>
        <td class="fw-bold">${role.name}</td>
        <td class="text-muted"><small>${role.description || ''}</small></td>
        <td><small>${new Date(role.createdAt).toLocaleDateString()}</small></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary" onclick="roleUI.openEditModal('${role._id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="roleUI.deleteRole('${role._id}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    },

    openCreateModal() {
        document.getElementById('roleForm').reset();
        document.getElementById('roleId').value = '';
        document.getElementById('roleModalTitle').innerText = 'Add Role';
    },

    openEditModal(id) {
        const role = this.globalRoles.find(r => r._id === id);
        if (!role) return;

        document.getElementById('roleId').value = role._id;
        document.getElementById('formRoleName').value = role.name;
        document.getElementById('formRoleDesc').value = role.description;
        document.getElementById('roleModalTitle').innerText = 'Edit Role';

        this.getModal().show();
    },

    async handleSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('roleId').value;
        const data = {
            name: document.getElementById('formRoleName').value,
            description: document.getElementById('formRoleDesc').value
        };

        try {
            if (id) {
                await api.put(`/roles/${id}`, data);
            } else {
                await api.post(`/roles`, data);
            }
            this.getModal().hide();
            this.loadRoles(); // reload data
        } catch (err) { }
    },

    async deleteRole(id) {
        if (!confirm('Chắc chắn xoá(mềm) Role này?')) return;
        try {
            await api.delete(`/roles/${id}`);
            this.loadRoles();
        } catch (err) { }
    }
};
