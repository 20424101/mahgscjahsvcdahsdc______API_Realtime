import express from 'express';
import {logError, logInfo} from '../utils/log.js';
import {stackifyError, stackifyInfo} from '../utils/stackify-log.js';

import stackify from 'stackify-logger';
stackify.start({apiKey: '0Ka5Gv6Mj6Wc4Oa6Dz2Rn9Mj5Qd7Fn7Rf1Ue9Sv', appName: 'Node Application', env: 'Production'});

import actorModel from '../models/actor.model.js';
import moment from 'moment';
import { broadcastAll } from '../ws.js';
import sse from '../sse.js';


const router = express.Router();

router.get('/short_polling', async function (req, res) {
    const ts = req.query.ts || 0;

    const list = await actorModel.find(ts);
    res.json({
      ts: moment().unix(),
      list
    });
})

router.get('/long_polling', async function (req, res) {
  const ts = req.query.ts || 0;

  let loop = 0;
  const f = async function(){
    const list = await actorModel.find(ts);
    if(list.length > 0){
      res.json({
        ts: moment().unix(),
        list
      });
    }
    else{
      loop++;
      console.log(`loop: ${loop}`);
      if(loop < 4){
        setTimeout(f, 3000);
      }
      else{
        res.json({
          ts: moment().unix(),
          list: []
        });
      }
    }
  }

  await f();
})

//---------------------------------------------------------
router.get('/', async function (req, res) {

  const list = await actorModel.findAll();
  res.json(list);
})

router.get('/:id', async function (req, res) {
  
  try {
    const id = req.params.id || 0;
    const film = await actorModel.findById(id);
    if (film === null) {
      return res.status(204).end();
    }
    res.json(film);
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
})

router.post('/', async function (req, res) {
  
    let actor = req.body;
    const ret = await actorModel.add(actor);
    actor = {
      actor_id: ret[0],
      ...actor
    }
    broadcastAll(JSON.stringify(actor));
    // const _notif = createNotification(JSON.stringify(actor));
    // sse.send(JSON.stringify(_notif), 'data');
    sse.send(actor, "post_reaction");
    res.status(201).json(actor);
})

router.delete('/:id', async function (req, res) {
  
  try {
    const id = req.params.id || 0;
    const n = await actorModel.del(id);
    res.json({
      affected: n
    });
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
})

router.patch('/:id', async function (req, res) {
  try {
    const id = req.params.id || 0;
    const film = req.body;
    const n = await actorModel.patch(id, film);
    res.json({
      affected: n
    });
    logInfo(req, res);
    stackifyInfo(req, res);

  } catch (error) {
    logError(error, req, res);
    stackifyError(error, req, res);
  }
})

//--------
// router.get('/logging', async function (req, res) {
//   try {
//     const list = await actorModel.findAll();
//     res.json(list);
//     logInfo(req, res);
//     stackifyInfo(req, res);

//   } catch (error) {
//     logError(error, req, res);
//     stackifyError(error, req, res);
//   }
// })

// router.post('/', async function (req, res) {
  
//   try {
//     let film = req.body;
//     const ret = await actorModel.add(film);
//     film = {
//       film_id: ret[0],
//       ...film
//     }
//     res.status(201).json(film);
//     logInfo(req, res);
//     stackifyInfo(req, res);

//   } catch (error) {
//     logError(error, req, res);
//     stackifyError(error, req, res);
//   }
// })

export default router;