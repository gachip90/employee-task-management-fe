const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Fetcher function swr
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch data");
  }
  return res.json();
};

// Send access code
export const sendAccessCode = async (phoneNumber: string) => {
  const res = await fetch(`${API_BASE_URL}/owner/create-new-access-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send OTP");
  }

  return res.json();
};

// Verify access code
export const verifyAccessCode = async (
  phoneNumber: string,
  accessCode: string
) => {
  const res = await fetch(`${API_BASE_URL}/owner/validate-access-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber, accessCode }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid verification code");
  }

  return data;
};

// Verify email access code
export const verifyEmailAccessCode = async (
  email: string,
  accessCode: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/employee/validate-email-access-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, accessCode }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid verification code");
  }

  return data;
};

// Create employee
export const createEmployee = async (employeeData: {
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  address?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/owner/create-employee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employeeData),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create employee");
  }

  return data;
};

// Update employee
export const updateEmployee = async (
  employeeId: string,
  updatedData: {
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
    address?: string;
  }
) => {
  const res = await fetch(
    `${API_BASE_URL}/owner/update-employee/${employeeId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update employee");
  }

  return data;
};

// Delete employee
export const deleteEmployee = async (employeeId: string) => {
  const res = await fetch(`${API_BASE_URL}/owner/delete-employee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete employee");
  }
};

// Update work schedule
export const updateWorkSchedule = async (
  employeeId: string,
  workSchedule: Record<string, string>
) => {
  const res = await fetch(
    `${API_BASE_URL}/owner/update-work-schedule/${employeeId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workSchedule }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update work schedule");
  }

  return data;
};

// Create task
export const createTask = async (taskData: {
  title: string;
  employeeId: string;
  assignedName: string;
  status: string;
  description?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/owner/create-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to create task");
  }

  return data;
};

// Update task
export const updateTask = async (
  taskId: string,
  updatedData: {
    title: string;
    assignedName: string;
    employeeId: string;
    status: string;
    description?: string;
  }
) => {
  const res = await fetch(`${API_BASE_URL}/owner/update-task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update task");
  }

  return data;
};

// Delete task
export const deleteTask = async (taskId: string) => {
  const res = await fetch(`${API_BASE_URL}/owner/delete-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to delete task");
  }

  return data;
};
