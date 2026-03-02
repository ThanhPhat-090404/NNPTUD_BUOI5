const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 UI available at http://localhost:${PORT}`);
    console.log(`🔧 API available at http://localhost:${PORT}/api/...`);
});

// Xử lý unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Đóng server & exit process
    server.close(() => process.exit(1));
});
