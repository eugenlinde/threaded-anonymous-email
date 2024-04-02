class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.code = 500;
    }
}

export default DatabaseError;
