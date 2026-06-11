import { Drawer } from "antd";
import {
  CloseOutlined,
  HomeFilled,
  PlusCircleFilled,
  AreaChartOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { closeLeftDrawer } from "../storeManagement/initSlice";
import { useNavigate } from "react-router-dom";

const DrawerComponent: React.FC = () => {
  const isDrawerOpen = useSelector(
    (state: any) => state.homeRed.openLeftDrawer,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNavigate = (path: string) => {
    navigate(path);
    dispatch(closeLeftDrawer());
  };

  return (
    <Drawer
      title="NK-Surveys"
      placement="left"
      closable={false}
      open={isDrawerOpen}
      key="left"
      size={250}
      style={{ backgroundColor: "#012d41", color: "white" }}
      extra={<CloseOutlined onClick={() => dispatch(closeLeftDrawer())} />}
    >
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#0f3a52] transition"
          onClick={() => onNavigate("/Home")}
        >
          <HomeFilled style={{ color: "#ef8e38" }} />
          <span className="text-white font-medium">Dashboard</span>
        </div>
        <div
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#0f3a52] transition"
          onClick={() => onNavigate("/create-poll")}
        >
          <PlusCircleFilled style={{ color: "#ef8e38" }} />
          <span className="text-white font-medium">Create Poll</span>
        </div>
        <div
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#0f3a52] transition"
          onClick={() => onNavigate("/voting")}
        >
          <AreaChartOutlined style={{ color: "#ef8e38" }} />
          <span className="text-white font-medium">Voting Screen</span>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerComponent;
