import { createServer as httpCreateServer, RequestListener } from 'http';
import { createServer as httpsCreateServer } from 'https';
import { readFileSync } from 'fs';
import axios from 'axios';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const app = (secure): RequestListener => {
  return (req, res) => {
    // redirect if https server is set and we receive a http request
    if (process.env.ENV !== 'dev' && !secure) {
      res.writeHead(302, {
        Location: `https://${req.headers.host}`,
      });
      res.end();
    }
    if (req.headers.host?.startsWith('cdn.')) {
      res.writeHead(302, {
        Location: `https://${process.env.CDN_URL}${req.url}`,
      });
      res.end();
    }

    const chunks: Buffer[] = [];

    req
      .on('error', (err) => {
        console.error(err);
      })
      .on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        const body = Buffer.concat(chunks);

        axios({
          method: req.method,
          url: req.url,
          baseURL: `http://localhost:${process.env.PORT}`,
          data: body,
          headers: req.headers,
          responseType: 'stream',
          decompress: false,
        })
          .then((axiosResponse) => {
            res.writeHead(axiosResponse.status, axiosResponse.headers);
            axiosResponse.data.on('end', () => {
              res.end();
            });
            axiosResponse.data.pipe(res);
          })
          .catch((error) => {
            if (axios.isAxiosError(error)) {
              res.writeHead(error.response?.status || 500, error.message);
              if (error.response) {
                error.response.data.on('end', () => {
                  res.end();
                });
                error.response.data.pipe(res);
              } else {
                res.end();
              }
            } else {
              res.writeHead(500, error.message);
              res.end();
            }
          });
      });
  };
};

export const initServer = () => {
  return new Promise((resolve) => {
    const httpServer = httpCreateServer(app(false));

    httpServer.listen(80, () => {
      console.log(
        'Server is running at http://localhost:%d in %s mode',
        80,
        process.env.ENV
      );
    });
    if (process.env.ENV !== 'dev') {
      const sslPath = `/etc/letsencrypt/live/${process.env.DOMAIN}/`;
      const privateKey = readFileSync(`${sslPath}/privkey.pem`, 'utf8');
      const certificate = readFileSync(`${sslPath}/fullchain.pem`, 'utf8');
      const credentials = { key: privateKey, cert: certificate };
      const httpsServer = httpsCreateServer(credentials, app(true));
      httpsServer.listen(443, () => {
        console.log(
          'Server is running at https://localhost:%d in %s mode',
          443,
          process.env.ENV
        );
      });
    }
    resolve(true);
  });
};

initServer().then(() => {
  console.log('Proxy ready to go');
});
