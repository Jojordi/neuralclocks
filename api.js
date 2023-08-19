//Basic Backend API made with express js to store users and user data in a SQLite Database
const sqlite3 = require("sqlite3").verbose()
const sqlite = require("sqlite")
const express = require("express");
const app = express();
app.use(express.json())

//Initialize Database instance and connect to it
const db = new sqlite3.Database(
    "./neuralclocks.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err)=>{
        if(err){
            return console.error(err.message)
        }
        console.log("Connected to SQlite Database.")
    })
//Initial Database initialization, here we insert the users Table and the timers Table
//User consists in basic credentials like Firstname, LastName, Username, password and the id of the entry which is unique
//Timers consists in the id of the user who created it, the 3 different time intervals in minutes and the date of addition of the timer in string format
//The queries are serialized in order to secure no datarace will happen
//Finally we insert a default admin user and a Default timer for the admin user
//If no database file is present a newone will be created it is highly advisable to start the api without a db file
db.serialize(()=>{
    //we first create the Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    username TEXT,
    password TEXT)`,
        (err)=>{
            if(err){
                return console.error(err.message)
            }
            console.log("Created users table")})
    //we delete previous entries as this instance of the dabase has to be clean
    db.run(`DELETE FROM users`, (err)=>{
        if(err){
            return console.error(err.message)
        }
        console.log("All users deleted")
    })

    const adminCreds = [0,"Admin","istrator","Admin","admin1234"]

    const insertSql = `INSERT INTO users(id,firstName,lastName,username,password) VALUES(?,?,?,?,?)`
    //we insert the admin user
    db.run(insertSql,adminCreds, function(err){
        if(err){
            return console.error(err.message)
        }
        const id = this.lastID
        console.log(`Rows inserted, ID ${id}`)
    })
    //we then create the timers table
    db.run(`CREATE TABLE IF NOT EXISTS timers (
            userid INTEGER,
            timername TEXT,
            pomodoro INTEGER,
            shortbreak INTEGER,
            longbreak INTEGER,
            added TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
        (err)=>{
            if(err){
                return console.error(err.message)
            }
            console.log("Created timers table")
        })
    //same as before we assure the data cleanliness of the table by deleting previous records
    db.run(`DELETE FROM timers`, (err)=>{
        if(err){
            return console.error(err.message)
        }
        console.log("All timers deleted")
        console.log("Connection ready")
    })
    const timerConfig = [0,"DefaultTimer",25,5,15]

    const insertTimerSql = `INSERT INTO timers(userid,timername,pomodoro,shortbreak,longbreak) VALUES(?,?,?,?,?)`
    //We insert a default timer associated with teh admin user
    db.run(insertTimerSql,timerConfig, function(err){
        if(err){
            return console.error(err.message)
        }
        console.log(`Timer inserted`)
        //finally since all the prevous jobs where serialized we are assured everything has run correctly and we fire the signal to start the app
        app.emit('DB_READY')
    })
})

//Basic route to test the connection to the backend
app.get("/test_api",(req,res,next)=>{
    res.json("SUCCESS!")
})
//Same as before but to check the database correct operation
app.get("/test_api_db",(req,res,next)=>{
    db.all("SELECT id, username FROM users",(err,rows)=>{
        if(err){
            throw err;
        }
        res.json(rows)
    })
})
//Route to add a user, we first check the username has not been taken before adding
app.post("/new_user",(req,res,next)=>{
    let checkSql = `SELECT id FROM users WHERE username = ?`
    let username = req.body.username
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let password =  req.body.password

    db.get(checkSql,[username],(err,row)=>{
        if(err){
            res.status(500)
            res.send(err)
            return
        }
        if(row){
            res.status(401)
            res.send("User already exists")
            return
        }

        const insertSql = `INSERT INTO users(firstName,lastName,username,password) VALUES(?,?,?,?)`

        db.run(insertSql,[firstName,lastName,username,password], function(err){
            if(err){
                res.send(err)
                return
            }
            res.json({id:this.lastID})
        })
    })
})

//We check the users credentials for a matching username and password
app.post("/check_user",(req,res,next)=>{
    let checkSql = `SELECT id FROM users WHERE username = ? AND password = ?`
    let username = req.body.username
    let password =  req.body.password

    db.get(checkSql,[username,password],(err,row)=>{
        if(err){
            res.status(500)
            res.send(err)
            return
        }
        if(!row){
            res.status(401)
            res.send("Invalid credentials")
            return
        }
        res.json({id:row.id})
    })
})
//Get all timer associated with the user whose id is in the request
app.post("/get_timers",(req,res,next)=>{
    const userId = req.body.userid
    let sql = `SELECT * FROM timers WHERE userid = ? ORDER BY added DESC`
    db.all(sql,[userId],(err,rows)=>{
        if(err){
            throw err;
        }
        res.json(rows)
    })
})
//Add a new timer associated to the user whose id is in the request
app.post("/set_timer",(req,res,next)=>{
    let checkSql = `SELECT id FROM users WHERE id = ?`
    let userid = req.body.userid
    let timername = req.body.timername
    let pomodoro = parseInt(req.body.pomodoro)
    let shortbreak = parseInt(req.body.shortbreak)
    let longbreak = parseInt(req.body.longbreak)

    db.get(checkSql,[userid],(err,row)=>{
        if(err){
            res.status(500)
            res.send(err)
            return
        }
        if(!row){
            res.status(401)
            res.send("Invalid credentials")
            return
        }
        const insertSql = `INSERT INTO timers(userid,timername,pomodoro,shortbreak,longbreak) VALUES(?,?,?,?,?)`

        db.run(insertSql,[userid,timername,pomodoro,shortbreak,longbreak], function(err){
            if(err){
                res.status(500)
                console.log(err)
                res.send(err)
                return
            }
            res.send("Added timer")
        })
    })
})
//We only start the app once we get a signal from the database initialization snippet that says that all the database initialization jobs are done and executed correctly
app.on('DB_READY',() => {
    app.listen(3001, () => {
        console.log(`NeuralClocks API running on port 3001`);
    });
})
