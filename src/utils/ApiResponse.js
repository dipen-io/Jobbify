class ApiResponse {
    constructor(statusCode, message, data = null, meta = {}) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = {
            timestamps: new Date().toISOString(),
            unix: Date.now(),
            meta,
        }
    }
}

module.exports = ApiResponse;
