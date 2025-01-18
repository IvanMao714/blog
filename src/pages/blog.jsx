import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction";
import BlogPostCard from "../components/blog-post";
import BlogContent from "../components/blog-content";
// import CommentsContainer, { fetchComments } from "../components/comment/comments";

export const blogStructure = {
    title: '',
    des: '',
    content: [],
    author: { personal_info: { } },
    banner: '',
    publishedAt: '',
}

export const BlogContext = createContext({ });

const BlogPage = () => {

    let { blog_id } = useParams()

    const [ blog, setBlog ] = useState(blogStructure);
    const [ similarBlogs, setSimilrBlogs ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ islikedByUser, setLikedByUser ] = useState(false);
    const [ commentsWrapper, setCommentsWrapper ] = useState(false);
    const [ totalParentCommentsLoaded, setTotalParentCommentsLoaded ] = useState(0);

    // console.log(blog);
    let { title, content , banner, author: { personal_info: { fullname, username: author_username , profile_img } }, publishedAt } = blog;
    // console.log(content);
    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "blog/get-blog", { blog_id })
        .then(async ({ data: { blog } }) => {
            

            // blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFun: setTotalParentCommentsLoaded })
            blog.comments = [];
            setBlog(blog);
            console.log(blog);

            // axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
            // .then(({ data }) => {

            //     setSimilrBlogs(data.blogs);
            // })

            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }
    // const fetchBlog = () => {
    //     setLoading(true);
      
    //     // ====== [1] 手动构造一个 Mock Blog 数据 ======
    //     const mockBlog = {
    //       _id: "63f0f82199a66bc57bd12016",
    //       blog_id: "mock-blog-001",
    //       title: "这是一篇 Mock Blog",
    //       banner: "https://via.placeholder.com/600x300", 
    //       des: "这是一段模拟描述，用来测试前端页面的展示效果。",
    //       content: [
    //         {
    //             blocks: [
    //                 {
    //                     type: "header",
    //                     data: {
    //                         text: "这是一个标题",
    //                         level: 3
    //                     }
    //                 },
    //                 {
    //                     type: "paragraph",
    //                     data: {
    //                         text: "这是一段测试文本。"
    //                     }
    //                 }
    //             ]
    //         }
    //       ],
    //       tags: ["tagX", "tagY"],
    //       author: {
    //         personal_info: {
    //             fullname: "Mock 作者",
    //             username: "mock-author",
    //             profile_img: "https://via.placeholder.com/150x150"
    //         }
    //       },
    //       activity: {
    //         total_likes: 20,
    //         total_comments: 5,
    //         total_reads: 100,
    //         total_parent_comments: 2
    //       },
    //       comments: [],
    //       draft: false,
    //       // timestamps 里会自动生成 publishedAt，在此手动加上做测试
    //       publishedAt: "2025-01-02T00:00:00.000Z"
    //     };
      
    //     // ====== [2] 手动构造一个 Mock "相似博客" 列表 ======
    //     const mockSimilarBlogs =  [
    //         {
    //           _id: "63f0f82199a66bc57bd12017",
    //           blog_id: "mock-blog-002",
    //           title: "模拟相似博客#1",
    //           banner: "https://via.placeholder.com/600x300",
    //           des: "这是一篇相似博客#1，用于测试。",
    //           tags: ["tagX", "tagA"],
    //           activity: {
    //             total_likes: 5,
    //             total_comments: 1
    //           },
    //           publishedAt: "2025-01-03T00:00:00.000Z",
    //           personal_info: {
    //             fullname: "Mock 作者",
    //             username: "mock-author",
    //             profile_img: "https://via.placeholder.com/150x150"
    //             }
    //         },
    //         // {
    //         //   _id: "63f0f82199a66bc57bd12018",
    //         //   blog_id: "mock-blog-003",
    //         //   title: "模拟相似博客#2",
    //         //   banner: "https://via.placeholder.com/600x300",
    //         //   des: "这是一篇相似博客#2，用于测试。",
    //         //   tags: ["tagY", "tagB"],
    //         //   activity: {
    //         //     total_likes: 15,
    //         //     total_comments: 3
    //         //   },
    //         //   publishedAt: "2025-01-04T00:00:00.000Z"
    //         // }
    //       ];
      
    //     // ====== [3] 用 setTimeout 模拟异步请求延迟 ======
    //     setTimeout(async () => {
    //       try {
    //         // ====== 模拟获取 Blog ======
    //         const blog = mockBlog;
      
    //         // ====== 如果你还想调 fetchComments，模拟返回一些评论数据 ======
    //         // blog.comments = await fetchComments({
    //         //   blog_id: blog._id,
    //         //   setParentCommentCountFun: setTotalParentCommentsLoaded
    //         // });
      
    //         // 设置本地状态
    //         setBlog(blog);
      
    //         // ====== 模拟获取相似博客 ======
    //         const data = mockSimilarBlogs;
    //         setSimilrBlogs(data.blogs);
      
    //         setLoading(false);
    //       } catch (err) {
    //         console.log(err);
    //         setLoading(false);
    //       }
    //     }, 1000); // 1秒的延迟模拟
    //   };
      

    useEffect(() => {

        resetStates();

        fetchBlog();
        console.log(content);


    }, [blog_id])

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilrBlogs(null);
        setLoading(true);
        setLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    }

    console.log(content);

    return (
        <AnimationWrapper>
            {
                loading ? <Loader />
                : 
                <BlogContext.Provider value={{ blog, setBlog, islikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded }}>

                    {/* <CommentsContainer /> */}

                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">

                        {/* <img src={banner} className="aspect-video" /> */}

                        <div className="mt-12">
                            <h2>{title}</h2>

                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img src={profile_img} className="w-12 h-12 rounded-full" />

                                    <p className="capitalize">
                                        {fullname}
                                        <br />
                                        @
                                        <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                                    </p>
                                    
                                </div>
                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
                            </div>
                        </div>

                        {/* <BlogInteraction /> */}

                        <div className="my-12 font-gelasio blog-page-content">
                            {/* {
                                content.blocks.map((block, i) => {
                                    return <div key={i} className="my-4 md:my-8">
                                        <BlogContent block={block} />
                                    </div>
                                })
                            } */}
                            <BlogContent content={content} />
                        </div>

                        <BlogInteraction />
{/* 
                        {
                            similarBlogs != null && similarBlogs.length ?
                                <>
                                    <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>

                                    {
                                        similarBlogs.map((blog, i) => {

                                            let { author: { personal_info } } = blog;
                                            // console.log(blog);

                                            return <AnimationWrapper key={i} transition={{ duration: 1, delay: i*0.08 }}>
                                                <BlogPostCard content={blog} author={personal_info} />
                                            </AnimationWrapper>

                                        })
                                    }
                                </>
                            : " "
                        }  */}

                    </div>
                </BlogContext.Provider>
            }
        </AnimationWrapper>
    )
}

export default BlogPage;