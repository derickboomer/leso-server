var mysql = require('mysql');
var express = require ('express');
var bodyParser = require ('body-parser')
var app = express();
var cors = require ('cors')
const nodemailer = require('nodemailer')
const fileUpload = require('express-fileupload')
const multer = require('multer')
const path = require ('path')

// const upload = multer({storage: storage});

// const storage  = multer.diskStorage({
//     destination: '/Images', 
//     filename:(req, file, cb)=>{
//         console.log(file)
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }, 
    
    
// })


// const transporter = nodemailer.createTransport ({
//     service: "hotmail",
//     auth: {
//         user:"leso.capstone.test@outlook.com",
//         pass:"LESO!123",
//     },
// })


// const options = {
//     from:"leso.capstone.test@outlook.com",
//     to:"rhoderick.rodriguez.cics@gmail.com",
//     subject: "Sending email with node js",
//     text: "wow that is simple"
// }


// transporter.sendMail(options, (err, info)=> {
//     if(err){
//         console.log(err);
//         return;
//     }   
//     console.log
// })



app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "leso_database",
    
  });

con.connect(function(err) {
    
    if (err) throw err;
    console.log("Database Connected");
});


// Render accounts 
app.get('/accounts', (req,res) =>{
    con.query("SELECT * FROM user_account ",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// "SELECT * FROM user_account WHERE accountType ='Administrator'"

// Create Account Function
app.post('/createaccount',  (req, res) => {
    
    const firstName = req.body.firstName;
    const middleName = req.body.middleName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const college = req.body.college;
    const accountType = req.body.accountType;
    const dateCreated = new Date();
   
    // Create Account
    con.query('INSERT INTO user_account (firstName, middleName, lastName, email, password, college, accountType, dateCreated) VALUES (?,?,?,?,?,?,?,?)', 
    [firstName, middleName, lastName, email, password, college, accountType, dateCreated], (err,res)=> {
        if (err) {
            console.log("Database error");
        } else {
            
            console.log (accountType + " account created!");
        };
    }); 

});

// Delete Account
app.delete('/delete/:iduser_account', (req,res) =>{
    const iduser_account = req.params.iduser_account;
    con.query('DELETE FROM user_account WHERE iduser_account = ?',[iduser_account], (err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});
// Connected to the useEffect Created in Admin Homepage to render values from db
app.get('/update/get/:iduser_account', (req,res) =>{
    const{iduser_account} = req.params;
    const sqlGet = 'SELECT * FROM user_account WHERE iduser_account = ?';
    con.query(sqlGet,iduser_account,(err,result)=> {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        };
    }); 
});

// Update Account Credentials
app.put('/update/:iduser_account', (req,res) =>{
    const iduser_account = req.params.iduser_account;
    const values = [
        req.body.firstName,
        req.body.middleName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        req.body.accountType,
        req.body.college,

    ]
    const sqlUpdate = 'UPDATE user_account SET `firstName` = ?, `middleName` = ?, `lastName` = ?, `email` = ?, `password` = ?, `accountType`= ?, `college` = ? WHERE iduser_account = ?';
    con.query(sqlUpdate,[...values, iduser_account],(err,result)=> {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        };
    }); 
});


// LOGIN
    app.post('/login', (req,res)=>{
       
        const email = req.body.email;
        const password = req.body.password;
        const accountType = req.body.accountType;
    
        const sqlLogin = 'SELECT * FROM user_account WHERE email = ? AND password = ? AND accountType = ? ';
        con.query(sqlLogin,[email, password, accountType] , (err,result)=> {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result)
                    console.log(result)
                  
                };
            }
        ); 
    })

    app.post('/submitjoborder', (req, res) => {
        // const jobordervalues = [
        // req.body.type,
        // req.body.status,
        // req.body.stage,
        // req.body.date_received,
        // req.body.recommendedDueDate,
        // req.body.firstName,
        // req.body.lastName,
        // req.body.email,
        // req.body.cellphoneNo,
        // req.body.quantity,
        // req.body.serviceRequested,
        // req.body.instrumentTransportation,
        // req.body.college,
        // req.body.laboratory,
        // req.body.laboratoryLocation,
        // req.body.problemReported,
        // req.body.model,
        // req.body.serialNo,
        // req.body.manufacturer,
        // req.body.diagnosis,
        // req.body.actionTaken,
        // req.body.dateCalibrated,
        // req.body.procedure,
        // req.body.calibrationResult,
        // req.body.remarks,
        // req.body.approvedby,
        // req.body.recievedby,
        // ]

        
        const type = "Open";
        const status="For Approval";
        const stage = req.body.stage;
        const date_received = new Date();
        const firstName =req.body.firstName;
        const lastName =req.body.lastName;
        const  email=req.body.email;
        const  cellphoneNo=req.body.cellphoneNo;
        const  quantity=req.body.quantity;
        const  serviceRequested=req.body.serviceRequested;
        const instrument = req.body.instrument;
        // const  transportation=req.body.transportation;
        const  college=req.body.college;
        const  laboratory=req.body.laboratory;
        const  laboratoryLocation=req.body.laboratoryLocation;
        const  problemReported=req.body.problemReported;
        const  model=req.body.model;
        const  serialNo=req.body.serialNo;
        const  manufacturer=req.body.manufacturer;
        const  propertyNo=req.body.propertyNo;
        const image = req.body.image;
        const diagnosis =req.body.diagnosis;
        const  actionTaken=req.body.actionTaken;
        const  dateCalibrated=req.body.dateCalibrated;
        const  procedure=req.body.procedure;
        const  calibrationResult=req.body.calibrationResult;
        const remarks =req.body.remarks;
        // const  approvedby="Not Yet Approved";
        // const  recievedby="Not Yet Assigned";
        
        const dateCreated = new Date();
        const sqlInsert = 'INSERT INTO job_order ( type, status, stage, date_received, firstName, lastName, email, cellphoneNo, instrument, quantity, serviceRequested,college, laboratory, laboratoryLocation, problemReported, model, serialNo, manufacturer, propertyNo, image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        con.query( sqlInsert, [type, status, stage, date_received, firstName, lastName,email, cellphoneNo, instrument, quantity, serviceRequested, college , laboratory, laboratoryLocation, problemReported, model, serialNo, manufacturer, propertyNo, image], (err,res)=> {
            if (err) {
                console.log(err);
            } else {
                console.log (image);
                console.log ("job order submitted");
            };
        }); 
    
    });

    // "SELECT * FROM user_account WHERE accountType ='Administrator'"
    // SELECT * FROM job_order WHERE type ='Open'AND status ='For Approval'

