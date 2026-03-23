class ApiResponse {
    constructor(statusCode, message, data = null, meta = {}) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.meta = meta;
        this.data = data;
    }
}

module.exports = ApiResponse;
