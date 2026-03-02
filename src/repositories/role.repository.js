const Role = require('../models/Role.model');

/**
 * Repository cho Role — tất cả DB queries tập trung tại đây
 */
const roleRepository = {
    /**
     * Tạo role mới
     */
    create: async (data) => {
        return await Role.create(data);
    },

    /**
     * Lấy tất cả roles chưa bị xoá mềm
     */
    findAll: async () => {
        return await Role.find({ isDeleted: false }).sort({ createdAt: -1 });
    },

    /**
     * Lấy role theo ID (chưa bị xoá)
     */
    findById: async (id) => {
        return await Role.findOne({ _id: id, isDeleted: false });
    },

    /**
     * Cập nhật role theo ID
     */
    update: async (id, data) => {
        return await Role.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: data },
            { new: true, runValidators: true }
        );
    },

    /**
     * Xoá mềm: đặt isDeleted = true
     */
    softDelete: async (id) => {
        return await Role.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
    },
};

module.exports = roleRepository;
