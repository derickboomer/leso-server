const moment = require("moment");

var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const path = require("path");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "rhoderick.rodriguez.cics@ust.edu.ph",
//     pass: "911rhoderick",
//   },
// });

// const options = {
//   from: "rhoderick.rodriguez.cics@ust.edu.ph",
//   to: "acabazal@up.edu.ph",
//   subject: "Job Order Submitted",
//   text: "You succesfully submitted your request",
// };

// transporter.sendMail(options, (err, info) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Succesfully submitted request");
// });

app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "leso_database",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected");
});

// Render accounts
app.get("/accounts", (req, res) => {
  con.query("SELECT * FROM user_account ", (err, result) => {
    if (err) {
      console.log("Database error");
    } else {
      res.send(result);
    }
  });
});

// "SELECT * FROM user_account WHERE accountType ='Administrator'"

// Create Account Function
app.post("/createaccount", (req, res) => {
  const firstName = req.body.firstName;
  const middleName = req.body.middleName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const college = req.body.college;
  const accountType = req.body.accountType;
  const dateCreated = new Date();

  // Create Account
  con.query(
    "INSERT INTO user_account (firstName, middleName, lastName, email, password, college, accountType, dateCreated) VALUES (?,?,?,?,?,?,?,?)",
    [
      firstName,
      middleName,
      lastName,
      email,
      password,
      college,
      accountType,
      dateCreated,
    ],
    (err, res) => {
      if (err) {
        console.log("Database error");
      } else {
        console.log(accountType + " account created!");
      }
    }
  );
});

// Delete Account
app.delete("/delete/:iduser_account", (req, res) => {
  const iduser_account = req.params.iduser_account;
  con.query(
    "DELETE FROM user_account WHERE iduser_account = ?",
    [iduser_account],
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});
// Connected to the useEffect Created in Admin Homepage to render values from db
app.get("/update/get/:iduser_account", (req, res) => {
  const { iduser_account } = req.params;
  const sqlGet = "SELECT * FROM user_account WHERE iduser_account = ?";
  con.query(sqlGet, iduser_account, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Update Account Credentials
app.put("/update/:iduser_account", (req, res) => {
  const iduser_account = req.params.iduser_account;
  const values = [
    req.body.firstName,
    req.body.middleName,
    req.body.lastName,
    req.body.email,
    req.body.password,
    req.body.accountType,
    req.body.college,
  ];
  const sqlUpdate =
    "UPDATE user_account SET `firstName` = ?, `middleName` = ?, `lastName` = ?, `email` = ?, `password` = ?, `accountType`= ?, `college` = ? WHERE iduser_account = ?";
  con.query(sqlUpdate, [...values, iduser_account], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const accountType = req.body.accountType;

  const sqlLogin =
    "SELECT * FROM user_account WHERE email = ? AND password = ? AND accountType = ? ";
  con.query(sqlLogin, [email, password, accountType], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log(result);
    }
  });
});

app.post("/submitjoborder", (req, res) => {
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
  function between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  // moment(new Date()).format("LLL")
  const trackingnumber = between(1000, 2000);
  const type = "Open";
  const status = "For Approval";
  const stage = req.body.stage;
  const date_received = new Date();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const cellphoneNo = req.body.cellphoneNo;
  const quantity = req.body.quantity;
  const serviceRequested = req.body.serviceRequested;
  const instrument = req.body.instrument;
  // const  transportation=req.body.transportation;
  const college = req.body.college;
  const laboratory = req.body.laboratory;
  const laboratoryLocation = req.body.laboratoryLocation;
  const problemReported = req.body.problemReported;
  const model = req.body.model;
  const serialNo = req.body.serialNo;
  const manufacturer = req.body.manufacturer;
  const propertyNo = req.body.propertyNo;
  const image = req.body.image;
  const studentno = req.body.studentno;
  const recommendation = "N/A";
  const performance = "No Rating";
  const diagnosis = req.body.diagnosis;
  const actionTaken = req.body.actionTaken;
  const dateCalibrated = req.body.dateCalibrated;
  const procedure = req.body.procedure;
  const calibrationResult = req.body.calibrationResult;
  const remarks = req.body.remarks;
  // const  approvedby="Not Yet Approved";
  const recievedby = "Unassigned";
  const dateCreated = new Date();

  const newdate = moment(date_received).format("LLLL");

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "leso.capstone.test@gmail.com",
      pass: "aduvlfmfugzmrezc",
    },
  });

  const options = {
    from: "leso.capstone.test@gmail.com",
    to: email,
    subject: "CAMRS LESO - Job Order Received",
    text: `*This is a message from LESO Office* `,

    html: `<h3>Hi <strong>${firstName}</strong>,</h3>
     <h3> This is to inform you that LESO has recieved your job order request on <strong>${newdate}</strong> with the following details:</h3> 
            <p>Tracking Number: <strong>${trackingnumber}</strong></p>  <p>Name: <strong>${firstName} ${lastName}</strong></p>  
            <p>Department / Unit: <strong>${college}</strong></p>  
            <p>Instrument: <strong>${instrument}</strong></p>  
            <p>Instrument Model: <strong>${model}</strong></p>  
            <p>Tracking Number: <strong>${serialNo}</strong></p>  
            <p>Property No: <strong>${propertyNo}</strong></p>  
            <p>Service Requested: <strong>${serviceRequested}</strong></p>  
            <p>Mode: <strong>${stage}</strong></p>          
     <h3>You may track your request status through placing your trackin number: ${trackingnumber} on the Track Tab. For more inquiries please email LESO</h3>  

     <img src=${image} width="400" height="400" >`,
  };

  const sqlInsert =
    "INSERT INTO job_order ( trackingnumber, type, status, stage, date_received, firstName, lastName, email, cellphoneNo, instrument, quantity, serviceRequested,college, laboratory, laboratoryLocation, problemReported, model, serialNo, manufacturer, propertyNo, image, receivedby, studentno, recommendation, performance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  con.query(
    sqlInsert,
    [
      trackingnumber,
      type,
      status,
      stage,
      date_received,
      firstName,
      lastName,
      email,
      cellphoneNo,
      instrument,
      quantity,
      serviceRequested,
      college,
      laboratory,
      laboratoryLocation,
      problemReported,
      model,
      serialNo,
      manufacturer,
      propertyNo,
      image,
      recievedby,
      studentno,
      recommendation,
      performance,
    ],
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(image);
        console.log("job order submitted");
        console.log("Job Order Tracking Number " + trackingnumber);
        transporter.sendMail(options, (err, info) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Succesfully submitted request");
        });
      }
    }
  );
});

