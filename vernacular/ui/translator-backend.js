var http = require('http');
var PythonShell = require('python-shell');
var fs = require('fs');

	console.log("Server initialized.");
	var input = "वर्ष = 2018\nयदि वर्ष बराबर 2018:\n\tछापो('नमस्कार')"
	var input_script_fp = "temp/original.hi_py";
	var translated_input_script_fp = "temp/translated.py";

	fs.writeFile(input_script_fp, input, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});

	var options = {
		mode: 'text',
		args: [input_script_fp, "hi", "en"]
	};

	// Translate the non-en code.
	PythonShell.run('translator/controller.py',
	 				options, function (err, results) {
	  if (err) throw err;
	  console.log('Translated code: ');
	  console.log(results);
	  to_write_to_file = results.join("\n");
	  // Persist the translated code.
	  fs.writeFile(translated_input_script_fp, to_write_to_file, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	  });
		// Run the translated script.
		// Translate the non-en code.
		PythonShell.run(translated_input_script_fp,
						options, function (err, results) {
		  if (err) throw err;
		  console.log('Translated code executes as: ');
		  console.log(results);
		});

	});





http.createServer(function (req, res) {
	// FIXME load the html page at start.
	print("Web server can now listen...")

//	PythonShell.run(py_script_path, function (err, results) {
//			  console.log('fetching output from python script: ' + py_script_path);
//			  if (err) throw err;
//			  console.log("controller executed script, output => " + results);
//			  callback(results);
//	});

}).listen(8080);
