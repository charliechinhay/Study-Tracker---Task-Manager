// Custom error class for application-specific errors
class AppError extends Error{
    constructor(status, message, code, errors){
        super(message);
        this.status = status;
        this.code = code;
        this.errors = errors;
    }
}

export default AppError;