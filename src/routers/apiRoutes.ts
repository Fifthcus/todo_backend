import express from "express";
import { findUsersList, addTaskToDB } from "../database/apiQueries"

const apiRoutes = express.Router();

interface TaskObject {
    user: {
        id: number
    },
    isCompleted: boolean,
    task: string,
}

//Fetch entire list.
apiRoutes.get("/:id/list", async (req, res) => {
    const { id } = req.params;
    try {
        const list = await findUsersList(id);
        res.status(200).json({ list });
    } catch(err) {
        res.status(500).json({ message:  "An error occured", error: err});
    }
});
//Add task.
apiRoutes.post("/list/task", async (req, res) => {
    console.log(req.body);
    const { user, isCompleted, task } = <TaskObject>req.body;
    try {
        await addTaskToDB(user.id, isCompleted, task);
        res.status(200).json({ message: "Task added." });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message:  "An error occured", error: err});
    }
});

export default apiRoutes;