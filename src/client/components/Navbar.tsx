import { Button, Divider, message, Modal } from "antd";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { MenuOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { openLeftDrawer, closeLeftDrawer } from "../storeManagement/initSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-blue-400" : "text-white";
  };

  const onLogut: any = () => {
    try {
      authService.logout();
      setLogoutModalVisible(false);
      navigate("/");
    } catch (err: any) {
      const errorMessage = err.message || "Logout failed. Please try again.";
      message.error(errorMessage);
    }
    setLogoutModalVisible(false);
  };

  function capitalizeFirst(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <>
      <nav className="bg-[#012d41] text-white p-3 md:p-4">
        <div className="mx-auto flex items-center justify-between flex-wrap gap-3 px-4">
          <div className="text-sm md:text-lg font-bold flex items-center justify-between gap-4">
            {/* <Button> */}
            <MenuOutlined
              className="cursor-pointer"
              onClick={() => dispatch(openLeftDrawer())}
            />
            {/* </Button> */}
            <Link to="/Home" className="hover:text-blue-300 transition">
              NK-Serveys
            </Link>
          </div>
          {location.pathname !== "/login" && location.pathname !== "/" && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h3 className="mb-1">
                Hi {capitalizeFirst(authService.getUsername()!)}
              </h3>
              <Divider vertical style={{ borderColor: "whitesmoke" }} />
              <Button
                onClick={() => setLogoutModalVisible(true)}
                size="small"
                className="md:size-auto"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>
      <Modal
        title="Logout"
        open={logoutModalVisible}
        onOk={onLogut}
        onCancel={() => setLogoutModalVisible(false)}
      >
        Are you sure want to logout ?
      </Modal>
    </>
  );
};

export default Navbar;
