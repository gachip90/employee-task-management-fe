"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendAccessCode,
  verifyAccessCode,
  verifyEmailAccessCode,
} from "@/lib/api/api";
import { Button, Input, Tabs, Form, App } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

type LoginMethod = "email" | "phone";
type FormStep = "login" | "verification";

export default function LoginForm() {
  const { message } = App.useApp();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [currentStep, setCurrentStep] = useState<FormStep>("login");
  const [contactInfo, setContactInfo] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmitContact = async () => {
    if (loading) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      if (loginMethod === "phone") {
        await sendAccessCode(values.contact);
        setContactInfo(values.contact);
        setCurrentStep("verification");
        message.success("Verification code sent to your phone");
      } else if (loginMethod === "email") {
        setContactInfo(values.contact);
        setCurrentStep("verification");
      }
    } catch (error: any) {
      console.error("Error sending access code:", error);
      message.error(
        error.message ||
          (loginMethod === "phone"
            ? "Failed to send verification code"
            : "Invalid email address")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setCurrentStep("login");
    form.resetFields();
  };

  const handleSubmitVerification = async () => {
    if (loading) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      if (loginMethod === "phone") {
        try {
          const response = await verifyAccessCode(
            contactInfo,
            values.verificationCode
          );

          if (response.success) {
            localStorage.setItem("userPhone", contactInfo);
            localStorage.setItem("userRole", "owner");
            localStorage.setItem("userId", response.ownerId);
            message.success("Login successful!");

            router.push("/manage-employee");
          } else {
            message.error(response.message || "Failed to validate access code");
          }
        } catch (error: any) {
          message.error(error.message || "An error occurred during login");
        }
      } else if (loginMethod === "email") {
        try {
          const response = await verifyEmailAccessCode(
            contactInfo,
            values.verificationCode
          );

          if (response.success) {
            localStorage.setItem("userEmail", contactInfo);
            localStorage.setItem("userRole", "employee");
            localStorage.setItem("userId", response.employeeId);
            message.success("Login successful!");
            router.push("/task");
          } else {
            message.error(response.message || "Failed to validate access code");
          }
        } catch (error: any) {
          message.error(error.message || "An error occurred during login");
        }

        router.push("/task");
      } else {
        message.error("Please request verification code first");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      message.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (loading || !contactInfo || !canResend) return;

    try {
      setLoading(true);
      setCanResend(false);
      setResendTimer(60);

      if (loginMethod === "phone") {
        await sendAccessCode(contactInfo);
        message.success("Verification code resent");
      } else {
        message.info("Email resend not implemented yet");
      }

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error resending code:", error);
      message.error(error.message || "Failed to resend verification code");
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setLoginMethod(key as LoginMethod);
    form.resetFields();
    if (currentStep === "verification") {
      setCurrentStep("login");
    }
  };

  const phoneValidator = (_: any, value: string) => {
    if (!value) return Promise.resolve();

    const cleanPhone = value.replace(/[\s\-()]/g, "");
    const phoneRegex = /^[+]?[0-9]{10,15}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return Promise.reject(new Error("Please enter a valid phone number"));
    }

    if (cleanPhone.replace(/^\+/, "").length < 10) {
      return Promise.reject(
        new Error("Phone number must be at least 10 digits")
      );
    }

    return Promise.resolve();
  };

  if (currentStep === "verification") {
    return (
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={handleBackToLogin}
          disabled={loading}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 bg-transparent border-none cursor-pointer disabled:opacity-50"
        >
          <ArrowLeftOutlined />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {loginMethod === "phone"
              ? "Phone verification"
              : "Email verification"}
          </h1>
          <p className="text-gray-600 mb-4">
            {loginMethod === "phone"
              ? "Please enter the code sent to your phone"
              : "Please enter the code sent to your email"}
          </p>
          <p className="text-sm text-blue-600 font-medium">{contactInfo}</p>
        </div>

        <Form form={form}>
          <div className="space-y-4">
            <Form.Item
              name="verificationCode"
              rules={[
                { required: true, message: "Verification code is required" },
                { len: 6, message: "Verification code must be 6 digits" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Verification code must contain only numbers",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your code"
                className="h-12 text-center text-lg tracking-widest"
                maxLength={6}
                disabled={loading}
              />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              onClick={handleSubmitVerification}
              loading={loading}
              className="w-full h-12 verification-submit-btn"
              style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
            >
              {loading ? "Verifying..." : "Submit"}
            </Button>
          </div>
        </Form>

        <div className="text-center pt-4">
          <span className="text-gray-600">Code not received? </span>
          <button
            onClick={handleResendCode}
            disabled={loading || !canResend}
            className="text-blue-500 hover:text-blue-600 font-medium bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            {canResend ? "Send again" : `Wait ${resendTimer}s`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SIGN IN</h1>
        <p className="text-gray-600 mb-6">
          {loginMethod === "phone"
            ? "Please enter your phone to sign in"
            : "Please enter your email to sign in"}
        </p>
      </div>

      <div className="mb-6">
        <Tabs
          activeKey={loginMethod}
          onChange={handleTabChange}
          centered
          items={[
            { key: "phone", label: "Phone Number" },
            { key: "email", label: "Email" },
          ]}
        />
      </div>

      <Form form={form} layout="vertical">
        <div className="space-y-4">
          {loginMethod === "phone" ? (
            <Form.Item
              name="contact"
              label="Phone Number"
              rules={[
                { required: true, message: "Phone number is required" },
                { validator: phoneValidator },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your phone number"
                className="h-12"
                disabled={loading}
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="contact"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                className="h-12"
                disabled={loading}
              />
            </Form.Item>
          )}

          <Button
            type="primary"
            size="large"
            onClick={handleSubmitContact}
            loading={loading}
            className="w-full h-12 login-submit-btn"
            style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6" }}
          >
            {loading ? "Sending..." : "Continue"}
          </Button>
        </div>
      </Form>

      <div className="text-center pt-4">
        <span className="text-gray-600">Don't have an account? </span>
        <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">
          Sign up for free!
        </a>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}
