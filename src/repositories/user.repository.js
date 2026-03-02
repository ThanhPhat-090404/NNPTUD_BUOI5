const User = require('../models/User.model');

/**
 * Repository cho User — tất cả DB queries tập trung tại đây
 */
const userRepository = {
    /**
     * Tạo user mới
     */
    create: async (data) => {
        return await User.create(data);
    },

    /**
     * Lấy tất cả users chưa bị xoá mềm (populate role)
     */
    findAll: async () => {
        return await User.find({ isDeleted: false })
            .populate('role', 'name description')
            .sort({ createdAt: -1 });
    },

    /**
     * Lấy user theo ID (chưa bị xoá)
     */
    findById: async (id) => {
        return await User.findOne({ _id: id, isDeleted: false }).populate('role', 'name description');
    },

    /**
     * Cập nhật user theo ID
     */
    update: async (id, data) => {
        return await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true, runValidators: true }
        ).populate('role', 'name description');
    },

    /**
     * Xoá mềm: đặt isDeleted = true
     */
    softDelete: async (id) => {
        return await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
    },

    /**
     * Tìm user theo email VÀ username (dùng cho enable/disable)
     */
    findByEmailAndUsername: async (email, username) => {
        return await User.findOne({
            email: email.toLowerCase().trim(),
            username: username.trim(),
            isDeleted: false,
        });
    },

    /**
     * Cập nhật trạng thái status của user
     */
    setStatus: async (id, status) => {
        return await User.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        ).populate('role', 'name description');
    },
};

module.exports = userRepository;
