import express from 'express';
import crypto from 'crypto';

const router = express.Router();

router.post('/', function (req, res) {
    const time = Date.now() + 30000; //30s
    const user = req.body.username;
    const secret_key = process.env.SECRET_KEY;
  
    const payload = `${user}#${time}`;
    const hash = crypto.createHash('sha256')
    .update(payload+secret_key)
    .digest('hex');
  
    const encode = Buffer.from(`${payload}:${hash}`).toString('base64');
  
    if(req.body.username !== process.env.AUTH_USER || req.body.password !== process.env.AUTH_PASSWORD){
      res.status(403).send({authenticated: false});
    }
    else{
      res.status(200).json({
        authenticated: true,
        accessToken: encode,
        refeshToken: process.env.REFESH_TOKEN
      });
    }
});

export default router;