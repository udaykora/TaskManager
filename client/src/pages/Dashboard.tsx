import React, { useEffect, useState } from 'react';
import {
  Layout,
  Typography,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Popconfirm,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  LogoutOutlined,
  EditOutlined,
  DeleteOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../context/authContext';
import { getTasks, createTask, updateTask, deleteTask, type Task } from '../api/tasks';
import { getAISuggestion } from "../api/ai";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const priorityColor: Record<string, string> = {
  Low: 'green',
  Medium: 'gold',
  High: 'red',
};

const statusColor: Record<string, string> = {
  'To Do': 'default',
  'In Progress': 'blue',
  Done: 'green',
};

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [form] = Form.useForm();

  
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const data = await getTasks();
        setTasks(data);
      } catch {
        message.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  
  useEffect(() => {
    if (modalOpen) {
      if (editingTask) {
        form.setFieldsValue({
          ...editingTask,
          dueDate: editingTask.dueDate ? dayjs(editingTask.dueDate) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [modalOpen, editingTask, form]);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
    };

    setSubmitting(true);
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, payload);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
        message.success('Task updated');
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [created, ...prev]);
        message.success('Task created');
      }
      setModalOpen(false);
    } catch {
      message.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      message.success('Task deleted');
    } catch {
      message.error('Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAISuggest = async () => {
    const title = form.getFieldValue('title');

    if (!title || !title.trim()) {
      message.warning('Enter a task title first');
      return;
    }

    setAiLoading(true);
    try {
      const suggestion = await getAISuggestion(title);
      form.setFieldsValue({
        description: suggestion.description,
        priority: suggestion.priority,
      });
      message.success('AI suggestion applied — feel free to edit it');
    } catch {
      message.error('Failed to get AI suggestion');
    } finally {
      setAiLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <Layout className="min-h-screen ">
      <Header style={{ background: '#ffffff' }}
 className="bg-white flex items-center justify-between px-6 shadow-sm text-amber-50">
        <Title level={4} className="!mb-0 tracking-wide text-white">
          TASK MANAGER
        </Title>
        <Space>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </Space>
      </Header>

      <Content className="p-6 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <Space wrap>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 160 }}
              onChange={setStatusFilter}
              value={statusFilter}
            >
              <Option value="To Do">To Do</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Done">Done</Option>
            </Select>

            <Select
              placeholder="Filter by priority"
              allowClear
              style={{ width: 160 }}
              onChange={setPriorityFilter}
              value={priorityFilter}
            >
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            New Task
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-24 gap-3">
            <Spin size="large" />
            <Text type="secondary">Loading tasks...</Text>
          </div>
        ) : filteredTasks.length === 0 ? (
          <Empty description="No tasks yet" className="mt-20" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                title={task.title}
                className="shadow-sm"
                extra={
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(task)}
                    />
                    <Popconfirm
                      title="Delete this task?"
                      onConfirm={() => handleDelete(task.id)}
                      okText="Delete"
                      okButtonProps={{ danger: true, loading: deletingId === task.id }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        loading={deletingId === task.id}
                      />
                    </Popconfirm>
                  </Space>
                }
              >
                <Text className="block text-sm text-gray-500 mb-3 min-h-[40px]">
                  {task.description || 'No description'}
                </Text>
                <Space wrap>
                  <Tag color={statusColor[task.status]}>{task.status}</Tag>
                  <Tag color={priorityColor[task.priority]}>{task.priority}</Tag>
                  {task.dueDate && <Tag>{task.dueDate}</Tag>}
                </Space>
              </Card>
            ))}
          </div>
        )}
      </Content>

      <Modal
        title={editingTask ? 'Edit Task' : 'New Task'}
        open={modalOpen}
        onCancel={() => !submitting && setModalOpen(false)}
        footer={null}
        destroyOnHidden
        maskClosable={!submitting}
        closable={!submitting}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={submitting}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g. Fix login bug" />
          </Form.Item>

          <Button
            type="dashed"
            icon={<RobotOutlined />}
            onClick={handleAISuggest}
            loading={aiLoading}
            block
            className="mb-4"
          >
            {aiLoading ? 'Thinking...' : 'AI Suggest'}
          </Button>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Task details" />
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="priority" label="Priority" initialValue="Medium">
            <Select>
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="To Do">
            <Select>
              <Option value="To Do">To Do</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" block loading={submitting}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Dashboard;