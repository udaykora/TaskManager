import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/authContext';

const { Title, Text } = Typography;

const WAKE_UP_DELAY_MS = 10000;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const [showWakeUpNotice, setShowWakeUpNotice] = React.useState(false);
  const wakeUpTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWakeUpTimer = () => {
    if (wakeUpTimerRef.current) {
      clearTimeout(wakeUpTimerRef.current);
      wakeUpTimerRef.current = null;
    }
  };

  // Clean up timer on unmount so it doesn't fire after navigation away
  React.useEffect(() => {
    return () => clearWakeUpTimer();
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    setShowWakeUpNotice(false);

    wakeUpTimerRef.current = setTimeout(() => {
      setShowWakeUpNotice(true);
    }, WAKE_UP_DELAY_MS);

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
      clearWakeUpTimer();
      setSubmitting(false);
      setShowWakeUpNotice(false);
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

          {showWakeUpNotice && (
            <Form.Item>
              <Alert
                type="info"
                showIcon
                message="Waking up the server..."
                description="This app runs on a free server that sleeps when idle. It can take up to a minute to spin back up on the first request — thanks for your patience!"
              />
            </Form.Item>
          )}

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