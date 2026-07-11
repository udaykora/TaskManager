import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Tag, Divider, Button, Space } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  RobotOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const techStack = {
  Frontend: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Ant Design', 'React Router'],
  Backend: ['Node.js', 'Express.js', 'Cookie-based session auth'],
  Database: ['Firebase Firestore'],
  Authentication: ['Firebase Authentication', 'Firebase Admin SDK'],
  'AI Integration': ['Google Gemini API (gemini-2.5-flash)'],
  Deployment: ['Firebase Hosting (Frontend)', 'Firebase Cloud Functions (Backend)'],
};

const features = [
  'Full CRUD task management — create, read, update, and delete tasks',
  'Each task includes title, description, due date, priority, and status',
  'Filter tasks by status and priority',
  'Secure signup and login with Firebase Authentication',
  'Session persistence via HTTP-only cookies',
  'AI-powered task suggestions using Google Gemini',
  'Responsive design across mobile and desktop',
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to="/login">
          <Button icon={<ArrowLeftOutlined />} type="text" className="mb-6">
            Back to Login
          </Button>
        </Link>

        <div className="text-center mb-10">
          <Title level={2} className="!mb-2 tracking-wide">
            TASK MANAGER
          </Title>
          <Text type="secondary" className="text-base">
            A full-stack task management application built as a take-home assignment
          </Text>
        </div>

        <Card className="shadow-sm mb-6">
          <Title level={4}>
            <CheckCircleOutlined className="text-green-600 mr-2" />
            About This Project
          </Title>
          <Paragraph className="text-gray-600">
            This application was built to demonstrate a complete full-stack development
            workflow — from authentication and database design to REST API architecture
            and AI integration. The goal was to build something functional, clean, and
            well-structured within a short development window, while prioritizing code
            quality and a polished user experience.
          </Paragraph>
        </Card>

        <Card className="shadow-sm mb-6">
          <Title level={4}>
            <ThunderboltOutlined className="text-amber-500 mr-2" />
            Core Features
          </Title>
          <ul className="space-y-2 mt-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-gray-600">
                <CheckCircleOutlined className="text-green-500 mt-1 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="shadow-sm mb-6">
          <Title level={4}>
            <DatabaseOutlined className="text-blue-500 mr-2" />
            Tech Stack
          </Title>
          <Paragraph className="text-gray-600 mb-4">
            Every technology below was chosen deliberately based on project requirements —
            developer velocity, type safety, and a smooth path from prototype to deployment.
          </Paragraph>

          {Object.entries(techStack).map(([category, items]) => (
            <div key={category} className="mb-4">
              <Text strong className="block mb-2 text-gray-800">
                {category}
              </Text>
              <Space wrap>
                {items.map((item) => (
                  <Tag key={item} color="default" className="text-sm py-1 px-3">
                    {item}
                  </Tag>
                ))}
              </Space>
            </div>
          ))}
        </Card>

        <Card className="shadow-sm mb-6">
          <Title level={4}>
            <SafetyOutlined className="text-red-500 mr-2" />
            Authentication & Security
          </Title>
          <Paragraph className="text-gray-600">
            User authentication is handled through Firebase Authentication, with passwords
            never touching the backend directly — verification happens client-side via the
            Firebase SDK, and the resulting ID token is verified server-side using the
            Firebase Admin SDK. Sessions are maintained through HTTP-only, secure cookies
            rather than storing tokens in browser storage, reducing exposure to XSS-based
            token theft.
          </Paragraph>
        </Card>

        <Card className="shadow-sm mb-10">
          <Title level={4}>
            <RobotOutlined className="text-purple-500 mr-2" />
            AI Integration
          </Title>
          <Paragraph className="text-gray-600">
            The task creation form includes an AI Suggest feature powered by Google's
            Gemini API. Given a rough task title, the model generates a clear description
            and a sensible priority level, which the user can accept or edit before saving.
            The API key is kept strictly on the backend and is never exposed to the client.
          </Paragraph>
        </Card>

        <Divider />

        <div className="text-center text-sm text-gray-400 pb-6">
          Built as part of a Full Stack Developer take-home assignment.
        </div>
      </div>
    </div>
  );
};

export default About;