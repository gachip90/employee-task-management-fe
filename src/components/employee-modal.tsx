"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, Col, Row } from "antd";

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  title?: string;
  okText?: string;
  confirmLoading?: boolean;
  initialValues?: any;
}

const EmployeeModal = ({
  open,
  onClose,
  onSubmit,
  title,
  okText,
  confirmLoading,
  initialValues,
}: EmployeeModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                {
                  pattern: /^\+?\d{9,15}$/,
                  message: "Phone number is not valid",
                },
              ]}
            >
              <Input placeholder="Enter your phone number " />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select placeholder="Select a role">
                <Select.Option value="HR">HR</Select.Option>
                <Select.Option value="Sales">Sales</Select.Option>
                <Select.Option value="Developer">Developer</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input placeholder="Enter your address" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
