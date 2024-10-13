import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useDispatch, useSelector } from "@/redux/store";
import { clearError } from "@/redux/slice/chatbot";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const ErrorDialog = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.chatbot.error);

  const handleErrorClose = () => {
    dispatch(clearError());
  };

  return (
    <Dialog open={!!error}>
      <DialogContent>
        <DialogTitle>Oops! Something went wrong</DialogTitle>
        <DialogDescription>
          We encountered an unexpected error while processing your request. Our
          team has been notified and is working on resolving the issue. Please
          try again later or contact support if the problem persists.
        </DialogDescription>
        <Collapsible>
          <CollapsibleTrigger>Show error details</CollapsibleTrigger>
          <CollapsibleContent className="bg-red-50 p-4 rounded-md">
            {error}
          </CollapsibleContent>
        </Collapsible>

        <div className="flex justify-end">
          <Button onClick={handleErrorClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
