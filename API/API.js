const https = require('https');
const GETTASK_URL = 'https://interview.adpeai.com/api/v1/get-task';

function GETPOSTAPI () {}

const _p = GETPOSTAPI.prototype;

//  GetTask makes actual GET request to get-task api
//  and returns a promise with response of the API
_p.GetTask = function () {

return new Promise((resolve,reject) => {

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
                                              resolve(jsonResp);
                                          });
                                      }
                                );

          request.on('error', err => reject(err) );
          request.end();
  });

};

//  SubmitTask makes actual POST request to submit-task api
//  and returns a promise with response of the API
_p.SubmitTask = function (dataToPost) {
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
};

module.exports = GETPOSTAPI;
