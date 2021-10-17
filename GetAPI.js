const PostAPI = require('./PostAPI');
const API = require('./API/API');

//  StartModule makes an HTTP GET request to
//  https://interview.adpeai.com/api/v1/get-task
//  and then, uses the response to create POST request for https://interview.adpeai.com/api/v1/submit-task
//  and makes POST call
 const StartModule = function () {
  const apiObj = new API();
  const MakeGetCallPromise = apiObj.GetTask();
   MakeGetCallPromise.then(HandleGetSuccess)
                     .catch(HandleFailure)
}

//  HandleGetSuccess is called with response of the Get-Task API
//  HandleGetSuccess passes on the request to PostAPI modlue to submit a POST
const HandleGetSuccess = (dataToPost) => {
    try {
      console.log('Get-Task response received:', dataToPost);
      PostAPI.CallPostAPI(dataToPost, HandlePostResponse,HandleFailure);
    } catch (e) {
      console.log('Error Occured!! ouptput:', e.message);
      StartNewOpeartion();
    }

};

/// HandleFailure logs errro returned by Get_Task api and gives option to exit or restart process
const HandleFailure = (err) => {
    console.log('Error returned during API call:', err);
    StartNewOpeartion();
}

//  HandlePostResponse is called with response of submit-task API
//  It outputs response of the submit-task API
//  Also takes response from user if need to make another get-task API call or exit
const HandlePostResponse = function ( output){
  if ( output && output.data && output.error == null){
    console.log( 'Submit-Task response Received: ', output);
  } else {
    console.log('ERROR Received!!! output:',output);
  }
  StartNewOpeartion();
};

/// StartNewOpeartion gives option to user to restart process or exit
const StartNewOpeartion = () => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('To Continue PRESS: Y \nTo Exit Press    : N \n:', name => {
    try {
      if (name.toUpperCase() === 'Y'){
        StartModule();
        readline.close();
      } else {
        console.log('Thank You! Process completed')
        readline.close();
      }
    } catch (e) {
      console.log('Error Occured!! ouptput:',e.message);
      readline.close();
    }
  })
}

//  Start executing API calls
StartModule();
