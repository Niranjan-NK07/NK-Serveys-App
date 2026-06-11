import React, { useState } from "react";
import { authService } from "../services/authService.ts";
import { useNavigate } from "react-router-dom";
import { Checkbox, Form, FormProps, Input, message, Button } from "antd";
import { FormInstance } from "antd/es/form"; // type for AntD form

type LoginFormProps = {
  registerForm: FormInstance;
};

type FieldType = {
  username?: string;
  //   remember?: string;
  password?: string;
  email?: string;
};

const RegisterForm: React.FC<LoginFormProps> = ({ registerForm }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    try {
      await authService.register({
        username: values.username || "",
        email: values.email || "",
        password: values.password || "",
      });
      message.success(
        "Registration successful. Redirecting to the application !",
      );
      registerForm.resetFields();
      setTimeout(() => {
        navigate("/Home");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err.message || "Registration failed. Please try again.";
      setError(err.message);
      message.error(err.message);
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
      name="register"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 30 }}
      //   style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={registerForm}
      className="flex flex-col justify-center min-w-100 grow"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter the username!" },
          { min: 3, message: "Username must be at least 3 characters!" },
        ]}
        className="w-full"
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter the email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please enter the password!" },
          { min: 8, message: "Password must be at least 8 characters!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {/* <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}
      {error && <span style={{ color: "red" }}>{error}</span>}
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
