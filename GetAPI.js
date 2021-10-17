const PostAPI = require('./PostAPI');
const https = require('https');

const GETTASK_URL = 'https://interview.adpeai.com/api/v1/get-task';
//  StartGetCall makes an HTTP GET request to
//  https://interview.adpeai.com/api/v1/get-task
//  and then, uses the response to create POST request for https://interview.adpeai.com/api/v1/submit-task
//  and makes POST call
const StartGetCall = function () {
  const lstOfChunks = [];
  const request = https
                    .request(
                                    GETTASK_URL,
                                    (response) => {
                                      response.on('data', chunk => {
                                        lstOfChunks.push(chunk);
                                      })
                                      .on('end', () => {
                                            const jsonResp = JSON.parse(Buffer.concat(lstOfChunks).toString());
                                            HandleGetSuccess(jsonResp);
                                        });
                                    }
                              );

        request.on('error', err => {
          console.log('Error returned during Get-Task API call:', err);
        });
        request.end();
};

//  HandleGetSuccess is called with response of the Get-Task API
//  HandleGetSuccess passes on the request to PostAPI modlue to submit a POST
const HandleGetSuccess = (dataToPost) => {
    try {
      console.log('Get-Task response received:', dataToPost);
      PostAPI.CallPostAPI(dataToPost, HandlePostResponse);
    } catch (e) {
      console.log('Error Occured!! ouptput:', e.message);
    }

};

//  HandlePostResponse is called with response of submit-task API
//  It outputs response of the submit-task API
//  Also takes response from user if need to make another get-task API call or exit
const HandlePostResponse = function ( output){
  if ( output && output.data && output.error == null){

    console.log( 'Submit-Task response Received: ', output);

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    readline.question('To Continue PRESS: Y \nTo Exit Press    : N \n:', name => {
      try {
        if (name.toUpperCase() === 'Y'){
          StartGetCall();
        } else {
          console.log('Thank You! Process completed')
          readline.close();
        }
      } catch (e) {
        console.log('Error Occured!! ouptput:',e.message);
        readline.close();
      }
    })
  } else {
    console.log('ERROR Received!!! output:',output);
  }
};

//  Start executing API calls
StartGetCall();
