var http = require('http');
const PORT = 8000;

function handleRequest(request, response){
  getLogData('BuildFailures.txt', function(logs){
    response.writeHead(200, {'Content-Type': 'text/html'});
    
    var content = logs.map(function(e){ 
      return '<li><pre>' + e.replace(/\\n/g, '\n') + '</pre></li>'; 
    }).join('');

    response.end('<ul>' + content + '</ul>');
  });
}


var fs = require('fs');
function readFile(path, success) {
  fs.readFile(path, 'utf8', function (err, data) {
    err ? console.log(err) : success(data);
  });
}

//Get the build_log field from Buildfailures.txt file using RegEx
function getLogData(filename, done) {
  readFile('/Users/Didi/Desktop/BuildFailures/' + filename, function(data) {
    var logs = [];
    data.match(/\s*"build_log"\s?: ".*"/g).forEach(function(e){
      logs.push(e.match(/\s*"build_log"\s?: "(.*)"/)[1]);
    });


//Get the build_log field from Buildfailures.txt file without using RegEx
    //var lines = data.split('\n');
    //var keyword = '"build_log" : ', index;
    //lines.forEach(function(line){
    // index = line.indexOf(keyword);
    //  if (index != -1) {
    //   logs.push(line.slice(index + keyword.length, line.length - 2));
    //  }
    //});

    done(logs);
  });
}


//Error messages 
function errorMessage(){
  getLogData('BuildFailures.txt', function(logs) {
    var index, result, end;

    logs.forEach(function(msg, i) {
      
      // array of objects for each errorType pattern and friendly message
      var errorTypeCollection = [
        {
          "pattern": "Code Sign error", //18 errors
          "message": "Code Sign error occurred. Provisioning profiles not found. This product type must be built using a provisioning profile." 
        },
        {
          "pattern": "Build error: Error downloading and extracting project code", //5 errors
          "message": "An error occurred while downloading and extracting project source code." 
        },
        {
          "pattern": "failed to install cordova plugin", //2 errors
          "message": "Error building project source code. Failed to install cordova plugin."
        },
        {
         "pattern": "Execution failed for task", //67 errors
         "message": false
        },
        {
          "pattern": "Variable(s) missing",  //2 errors
          "message": "Error building project source code. Some plugins require a parameters APP_ID=\"value\" and APP_NAME=\"value\"."
        },
        {
          "pattern": "Failed to fetch plugin", //3 errors
          "message": "Failed to fetch plugin. There is a connection problems, or plugin specification is incorrect."
        },
        {
          "pattern": "A problem occurred evaluating root project 'android'", //3 errors
          "message": "A problem occurred evaluating root project 'android'. Missing key required \"keyAlias\"."
        }
      ];

      // Print the error message for each founded patterns
      errorTypeCollection.forEach(function(errorType, x){
        var keyword;

        if(msg.indexOf(errorType.pattern) !== -1) {
          if(errorType.message) {
            console.log(errorType.message);
          } else { 
            msg = msg.substr(msg.indexOf('Execution failed for task'));
            msg = msg.substr(0, (msg.indexOf('\\n\\n*')));
            msg = msg.replace(/\\n/g, '\n');
            console.log("Something went wrong! " + msg);
          }
        }
      });
    });
  });
}



// $ node process-2.js one two=three four
// 0: node
// 1: /Users/mjr/work/node/process-2.js
// 2: one
// 3: two=three
// 4: four

if (process.argv[2] == 'server') {
  http.createServer(handleRequest).listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);  // node index.js server 
  });
} else {
    errorMessage(); // node index.js
}