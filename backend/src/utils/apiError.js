class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        data = null,
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = false;
        this.errors = errors;

        // Capture the stack trace if no stack is provided
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Format the error as a response object
    toResponse() {
        return {
            success: this.success,
            message: this.message,
            errors: this.errors,
            data: this.data,
        };
    }

    logError() {
        console.error("ApiError occurred", {
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
            stack: this.stack,
        });
    }
}

export { ApiError };
