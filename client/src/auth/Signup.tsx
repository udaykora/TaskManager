import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { signupUser } from '../api/auth';

const { Title, Text } = Typography;

const Signup: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await signupUser({
        name: values.name,
        email: values.email,
        password: values.password,
        mobileNumber: values.mobileNumber,
      });
      message.success('Account created! Please log in.');
      navigate('/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Title level={2} className="mb-8 tracking-wide">
        TASK MANAGER
      </Title>

      <Card title="Sign Up" className="w-full max-w-sm shadow-md">
        <Form form={form} name="register" layout="vertical" onFinish={onFinish} scrollToFirstError>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!', whitespace: true }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'The input is not valid E-mail!' },
              { required: true, message: 'Please input your E-mail!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Re-enter Password" />
          </Form.Item>

          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[{ required: true, message: 'Please input your mobile number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <Text>
            Already have an account? <Link to="/login">Log in</Link>
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

export default Signup;