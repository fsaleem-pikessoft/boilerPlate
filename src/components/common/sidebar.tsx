import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { networks } from "../../utils/constants/networks";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768); // Collapse if screen width is ≤ 768px
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathParts = pathname.split("/").filter((part) => part);
  const currentNetwork = pathParts[0];
  const currentProject = pathParts[1];

  const selectedNetwork = networks.find((network) => network.link === currentNetwork);
  const selectedProject = selectedNetwork?.projects.find((project) => project.link === `/${currentProject}`);

  const items = [
    {
      key: "dashboard",
      icon: <PieChartOutlined />,
      label: <Link href="/dashboard">Network Apps</Link>,
    },
    {
      key: "information",
      icon: <DesktopOutlined />,
      label: <Link href="/information">Information</Link>,
    },
  ];

  if (selectedNetwork) {
    items.push(
      ...selectedNetwork.projects.map((project) => ({
        key: `project-${project.id}`,
        icon: project.icon ? React.createElement(project.icon) : <DesktopOutlined />,
        label: <Link href={`/${selectedNetwork.link}${project.link}`}>{project.name}</Link>,
      }))
    );
  }

  const selectedKeys = selectedProject ? [`project-${selectedProject.id}`] : ["dashboard"];

  return (
    <div style={{ width: collapsed ? 80 : 256, height: "100vh", transition: "width 0.3s ease-in-out" }}>
      <Button
        type="primary"
        onClick={() => setCollapsed(!collapsed)}
        style={{ margin: "16px" }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        selectedKeys={selectedKeys}
        style={{ borderRight: "none" }}
      />
    </div>
  );
};

export default Sidebar;
