import { createBlogInput, updateBlogInput } from "@aj____/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();
blogRouter.use(async (c, next) => {
    const jwt = c.req.header('Authorization'); 
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }

    const token = jwt;
    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        if (!payload || typeof payload.id!='string') {
            c.status(401);
            return c.json({ error: "unauthorized" });
        }
        c.set('userId', payload.id);
        await next();
    } catch (err) {
        return c.json({ error: 'Invalid token' }, 401);
    }
});

blogRouter.post('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	const body = await c.req.json();
	const {success} = createBlogInput.safeParse(body);
	if(!success){
		c.status(411);
        return c.json({
            message :"Inputs are not correct" 
        })
	}
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

blogRouter.put('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = updateBlogInput.safeParse(body);
	if(!success){
		c.status(411);
        return c.json({
            message :"Inputs are not correct" 
        })
	}
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});
blogRouter.get('/bulk',async(c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const blogs = await prisma.post.findMany({
		select :{
			content:true,
			title:true,
			id:true,
			author :{
				select:{
					name : true
				}
			}
		}
	});
    return c.json({
        blogs
    })
})
blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		},
		select : {
			id : true,
			title : true,
			content : true,
			author :{
				select:{
					name:true
				}
			}
		}
	});

	return c.json({post});
})