// "SELECT * FROM user_account WHERE accountType ='Administrator'"
// SELECT * FROM job_order WHERE type ='Open'AND status ='For Approval'

// Render openrequest table
app.get("/openrequest", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' ORDER BY idjob_order DESC ",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Populate Open Job Order Fields
app.get("/joborderupdate/:idjob_order", (req, res) => {
  const { idjob_order } = req.params;
  const sqlGet =
    "SELECT * FROM job_order WHERE idjob_order = ? ORDER BY idjob_order DESC";
  con.query(sqlGet, idjob_order, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Update Open Jon Orders
app.put("/openjoborderupdate/:idjob_order", (req, res) => {
  const idjob_order = req.params.idjob_order;
  const jobordervalues = [
    req.body.type,
    req.body.status,
    req.body.stage,
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.cellphoneNo,
    req.body.image,
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
    req.body.recommendation,
    req.body.trackingnumber,
  ];

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "leso.capstone.test@gmail.com",
      pass: "aduvlfmfugzmrezc",
    },
  });

  const options = {
    from: "leso.capstone.test@gmail.com",
    to: jobordervalues[5],
    subject: "CAMRS LESO - Job Order Closed",
    text: `*This is a message from LESO Office* `,
    html: `<p>Hi <strong>${jobordervalues[3]}</strong>,</p>
    <p>This is to inform you that your <strong>Job Order Request:${idjob_order}</strong> has been closed on <strong> ${jobordervalues[21]}</strong>.</p> 
    <p>You may now view or print your "Technical Service Report" and "Certificate of Calibration"  on the Track Tab by placing your Tracking ID: <strong>${jobordervalues[28]}</strong>.</p>
    <p>You may also visit LESO to get an official copy of the certificate with the administrator's signature.</p>
    <strong><p>For more questions please email __________ Thank You!</p></strong>
      `,
  };

  const sqlUpdate =
    "UPDATE job_order SET `type` = ?, `status` = ?, `stage` = ?, `firstName` = ?, `lastName`= ?, `email` = ?, `cellphoneNo` = ?, `image` = ?, `quantity` = ?, `serviceRequested` = ?, `instrument` = ?, `college` = ?, `laboratory` = ?, `laboratoryLocation` = ?, `problemReported` = ?, `model` = ?, `serialNo` = ?, `manufacturer` = ?, `propertyNo` = ?, `diagnosis` = ?, `actionTaken` = ?, `dateCalibrated` = ?, `procedure` = ?, `calibrationResult` = ?, `remarks` = ? , `approvedBy` = ? , `receivedby` = ? , `recommendation` = ?, `trackingnumber` = ? WHERE idjob_order = ?";
  con.query(sqlUpdate, [...jobordervalues, idjob_order], (err, result) => {
    console.log(jobordervalues);
    if (err) {
      console.log(err);
    } else if (jobordervalues[0] == "Closed") {
      res.send(result);
      console.log("Closed Request");
      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Succesfully submitted request");
      });
    } else {
      res.send(result);
    }
  });
});

