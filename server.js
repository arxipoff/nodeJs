var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;

var app = express();
var db = require('./db');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));


// MAIN
app.get('/', function(req, res) {
  res.render('index');
});
app.get('/about', function(req, res) {
  res.render('about');
});
app.get('/news', function(req, res) {
  db.get().collection('news').find().toArray(function(err, docs) {
    if(err) {
      console.log(err);
      return res.sendStatus(500)
    }
    res.render('news', {data: docs});
  })
});
app.get('/news/:id', function(req, res) {
  db.get().collection('news').findOne({_id: ObjectID(req.params.id)}, function(err, doc) {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.render('news-description', {data: doc})
  })
})
app.get('/addNews', function(req, res) {
  res.render('add-news');
});
app.get('/deleteNews/:id', function(req, res) {
  db.get().collection('news').deleteOne({_id: ObjectID(req.params.id)}, function(err, result) {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.redirect('/news');
  })
})
// POST
app.post('/about', urlencodedParser, function(req, res) {
  if(!req.body) return res.sendStatus(400);
  res.render('about-success', {data: req.body});
})
app.post('/addNews', urlencodedParser, function(req, res) {
  if(!req.body) return res.sendStatus(400);

  var news = {
    title: req.body.title,
    text: req.body.text
  };
  db.get().collection('news').insertOne(news, function(err, result) {
    if(err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.redirect('/news');
  })
})


db.connect('mongodb://127.0.0.1:27017', function(err) {
  if(err) {
    return console.log(err);
  }
  app.listen(3030, function() {
    console.log("let's rock on: http://127.0.0.1:3030/");
  });
});
