import db from "./pool";

export const findUsersList = async (id: string) => {
    const {rows} = await db.query("SELECT * FROM tasks WHERE user_id = ($1)", [id]);
    return rows;
}
export const addTaskToDB = async (user_id: number, isCompleted: boolean, task: string) => {
    await db.query("INSERT INTO tasks (user_id, task, isCompleted) VALUES ($1, $2, $3)", [user_id, task, isCompleted]);
}
export const deleteTaskFromDB = async (id: string) => {
    await db.query("DELETE FROM tasks WHERE id = ($1)", [id]);
}
export const updateTaskToDB = async (task: string, id: string) => {
    await db.query("UPDATE tasks SET task = ($1) WHERE id = ($2)", [task, id]);
}

export const updateStatusToDB = async (status: boolean, id: string) => {
    console.log(status);
    await db.query("UPDATE tasks SET iscompleted = ($1) WHERE id = ($2)", [status, id]);
}