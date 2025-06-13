"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import { Modal, Form, TimePicker, Row, Col, Switch } from "antd";

interface SetScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  employee?: string;
  confirmLoading?: boolean;
  initialSchedule?: Record<string, string>;
}

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const SetScheduleModal = ({
  open,
  onClose,
  onSubmit,
  employee,
  confirmLoading,
  initialSchedule,
}: SetScheduleModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialSchedule) {
      const fields: Record<string, any> = {};

      for (const day of daysOfWeek) {
        const value = initialSchedule[day];
        if (!value || value === "off") {
          fields[`${day}_off`] = true;
          fields[`${day}_start`] = null;
          fields[`${day}_end`] = null;
        } else {
          const [start, end] = value.split("-");
          fields[`${day}_off`] = false;
          fields[`${day}_start`] = dayjs(start, "HH:mm");
          fields[`${day}_end`] = dayjs(end, "HH:mm");
        }
      }

      form.setFieldsValue(fields);
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialSchedule]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const schedule: Record<string, string> = {};

      for (const day of daysOfWeek) {
        const isOff = values[`${day}_off`];
        const start = values[`${day}_start`];
        const end = values[`${day}_end`];

        if (isOff || !start || !end) {
          schedule[day] = "off";
        } else {
          schedule[day] = `${start.format("HH:mm")}-${end.format("HH:mm")}`;
        }
      }

      onSubmit(schedule);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <div className="pb-2 text-center">
          Set schedule for {employee || "Employee"}
        </div>
      }
      open={open}
      onCancel={onClose}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      okText="Save"
      width={600}
    >
      <Form form={form} layout="vertical">
        {daysOfWeek.map((day) => (
          <Row gutter={16} key={day} align="middle">
            <Col span={5}>
              <strong>{capitalize(day)}</strong>
            </Col>

            <Col span={6}>
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev[`${day}_off`] !== curr[`${day}_off`]
                }
              >
                {({ getFieldValue }) => (
                  <Form.Item name={`${day}_start`} style={{ marginBottom: 0 }}>
                    <TimePicker
                      format="HH:mm"
                      className="w-full"
                      disabled={getFieldValue(`${day}_off`)}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev[`${day}_off`] !== curr[`${day}_off`]
                }
              >
                {({ getFieldValue }) => (
                  <Form.Item name={`${day}_end`} style={{ marginBottom: 0 }}>
                    <TimePicker
                      format="HH:mm"
                      className="w-full"
                      disabled={getFieldValue(`${day}_off`)}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name={`${day}_off`}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="Off" unCheckedChildren="On" />
              </Form.Item>
            </Col>
          </Row>
        ))}
      </Form>
    </Modal>
  );
};

export default SetScheduleModal;
