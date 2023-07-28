const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express(); // Runs the server
const port = 3000;
const mysql = require('mysql2'); // Connects to the database
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'chad',
  password: '12345678',
  database: 'mydB',
});

db.connect((err) => { // Function that connects to the database
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create
app.post('/create', (req, res) => {
    let details = {
        t_id: req.body.t_id,
        name: req.body.name,
        type: req.body.type,
        desc: req.body.desc,
        status: req.body.status,
        priority: req.body.priority,
        date: req.body.date
    }
    let sql = "INSERT INTO tickets SET ?";
    db.query(sql, details, (error) => {
        if (error) {
            console.log("Successfully failed adding record");
        } else {
            console.log("Successfully added record");
        }
    })

  });

// Read
app.get('/read', (req, res) => {
    var sql = "SELECT * from tickets";
    db.query(sql, function (error, result) {
        if (error) {
            console.log("Error");
        } else {
            res.send(result);
        }
    })

});

// Update
app.put('/update/:t_id', (req, res) => {
    let sql = 
    "UPDATE tickets SET type='" +
    req.body.type +
    "', status='" +
    req.body.status +
    "', priority='" +
    req.body.priority +
    "' WHERE t_id=" +
    req.params.t_id;

    let query = db.query(sql, (error, result) =>{
        if (error) {
            console.log("Successfully failed updating record");
        } else {
            console.log("Successfully updated record");
        }
    })
})

// Delete
app.delete('/delete/:id', (req, res) => {
    let sql = "DELETE FROM tickets WHERE t_id=" +req.params.id +"";
    let query = db.query(sql, (error) =>{
        if (error) {
            console.log("Successfully failed deleting record");
        } else {
            console.log("Successfully deleted record");
        }
    })
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});