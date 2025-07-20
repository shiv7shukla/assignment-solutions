const express=require("express");
const app=express();

require("dotenv").config();

app.use(express.json());

const PORT=process.env.PORT;

const {userRouter}=require("./routes/user");
const {courseRouter}=require("./routes/course");
const {adminRouter}=require("./routes/admin");

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

app.listen(PORT);