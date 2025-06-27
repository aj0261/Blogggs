import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign ,verify} from "hono/jwt";
import { signinInput, signupInput } from "@aj____/medium-common";
export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const {success } = signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message :"Inputs are not correct" 
        })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name : body.name
      },
    });
  
    const token = await sign({ id: user.id,name : user.name }, c.env.JWT_SECRET)
  
    return c.text(token)
})
  
userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message :"Inputs are not correct" 
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
    });

    if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.text(jwt);
})

userRouter.put('/profile', async (c) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) return c.json({ error: "unauthorized" }, 401);
    
    let userId;
    try {
        const payload = await verify(jwt, c.env.JWT_SECRET);
        if (!payload || typeof payload.id !== 'string') return c.json({ error: "unauthorized" }, 401);
        userId = payload.id;
    } catch (err) {
        return c.json({ error: 'Invalid token' }, 401);
    }
    
    const { bio } = await c.req.json();
    if (typeof bio !== 'string') {
        return c.json({ error: 'Invalid bio provided' }, 400);
    }

    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { bio: bio },
        });
        return c.json({ message: 'Profile updated successfully' });
    } catch (e) {
        return c.json({ error: 'Failed to update profile' }, 500);
    }
});

userRouter.get('/:id/profile', async (c) => {
    const userId = c.req.param('id');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                bio: true,
                posts: { 
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        publishedAt: true,
                        _count: { select: { votes: true } },
                        votes: { where: { type: "UP" } }
                    },
                    orderBy: { publishedAt: 'desc' }
                }
            }
        });

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }
        const userProfile = {
            ...user,
            posts: user.posts.map(post => {
                const upvotes = post.votes.length;
                const downvotes = post._count.votes - upvotes;
                const { _count, votes, ...rest } = post;
                return { ...rest, upvotes, downvotes };
            })
        };

        return c.json({ user: userProfile });
    } catch (e) {
        return c.json({ error: 'Failed to fetch user profile' }, 500);
    }
});