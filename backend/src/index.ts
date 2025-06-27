import  {Hono}  from 'hono'
import { userRouter } from './route/user'
import { blogRouter } from './route/blog'
import { aiRouter } from './route/ai' 
import { cors } from 'hono/cors'
const app = new Hono<{
  Bindings : {
    DATABASE_URL : string
    JWT_SECRET : string
    HF_ACCESS_TOKEN: string 
  }
}>()
app.use('/*',cors());
app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);
app.route("/api/v1/ai", aiRouter); 

export default app 
