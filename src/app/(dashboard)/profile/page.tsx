"use client";

import "@ant-design/v5-patch-for-react-19";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher, updateEmployee } from "@/lib/api/api";
import { Card, Descriptions, Button, App } from "antd";
import EmployeeModal from "@/components/employee-modal";

const ProfilePage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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
    userId ? `http://localhost:5000/api/owner/get-employee/${userId}` : null,
    fetcher
  );

  const employeeData = data?.employee;

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-2xl shadow-lg"
        title={<h1 className="text-xl font-semibold">Profile Information</h1>}
        loading={isLoading}
      >
        {error && (
          <div className="text-red-500 text-center mb-4">
            Error loading data file
          </div>
        )}
        <Descriptions
          column={1}
          bordered
          styles={{
            label: { fontWeight: "bold", width: "30%", fontSize: "16px" },
            content: { fontSize: "16px" },
          }}
        >
          <Descriptions.Item label="Name">
            {employeeData?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {employeeData?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone number">
            {employeeData?.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {employeeData?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            {employeeData?.role}
          </Descriptions.Item>
        </Descriptions>
        <div className="mt-8 flex justify-center">
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-600 transition duration-200 text-lg px-6 py-2 h-auto"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      </Card>
      <EmployeeModal
        title="Edit Profile"
        okText="Save"
        open={editModalOpen}
        confirmLoading={modalLoading}
        onClose={() => {
          setEditModalOpen(false);
        }}
        initialValues={data?.employee}
        onSubmit={async (formData) => {
          try {
            setModalLoading(true);

            await updateEmployee(data?.employee.employeeId, formData);
            message.success("Edit profile successfully");
            mutate();
            setEditModalOpen(false);
          } catch (error: any) {
            message.error(error.message || "Failed to edit profile");
          } finally {
            setModalLoading(false);
          }
        }}
      />
    </div>
  );
};

export default ProfilePage;
