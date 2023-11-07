const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // change port as needed
const host = 'casa0017.cetools.org';
//app.use(express.json());
//using environment variable __dirname - absolute path of dir of executing file
app.use(express.static(__dirname));

// Serve the mapjson directory as a static folder
app.use('/mapjson', express.static(path.join(__dirname, 'mapjson')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Define a root route that serves your HTML file
app.get('/', (req, res) => {
  //console.log("__dirname: " + __dirname);
  res.sendFile(path.join(__dirname, 'Map.html'));
  //res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/map.html');
});

app.get('/getData', (req, res) => {
    const data = []; // array to store the returned data

    fs.createReadStream('./data/treeData.csv')

    .pipe(csv()) //using csv-parser for this to convert to json for output
    //event handler for each row read
    .on('data', (row) => {
      //console.log(row);  
      data.push(row); //appends the row
    })
    //return the data
    .on('end', () => {
      res.json(data);
    });
});

app.get('/getSQLData', (req, res) => {
  console.log("");
  let mysql = require('mysql');
  let config = require('./config.js');
  
  let connection = mysql.createConnection(config);
  
  let sql = `SELECT * FROM ARCCanopyData WHERE la_cd = "E09000002"`;
  connection.query(sql, (error, results, fields) => {
    res.status(200).json(results);
  //  if (error) {
  //    return console.error(error.message);
  //  }
  //  console.log(results);
  });
  
  connection.end(); 

});

app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});