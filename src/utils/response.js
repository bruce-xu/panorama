/**
 * 响应体
 */
class Response {
  static success(data, msg) {
    return {
      code: 0,
      data,
      msg: msg || 'Success'
    };
  }

  static error(code, msg, data) {
    console.error(`
Error:
  code: ${code}
  data: ${data}
  msg: ${msg}`);
    
    return {
      code,
      data: data,
      msg: msg || 'Error'
    };
  }

  static write(res) {
    let {code, msg, data} = res;
    if (code !== 0) {
      msg = msg || errorMessages[code] || errorMessages[-1];
    }

    return {
      code,
      msg,
      data
    }
  }
}

module.exports = Response;