"use client";
import React from "react";
import { Avatar, Card, Col, Row } from "antd";
import { DesktopOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { networks } from "../../utils/constants/networks";

const DashboardPage = () => {
  const router = useRouter();

  return (
    <Row gutter={16} style={{ margin: "30px" }}>
      {networks.map((network) => (
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={8}
          xl={8}
          xxl={8}
          key={network.link}
          style={{ display: "grid" }}
        >
          <Card
            title={network.name}
            style={{ boxShadow: "0px 0px 2px rgba(0,0,0,0.3)" }}
          >
            <Row gutter={16}>
              {network.projects.map((project) => (
                <Col
                  key={project.id}
                  span={8}
                  style={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => router.push(`/${network.link}${project.link}`)}
                >
                  <Avatar
                    size={32}
                    icon={
                      project.icon ? React.createElement(project.icon) : null
                    }
                  />
                  <p style={{ fontSize: "10px" }}>{project.name}</p>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardPage;
