import express from "express";
import { findUsersList, addTaskToDB, deleteTaskFromDB, updateTaskToDB, updateStatusToDB } from "../database/apiQueries"

const apiRoutes = express.Router();

interface TaskObject {
    user: {
        id: number
    },
    iscompleted: boolean,
    task: string,
}

//Fetch entire list.
apiRoutes.get("/list/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const list = await findUsersList(id);
        res.status(200).json({ list });
    } catch(err) {
        res.status(500).json({ message: "An error occured", error: err});
    }
});
//Add task.
apiRoutes.post("/list/task", async (req, res) => {
    const { user, iscompleted, task } = <TaskObject>req.body;
    try {
        await addTaskToDB(user.id, iscompleted, task);
        res.status(200).json({ message: "Task added." });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message:  "An error occured", error: err});
    }
});
//Update task
apiRoutes.put("/list/task/:id", async (req, res) => {
    const { id } = req.params;
    const { task, whatIsBeingUpdated } = req.body;
    try {
        if(whatIsBeingUpdated === "task") {
            await updateTaskToDB(task.task, id);
        } else if(whatIsBeingUpdated === "status") {
            await updateStatusToDB(task.iscompleted, id);
        }
        res.status(200).json({ message: "Task updated." });
    } catch(error) {
        console.error(error);
    }
})
//Delete a task
apiRoutes.delete("/list/task/:id", async (req, res) => {
    const { id } = req.params;
    await deleteTaskFromDB(id);
    res.status(200).json({ message: "Task deleted." });
});

export default apiRoutes;