"use client";

import React, { useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Group,
  PinInput,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import styles from "./login.module.scss";
// import { useMutation } from "@apollo/client/react/hooks";
import {
  SendOtpDocument,
  LoginOtpVerifyDocument,
} from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  
  const [sendOtp, { loading: sendOtpLoading }] = useMutation(SendOtpDocument,{
    onCompleted:()=>{
      setStep("otp");
      notifications.show({
        title: "OTP Sent",
        message: "Please check your email for the OTP.",
        color: "green",
      });
    },
    onError:(error)=>{
      notifications.show({
        title: "Failed to send OTP",
        message:  error.message,
        color: "red",
      });
    }
  });
  const [loginVerify, { loading: loginLoading }] = useMutation(LoginOtpVerifyDocument);

  const form = useForm({
    initialValues: {
      email: "",
      otp: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      otp: (value) =>
        step === "otp" && value.length < 4 ? "OTP must be 4 digits" : null,
    },
  });

  const handleSendOtp = async (values: typeof form.values) => {
      await sendOtp({
        variables: {
          email: values.email,
          type: "LOGIN",
        },
      });
      setEmail(values.email);
  };

  const handleVerifyOtp = async (values: typeof form.values) => {
    try {
      const { data } = await loginVerify({
        variables: {
          data: {
            email: email,
            otp: values.otp,
          },
        },
      });

      if (data?.loginOtpVerify) {
        notifications.show({
          title: "Success",
          message: "Logged in successfully!",
          color: "green",
        });
        // Redirect to home or dashboard
        router.push("/");
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Invalid OTP",
        color: "red",
      });
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.card} withBorder>
        <LoadingOverlay
          visible={sendOtpLoading || loginLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Title order={2} className={styles.title}>
          {step === "email" ? "Welcome Back" : "Enter OTP"}
        </Title>

        <form
          className={styles.form}
          onSubmit={form.onSubmit(step === "email" ? handleSendOtp : handleVerifyOtp)}
        >
          {step === "email" ? (
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps("email")}
            />
          ) : (
            <>
              <Text size="sm" ta="center" mb="xs">
                Enter the OTP sent to {email}
              </Text>
              <Group justify="center">
                <PinInput
                  length={4}
                  type="number"
                  {...form.getInputProps("otp")}
                />
              </Group>
            </>
          )}

          <Button type="submit" fullWidth className={styles.button}>
            {step === "email" ? "Send OTP" : "Verify & Login"}
          </Button>
          
          {step === "otp" && (
             <Button 
                variant="subtle" 
                fullWidth 
                onClick={() => setStep("email")}
                size="xs"
             >
                Back to Email
             </Button>
          )}
        </form>
      </Paper>
    </div>
  );
}
