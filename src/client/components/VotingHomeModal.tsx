import { BorderBeam, Button } from "antd";
import { useState } from "react";

type IPoll = {
  _id?: string;
  question?: string;
  description?: string;
  options?: string[];
  votes?: Record<string, number>;
  expiresAt?: Date | string;
};
type VotingHomeModalProps = {
  poll: IPoll;
  selectedOption: any;
  setSelectedOption: any;
  pollType: string;
};

const VotingHomeModal: React.FC<VotingHomeModalProps> = ({
  poll,
  selectedOption,
  setSelectedOption,
  pollType,
}) => {
  const selected = selectedOption?.[poll._id!];

  return (
    <>
      <div className="space-y-3">
        {poll.options?.map((option: any) => (
          <div key={option} className="flex items-center justify-between gap-2">
            <BorderBeam
              outset={5}
              color={[
                { color: "#2f54eb", percent: 0 },
                { color: "#722ed1", percent: 44 },
                { color: "#ff85c0", percent: 100 },
              ]}
            >
              <span
                className={`flex-1 rounded px-2 py-1 border flex justify-between ${selected === option ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
              >
                <span>{option}</span>
                <span>{poll.votes?.[option]} votes</span>
              </span>
            </BorderBeam>
            {pollType === "act" && <Button
              style={{
                padding: "1rem 0.65rem",
                backgroundColor: "#ef8e38",
                color: "whitesmoke",
              }}
              onClick={() =>
                setSelectedOption((prev: any) => ({
                  ...prev,
                  [poll._id!]: option,
                }))
              }
            >
              Vote
            </Button>}
          </div>
        ))}
      </div>
    </>
  );
};

export default VotingHomeModal;
