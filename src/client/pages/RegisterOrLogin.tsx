import React, { useState } from "react";
import { Form, Layout, message, Tabs } from "antd";
import type { FormProps, TabsProps } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import RegisterForm from "../components/Register";
import LoginForm from "../components/Login";

const RegisterOrLogin: React.FC = () => {
  const [registerForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const items: TabsProps["items"] = [
    {
      key: "register",
      label: "Register",
      children: <RegisterForm registerForm={registerForm} />,
    },
    {
      key: "login",
      label: "Login",
      children: <LoginForm loginForm={loginForm} />,
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#EEF2F6" }}>
      <Content className="flex justify-center items-center shadow-2xs">
        <div className="flex bg-white rounded-xl shadow-xl/30 overflow-hidden w-225 min-h-106">
          <div className="w-1/2 p-10 text-white bg-linear-to-b from-[#108dc7] to-[#ef8e38] flex flex-col justify-center items-center">
            <Title level={2}>
              Welcome to <br />
              <span className="font-bold">NK‑Surveys</span>
            </Title>
            <Text>Share your opinions, shape the future.</Text>
          </div>
          <div className="w-1/2 p-10 grow">
            <Tabs
              defaultActiveKey="register"
              centered
              items={items}
              className="flex flex-col justify-center items-center"
              onChange={() => {
                registerForm.resetFields();
                loginForm.resetFields();
              }}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default RegisterOrLogin;
