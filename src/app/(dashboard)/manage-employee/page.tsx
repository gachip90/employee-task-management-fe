"use client";

import "@ant-design/v5-patch-for-react-19";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Tag, Spin, Alert, Dropdown, App } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateWorkSchedule,
  fetcher,
} from "@/lib/api/api";
import EmployeeModal from "@/components/employee-modal";
import SetScheduleModal from "@/components/set-schedule-modal";
import ViewScheduleModal from "@/components/view-schedule-modal";

const ManageEmployeePage = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [viewScheduleModalOpen, setViewScheduleModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("http://localhost:3000/");
    }
  }, [router]);

  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:5000/api/owner/get-all-employees",
    fetcher
  );

  const dataSource =
    data?.employees.map((employee: any, index: number) => ({
      key: employee.id || index.toString(),
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber || "N/A",
      address: employee.address || "N/A",
      role: employee.role || "N/A",
      status: employee.status || "Active",
      workSchedule: employee.workSchedule,
    })) || [];

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <Tag color="green">{status}</Tag>,
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
                  setSelectedEmployee(record);
                  setEditModalOpen(true);
                },
              },
              {
                key: "view-schedule",
                label: "View Schedule",
                onClick: () => {
                  setSelectedEmployee(record.name);
                  setSelectedSchedule(record.workSchedule);
                  setViewScheduleModalOpen(true);
                },
              },
              {
                key: "set-schedule",
                label: "Set Schedule",
                onClick: () => {
                  setSelectedEmployee(record);
                  console.log(selectedEmployee);
                  setSelectedSchedule(record.workSchedule);
                  setScheduleModalOpen(true);
                },
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => handleDeleteEmployee(record.key),
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

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
      message.success("Employee deleted successfully");

      mutate();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      message.error(error.message || "Failed to delete employee");
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
        <h2 className="text-xl font-semibold">Manage Employee</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Employee
        </Button>
      </div>
      {tableContent()}
      <EmployeeModal
        title="Create Employee"
        okText="Create"
        open={createModalOpen}
        confirmLoading={modalLoading}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            setModalLoading(true);

            await createEmployee(formData);
            message.success("Employee created successfully");

            mutate();
            setCreateModalOpen(false);
          } catch (error: any) {
            message.error(error.message || "Failed to create employee");
          } finally {
            setModalLoading(false);
          }
        }}
      />
      <EmployeeModal
        title="Edit Employee"
        okText="Save"
        open={editModalOpen}
        confirmLoading={modalLoading}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        initialValues={selectedEmployee}
        onSubmit={async (formData) => {
          try {
            setModalLoading(true);

            await updateEmployee(selectedEmployee?.key, formData);

            message.success("Employee updated successfully");
            mutate();
            setEditModalOpen(false);
            setSelectedEmployee(null);
          } catch (error: any) {
            message.error(error.message || "Failed to update employee");
          } finally {
            setModalLoading(false);
          }
        }}
      />
      <ViewScheduleModal
        open={viewScheduleModalOpen}
        onClose={() => setViewScheduleModalOpen(false)}
        employee={selectedEmployee}
        schedule={selectedSchedule}
      />
      <SetScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        employee={selectedEmployee?.name}
        confirmLoading={modalLoading}
        initialSchedule={selectedEmployee?.workSchedule}
        onSubmit={async (formData) => {
          try {
            setModalLoading(true);

            await updateWorkSchedule(selectedEmployee?.key, formData);

            message.success("Work schedule updated successfully");
            mutate();

            setScheduleModalOpen(false);
            setSelectedEmployee(null);
          } catch (error: any) {
            message.error(error.message || "Failed to update work schedule");
          } finally {
            setModalLoading(false);
          }
        }}
      />
    </div>
  );
};

export default ManageEmployeePage;
