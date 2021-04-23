var fs = require('fs');
var PythonShell = require('python-shell');

exports.execute_script_async = function(py_script_path, callback) {
	PythonShell.run(py_script_path, function (err, results) {
		  console.log('fetching output from python script: ' + py_script_path);
		  if (err) throw err;
		  console.log("got => " + results);
		  callback(results);
		  // var executed_results = [];
		  // executed_results.push(results);
		  // if (executed_results.length > 0) return executed_results.join("\n");
		  // else return "No pythonshell results found";
	});
}

exports.execute_code_sync = function(translated_code, callback) {
	var temp_path = "./compiled_py_temp/test12345.py";
	fs.writeFileSync(temp_path, translated_code, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});

	console.log(".... About to wait for executing the translated python script: " + temp_path);
	exports.execute_script_async(temp_path, function(results){
	console.log(".... Executed result = ");
	console.log(results);
	callback(results.join('\n'));
	});
	// return returned_result;
}