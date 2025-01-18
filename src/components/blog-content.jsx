/* eslint-disable react/prop-types */

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'  // 引入代码高亮样式
// import 'highlight.js/styles/atom-one-dark.css';

import gfm from 'remark-gfm'


const BlogContent = ( content ) => {
    return (
        <ReactMarkdown
          remarkPlugins={[gfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        >
          {content.content}

        </ReactMarkdown>
      )
}

export default BlogContent