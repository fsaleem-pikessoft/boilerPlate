import {
  FileTextOutlined,
  BarChartOutlined,
  RobotOutlined,
  VideoCameraOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

export const networks = [
  {
    name: "Network A",
    link: "network-a",
    projects: [
      { id: "1", name: "Resume", link: "/resume", icon: FileTextOutlined },
      { id: "2", name: "Report", link: "/report", icon: BarChartOutlined },
      {
        id: "3",
        name: "AI Assistant",
        link: "/ai-assistant",
        icon: RobotOutlined,
      },
      {
        id: "4",
        name: "Video Profile",
        link: "/video-profile",
        icon: VideoCameraOutlined,
      },
    ],
  },
  {
    name: "Network B",
    link: "network-b",
    projects: [
      {
        id: "1",
        name: "Admin Report",
        link: "/admin-report",
        icon: FileSearchOutlined,
      },
    ],
  },
];
