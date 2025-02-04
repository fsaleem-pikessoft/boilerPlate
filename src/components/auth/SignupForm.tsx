import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Flex, Card, Row, Col } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const SignUpForm = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (user?.email) {
    return <LoadingSpinner isVisible={true} />;
  } 

   const onFinish: FormProps<FieldType>["onFinish"] = (values) => {   
    console.log("Success:", values);
    router.push("/auth/login");   
  };

  return (
    <div className="min-h-screen flex items-center md:justify-center p-4">
    <Card style={{width:400}}>
      <Row gutter={16}>
       <Col span={24}>
       <h1 style={{fontWeight:"bold",textAlign:"center",marginBottom:"20px"}}>SignUp Form</h1>
       </Col>
      </Row>
    <Form
    name="signup"
    initialValues={{ remember: true }}
    style={{ maxWidth: 360 }}
    onFinish={onFinish}
  >
    <Form.Item
    label="Name"
      name="name"
      rules={[{ required: true, message: 'Please input your Username!' }]}
    >
      <Input prefix={<UserOutlined />} placeholder="Username" />
    </Form.Item>
    <Form.Item
    label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your Email!' }]}
    >
      <Input prefix={<UserOutlined />} placeholder="Email" />
    </Form.Item>
    <Form.Item
    label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your Password!' }]}
    >
      <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
    </Form.Item>
    <Form.Item>
      <Flex justify="space-between" align="center">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>      
      </Flex>
    </Form.Item>

    <Form.Item>
      <Button block type="primary" htmlType="submit">
        Sign Up
      </Button>
      or <a href="/auth/login">Login now!</a>
    </Form.Item>
  </Form>
    </Card>
  </div>
  );
};

export default SignUpForm;
