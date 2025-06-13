"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { fetcher } from "@/lib/api/api";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  title?: string;
  okText?: string;
  confirmLoading?: boolean;
  initialValues?: any;
}

const TaskModal = ({
  open,
  onClose,
  onSubmit,
  title,
  okText,
  confirmLoading,
  initialValues,
}: TaskModalProps) => {
  const [form] = Form.useForm();

  const { data, error, isLoading } = useSWR(
    "http://localhost:5000/api/owner/get-all-employees",
    fetcher
  );

  const employees = data?.employees || [];

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          assignee: initialValues.employeeId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const selectedEmployee = employees.find(
        (emp: any) => emp.employeeId === values.assignee
      );
      const payload = {
        ...values,
        employeeId: values.assignee,
        assignedName: selectedEmployee.name,
      };
      delete payload.assignee;
      onSubmit(payload);
    });
  };

  return (
    <Modal
      title={<div className="pb-2 text-center">{title}</div>}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={onClose}
      onOk={handleOk}
      width={600}
      okText={okText || "Save"}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input placeholder="Enter task description" />
        </Form.Item>
        <Form.Item
          name="assignee"
          label="Assignee"
          rules={[{ required: true, message: "Please select an assignee" }]}
        >
          <Select
            placeholder="Select an assignee"
            loading={isLoading}
            disabled={isLoading || !!error}
          >
            {employees.map((emp: any) => (
              <Select.Option key={emp.employeeId} value={emp.employeeId}>
                {emp.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select a status">
            <Select.Option value="in progress">In Progress</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="done">Done</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
