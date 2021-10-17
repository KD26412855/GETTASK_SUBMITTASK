const API = require('./API/API');
const OperationCreatorModule = require('./OperationCreator');

module.exports = {
   CallPostAPI: function (dataToPost,callBackSuccess,callBackFailure) {

     const actionData = OperationCreatorModule.OperationCreator(dataToPost);
    if (actionData){
      const apiObj = new API();
      const MakeSubmitCallPromise = apiObj.SubmitTask(actionData);
       MakeSubmitCallPromise.then(callBackSuccess)
                         .catch(callBackFailure)
    } else {
       throw Error(`Error occured.${dataToPost.operation} Operation not found`);
     }
  }
}
