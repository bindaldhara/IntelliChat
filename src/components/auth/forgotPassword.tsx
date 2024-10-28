import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
  verifyOTPSchema,
  type VerifyOTPFormValues,
} from "./schema"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "@/redux/store";
import { forgotPassword, verifyOtpAndResetPassword } from "@/action/api";
import { clearForgotPasswordState } from "@/redux/slice/user";
import { RootState } from "@/redux/store";
import { useState } from "react";
import Loader from "../ui/loader";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {
  const dispatch = useDispatch();
  const { forgotPasswordSuccess, error, otpSuccess, isLoading } = useSelector(
    (state: RootState) => state.user
  );

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState<string>("");


  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
  } = useForm<VerifyOTPFormValues>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
    },
  });

  const onSubmitEmail: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setEmail(data.email);
    const resp = await dispatch(forgotPassword(data));
    if (resp.type === "auth_forgotPassword/fulfilled") 
    setStep("otp");
  };

  const onSubmitOTP: SubmitHandler<VerifyOTPFormValues> = async (data) => {
    const { otp, newPassword } = data;
    const resp = await dispatch(verifyOtpAndResetPassword({ email, otp, newPassword }));
    if (resp.type === "auth_verifyOtpAndResetPassword/fulfilled") 
    handleClose();
  };

  const handleClose = () => {
    dispatch(clearForgotPasswordState());
    onClose();
  };

  return (
    <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {step === "email" ? "Forgot Password" : "Verify OTP"}
        </h2>
        {step === "email" ? (
          <form
            onSubmit={handleSubmitEmail(onSubmitEmail)}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...registerEmail("email")}
              />
              <p className="text-red-500">{emailErrors.email?.message}</p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {forgotPasswordSuccess && (
              <p className="text-green-500">Password reset link sent!</p>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={handleClose}
                className="bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black"
              >
                <p className="flex items-center gap-2">
                  {isLoading && <Loader />}
                  Submit
                </p>
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitOTP(onSubmitOTP)} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                {...registerOTP("otp")}
              />
              <p className="text-red-500">{otpErrors.otp?.message}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                {...registerOTP("newPassword")}
              />
              <p className="text-red-500">{otpErrors.newPassword?.message}</p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {otpSuccess && (
              <p className="text-green-500">Password has been reset!</p>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={() => setStep("email")}
                className="bg-gray-500"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-black"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
