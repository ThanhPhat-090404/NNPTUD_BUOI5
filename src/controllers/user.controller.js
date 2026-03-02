const userRepository = require('../repositories/user.repository');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /api/users — Tạo user mới
 */
const createUser = async (req, res) => {
    try {
        const { username, password, email, fullName, avatarUrl, role } = req.body;
        if (!username || !password || !email) {
            return errorResponse(res, 'username, password, email là bắt buộc', 400);
        }
        const user = await userRepository.create({ username, password, email, fullName, avatarUrl, role });
        return successResponse(res, user, 'Tạo user thành công', 201);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return errorResponse(res, `${field} đã tồn tại`, 409);
        }
        return errorResponse(res, error.message);
    }
};

/**
 * GET /api/users — Lấy tất cả users
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.findAll();
        return successResponse(res, users, 'Lấy danh sách user thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

/**
 * GET /api/users/:id — Lấy user theo ID
 */
const getUserById = async (req, res) => {
    try {
        const user = await userRepository.findById(req.params.id);
        if (!user) return errorResponse(res, 'Không tìm thấy user', 404);
        return successResponse(res, user, 'Lấy user thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

/**
 * PUT /api/users/:id — Cập nhật user
 */
const updateUser = async (req, res) => {
    try {
        const { username, email, fullName, avatarUrl, role, loginCount } = req.body;
        const user = await userRepository.update(req.params.id, {
            username, email, fullName, avatarUrl, role, loginCount,
        });
        if (!user) return errorResponse(res, 'Không tìm thấy user', 404);
        return successResponse(res, user, 'Cập nhật user thành công');
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return errorResponse(res, `${field} đã tồn tại`, 409);
        }
        return errorResponse(res, error.message);
    }
};

/**
 * DELETE /api/users/:id — Xoá mềm user
 */
const deleteUser = async (req, res) => {
    try {
        const user = await userRepository.softDelete(req.params.id);
        if (!user) return errorResponse(res, 'Không tìm thấy user', 404);
        return successResponse(res, null, 'Xoá user thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

/**
 * POST /api/users/enable — Kích hoạt user (status → true)
 * Body: { email, username }
 */
const enableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return errorResponse(res, 'email và username là bắt buộc', 400);
        }

        const user = await userRepository.findByEmailAndUsername(email, username);
        if (!user) return errorResponse(res, 'Không tìm thấy user với email và username đã cung cấp', 404);

        if (user.status === true) {
            return errorResponse(res, 'User đã đang ở trạng thái kích hoạt', 400);
        }

        const updated = await userRepository.setStatus(user._id, true);
        return successResponse(res, updated, 'Kích hoạt user thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

/**
 * POST /api/users/disable — Vô hiệu hoá user (status → false)
 * Body: { email, username }
 */
const disableUser = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return errorResponse(res, 'email và username là bắt buộc', 400);
        }

        const user = await userRepository.findByEmailAndUsername(email, username);
        if (!user) return errorResponse(res, 'Không tìm thấy user với email và username đã cung cấp', 404);

        if (user.status === false) {
            return errorResponse(res, 'User đã đang ở trạng thái vô hiệu hoá', 400);
        }

        const updated = await userRepository.setStatus(user._id, false);
        return successResponse(res, updated, 'Vô hiệu hoá user thành công');
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, enableUser, disableUser };