// Render openrequest table
    app.get('/openrequest', (req,res) =>{
        con.query("SELECT * FROM job_order WHERE type ='Open'",(err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });

// Populate Open Job Order Fields
    app.get('/joborderupdate/:idjob_order', (req,res) =>{
        const{idjob_order} = req.params;
        const sqlGet = 'SELECT * FROM job_order WHERE idjob_order = ?';
        con.query(sqlGet,idjob_order,(err,result)=> {
            if (err) {
                console.log(err);
            } else {
                
                res.send(result);
            };
        }); 
    });

// Update Open Jon Orders
    app.put('/openjoborderupdate/:idjob_order', (req,res) =>{
        const idjob_order = req.params.idjob_order;
        const jobordervalues = [
        req.body.type,
        req.body.status,
        req.body.stage,
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.cellphoneNo,
        req.body.quantity,
        req.body.serviceRequested,
        req.body.instrument,
        req.body.college,
        req.body.laboratory,
        req.body.laboratoryLocation,
        req.body.problemReported,
        req.body.model,
        req.body.serialNo,
        req.body.manufacturer,
        req.body.propertyNo,
        req.body.diagnosis,
        req.body.actionTaken,
        req.body.dateCalibrated,
        req.body.procedure,
        req.body.calibrationResult,
        req.body.remarks,
        req.body.approvedBy,
        req.body.receivedby,
        ]
        const sqlUpdate = 'UPDATE job_order SET `type` = ?, `status` = ?, `stage` = ?, `firstName` = ?, `lastName`= ?, `email` = ?, `cellphoneNo` = ?, `quantity` = ?, `serviceRequested` = ?, `instrument` = ?, `college` = ?, `laboratory` = ?, `laboratoryLocation` = ?, `problemReported` = ?, `model` = ?, `serialNo` = ?, `manufacturer` = ?, `propertyNo` = ?, `diagnosis` = ?, `actionTaken` = ?, `dateCalibrated` = ?, `procedure` = ?, `calibrationResult` = ?, `remarks` = ? , `approvedBy` = ? , `receivedby` = ? WHERE idjob_order = ?';
        con.query(sqlUpdate,[...jobordervalues, idjob_order],(err,result)=> {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            };
        }); 
    });

// Render Admin Closed Requests
    app.get('/closedrequest', (req,res) =>{
        con.query("SELECT * FROM job_order WHERE type ='Closed'",(err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });

// Render Open and ForApprova Count
    app.get('/counter', (req,res) =>{
        con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='For Approval'",(err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });

// Render Open and Approved Count
    app.get('/approvedcounter', (req,res) =>{
        con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved'",(err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });

// Render Closed and Completed Count
    app.get('/closedapproved', (req,res) =>{
        con.query("SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved'",(err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });

// Render Closed and Cancelled Count
    app.get('/closeddeclined', (req,res) =>{
        con.query("SELECT * FROM job_order WHERE type ='Closed' AND status ='Declined'",(err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });

// Delete Job Order
    app.delete('/deletejoborder/:idjob_order', (req,res) =>{
        const idjob_order = req.params.idjob_order;
        con.query('DELETE FROM job_order WHERE idjob_order = ?',[idjob_order], (err,result)=> {
            if (err) {
                console.log("Database error");
            } else {
                res.send(result);
            };
        }); 
    });


// Render Closed and Cancelled Count
app.get('/technicianopenrequest', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// Render Closed and Cancelled Count
app.get('/technicianclosedrequest', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});



// Render Pick Up Count
app.get('/renderpickupcount', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Pick-Up'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// Render Pick Up Count
app.get('/renderdropoffcount', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' stage ='Drop-Off'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// Render Pick Up Count
app.get('/renderrecieved', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Recieved'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// 
app.get('/renderinspection', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Inspection'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// 
app.get('/renderongoing', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='On-Going'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// Render Closed and Cancelled Count
app.get('/closedcompleted', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved' AND stage ='Completed'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

// Render Closed and Cancelled Count
app.get('/closedcancelled', (req,res) =>{
    con.query("SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved' AND stage ='Cancelled'",(err,result)=> {
        if (err) {
            console.log("Database error");
        } else {
            res.send(result);
        };
    }); 
});

app.post('/track', (req,res)=>{
       
    const idjob_order = req.body.idjob_order;


    const sqlLogin = 'SELECT * FROM job_order WHERE idjob_order = ?';
    con.query(sqlLogin,[idjob_order] , (err,result)=> {
            if (err) {
                console.log(err);
            } else {
                res.send(result)
                
              
            };
        }
    ); 
})

// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("Lisenting on port " + port + "..." );
    });

// app.listen(process.env.PORT || PORT, () =>{
//     console.log("Lisenting on port " + PORT + "..." )
// })





    

  

  