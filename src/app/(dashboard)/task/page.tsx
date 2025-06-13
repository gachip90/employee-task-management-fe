"use client";

import "@ant-design/v5-patch-for-react-19";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher, updateTask } from "@/lib/api/api";
import { Alert, Button, Spin, Table, Tag, App } from "antd";

const TaskPage = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("http://localhost:3000/");
    }
  }, [router]);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    userId
      ? `http://localhost:5000/api/owner/get-all-tasks?employeeId=${userId}`
      : null,
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

  const handleCompleteTask = async (taskId: string) => {
    if (!data?.data) {
      message.error("Task data not available");
      return;
    }

    try {
      await updateTask(taskId, {
        title: data.data.find((task: any) => task.id === taskId).title,
        assignedName: data.data.find((task: any) => task.id === taskId)
          .assignedName,
        employeeId: userId || "",
        status: "done",
        description: data.data.find((task: any) => task.id === taskId)
          .description,
      });
      message.success("Task status updated successfully");
      mutate();
    } catch (error: any) {
      message.error(error.message || "Failed to update task status");
    }
  };

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
      dataIndex: "action",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          disabled={record.status === "done"}
          onClick={() => {
            handleCompleteTask(record.key);
          }}
        >
          Complete
        </Button>
      ),
    },
  ];

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
        <h2 className="text-xl font-semibold">Task</h2>
      </div>
      {tableContent()}
    </div>
  );
};

export default TaskPage;
