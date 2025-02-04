import { useState, useEffect, useRef } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, Card, Row, Col } from 'antd';
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, setUser } from '../../redux/authSlice';

export type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const { hardcodedEmail, hardcodedPassword } = useSelector(selectAuth);

  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  const validateEmail = (input = false) => {
    if (email === "") {
      setIsEmailValid(true);
      setIsSubmitDisabled(true);
      return false;
    } else {
      const pattern = /^[a-zA-Z0-9\.\-%+_]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
      const valid = pattern.test(email);
      setIsEmailValid(valid);
      setIsSubmitDisabled(!valid);
      return valid;
    }
  };

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      return response.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An error occurred during login"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateEmail()) {
  //     const loginResult = await loginUser(email, password);
  //     if (loginResult?.message) {
  //             router.push("/dashboard");
  //             Cookies.set("email", email);
  //       toast.success(loginResult?.message);
  //     }
  //   }
  // };

  // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.target.value);
  // };

  const onFinish = (values: FieldType) => {
    const { email, password } = values;
    if (email !== hardcodedEmail || password !== hardcodedPassword) {
      toast.error("Invalid cradentials");
      return;
    }
    
    dispatch(setUser({ email }));
    toast.success("Login Successfully");
    router.push("/dashboard"); 
  };


  return (
    <div className="min-h-screen flex items-center md:justify-center p-4">
      <Card style={{width:400}}>
      <Row gutter={16}>
       <Col span={24}>
       <h1 style={{fontWeight:"bold",textAlign:"center",marginBottom:"20px"}}>Login Form</h1>
       </Col>
      </Row>
      <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
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
          <a href="">Forgot password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Log in
        </Button>
        or <a href="/auth/signup">Register now!</a>
      </Form.Item>
    </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
