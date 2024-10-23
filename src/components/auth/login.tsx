import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginFormValues } from "./schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "@/redux/store";
import { login } from "@/action/api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LoginProps {
  onForgotPassword: () => void; 
}

const Login: React.FC<LoginProps> = ({ onForgotPassword }) => {
  const dispatch = useDispatch();
  const { error: apiError } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   const [showPassword, setShowPassword] = useState(false); 

   const togglePasswordVisibility = () => {
     setShowPassword((prevState) => !prevState);
   };

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    dispatch(login(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>
        <div className="flex flex-col space-y-1.5 relative">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-red-500">{errors.password?.message}</p>
        </div>
      </div>
      {apiError && <p className="text-red-500">{apiError}</p>}
      <div className="flex">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-blue-500 underline ml-auto"
        >
          Forgot Password?
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
};

export default Login;
