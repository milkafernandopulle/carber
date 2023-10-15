import LoginForm from "@/components/molecules/forms/LoginForm";
import { Button } from "@/components/ui/button";

type LoginPageProps = {};
export default function LoginPage({}: LoginPageProps) {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[rgb(249,_250,_251)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
