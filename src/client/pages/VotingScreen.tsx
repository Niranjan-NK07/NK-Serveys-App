import { BorderBeam, Button, Card, Empty, message, Skeleton, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { onVoteOnPoll, updateActivePolls } from "../storeManagement/initSlice";
import { useEffect, useState } from "react";
import { pollService } from "../services/pollService";

type IPoll = {
  _id?: string;
  question?: string;
  description?: string;
  options?: string[];
  votes?: Record<string, number>;
  expiresAt?: Date | string;
};

const VotingScreen: React.FC = () => {
  const activePolls = useSelector((state: any) => state.homeRed.activePolls);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<
    Record<string, string | null>
  >({});

  const dispatch = useDispatch();

  const fetchPolls: any = async () => {
    try {
      setLoading(true);
      const pollsData = await pollService?.getActPolls();
      setLoading(false);
      dispatch(updateActivePolls(pollsData));
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
      message.success("Voted successfully !");
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleCancel = (pollId: string) => {
    setSelectedOption((prev) => ({ ...prev, [pollId]: null }));
  };

  return (
    <div className="h-screen bg-gray-100 p-2">
      <div className="h-[98vh] max-w-3xl mx-auto flex flex-col justify-center gap-6 bg-blue-100 min-w-[80%] px-10 py-5 rounded-2xl">
        <h1 className="text-3xl font-bold text-center">Voting Screen</h1>
        <div className="flex-1 flex flex-col gap-6 overflow-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
          {loading ? (
            <Skeleton active />
          ) : activePolls?.length > 0 ? (
            activePolls?.map((poll: IPoll) => {
              const totalVotes = Object.values(poll.votes || {}).reduce(
                (acc: number, cur: number) => acc + cur,
                0,
              );

              const timeLeft = poll.expiresAt
                ? Math.max(
                    0,
                    (new Date(poll.expiresAt).getTime() - Date.now()) /
                      1000 /
                      60,
                  )
                : null;

              const selected = selectedOption?.[poll._id!];

              return (
                <Card
                  key={poll._id}
                  title={poll.question}
                  className="shadow-lg rounded-lg"
                  extra={
                    timeLeft && timeLeft > 0 ? (
                      <Tag color="green">
                        Ends in {Math.ceil(timeLeft / 60)} hrs
                      </Tag>
                    ) : (
                      <Tag color="red">Closed</Tag>
                    )
                  }
                >
                  <div className="space-y-3">
                    {poll.options?.map((option: any) => (
                      <div
                        key={option}
                        className="flex items-center justify-between gap-3"
                      >
                        {selected === option ? (
                          <BorderBeam
                            color={[
                              { color: "#2f54eb", percent: 0 },
                              { color: "#722ed1", percent: 44 },
                              { color: "#ff85c0", percent: 100 },
                            ]}
                          >
                            <span
                              className={`flex-1 rounded p-2 border flex justify-between ${selected === option ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
                            >
                              <span>{option}</span>
                              <span>{poll.votes?.[option]} votes</span>
                            </span>
                          </BorderBeam>
                        ) : (
                          <span
                            className={`flex-1 rounded p-2 border flex justify-between ${selected === option ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
                          >
                            <span>{option}</span>
                            <span>{poll.votes?.[option]} votes</span>
                          </span>
                        )}
                        <Button
                          style={{
                            padding: "1.2rem 3.7rem",
                            backgroundColor: "#ef8e38",
                            color: "whitesmoke",
                          }}
                          onClick={() =>
                            setSelectedOption((prev) => ({
                              ...prev,
                              [poll._id!]: option,
                            }))
                          }
                        >
                          Vote
                        </Button>
                      </div>
                    ))}
                  </div>
                  {selectedOption && (
                    <div className="flex justify-end gap-4 mt-4">
                      <Button
                        type="primary"
                        onClick={() => handleSave(poll._id!)}
                      >
                        Save
                      </Button>
                      <Button danger onClick={() => handleCancel(poll._id!)}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  <p className="mt-4 text-sm text-gray-500">
                    {totalVotes} votes
                  </p>
                </Card>
              );
            })
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingScreen;
