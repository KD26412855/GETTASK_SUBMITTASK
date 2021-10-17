const OP_MULTIPLICATION = 'multiplication';
const OP_DIVISION = 'division';
const OP_ADDITION = 'addition';
const OP_SUBTRACTION = 'subtraction';
const OP_REMINDER = 'remainder';

module.exports = {
    OperationCreator: function (data){
    if ( data){
      switch (data.operation) {
        case OP_MULTIPLICATION:
          return {
                  id: data.id,
                  result: data.left * data.right
                }
        case OP_DIVISION:
        return {
                id: data.id,
                result: data.left / data.right
              }
        case OP_ADDITION:
        return {
                id: data.id,
                result: data.left + data.right
              }
        case OP_SUBTRACTION:
        return {
                id: data.id,
                result: data.left - data.right
              }
          case OP_REMINDER:
          return {
                  id: data.id,
                  result: data.left % data.right
                }
        default:
            return null;
      }
    } else {
       return null;
    }

  }

}
