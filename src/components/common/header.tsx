import Image from "next/image";
import { Avatar, Card, Col, Row, Dropdown } from "antd";
import { selectAuth } from '../../redux/authSlice';
import { useSelector } from 'react-redux';
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const { user } = useSelector(selectAuth);
  const { logout } = useAuth();

  return (    
     <Row gutter={16}>
      <Col span={24}>
      <Card style={{borderRadius:"0px",border:"none"}}>
      <Row gutter={16} align="middle" justify="space-between"> 
  <Col xs={24} sm={24} md={18} lg={20} xl={20} xxl={20}>
    <Row gutter={16} align="middle">
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12} style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <Image src="/images/CloudshiftHorizontal.png" width={100} height={20} alt="image" />
        <span style={{ fontWeight: "bold", marginLeft: "5px",fontSize:"17px" }}>IIRD Framework</span>
      </Col>
    </Row>
  </Col> 
  <Col xs={12} sm={12} md={3} lg={3} xl={3} xxl={3} style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
    <p style={{ margin: 0 }}>{user?.email}</p>
  </Col>  
  <Col xs={12} sm={12} md={3} lg={1} xl={1} xxl={1} >
    <Dropdown
      menu={{
        items: [
          {
            key: "logout",
            label: <button onClick={logout}>Logout</button>,
          },
        ],
      }}
      trigger={["hover"]}
    >
      <Avatar size={32} src="/images/avatar.svg" />
    </Dropdown>
  </Col>
</Row>
          
      </Card> 
      </Col>     
     </Row>    
  );
};

export default Header;
