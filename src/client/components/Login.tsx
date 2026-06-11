import { useState } from "react";
import { authService } from "../services/authService.ts";
import { useNavigate } from "react-router-dom";
import { Form, FormProps, Input, message, Button } from "antd";
import { FormInstance } from "antd/es/form"; // type for AntD form

type LoginFormProps = {
  loginForm: FormInstance;
};

type FieldType = {
  username?: string;
  password?: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ loginForm }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    try {
      await authService.login(values.username || "", values.password || "");
      message.success("Login successful. Redirecting to the application !");
      loginForm.resetFields();
      setTimeout(() => {
        navigate("/Home");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      // style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      // autoComplete="off"
      form={loginForm}
      className="flex flex-col justify-center min-w-100 grow"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter the username!" },
          { min: 3, message: "Username must be at least 3 characters!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please enter the password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {error && <span style={{ color: "red" }}>Something went wrong!</span>}
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
