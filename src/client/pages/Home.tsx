import {
  Button,
  Collapse,
  Layout,
  message,
  Modal,
  Skeleton,
  Tag,
  theme,
} from "antd";
import {
  CaretRightOutlined,
  PlusOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { pollService } from "../services/pollService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  onVoteOnPoll,
  updateActivePolls,
  updateRecentPolls,
} from "../storeManagement/initSlice";
import VotingHomeModal from "../components/VotingHomeModal";

const Home: React.FC = () => {
  const [actPolls, setActPolls] = useState<any[]>([]);
  const [recPolls, setRecPolls] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pollType, setPollType] = useState<string>("");
  const [currentPoll, setCurrentPoll] = useState<Record<string, string | null>>(
    {},
  );
  const [selectedOption, setSelectedOption] = useState<
    Record<string, string | null>
  >({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchPolls: any = async () => {
    try {
      setLoading(true);
      const pollsData = await pollService?.getActPolls();
      const recentPollsData = await pollService.getRecPolls();
      setLoading(false);
      setActPolls(pollsData);
      setRecPolls(recentPollsData?.recentPolls);
      dispatch(updateActivePolls(pollsData));
      dispatch(updateRecentPolls(recentPollsData?.recentPolls));
    } catch (err) {
      setLoading(true);
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPolls();
  }, []);

  const handleSave: any = async (pollId: string) => {
    const option = selectedOption[pollId];
    if (!option) return;

    dispatch(onVoteOnPoll({ pollID: pollId!, option }));
    setSelectedOption((prev) => ({ ...prev, [pollId]: null }));
    try {
      await pollService.updatePoll(pollId!, option);
      setIsModalOpen(false);
      await fetchPolls();
      message.success("Voted successfully !");
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleCancel = (pollId: string) => {
    setSelectedOption((prev) => ({ ...prev, [pollId]: null }));
  };

  const PollCard: React.FC<{ poll: any; type: string }> = ({ poll, type }) => {
    const timeLeft = poll.expiresAt
      ? Math.max(
          0,
          (new Date(poll.expiresAt).getTime() - Date.now()) / 1000 / 60,
        )
      : null;

    const totalVotes: any = poll.votes
      ? Object.values(poll.votes).reduce(
          (sum: any, count: any) => sum + count,
          0,
        )
      : 0;

    return (
      <div
        className="w-full bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer"
        onClick={() => {
          setIsModalOpen(true);
          setCurrentPoll(poll);
          setPollType(type);
        }}
      >
        <h3 className="text-lg font-semibold">{poll.question}</h3>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">{totalVotes} votes</p>
          {timeLeft && timeLeft > 0 ? (
            <Tag color="green">Ends in {Math.ceil(timeLeft / 60)} hours</Tag>
          ) : (
            <Tag color="red">Closed</Tag>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout className="flex h-screen">
      <section className="flex justify-center items-center gap-5 my-5">
        <Button
          style={{
            padding: "1.2rem 6rem",
            backgroundColor: "#ef8e38",
            color: "whitesmoke",
          }}
          onClick={() => navigate("/create-poll")}
        >
          <PlusOutlined />
          Create Poll
        </Button>
        <Button
          style={{
            padding: "1.2rem 6rem",
            backgroundColor: "#ef8e38",
            color: "whitesmoke",
          }}
          onClick={() => navigate("/my-polls")}
        >
          <ProjectOutlined />
          My Polls
        </Button>
      </section>
      <section className="flex justify-center mb-5 mx-10 gap-5 h-screen">
        <div className="h-[98vh] w-1/2 bg-blue-100 shadow-xl/30 flex flex-col items-center p-5 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">
            Active Polls({actPolls?.length})
          </h3>
          <div className="w-full flex-1 flex flex-col gap-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
            {loading ? (
              <Skeleton active />
            ) : (
              actPolls?.map((poll, i) => {
                return <PollCard poll={poll} key={`${poll}-${i}`} type="act" />;
              })
            )}
          </div>
        </div>
        <div className="h-[98vh] w-1/2 bg-blue-100 shadow-xl/30 flex flex-col items-center p-5 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">
            Recent Polls({recPolls?.length})
          </h3>
          <div className="w-full">
            <div className="w-full flex-1 flex flex-col gap-1 overflow-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
              {loading ? (
                <Skeleton active />
              ) : (
                recPolls?.map((poll: any, i: any) => {
                  return (
                    <PollCard poll={poll} key={`${poll}-${i}`} type="rec" />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span>{currentPoll?.question}</span>
            {pollType === "rec" && <Tag color="red">#Closed</Tag>}
          </div>
        }
        open={isModalOpen}
        styles={{
          mask: {
            backdropFilter: "blur(6px)", // ✅ blur effect
            WebkitBackdropFilter: "blur(6px)", // Safari support
            backgroundColor: "rgba(0,0,0,0.45)", // semi-transparent overlay
          },
        }}
        footer={[
          <Button key="votingScreen" onClick={() => navigate("/voting")}>
            Voting Screen
          </Button>,
          pollType === "act" && (
            <Button
              key="cancel"
              onClick={() => handleCancel(currentPoll?._id!)}
            >
              Cancel
            </Button>
          ),
          pollType === "act" && (
            <Button
              key="ok"
              type="primary"
              onClick={() => handleSave(currentPoll._id!)}
            >
              OK
            </Button>
          ),
        ]}
        closeIcon={<span onClick={() => setIsModalOpen(false)}>✖</span>}
      >
        <VotingHomeModal
          poll={currentPoll}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          pollType={pollType}
        />
      </Modal>
    </Layout>
  );
};

export default Home;
