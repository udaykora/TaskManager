import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/authContext';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const userData = await loginUser({
        email: values.email,
        password: values.password,
      });
      setUser(userData);
      message.success(`Welcome back, ${userData.name}`);
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Title level={2} className="mb-8 tracking-wide">
        TASK MANAGER
      </Title>

      <Card title="Login" className="w-full max-w-sm shadow-md">
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Log in
            </Button>
          </Form.Item>

          <Text>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Text>

          <div className="text-center mt-3">
  <Link to="/about" className="text-xs text-gray-400 hover:text-gray-600">
    About this project
  </Link>
</div>

        </Form>
      </Card>
    </div>
  );
};

export default Login;