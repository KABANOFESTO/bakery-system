"use client";

import React from "react";

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6 sm:px-10 max-w-4xl mx-auto" style={{ padding: "150px 20px" }}>
      <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center">Blog</h1>
      <p className="mb-6 text-gray-700">
        Welcome to the Bakery Ineza Blog! Here we share stories from our farms, brewing tips, cakes facts,
        and behind-the-scenes looks at how we deliver premium bread to your cup.
      </p>
      <p className="mb-6 text-gray-700">
        Stay tuned for updates and insights as we explore the rich culture of bread from wheat to flouw.
      </p>
    </div>
  );
};

export default Blog;
