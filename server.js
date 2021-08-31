const express = require('express');
const mongoose = require("mongoose");
const _ = require("lodash");
const app=express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
const url = "mongodb+srv://vamsi:vamsidb@cluster0.6py0r.mongodb.net/MedhaDB?retryWrites=true&w=majority";
mongoose.connect(url);

const companySchema = new mongoose.Schema({
    companyName:String,
    number_of_empl:Number
});
const employeeSchema = new mongoose.Schema({
    name:String,
    age:Number,
    mobile_no:Number,
    company:companySchema
});

//1.create company collection
const Company=mongoose.model("companys",companySchema);

//2.creaate employee collection
const Employee=mongoose.model("employees",employeeSchema);


app.get('/',(req,res)=>{
    
    res.render("home")
});

app.post('/',(req,res)=>{
    const option=req.body.group
    if(option==="company"){
        res.redirect('/company');
    }
    else{
        res.redirect('/employee');
    }
})

//3.get companys data
app.get('/company',async(req,res)=>{
    await Company.find({},function(error,result){
        res.render("company",{companylist:result})
    })
});

//add a company to the collection
app.post('/company',async(req,res)=>{
    const formated = _.capitalize(req.body.companyName);
    const company=formated;
    const totalEmployees=req.body.numberOfEmployees

    const addCompnay=new Company({
        companyName:company,
        number_of_empl:totalEmployees
    })
    await addCompnay.save();
    res.redirect('/company');
});

//4.get Employees data
app.get('/employee',async(req,res)=>{
    await Employee.find({},function(error,result){
        res.render("employee",{employeelist:result})
    })
});

//add an employee to DB
app.post('/employee',async(req,res)=>{
    const empName = req.body.employeeName;
    const age = req.body.age;
    const mobileNo=req.body.mobileNo;
    const company = req.body.company;
    await Company.findOne({companyName:company},async(error,result)=>{
        const addEmployee = new Employee({
            name:empName,
            age:age,
            mobile_no:mobileNo,
            company:result
        })
         await addEmployee.save();
        res.redirect('/employee')
    })
    
});
let params="";
//5.passsing company as parameter
app.get('/:companyname',async(req,res)=>{
    params = _.capitalize(req.params.companyname);
    console.log(params)
    res.render('listCompanies',{type: "get",params:params})
})

//5.list out matched companys
app.post('/:companyname',async(req,res)=>{
    await Company.findOne({companyName:params},function(error,result){
        if(!error){
            res.render('listCompanies',{type: "post",companylist:result})
        }
        else{
            console.log(error)
        }
    })
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("server has started and running")
})