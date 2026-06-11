import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Select,
  Space,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { pollService } from "../services/pollService";
import { authService } from "../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  question?: string;
};

const CreatePoll: React.FC = () => {
  const [createForm] = Form.useForm();
  const [showRedirect, setShowRedirect] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreatePoll: any = async (values: {
    id?: string;
    question?: string;
    options?: string[];
    DurationD?: string;
    DurationH?: string;
  }) => {
    try {
      const days = parseInt(values.DurationD || "0", 10);
      const hours = parseInt(values.DurationH || "0", 10);

      // Start from now
      const expiresAt = new Date();

      // Add days and hours
      expiresAt.setDate(expiresAt.getDate() + days);
      expiresAt.setHours(expiresAt.getHours() + hours);

      await pollService.createPoll({
        // id: values.id,
        question: values.question,
        options: values.options,
        createdBy: authService.getUserID(),
        expiresAt: expiresAt,
      });
      message.success("Poll created successfully !");
      createForm.resetFields();
      setShowRedirect(true);
    } catch (err) {
      setShowRedirect(false);
      console.log(err);
    }
  };

  return (
    <Layout className="flex-1 h-[90vh]">
      <section className="h-screen flex flex-col justify-center items-center gap-5 my-5">
        <Card className="w-2xl shadow-xl/30">
          <h1 className="text-2xl font-bold text-center mb-6 ">
            Create New Poll
          </h1>
          <Form
            name="createPoll"
            labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, height: "100%" }}
            initialValues={{ remember: true, DurationD: "1", DurationH: "0" }}
            layout="vertical"
            autoComplete="off"
            className="w-full"
            form={createForm}
            onFinish={handleCreatePoll}
          >
            <Form.Item<FieldType>
              name="question"
              label="Question"
              rules={[
                { required: true, message: "Please input your question!" },
              ]}
              className="w-full"
            >
              <Input className="w-full" />
            </Form.Item>
            <Form.List
              name="options"
              rules={[
                {
                  validator: async (_, options) => {
                    if (!options || options.length < 2) {
                      return Promise.reject(
                        new Error("At least 2 options required"),
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      label={index === 0 ? "Options" : ""}
                      key={field.key}
                      rules={[
                        { required: true, message: "Option cannot be empty" },
                      ]}
                    >
                      <Space.Compact style={{ width: "100%" }}>
                        <Input placeholder={`Option ${index + 1}`} />
                        {fields.length > 2 && (
                          <Button
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        )}
                      </Space.Compact>
                    </Form.Item>
                  ))}

                  {fields.length < 4 && (
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Option
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
            <Form.Item label="Poll Duration" required>
              <Space>
                <Form.Item
                  name="DurationD"
                  rules={[{ required: true, message: "Please select days" }]}
                >
                  <Select
                    style={{ width: 120 }}
                    options={[
                      { value: "1", label: "1 Day" },
                      { value: "2", label: "2 Days" },
                      { value: "3", label: "3 Days" },
                      { value: "4", label: "4 Days" },
                      { value: "5", label: "5 Days" },
                      { value: "6", label: "6 Days" },
                      { value: "7", label: "7 Days" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name="DurationH"
                  rules={[{ required: true, message: "Please select hours" }]}
                >
                  <Select
                    style={{ width: 120 }}
                    options={[
                      { value: "0", label: "0 Hours" },
                      { value: "6", label: "6 Hours" },
                      { value: "12", label: "12 Hours" },
                      { value: "18", label: "18 Hours" },
                    ]}
                  />
                </Form.Item>
              </Space>
            </Form.Item>

            <Form.Item className="flex justify-end">
              {showRedirect && (
                <Button
                  type="default"
                  className="mr-4"
                  onClick={() => {
                    navigate("/Home");
                    setShowRedirect(false);
                  }}
                >
                  View Polls
                </Button>
              )}
              <Button
                type="default"
                className="mr-4"
                onClick={() => createForm.resetFields()}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                style={{
                  backgroundColor: "#ef8e38",
                  color: "whitesmoke",
                }}
              >
                Create Poll
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </section>
    </Layout>
  );
};

export default CreatePoll;
