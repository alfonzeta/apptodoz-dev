const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
const authenticateToken = require("./auth");

router.get("/", authenticateToken, (req, res) => {
    const userId = req.user.userId;
    console.log(userId);

    Todo.find({
        active: true,
        $or: [
            { userId: userId },
            { "collaborator.userId": userId }
        ]
    })
        .sort({ timestamp: -1 })
        .exec()
        .then(todos => {
            res.status(200).json({ ok: true, todos: todos });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ ok: false, error });
        });
});


router.get("/:id", authenticateToken, (req, res) => {
    const id = req.params.id

    Todo.find({ _id: id })
        .sort({ timestamp: "descending" })
        .exec()
        .then(todos => {
            res.status(200).json({ ok: true, todos: todos });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ ok: false, error });
        });
});

router.post("/", (req, res) => {
    let body = req.body

    const todo = new Todo({
        userId: body.userId,
        title: body.title,
        status: body.status,
        author: {
            userId: body.author.userId,
            username: body.author.username,
            firstName: body.author.firstName,
            lastName: body.author.lastName
        },
        deadline: body.deadline
    })

    todo.save()
        .then(savedTodo => {
            res.status(201).json({
                ok: true,
                savedTodo: savedTodo
            })
        })
        .catch(error => {
            res.status(400).json({
                ok: false,
                error
            })
        })
})


router.put("/updateAuthor", authenticateToken, async (req, res) => {
    try {
        const body = req.body;
        const userId = req.user.userId;
        console.log("userid:", userId);
        console.log("body:", body);

        if (body.author) {
            const updatedTodos = await Todo.updateMany(
                { "author.userId": userId },
                {
                    $set: {
                        "author.firstName": body.author.firstName,
                        "author.lastName": body.author.lastName
                    }
                },
                { new: true, runValidators: true }
            );
            res.status(200).json({ ok: true, updatedTodos });
        } else {
            res.status(400).json({ ok: false, error: "firstName and lastName are required" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "An error occurred while updating todos" });
    }
});

router.put("/removeAccount", authenticateToken, async (req, res) => {
    try {
        const body = req.body;


        if (body.removeCollaborator) {
            const collaboratorId = body.removeCollaborator;

            // Update all todos where the collaborator's userId matches the provided one
            const updatedTodos = await Todo.updateMany(
                { "collaborator.userId": collaboratorId },
                { $pull: { collaborator: { userId: collaboratorId } } },
                { new: true, runValidators: true }
            );
            console.log("todos1");
            const removedTodos = await Todo.deleteMany(
                { userId: body.removeCollaborator },
                { new: true, runValidators: true }
            );

            res.status(200).json({ ok: true, updatedTodos, removedTodos });
        } else {
            res.status(400).json({ ok: false, error: "removeCollaborator field is required" });
        }
    } catch (error) {

        console.error(error);
        res.status(400).json({ ok: false, error });
    }
});



router.put("/updateTodo/:id", authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const body = req.body;

        let updatedTodo = await Todo.findById(id)
        console.log("id: ", id);
        console.log("req.body:", req.body);
        console.log("userId: ", userId);

        if (updatedTodo.userId.toString() === userId) {
            // Check if the request contains a removeContact field
            if (body.removeCollaborator) {
                console.log("here");
                updatedTodo = await Todo.findByIdAndUpdate(
                    id,
                    { $pull: { collaborator: body.removeCollaborator } },
                    { new: true, runValidators: true }
                );

            } else if (body.collaborator) {

                if (!updatedTodo.collaborator.some(collaborator => collaborator.userId.toString() === body.collaborator.userId)) {

                    updatedTodo = await Todo.findByIdAndUpdate(
                        id,
                        { $addToSet: { collaborator: body.collaborator } },
                        { new: true, runValidators: true }
                    )
                } else {
                    return
                };
            } else {
                updatedTodo = await Todo.findByIdAndUpdate(

                    id,
                    { $set: body },
                    { new: true, runValidators: true }
                );
            }

            res.status(200).json({ ok: true, updatedTodo });
        } else if (!body.collaborator && !body.removeCollaborator && !body.title) {

            updatedTodo = await Todo.findByIdAndUpdate(
                id,
                { $set: body },
                { new: true, runValidators: true }
            );
            res.status(200).json({ ok: true, updatedTodo });
        }
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                ok: false,
                error: "Duplicate contact request"
            });
        } else {

            console.error(error);
            res.status(400).json({ ok: false, error });
        }
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.userId;

    let updatedTodo = await Todo.findById(id)
    console.log("detodo:", userId);
    console.log("detoken:", updatedTodo.userId.toString());

    if (updatedTodo.userId.toString() === userId) {

        Todo.findByIdAndUpdate(id,
            { active: false },
            { new: true, runValidators: true })
            .then(removedTodo => {
                res.status(200).json({ ok: true, removedTodo: removedTodo })
            })
            .catch(error => {
                res.status(400).json({ ok: false, error })
            })
    }
})



// EMPTY ALL COLLABORATORS FROM ALL TO DOS
// router.put("/", authenticateToken, async (req, res) => {
//     try {
//         const body = req.body;

//         let updatedTodos;
//         updatedTodos = await Todo.updateMany(
//             {},
//             { $set: body },
//             { new: true, runValidators: true }
//         )
//         res.status(200).json({ ok: true, updatedTodos });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ ok: false, error });
//     }
// });





module.exports = router;
