const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
// Import the Workout Log Server
const { WorkoutLogModel } = require('../models');
const WorkoutLog = require('../models/workoutlog');

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

/*
====================
   Workout Log Create
=====================
*/
// router.post('/create', validateJWT, async (req, res) => {
//     const { description, definition, result } = req.body.workoutlog;
//     const {id } = req.user; 
//     const workoutLogResult = {
//         description,
//         definition,
//         result,
//         owner_id: id
//     }
//     try {
//         const newWorkoutLog = await WorkoutLogModel.create (workoutLogResult); 
//         res.status(200).json (newWorkoutLog);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
    
// });
    
router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.workoutlog
    // const {id } = req.user
    const logEntry = {
        description,
        definition,
        result,
        owner_id: req.user.id
    }
    try {
        const newLog = await WorkoutLogModel.create(logEntry)
        res.status(200).json(newLog)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})


/* 
===========================
    Get all Workout Logs
===========================
*/
// router.get("/", async (req, res) => {
//     try {
//         const entries = await WorkoutLogModel.findAll();
//         res.status(200).json(entries);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// });
 
/* 
===============================
    Get Workout Logs by User
===============================
*/
// router.get("/", validateJWT, async (req, res) => {
//     let { id } = req.user
//     try {
//         const userWorkoutLogs = await WorkoutLogModel.findall({
//             where: {
//                 owner_id: req.user.id
//             }
//         });
//         res.status(200).json(userWorkoutLogs);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// });

router.get("/:id", validateJWT, async (req, res) => {
    const { id } = req.params
    try {
        const myLogs = await WorkoutLogModel.findAll({
            where: {
                id: id
            }
        })
        res.status(200).json(myLogs)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})


/* 
=====================================
    Get Workout Logs by description
=====================================
*/
router.get("/description", async (req, res) => {
    const { description } = req.params;
    try {
        const results = await WorkoutLogModel.findAll({
            where: { description: description }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* 
==============================
    Update a Workout Log
==============================
*/
router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.workoutLog;
    const workoutLogId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: workoutLogId,
            owner_id: userId,
        }
};

const updatedWorkoutLog = {
    description: description,
    definition: definition,
    result: result
};

try {
    const update = await WorkoutLogModel.update(updatedWorkoutLog, query);
    res.status(200).json(update);
} catch (err) {
    res.status(500).json({ error: err });
}
});

/* 
================================
    Delete a Workout Log
================================
*/
router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const workoutLogId = req.params.id;

    try {
        const query = {
            where: {
                id: workoutLogId,
                owner_id: ownerId
            }
        };

    await WorkoutLogModel.destroy(query);
    res.status(200).json({ message: "Workout Log Result Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})
module.exports = router;

// router.get('/about', (req, res) => {
//     res.send("This is the about route!");
// })

