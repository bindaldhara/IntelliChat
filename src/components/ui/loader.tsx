import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
  return <LoaderCircle className={cn("animate-spin size-4", className)} />;
};

export default Loader;
