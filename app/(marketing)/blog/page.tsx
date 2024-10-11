"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { blogPosts } from "./blogData";

const BlogPage = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pt-4 pb-32"
    >
      <div className="container max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="font-bold text-4xl lg:text-5xl pb-4 text-center"
        >
          EarningsWave Blog
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-muted-foreground text-center mb-12"
        >
          Insights on Finance, APIs, and Earnings Calls
        </motion.p>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              className="border-b border-gray-200 pb-8"
            >
              <Link
                href={`/blog/${post.url}`}
                className="block hover:opacity-80 transition-opacity"
              >
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.category}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BlogPage;
