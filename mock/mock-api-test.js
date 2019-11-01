/**
 * api: request url = '/mock' + api
 * response: this is for express router callback, you can use query/params/body to make diff json
 * **/
module.exports = {
  api: '/test-mock',
  response: (req, res) => {
    // console.log(req.query);
    // console.log(req.params);
    // console.log(req.body);

    res.send(
      {
        success: true,
        code: 0,
        data: [],
        message: 'mock test success',
      },
    );
  },
};
