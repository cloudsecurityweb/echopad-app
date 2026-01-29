class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;

        // Log the response
        if (this.success) {
            console.log("ApiResponse sent", {
                statusCode: this.statusCode,
                message: this.message,
                data: this.data,
            });
        } else {
            console.warn("ApiResponse sent with warnings/errors", {
                statusCode: this.statusCode,
                message: this.message,
                data: this.data,
            });
        }
    }
}

export { ApiResponse };