const express = require("express");
const router = express.Router();
const user = require("../schema/userschema");
const bcrypt = require("bcrypt");
const { db } = require("../schema/userschema");

router.post("/signin", async (req, res) => {
    const checkEmail = req.body.email;
    const person = await user.findOne({ email: checkEmail });

    if (person) {
        const checkPassword = await bcrypt.compare(
            req.body.password,
            person.password
        );
        if (checkPassword) {
            res.status(200).json({ success: true });
        }
        else {
            res
                .status(200)
                .json({ success: false, error: "Email or password does not match" });
        }
    }
    else {
        res.status(200).json({ success: false, error: "User does not exist" });
    }
});

router.post('/addData', async(req, res) => {
    var monthlyIncome = parseInt(req.body.monthlyIncome);
    var monthlyExpense = parseInt(req.body.monthlyExpense);
    var date = req.body.date;
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    // today = dd + '/' + mm + '/' + yyyy;

    // today='13/11/2022';
    var date = req.body.date;
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    // today = dd + '/' + mm + '/' + yyyy;

    // today='13/11/2022';

    console.log(monthlyIncome)
    console.log(monthlyExpense)
    


    if ((monthlyIncome > 0 && typeof monthlyIncome === "number") && (monthlyExpense > 0 && typeof monthlyExpense === "number")) {
        // user.findOne({email:req.body.email},(err,user)=>{
        //     user.dataset.forEach((element) => {
        //         if(element.date===today){
        //             var update={
        //                 "monthlyIncome":monthlyIncome,
        //                 "monthlyExpense":monthlyExpense,
        //                 "date":today
        //             }
                    
        //         }
        //     });
        // });
        await user.updateOne(
            {
                'email':req.body.email
            },
            {
                $pull:{
                    dataset:{
                        date:date
                    }
                }
            },
            {
                multi:true
            }
        );

        user.findOne({email:req.body.email},async(err,person)=>{
            if(err){
                console.log(err);
            }else{
                if(person!=null){
                    var update={
                        "monthlyIncome":monthlyIncome,
                        "monthlyExpense":monthlyExpense,
                        "date":date
                    }
                    person.dataset.push(update);
                    await person.save();
                    res.status(200).json({success:true,message:"updated"})
                }
                else{
                    res.status(200).json({success:false,message:"user not found"})
                }
            }
        })
    }
    else {
        res.status(200).json({ success: false, error: "Enter valid monthlyIncome and monthlyExpense" });
    }
});

router.post("/fetchData", async (req, res) => {
  const savings = await user.findOne({ email: req.body.email });
  if(savings!=null){
      res.status(200).json({ data: savings.dataset, user: savings.name });
    }
    console.log(req.body.email);
});

router.post("/register", async (req, res) => {
    var check = req.body.email;
    var aadmi = await user.findOne({ email: check });
    console.log(aadmi)
    if (aadmi===null) {
        const hash = await bcrypt.hash(req.body.password, 10);
        const person = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hash, 
        });
        return res.status(200).json({ success: true });
    } else {
        return res.status(200).json({ success: false, error: "username already exist" });
    } 
});

module.exports = router;