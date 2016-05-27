const express = require("express");
const bodyParser= require('body-parser');
//TRY MONGO JS
var mongojs = 		require('mongojs');
var uri = 			"mongodb://bpraveen:YOURDBPAWORD@ds025180.mlab.com:25180/bpraveen";
var db		= 		mongojs(uri, ["vcard","users"]);
const app = express();

//const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/src'))

//var db;

//MongoClient.connect('mongodb://bpraveen:nokian73@ds025180.mlab.com:25180/bpraveen', (err, database) => {
  // ... start the server
//   if (err) return console.log(err)
//   db = database
//})


app.post('/insertvcard',function(req, res){
  
  console.log(req.body);
  //db.collection('vcard').save(req.body,(err,result) => {
    //if(err) return console.log(err)
    //  console.log("SAVED")
  //  res.redirect('/')
  //})
  
  db.vcard.insert(req.body, (err,result) => {
    
    if(err) return console.log(err);
    console.log("INSERT");
    res.redirect('/')
  })

})

app.get('/vcard', function (req,res){
  //tostring not required for mongojs
  var data = db.vcard.find(function(err, result){
    
    res.send(JSON.stringify(result));
  })
  
})

app.post('/remove', function(req, res) {
    console.log(req.body._id);
    db.vcard.remove( {_id: mongojs.ObjectId(req.body._id)}, (err, result) => {
    if(err) return console.log(err)
    res.send(result);
    console.log('Deleted');
      
    })
})


app.post('/update', function(req, res) {
    
    console.log(req.body);
    
    db.vcard.findAndModify({ 
      query: { _id: mongojs.ObjectId(req.body._id) },
      update: { $set: {
        company: req.body.company,
        name: req.body.name,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone,
        mobile: req.body.mobile
      }},
      new: true
      }, (err, result) => {
        
        if(err) return console.log(err)
        
        res.send(result);
        
      
      
    })
})


app.post('/newuser',function(req, res){
  
  console.log(req.body);
  db.users.insert(req.body, (err,result) => {
    
    if(err) return console.log(err);
    console.log("INSERT");
    res.redirect('/')
  })

})

app.get('/user', function (req,res){
  //tostring not required for mongojs
  var data = db.users.find(function(err, result){
    
    res.send(JSON.stringify(result));
  })
  
})


app.post('/deleteuser', function(req, res) {
  
    console.log(req.body._id);
    db.users.remove( {_id: mongojs.ObjectId(req.body._id)}, (err, result) => {
    if(err) return console.log(err)
    res.send(result);
    console.log('Deleted');
    })
    
})

app.get('/dashboard', function(req, res) {
  
  var final = {};
  db.users.find((err, result) => {
    if(err) return console.log(err)
    final.totalUsers = JSON.stringify(result.length);
    console.log(result.length);
    
    db.vcard.find((err, result)=>{
    
      if(err) return console.log(err)
      final.totalCards = (JSON.stringify(result.length));
      console.log(result.length);
      
      res.send((final));
    });
  })
  
  
    
  
  
})

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  
  console.log("Nodejs Server is Up.");
});