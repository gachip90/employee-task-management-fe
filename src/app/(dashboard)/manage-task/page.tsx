"use client";

import "@ant-design/v5-patch-for-react-19";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher, createTask, updateTask, deleteTask } from "@/lib/api/api";
import { Table, Button, Tag, Dropdown, Spin, Alert, App } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import TaskModal from "@/components/task-modal";

const ManageTaskPage = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("http://localhost:3000/");
    }
  }, [router]);

  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:5000/api/owner/get-all-tasks",
    fetcher
  );

  const dataSource =
    data?.data.map((task: any, index: number) => ({
      key: task.id || index.toString(),
      title: task.title,
      description: task.description,
      assignee: task.assignedName,
      status: task.status || "In Progress",
    })) || [];

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    { title: "Assignee", dataIndex: "assignee" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        let color =
          status === "done"
            ? "green"
            : status === "in progress"
            ? "blue"
            : "orange";
        return (
          <Tag className="capitalize" color={color}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => {
                  setSelectedTask(record);
                  setEditModalOpen(true);
                },
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => handleDeleteTask(record.key),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      message.success("Task deleted successfully");

      mutate();
    } catch (error: any) {
      console.error("Error deleting task:", error);
      message.error(error.message || "Failed to delete task");
    }
  };

  const tableContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4">
          <Alert
            message="Error"
            description="Oops, sometime went wrong"
            type="error"
            showIcon
          />
        </div>
      );
    }

    return <Table dataSource={dataSource} columns={columns} />;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Task</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Task
        </Button>
      </div>
      {tableContent()}
      <TaskModal
        title="Create Task"
        okText="Create"
        open={createModalOpen}
        confirmLoading={modalLoading}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            setModalLoading(true);

            await createTask(formData);
            message.success("Task created successfully");
            mutate();
            setCreateModalOpen(false);
          } catch (error: any) {
            message.error(error.message || "Failed to create task");
          } finally {
            setModalLoading(false);
          }
        }}
      />
      <TaskModal
        title="Edit Task"
        okText="Save"
        open={editModalOpen}
        confirmLoading={modalLoading}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTask(null);
        }}
        initialValues={selectedTask}
        onSubmit={async (formData) => {
          try {
            setModalLoading(true);

            await updateTask(selectedTask?.key, formData);
            message.success("Task updated successfully");
            mutate();
            setEditModalOpen(false);
          } catch (error: any) {
            message.error(error.message || "Failed to update employee");
          } finally {
            setModalLoading(false);
          }
        }}
      />
    </div>
  );
};

export default ManageTaskPage;
