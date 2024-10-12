import { toggleSidebar } from "@/redux/slice/app";
import { useDispatch, useSelector } from "@/redux/store";
import { PanelRightClose } from "lucide-react";

const Navbar = () => {
  const { isSidebarOpen } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const handleSidebarOpen = () => {
    dispatch(toggleSidebar(true));
  };
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <PanelRightClose
            onClick={handleSidebarOpen}
            className="cursor-pointer"
          />
        )}
        <h3 className="text-lg font-semibold">IntelliChat</h3>
      </div>
    </div>
  );
};

export default Navbar;
