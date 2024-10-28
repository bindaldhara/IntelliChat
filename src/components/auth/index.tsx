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
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { clearError } from "@/redux/slice/user";
import  ForgotPasswordModal  from "./forgotPassword";

const AuthDialog = () => {
  const dispatch = useDispatch();
  const { isAuthDialogOpen } = useSelector((state) => state.app);
  const [page, setPage] = useState<Page>("login");


  const closeAuthDialog = () => {
    dispatch(toggleAuthDialog());
  };

  const handleChangeAuthType = (page:Page) => {
    dispatch(clearError());
    setPage(page);
  };

 const {title, description} = useMemo( ()=>{
  let title = "";
  let description = "";
  
  if(page === "login"){
    title = "Login";
    description = "Login page";
  }
  else if(page === "register"){
    title = "Register";
    description = "Create a new account";
  }
  else{
    title = "Forget Password";
    description = "Enter your email to reset your password";

  }
  return {title,description};
 }, [page]);

  useEffect(() => {
    dispatch(fetchSelf());
  }, [dispatch]);

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="">{title}</DialogTitle>
          <DialogDescription className="">{description}</DialogDescription>
        </DialogHeader>
        {page === "login" && (
          <Login onForgotPassword={() => handleChangeAuthType("forgetPass")} />
        )}
        {page === "register" && <Register />}
        {page === "forgetPass" && (
          <ForgotPasswordModal onClose={() => handleChangeAuthType("login")} />
        )}

        <div className="text-center">
          <Button variant="link" onClick={() => handleChangeAuthType(page === "register" ? "login" : "register")}>
            {page === "login" && "Need an account? Register"}
            {page === "register" && "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;

type Page = "login" | "register" | "forgetPass" ;
