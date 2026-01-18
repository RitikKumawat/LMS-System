"use client";

import React, { useState } from "react";
import {
  TextInput,
  LoadingOverlay,
  Group,
  PinInput,
  Text,
} from "@mantine/core"; // Keep Mantine inputs for functionality
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import styles from "../auth.module.scss"; // Styles for inputs/layout
import { yupResolver } from "mantine-form-yup-resolver";
import { SendOtpDocument, LoginOtpVerifyDocument } from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";
import FCard from "@/components/ui/FCard";
import FButton from "@/components/ui/FButton";
import FTypography from "@/components/ui/FTypography";
import { INITIAL_VALUES } from "@/form/initial-values";
import { VALIDATIONS } from "@/form/validations";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");

  const [sendOtp, { loading: sendOtpLoading }] = useMutation(SendOtpDocument, {
    onCompleted: () => {
      setStep("otp");
      notifications.show({
        title: "OTP Sent",
        message: "Please check your email for the OTP.",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Failed to send OTP",
        message: error.message,
        color: "red",
      });
    },
  });
  const [loginVerify, { loading: loginLoading }] = useMutation(
    LoginOtpVerifyDocument,
    {
      onCompleted: () => {
        notifications.show({
          title: "Success",
          message: "Logged in successfully!",
          color: "green",
        });
        // Redirect to home or dashboard
        router.push("/");
    },
    onError:(error)=>{
      notifications.show({
        title: "Error",
        message:  error.message,
        color: "red",
      });
    }
  }
  );

  const form = useForm({
    initialValues: INITIAL_VALUES.login,
    validate: yupResolver(VALIDATIONS.login(step)),
  });

  const handleSendOtp = async (values: typeof form.values) => {
    console.log("FORM ERRRORS",form.errors)
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
      await loginVerify({
        variables: {
          data: {
            email: email,
            otp: values.otp,
          },
        },
      });
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
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={styles.gridOverlay} />

      <div className={styles.cardWrapper}>
        <FCard glass={true} className={styles.authCard}>
          <LoadingOverlay
            visible={sendOtpLoading || loginLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            styles={{ overlay: { backgroundColor: "#2d303cb0" } }}
          />
          <FTypography variant="h2" align="center" className={styles.title}>
            {step === "email" ? "Welcome Back" : "Enter OTP"}
          </FTypography>

          <form
            className={styles.form}
            onSubmit={form.onSubmit(
              step === "email" ? handleSendOtp : handleVerifyOtp,
            )}
          >
            {step === "email" ? (
              <TextInput
                label="Email"
                placeholder="your@email.com"
                classNames={{ input: styles.input, label: styles.input }}
                {...form.getInputProps("email")}
                error={form.errors.email}
                className={styles.input}
              />
            ) : (
              <>
                <Text size="sm" ta="center" mb="xs" c="dimmed">
                  Enter the OTP sent to {email}
                </Text>
                <Group justify="center">
                  <PinInput
                    length={6}
                    type="number"
                    classNames={{ input: styles.pinInput }}
                    {...form.getInputProps("otp")}
                    
                  />
                </Group>
              </>
            )}

            <FButton type="submit" fullWidth style={{ marginTop: "1rem" }}>
              {step === "email" ? "Send OTP" : "Verify & Login"}
            </FButton>

            {step === "otp" && (
              <FButton
                variant="ghost"
                fullWidth
                onClick={() => setStep("email")}
                style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
              >
                Back to Email
              </FButton>
            )}
          </form>
        </FCard>
      </div>
    </div>
  );
}
