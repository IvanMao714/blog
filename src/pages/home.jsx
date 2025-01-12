import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import BlogPostCard from "../components/blog-post";
import MinimalBlogPost from "../components/nobanner-blog-post";
import { activeTabRef } from "../components/inpage-navigation";
import NoDataMessage from "../components/nodata";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more";

const latestBlogsMockData = [
    {
        blog_id: 1,
        publishedAt: "2025-01-01",
        tags: ["tag1", "tag2"],
        title: "Mock Blog #1",
        des: "This is the description for mock blog #1",
        banner: "https://example.com/banner1.jpg",
        activity: {
        total_likes: 10,
        },
        author: {personal_info: {
          fullname: "Mock User A",
          profile_img: "https://example.com/mock_avatar_a.jpg",
          username: "MockA",
        }},
      },
      {
        blog_id: 2,
        publishedAt: "2025-01-02",
        tags: ["tagX", "tagY"],
        title: "Mock Blog #2",
        des: "This is the description for mock blog #2",
        banner: "https://example.com/banner2.jpg",
        activity: {
        total_likes: 20,
        },
        author: {personal_info: {
          fullname: "Mock User B",
          profile_img: "https://example.com/mock_avatar_b.jpg",
          username: "MockB",
        }},
      },
    ];


// // 模拟的“分类博客”数据（可根据分类再细分或只用一套数据）
// const categoryBlogsMockData = [
//     {
//       title: "Mock Category Blog #1",
//       author: { personal_info: { name: "Mock Category User" } },
//       content: "Category: programming"
//     },
//     {
//       title: "Mock Category Blog #2",
//       author: { personal_info: { name: "Mock Category User" } },
//       content: "Category: programming"
//     }
//   ];
  
  // 模拟的“热门博客”数据
  const trendingBlogsMockData = [
    {
        blog_id: 1,
        publishedAt: "2025-01-01",
        tags: ["tag1", "tag2"],
        title: "Mock Blog #1",
        des: "This is the description for mock blog #1",
        banner: "https://example.com/banner1.jpg",
        activity: {
        total_likes: 10,
        },
        author: {personal_info: {
          fullname: "Mock User A",
          profile_img: "https://example.com/mock_avatar_a.jpg",
          username: "MockA",
        }},
      },
      {
        blog_id: 2,
        publishedAt: "2025-01-02",
        tags: ["tagX", "tagY"],
        title: "Mock Blog #2",
        des: "This is the description for mock blog #2",
        banner: "https://example.com/banner2.jpg",
        activity: {
        total_likes: 20,
        },
        author: {personal_info: {
          fullname: "Mock User B",
          profile_img: "https://example.com/mock_avatar_b.jpg",
          username: "MockB",
        }},
      },
    ];

