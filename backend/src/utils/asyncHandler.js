import { ApiError } from "./apiError.js";

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            console.log("Incoming request", {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                query: req.query,
                body: req.body,
            });

            await requestHandler(req, res, next);
        } catch (err) {
            // Log only if it's not an ApiError
            if (!(err instanceof ApiError)) {
                console.error("Unhandled error in asyncHandler", {
                    statusCode: err?.statusCode || 500,
                    message: err?.message || "Unhandled error occurred",
                    stack: err?.stack,
                });
            }

            // Forward to centralized error handler
            next(err);
        }
    };
};

export { asyncHandler };
