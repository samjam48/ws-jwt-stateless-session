'use strict';

const { readFile } = require('fs');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const notFoundPage = '<p style="font-size: 10vh; text-align: center;">404!</p>';

module.exports = (req, res) => {
  switch (`${req.method} ${req.url}`) {
    case 'GET /':
      return readFile(
        './index.html',
        (err, data) => {
          res.writeHead(
            200,
            {
              'Content-Type': 'text/html',
              'Content-Length': data.length
            }
          );
          return res.end(data);
        }
      );
      break;

    case 'POST /login':
      jwt.sign({user: "Sam"}, 'SecretStuff', {algorithm: 'HS256'}, function(err, token) {
        if (err) {
          return err;
        } else {
          res.writeHead(302, {'Set-Cookie': `loginCookie=${token}; logged_in=true; Max-Age=9000;`, 'Location': '/'});
          return res.end(token);
        }
      });
      break;

    case 'POST /logout':
      res.writeHead(302, {'Set-Cookie': `${req.headers.cookie}; logged_in=false;  Max-Age=0;`, 'Location': '/'});
      return res.end();
      break;

    case 'GET /auth_check':
      const cookies = cookie.parse(req.headers.cookie || '');

      if (typeof cookies.loginCookie != 'undefined') {
        var decoded = jwt.verify(cookies.loginCookie, 'SecretStuff')
        console.log(decoded.user);
        
      }
      // const loginCookie = cookies.loginCookie;



      // console.log('our loginCookie value = ', loginCookie);
      // console.log('cookies = ', cookies);


    default:
      res.writeHead(
        404,
        {
          'Content-Type': 'text/html',
          'Content-Length': notFoundPage.length
        }
      );
      return res.end(notFoundPage);
  }
}
