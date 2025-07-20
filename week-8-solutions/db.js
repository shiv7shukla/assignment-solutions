const mongoose=require("mongoose");
(async ()=>{
    try{
        await mongoose.connect("mongodb+srv://shivs_admin:142005@cluster0.iwlb894.mongodb.net/course-app");}
    catch{
        console.log("error in connecting to database");}
})();


const Schema=mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;

const User=new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const Course=new Schema({
    title:String,
    description:String,
    price:Number,
    imageurl:String,
    creatorId:ObjectId
})

const Admin=new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const Purchases=new Schema({
    courseId:ObjectId,
    userId:ObjectId
})

const UserModel=mongoose.model("user",User);
const AdminModel=mongoose.model("admin",Admin);
const CourseModel=mongoose.model("course",Course);
const PurchaseModel=mongoose.model("purchase",Purchases);

module.exports={UserModel,AdminModel,CourseModel,PurchaseModel};