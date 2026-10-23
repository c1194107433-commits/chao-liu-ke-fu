import handler from '../server.mjs';
export default function product(req,res){req.url='/api/product';return handler(req,res);}