const HomePage = () => {
    let [blogs, setBlog] = useState(null);
    let [trendingBlogs, setTrendingBlog] = useState(null);
    let [ pageState, setPageState ] = useState("home");
    let [categories, setCategories] = useState([]);

    const fetchCategories = () => {
        axios
            .get(import.meta.env.VITE_SERVER_DOMAIN + "tag/get_all")
            .then(({ data }) => {
                setCategories(data);
                // console.log(data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // let categories = [
    //     "programming",
    //     "hollywood",
    //     "film making",
    //     "social media",
    //     "cooking",
    //     "tech",
    //     "finance",
    //     "travel",
    // ];

    const fetchLatestBlogs = ({ page = 1 }) => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "blog/latest-blogs", { page })
            .then( async ({ data }) => {
                
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "blog/all-latest-blogs-count"
                })
                // console.log(formatedData)

                setBlog(formatedData);
            })
            .catch((err) => {
                console.log(err);
            });

        // setTimeout(async () => {
        //     // 直接使用我们的 mock data
        //     let mockResult = latestBlogsMockData;
        
        //     // 如果需要模拟分页，可以在这里做一下 slice 处理
        //     // 例如: mockResult = latestBlogsMockData.slice( (page-1)*5, page*5 )
        
        //     // 不想破坏原本 filterPaginationData 的结构时，你依旧可以调用它
        //     // 只需要把 mockResult 当成 data.blogs 传进去即可
        //     let formatedData = await filterPaginationData({
        //       state: blogs,
        //       data: mockResult,
        //       page,
        //       countRoute: "/all-latest-blogs-count"
        //     });
        
        //     setBlog(formatedData);
        //   }, 500); // 0.5 秒后返回，假装有网络延时
        
    };

    const fetchBlogsByCategory = ({ page = 1 }) => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "blog/search-blogs", { tag: pageState, page })
            .then( async ({ data }) => {
                // console.log(data)
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "blog/search-blogs-count",
                    data_to_send: { tag: pageState }
                })
                // console.log(formatedData)

                setBlog(formatedData);
            })
            .catch((err) => {
                console.log(err);
            });
        // setTimeout(async () => {
        //     // 这里可以做更精确的分类匹配，也可以直接返回我们准备的 categoryBlogsMockData
        //     let mockResult = categoryBlogsMockData;
        
        //     let formatedData = await filterPaginationData({
        //       state: blogs,
        //       data: mockResult,
        //       page,
        //       countRoute: "/search-blogs-count",
        //       data_to_send: { tag: pageState }
        //     });
        
        //     setBlog(formatedData);
        //   }, 500);
    }

    const fetchTrendingBlogs = () => {
        axios
            .get(import.meta.env.VITE_SERVER_DOMAIN + "blog/trending-blogs")
            .then(({ data }) => {
                setTrendingBlog(data.blogs);
            })
            .catch((err) => {
                console.log(err);
            });
        // setTimeout(() => {
        //     // 直接使用 mock 数据
        //     setTrendingBlog(trendingBlogsMockData);
        //   }, 500);
    };

    const loadBlogByCategory = (e) => {
        
        let category = e.target.innerText.split(' ')[0].toLowerCase(); 

        setBlog(null);

        if(pageState == category){
            setPageState("home");
            return;
        }

        setPageState(category);

    }

    useEffect(() => {

        activeTabRef.current.click();

        if(pageState == "home"){
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsByCategory({ page: 1 })
        }

        if(!trendingBlogs){
            fetchTrendingBlogs();
        }
        fetchCategories();

    }, [pageState]);

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blogs */}
                <div className="w-full">
                    <InPageNavigation
                        routes={[ pageState , "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                    >
                        <>
                            {blogs == null ? (
                                <Loader />
                            ) : (
                                blogs.results.length ? 
                                    blogs.results.map((blog, i) => {
                                        return (
                                            <AnimationWrapper
                                                transition={{
                                                    duration: 1,
                                                    delay: i * 0.1,
                                                }}
                                                key={i}
                                            >
                                                <BlogPostCard
                                                    content={blog}
                                                    author={
                                                        blog.author.personal_info
                                                    }
                                                />
                                            </AnimationWrapper>
                                        );
                                    })
                                : <NoDataMessage message="No blogs published" />
                            )}
                            <LoadMoreDataBtn state={blogs} fetchDataFun={( pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory )} />
                        </>

                        {trendingBlogs == null ? (
                            <Loader />
                        ) : (
                            trendingBlogs.length ?
                                trendingBlogs.map((blog, i) => {
                                    return (
                                        <AnimationWrapper
                                            transition={{
                                                duration: 1,
                                                delay: i * 0.1,
                                            }}
                                            key={i}
                                        >
                                            <MinimalBlogPost
                                                blog={blog}
                                                index={i}
                                            />
                                        </AnimationWrapper>
                                    );
                                })
                            : <NoDataMessage message="No trending blogs" />
                        )}
                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Stories form all interests
                            </h1>

                            <div className="flex gap-3 flex-wrap">
                                {categories.map((category, i) => {
                                    return (
                                        <button onClick={loadBlogByCategory} className={"tag " + (pageState == category.tag ? " bg-black text-white " : " ")} 
                                        key={i}>
                                            {category.tag} {category.count}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Trending
                                <i className="fi fi-rr-arrow-trend-up"></i>
                            </h1>

                            {trendingBlogs == null ? (
                                <Loader />
                            ) : (
                                trendingBlogs.length ? 
                                    trendingBlogs.map((blog, i) => {
                                        return (
                                            <AnimationWrapper
                                                transition={{
                                                    duration: 1,
                                                    delay: i * 0.1,
                                                }}
                                                key={i}
                                            >
                                                <MinimalBlogPost
                                                    blog={blog}
                                                    index={i}
                                                />
                                            </AnimationWrapper>
                                        );
                                    })
                                : <NoDataMessage message="No trending blogs" />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default HomePage;
