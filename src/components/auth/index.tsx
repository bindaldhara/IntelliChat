import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toggleAuthDialog } from "@/redux/slice/app";
import { useDispatch, useSelector } from "@/redux/store";
import Login from "./login";
import Register from "./register";
import { fetchSelf } from "@/action/api";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { clearError } from "@/redux/slice/user";

const AuthDialog = () => {
  const dispatch = useDispatch();
  const { isAuthDialogOpen } = useSelector((state) => state.app);
  const [isLogin, setIsLogin] = useState(true);

  const closeAuthDialog = () => {
    dispatch(toggleAuthDialog());
  };

  const handleChangeAuthType = () => {
    dispatch(clearError());
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    dispatch(fetchSelf());
  }, [dispatch]);

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="">
            {isLogin ? "Login" : "Register"}
          </DialogTitle>
          <DialogDescription className="">
            {isLogin ? "Login to your account" : "Create a new account"}
          </DialogDescription>
        </DialogHeader>
        {isLogin ? <Login /> : <Register />}
        <div className="text-center">
          <Button variant="link" onClick={handleChangeAuthType}>
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
