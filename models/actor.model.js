import generate from './generic.model.js';
import moment from 'moment';
import db from '../utils/db.js';

const model = generate('actor', 'actor_id');

model.find = function(ts){
    const m_ts = moment.unix(ts);
    const str_ts = m_ts.format('YYYY-MM-DD HH:mm:ss');
    return db('actor').where('last_update', '>=', str_ts);
}

export default model;