import handler from '../server.mjs';
export default function run(req,res){req.url='/api/run';return handler(req,res);}
