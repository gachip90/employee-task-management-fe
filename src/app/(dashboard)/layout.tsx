"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import type { MenuProps } from "antd";
import { Layout, Menu, Avatar, Popover, Dropdown } from "antd";
import {
  TeamOutlined,
  ScheduleOutlined,
  MessageOutlined,
  ProfileOutlined,
  PullRequestOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const tabsByRole: Record<
  string,
  { key: string; label: string; icon: React.ReactNode; path: string }[]
> = {
  owner: [
    {
      key: "manage-employee",
      label: "Manage Employee",
      icon: <TeamOutlined />,
      path: "/manage-employee",
    },
    {
      key: "manage-task",
      label: "Manage Task",
      icon: <ScheduleOutlined />,
      path: "/manage-task",
    },
    {
      key: "message",
      label: "Message",
      icon: <MessageOutlined />,
      path: "/message",
    },
  ],
  employee: [
    {
      key: "task",
      label: "Task",
      icon: <PullRequestOutlined />,
      path: "/task",
    },
    {
      key: "profile",
      label: "Profile",
      icon: <ProfileOutlined />,
      path: "/profile",
    },
    {
      key: "message",
      label: "Message",
      icon: <MessageOutlined />,
      path: "/message",
    },
  ],
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<
    { key: string; label: string; icon: React.ReactNode; path: string }[]
  >([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "employee";
    const tabs = tabsByRole[role] || [];
    setMenuItems(tabs);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const avatarMenu: MenuProps["items"] = [
    {
      key: "logout",
      label: "Log out",
      onClick: handleLogout,
    },
  ];

  const handleLogoClick = () => {
    router.refresh();
  };

  const showNotification = (
    <div style={{ padding: 8, width: 200, textAlign: "center" }}>
      You have no notifications
    </div>
  );

  return (
    <Layout className="min-h-screen">
      <Sider theme="light" width={220} className="bg-white shadow-md">
        <div
          className="h-16 flex items-center justify-center font-semibold border-b"
          onClick={handleLogoClick}
        >
          <div className="max-w-md">
            <Image
              src="/assets/image/skipli_marketing_logo.png"
              alt="Login Background"
              width={80}
              height={80}
              className="w-full h-auto cursor-pointer"
            />
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems.map((item) => ({
            key: item.path,
            label: item.label,
            icon: item.icon,
          }))}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>

      <Layout>
        <Header className="!bg-white px-6 flex justify-end items-center gap-4 shadow-sm">
          <Popover placement="left" content={showNotification} trigger="click">
            <div className="cursor-pointer rounded-full">
              <BellOutlined style={{ fontSize: 20 }} />
            </div>
          </Popover>
          <Dropdown
            placement="bottom"
            menu={{ items: avatarMenu }}
            trigger={["click"]}
          >
            <Avatar icon={<UserOutlined />} className="cursor-pointer" />
          </Dropdown>
        </Header>
        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
