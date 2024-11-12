import db from "./pool"

/* async function insertUsername(username, password) {
    await db.query("INSERT INTO accounts (username, password) VALUES ($1, $2)", [username, password]);
} */

export const insertUser = async (username: string, email: string, password: string, salt: string, jwtrefresh: string) => {
    await db.query("INSERT INTO users (username, email, password, salt, jwtrefresh) VALUES ($1, $2, $3, $4, $5)", [username, email, password, salt, jwtrefresh]);
}

//For signing in.
export const getUserByEmail = async (email: string) => {
    const { rows } = await db.query("SELECT * FROM users WHERE email = ($1)", [email]);
    return rows[0];
}

export const updateUserJwtRefresh = async (id: number, jwtrefresh: string,) => {
    await db.query("UPDATE users SET jwtrefresh = ($1) WHERE id = ($2)", [jwtrefresh, id]);
}