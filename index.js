const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db/db");

require("dotenv").config();

app.use(cors());
app.use(express.json());
  

const rolesRouter = require("./routers/routes/role");
app.use(rolesRouter);

const usersRouter = require("./routers/routes/user");
app.use(usersRouter);

const postsRouter = require("./routers/routes/post");
app.use(postsRouter);

const commentsRouter = require("./routers/routes/comment");
app.use(commentsRouter);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});