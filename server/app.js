require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

app.use(Express.json());

const controllers = require("./controllers");

app.use("/user", controllers.userController);

// app.use(require("./middleware/validate-jwt"));
app.use("/log", controllers.workoutLogController);


dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
})
.catch((er) => {
    console.log(`[Server]: App is listening on 3000`);
});
