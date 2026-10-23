import http from 'node:http';
import {readFile} from 'node:fs/promises';
const key=process.env.DIFY_API_KEY;
const base=(process.env.DIFY_BASE_URL||'http://localhost/v1').replace(/\/$/,'');
const product=await readFile(new URL('data/product_info.txt',import.meta.url),'utf8');
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
http.createServer(async(req,res)=>{
try{
if(req.method==='GET'&&req.url==='/api/product')return send(res,200,{product,connected:!!key});
if(req.method==='POST'&&req.url==='/api/run'){
if(req.headers.origin && ![`http://${req.headers.host}`,`https://${req.headers.host}`].includes(req.headers.origin))return send(res,403,{error:'请求来源不允许'});
let body='';for await(const chunk of req){body+=chunk;if(body.length>30000)return send(res,413,{error:'输入过长'});}
const {question,product_info}=JSON.parse(body);
if(typeof question!=='string'||!question.trim()||question.length>2000||typeof product_info!=='string'||!product_info.trim()||product_info.length>20000)return send(res,400,{error:'请填写问题和商品资料，并检查长度'});
if(!key)return send(res,503,{error:'尚未配置 Dify API Key，请设置环境变量后重启'});
const upstream=await fetch(base+'/workflows/run',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({inputs:{question,product_info},response_mode:'blocking',user:'chaowan-local-workbench'}),signal:AbortSignal.timeout(120000)});
if(!upstream.ok)return send(res,502,{error:`Dify 调用失败（${upstream.status}），请检查密钥、已发布版本和模型配置。`});
const result=await upstream.json();if(result.data?.status!=='succeeded')return send(res,502,{error:'工作流未成功完成，请在 Dify 日志中查看原因。'});
const o=result.data.outputs||{};const category=o.reasoning_content||o.category;const answer=o.title||o.answer;
if(typeof category==='string'&&category.trim())return send(res,200,{kind:'human',category:['物流','售后','拿不准'].includes(category.trim())?category.trim():'拿不准',question});
if(typeof answer==='string'&&answer.trim())return send(res,200,{kind:answer.includes('需要人工客服进一步核实')?'human':'auto',category:answer.includes('需要人工客服进一步核实')?'拿不准':'参数',answer,question});
return send(res,502,{error:'工作流输出格式不匹配，请检查结束节点字段。'});
}
if(req.method==='GET'&&['/','/app.js','/style.css'].includes(req.url)){const file=req.url==='/'?'index.html':req.url.slice(1);res.setHeader('Content-Type',file.endsWith('html')?'text/html; charset=utf-8':file.endsWith('css')?'text/css':'text/javascript');return res.end(await readFile(new URL('public/'+file,import.meta.url)));}
send(res,404,{error:'未找到'});
}catch(e){send(res,502,{error:e.name==='TimeoutError'?'Dify 响应超时，请稍后重试。':'请求未完成，请检查本机 Dify 是否运行。'});}
}).listen(Number(process.env.PORT||3210),process.env.HOST||'127.0.0.1',()=>console.log('潮玩客服服务已启动'));
