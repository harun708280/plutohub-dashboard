"use client";

import React from "react";
import { Table, Space, Dropdown } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const blogData = [
  {
    id: 1,
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: {
      name: "Harun Or Rashid",
      avatar: "https://via.placeholder.com/40.png?text=HR",
    },
    likes: 120,
    comments: 15,
    date: "2025-09-10",
  },
  {
    id: 2,
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: {
      name: "Arif Ahmed",
      avatar: "https://via.placeholder.com/40.png?text=AA",
    },
    likes: 85,
    comments: 10,
    date: "2025-09-11",
  },
  {
    id: 3,
    title:
      "The Impact of Technology on the Workplace: How Technology is Changing",
    author: {
      name: "Fatema Begum",
      avatar: "https://via.placeholder.com/40.png?text=FB",
    },
    likes: 200,
    comments: 30,
    date: "2025-09-12",
  },
  {
    id: 4,
    title: "Next.js 15 Released: What's New and Improved",
    author: {
      name: "Sabbir Hossain",
      avatar: "https://via.placeholder.com/40.png?text=SH",
    },
    likes: 90,
    comments: 12,
    date: "2025-09-08",
  },
  {
    id: 5,
    title: "Exploring Tailwind CSS v4: The Future of Styling",
    author: {
      name: "Nusrat Jahan",
      avatar: "https://via.placeholder.com/40.png?text=NJ",
    },
    likes: 150,
    comments: 25,
    date: "2025-09-07",
  },
  {
    id: 6,
    title: "Understanding Prisma with PostgreSQL",
    author: {
      name: "Rakibul Hasan",
      avatar: "https://via.placeholder.com/40.png?text=RH",
    },
    likes: 60,
    comments: 7,
    date: "2025-09-05",
  },
];

const BlogTable = () => {
  const getMenuItems = (record) => [
    {
      key: "edit",
      label: (
        <span>
          <EditOutlined className="mr-2 text-blue-600" />
          Edit
        </span>
      ),
    },
    {
      key: "delete",
      label: (
        <span>
          <DeleteOutlined className="mr-2 text-red-600" />
          Delete
        </span>
      ),
    },
    {
      key: "view",
      label: (
        <span>
          <EyeOutlined className="mr-2" />
          View
        </span>
      ),
    },
  ];

  const columns = [
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (author) => (
        <Space>
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage  src="https://res.cloudinary.com/dygtjjkso/image/upload/v1756888859/blogs/thfxbtjf2ur8q7erskhe.webp"
              alt="" />
          </Avatar>
          <span>{author.name}</span>
        </Space>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <span className="font-medium">{title}</span>,
    },
    
    {
      title: " Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: "Comments",
      key: "stats",
      render: (_, record) => (
        <Space>
         
          <span>
            <MessageOutlined className="mr-1" />
            {record.comments}
          </span>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getMenuItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <MoreOutlined className="text-xl cursor-pointer" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="py-6">
      <Table
        dataSource={blogData}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
        bordered={false}
      />
    </div>
  );
};

export default BlogTable;
