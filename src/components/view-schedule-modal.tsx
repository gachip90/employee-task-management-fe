"use client";

import { Modal, Table } from "antd";

interface Schedule {
  [key: string]: string;
}

interface ViewScheduleModalProps {
  open: boolean;
  onClose: () => void;
  employee: string | null;
  schedule?: Schedule;
}

const ViewScheduleModal = ({
  open,
  onClose,
  employee,
  schedule,
}: ViewScheduleModalProps) => {
  const dayOrder = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const dataSource = schedule
    ? dayOrder.map((day) => ({
        key: day,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        time: schedule[day]?.replace(/"/g, "") || "N/A",
      }))
    : [];

  const columns = [
    {
      title: "Day",
      dataIndex: "day",
      render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: "Working Hours",
      dataIndex: "time",
    },
  ];

  return (
    <Modal
      title={
        <div className="pb-2 text-center">
          Schedule for {employee || "Employee"}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default ViewScheduleModal;
