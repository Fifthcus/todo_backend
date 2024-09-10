import { Pool } from "pg";

export default new Pool({
    connectionString: "postgresql://michaelstetter:password@localhost:5432/todo"
  });