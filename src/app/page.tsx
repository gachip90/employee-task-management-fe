import Image from "next/image";
import LoginForm from "@/components/login-form";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md">
          <Image
            src="/assets/image/bg_login.png"
            alt="Login Background"
            width={400}
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}
