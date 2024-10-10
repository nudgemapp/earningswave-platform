"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { blogPosts } from "../blogData";

const BlogIdPage = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return <div>Blog post not found</div>;
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto px-4 py-12 mb-20"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="text-4xl font-bold mb-4"
      >
        {post.title}
      </motion.h1>
      <div className="flex justify-between text-sm text-gray-500 mb-8">
        <span>{post.date}</span>
        <span>{post.category}</span>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="prose prose-lg"
      >
        <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
        <div>{post.content}</div>
      </motion.div>
    </motion.article>
  );
};

export default BlogIdPage;