// Performance Update
app.put("/performance/:idjob_order", (req, res) => {
  const idjob_order = req.params.idjob_order;
  const name = req.body.firstName;

  const email = req.body.email;
  const jobordervalues = [req.body.performance, req.body.performancecomment];
  const receivers = [req.body.receivedby, req.body.approvedBy];
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "leso.capstone.test@gmail.com",
      pass: "aduvlfmfugzmrezc",
    },
  });

  const options = {
    from: "leso.capstone.test@gmail.com",
    to: receivers,
    subject: "CAMRS LESO - Rating Received",
    text: `*This is a message from LESO Office* `,
    html: `<h1>You have received a "${jobordervalues[0]}" rating for Job Order: ${idjob_order}</h1>`,
  };

  const sqlUpdate =
    "UPDATE job_order SET `performance` = ? , `performancecomment` = ? WHERE idjob_order = ?";
  con.query(sqlUpdate, [...jobordervalues, idjob_order], (err, result) => {
    console.log(jobordervalues);
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log("Rating Submitted");
      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Succesfully submitted Rating");
      });
    }
  });
});

// Render Admin Closed Requests
app.get("/closedrequest", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Closed' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Open and ForApprova Count
app.get("/counter", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='For Approval' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Open and Approved Count
app.get("/approvedcounter", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/declinedcounter", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Declined' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Closed and Completed Count
app.get("/closedapproved", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Closed and Cancelled Count
app.get("/closeddeclined", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Closed' AND status ='Declined' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Delete Job Order
app.delete("/deletejoborder/:idjob_order", (req, res) => {
  const idjob_order = req.params.idjob_order;
  con.query(
    "DELETE FROM job_order WHERE idjob_order = ?",
    [idjob_order],
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Closed and Cancelled Count
app.get("/technicianopenrequest", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' ORDER BY idjob_order DESC ",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Closed and Cancelled Count
app.get("/technicianclosedrequest", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/admin", (req, res) => {
  con.query(
    "SELECT * FROM user_account WHERE accountType ='Administrator'",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/technician", (req, res) => {
  con.query(
    "SELECT * FROM user_account WHERE accountType ='Technician'",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Pick Up Count
app.get("/renderpickupcount", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Pick-Up'",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Pick Up Count
app.get("/renderdropoffcount", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Drop-Off'",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Pick Up Count
app.get("/renderrecieved", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Pending' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

//
app.get("/rendercompleted", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Completed' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

//
app.get("/rendercancelled", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND stage ='Cancelled' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Closed and Cancelled Count
app.get("/closedcompleted", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved' AND stage ='Completed' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

// Render Closed and Cancelled Count
app.get("/closedcancelled", (req, res) => {
  con.query(
    "SELECT * FROM job_order WHERE type ='Closed' AND status ='Approved' AND stage ='Cancelled' ORDER BY idjob_order DESC",
    (err, result) => {
      if (err) {
        console.log("Database error");
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/track", (req, res) => {
  const trackingnumber = req.body.trackingnumber;

  const sqlLogin = "SELECT * FROM job_order WHERE trackingnumber = ?";
  con.query(sqlLogin, [trackingnumber], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/filter", (req, res) => {
  const receivedby = req.body.receivedby;

  const sqlLogin =
    "SELECT * FROM job_order WHERE type ='Open' AND status ='Approved' AND receivedby = ? ORDER BY idjob_order DESC";
  con.query(sqlLogin, [receivedby], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Listening on port " + port + "...");
});

// app.listen(process.env.PORT || PORT, () =>{
//     console.log("Lisenting on port " + PORT + "..." )
// })
