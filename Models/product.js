import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productid:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    altname:{
        type:[String],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    labelledprice:{
        type:Number,
        required:true
    },
    images:{
        type:[String],
        default : ["/default.png1","/default.png2"],
        required:true
    },
    isAvailable:{
        type:Boolean,
        required:true,
        default:true
    },
    category:{
        type:String,
        required:false
    },
    stock:{
        type:Number,
        required:true,
        default:0
    },
    brand:{
        type:String,
        required:false
    },
    model:{
        type:String,
        required:false
    }   
})

const Product = mongoose.model("product",productSchema)
export default Product
