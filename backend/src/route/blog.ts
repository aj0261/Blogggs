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

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogsWithVotes = await prisma.post.findMany({
        select: {
            content: true, title: true, id: true, publishedAt: true,
            author: { select: { name: true ,id:true} },
            _count: { select: { votes: true } },
            votes: { where: { type: "UP" } }
        },
        orderBy: { publishedAt: 'desc' }
    });

    const blogs = blogsWithVotes.map(blog => {
        const upvotes = blog.votes.length;
        const totalVotes = blog._count.votes;
        const downvotes = totalVotes - upvotes;
        
        const { _count, votes, ...rest } = blog;
        return { ...rest, upvotes, downvotes }; 
    });

    return c.json({ blogs });
});


blogRouter.get('/search', async (c) => {
    const query = c.req.query('q') || '';

    if (!query) {
        return c.json({ blogs: [] }); 
    }

    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    try {
        const blogs = await prisma.post.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive', 
                        }
                    },
                    {
                        content: {
                            contains: query,
                            mode: 'insensitive',
                        }
                    },
                    {
                        author: {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                title: true,
                content: true,
                publishedAt: true,
                author: { select: { name: true } },
                _count: { select: { votes: true } },
                votes: { where: { type: "UP" } }
            }
        });
        const results = blogs.map(blog => {
            const upvotes = blog.votes.length;
            const downvotes = blog._count.votes - upvotes;
            const { _count, votes, ...rest } = blog;
            return { ...rest, upvotes, downvotes };
        });
        return c.json({ blogs: results });
    } catch (e) {
        console.error("Search failed:", e);
        return c.json({ error: "Failed to perform search" }, 500);
    }
});


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
			authorId: userId,
			publishedAt: new Date(),
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
	await prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content,
			publishedAt : new Date(),
		}
	});
	return c.text('updated post');
});

blogRouter.get('/myblogs', async (c) => {
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userBlogs = await prisma.post.findMany({
            where: {
                authorId: userId,
            },
            select: {
                id: true,
                title: true,
                publishedAt: true,
            },
            orderBy: {
                publishedAt: 'desc' 
            }
        });

        return c.json({ blogs: userBlogs });
    } catch (err) {
        console.error("Failed to fetch user blogs:", err);
        return c.json({ error: 'Failed to fetch blogs' }, 500);
    }
});

blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            select: {
                id: true, title: true, content: true, publishedAt: true,
                author: { select: { name: true ,id : true , bio : true} },
                _count: { select: { votes: true } },
                votes: { where: { type: "UP" } }
            }
        });

        if (!post) return c.json({ error: "Post not found" }, 404);

        const upvotes = post.votes.length;
        const totalVotes = post._count.votes;
        const downvotes = totalVotes - upvotes;

        const userVote = await prisma.vote.findUnique({
            where: { postId_userId: { postId: id, userId } },
            select: { type: true }
        });
        
        const { _count, votes, ...rest } = post;
        const responsePost = { ...rest, upvotes, downvotes, userVote: userVote ? userVote.type : null };
        
        return c.json({ post: responsePost });
    } catch (e) {
        return c.json({ error: "Failed to fetch post"}, 500);
    }
});


blogRouter.post('/:id/vote', async (c) => {
    const userId = c.get('userId');
    const postId = c.req.param('id');
    const { voteType } = await c.req.json(); 

    if (voteType !== "UP" && voteType !== "DOWN") {
        return c.json({ error: "Invalid vote type" }, 400);
    }

    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    try {
        const existingVote = await prisma.vote.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                }
            }
        });

        if (existingVote) {
            // User is clicking the same vote button again
            if (existingVote.type === voteType) {
                await prisma.vote.delete({
                    where: { id: existingVote.id }
                });
                return c.json({ message: "Vote removed" });
            }
            // Case 2: User is changing their vote
            else {
                await prisma.vote.update({
                    where: { id: existingVote.id },
                    data: { type: voteType }
                });
                return c.json({ message: "Vote changed" });
            }
        } else {
            // Case 3: User is casting a new vote
            await prisma.vote.create({
                data: {
                    type: voteType,
                    postId,
                    userId,
                }
            });
            return c.json({ message: "Vote cast" });
        }
    } catch (e) {
        console.error("Vote failed:", e);
        return c.json({ error: "Could not process vote" }, 500);
    }
});

blogRouter.get('/:id/comments', async (c) => {
    const postId = c.req.param('id');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' 
            }
        });
        return c.json({ comments });
    } catch (e) {
        return c.json({ error: "Failed to fetch comments" }, 500);
    }
});

blogRouter.post('/:id/comment', async (c) => {
    const userId = c.get('userId'); 
    const postId = c.req.param('id');
    const { content } = await c.req.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return c.json({ error: "Comment content cannot be empty" }, 400);
    }

    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

    try {
        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId: userId,
                postId,
            },
            select: { 
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        return c.json({ comment: newComment }, 201); 
    } catch (e) {
        return c.json({ error: "Failed to post comment" }, 500);
    }
});

