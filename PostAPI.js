const https = require('https');
const OperationCreatorModule = require('./OperationCreator');

module.exports = {

  //  CallPostAPI makes submit-task API using response of get-task api
  //  Throws error if request invalid
   CallPostAPI: function (dataToPost,callBack){

    const actionData = OperationCreatorModule.OperationCreator(dataToPost);
    if (actionData){
      const MakePostCallPromise = MakePostCall(actionData);
       MakePostCallPromise
       .then(callBack)
       .catch((data) => { console.log('Promise executed with error',data); })
    } else {
       throw Error(`Error occured.${dataToPost.operation} Operation not found`);
     }
  }

}

//  MakePostCall makes actual POST request to submit-task api
//  and returns a promise with response of the API
const MakePostCall = (dataToPost) => {

    return new Promise((resolve,reject) => {
      const dataToPostStr = JSON.stringify(dataToPost);
      const postResopnseObj = {
        data: null,
        error: null,
        status: null
      };
      const options = {
        host: 'interview.adpeai.com',
        port: 443,
        path: '/api/v1/submit-task',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': dataToPostStr.length
        }
      };

      const lstOfChunks = [];
      const request = https.request(
                                      options,
                                        (response) => {

                                          if (response.statusCode){
                                            postResopnseObj.status = {
                                                              status: response.statusCode,
                                                              statusMessage: response.statusMessage
                                                            };
                                            switch (response.statusCode) {
                                              case 400:
                                                postResopnseObj.error = 'Incorrect value in result; no ID specified; value is invalid';
                                                return reject(postResopnseObj);
                                              case 500:
                                                postResopnseObj.error = 'ID cannot be found';
                                                return reject(postResopnseObj);
                                            }
                                          }
                                          response.on('data', chunk => {
                                            lstOfChunks.push(chunk);
                                          })
                                          .on('end', () => {
                                              postResopnseObj.data = lstOfChunks.toString();
                                              return resolve(postResopnseObj);
                                            })
                                        }
                                  );

      request.on('error', err => {
        console.log('Error returned:',err);
      });
      request.write(dataToPostStr);
      request.end();

    });
}
