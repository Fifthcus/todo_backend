import db from "./pool";

export const findUsersList = async (id: string) => {
    const {rows} = await db.query("SELECT * FROM tasks WHERE user_id = ($1)", [id]);
    return rows;
}
export const addTaskToDB = async (user_id: number, isCompleted: boolean, task: string) => {
    await db.query("INSERT INTO tasks (user_id, task, isCompleted) VALUES ($1, $2, $3)", [user_id, task, isCompleted]);
}