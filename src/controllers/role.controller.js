const roleRepository = require('../repositories/role.repository');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/roles — Tạo role mới
 */
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return errorResponse(res, 'Tên role là bắt buộc', 400);

        const role = await roleRepository.create({ name, description });
        return successResponse(res, role, 'Tạo role thành công', 201);
    } catch (error) {
        if (error.code === 11000) return errorResponse(res, 'Tên role đã tồn tại', 409);
        return errorResponse(res, error.message);
    }
};

/**
 * GET /api/roles — Lấy tất cả roles
 */
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleRepository.findAll();
        return successResponse(res, roles, 'Lấy danh sách role thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

/**
 * GET /api/roles/:id — Lấy role theo ID
 */
const getRoleById = async (req, res) => {
    try {
        const role = await roleRepository.findById(req.params.id);
        if (!role) return errorResponse(res, 'Không tìm thấy role', 404);
        return successResponse(res, role, 'Lấy role thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

/**
 * PUT /api/roles/:id — Cập nhật role
 */
const updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await roleRepository.update(req.params.id, { name, description });
        if (!role) return errorResponse(res, 'Không tìm thấy role', 404);
        return successResponse(res, role, 'Cập nhật role thành công');
    } catch (error) {
        if (error.code === 11000) return errorResponse(res, 'Tên role đã tồn tại', 409);
        return errorResponse(res, error.message);
    }
};

/**
 * DELETE /api/roles/:id — Xoá mềm role
 */
const deleteRole = async (req, res) => {
    try {
        const role = await roleRepository.softDelete(req.params.id);
        if (!role) return errorResponse(res, 'Không tìm thấy role', 404);
        return successResponse(res, null, 'Xoá role thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };
