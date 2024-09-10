"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
exports.default = new pg_1.Pool({
    connectionString: "postgresql://michaelstetter:password@localhost:5432/todo"
});
