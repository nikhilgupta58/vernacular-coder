// const express = require('express');
// var bodyParser = require('body-parser');

// var tr = require('./translate-logic');
// var py = require('./python-interpretation');

const express = require('express');
var bodyParser = require('body-parser');
var PythonShell = require('python-shell');
var fs = require('fs');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
const port = process.env.PORT || 5000;

app.post('/api/translate', (req, res) => {
  // res.send({ body: req.body.inputText });

	// Does input have trailing new lines?
  	var input = req.body.inputText;
  	var src_human_lang = req.body.inputLang;
  	var target_human_lang = "en";

	var options = {
  		mode: 'text',
  		args: [input, src_human_lang, target_human_lang]
  	};

  	console.log("Calling translation api");

	PythonShell.run('../translator/controller.py', options, function (err, results) {
	   if (err) throw err;
	   console.log("Results: " + results)

	   res.send({ body:  results});
	});

  	});

app.listen(port, () => console.log(`Listening on port ${port}`));
