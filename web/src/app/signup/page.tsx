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
import styles from "./signup.module.scss";
import {
  SendOtpDocument,
  SignUpOtpVerifyDocument,
} from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [email, setEmail] = useState("");
  
  const [sendOtp, { loading: sendOtpLoading }] = useMutation(SendOtpDocument);
  const [signupVerify, { loading: signupLoading }] = useMutation(SignUpOtpVerifyDocument);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      otp: "",
    },

    validate: {
      name: (value) => (value.length < 2 ? "Name must be at least 2 characters" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      otp: (value) =>
        step === "otp" && value.length < 4 ? "OTP must be 4 digits" : null,
    },
  });

  const handleSendOtp = async (values: typeof form.values) => {
    try {
      await sendOtp({
        variables: {
          email: values.email,
          type: "SIGNUP",
        },
      });
      setEmail(values.email);
      setStep("otp");
      notifications.show({
        title: "OTP Sent",
        message: "Please check your email for the OTP.",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to send OTP",
        color: "red",
      });
    }
  };

  const handleVerifyOtp = async (values: typeof form.values) => {
    try {
      const { data } = await signupVerify({
        variables: {
          data: {
            name: values.name,
            email: email,
            otp: values.otp,
          },
        },
      });

      if (data?.signUpOtpVerify) {
        notifications.show({
          title: "Success",
          message: "Account created successfully!",
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
          visible={sendOtpLoading || signupLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Title order={2} className={styles.title}>
          {step === "details" ? "Create Account" : "Enter OTP"}
        </Title>

        <form
          className={styles.form}
          onSubmit={form.onSubmit(step === "details" ? handleSendOtp : handleVerifyOtp)}
        >
          {step === "details" ? (
            <>
              <TextInput
                label="Name"
                placeholder="Your Name"
                required
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                {...form.getInputProps("email")}
              />
            </>
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
            {step === "details" ? "Send OTP" : "Verify & Signup"}
          </Button>
          
          {step === "otp" && (
             <Button 
                variant="subtle" 
                fullWidth 
                onClick={() => setStep("details")}
                size="xs"
             >
                Back to Details
             </Button>
          )}
        </form>
      </Paper>
    </div>
  );
}
