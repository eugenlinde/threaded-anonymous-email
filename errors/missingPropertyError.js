class MissingPropertyError extends Error {
    constructor(message) {
        super(message);
        this.name = "MissingPropertyError";
        this.code = 400;
    }
}

export default MissingPropertyError;