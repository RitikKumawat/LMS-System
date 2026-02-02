"use client";

import React, { useState } from "react";
import {
  TextInput,
  LoadingOverlay,
  Group,
  PinInput,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import styles from "../../auth.module.scss";
import { SendOtpDocument, SignUpOtpVerifyDocument } from "@/generated/graphql";
import { useMutation } from "@apollo/client/react";
import FCard from "@/components/ui/FCard";
import FButton from "@/components/ui/FButton";
import FTypography from "@/components/ui/FTypography";
import { INITIAL_VALUES } from "@/form/initial-values";
import { yupResolver } from "mantine-form-yup-resolver";
import { VALIDATIONS } from "@/form/validations";
import { onError } from "@apollo/client/link/error";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
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
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });
  const [signupVerify, { loading: signupLoading }] = useMutation(
    SignUpOtpVerifyDocument,
    {
      onCompleted: () => {
        notifications.show({
          title: "Success",
          message: "Account created successfully!",
          color: "green",
        });
        // Redirect to home or dashboard
        router.push("/");
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      }
    },
  );

  const form = useForm({
    initialValues: INITIAL_VALUES.signup,

    validate: yupResolver(VALIDATIONS.signup(step)),
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
      await signupVerify({
        variables: {
          data: {
            name: values.name,
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
            visible={sendOtpLoading || signupLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            styles={{ overlay: { backgroundColor: "#2d303cb0" } }}
          />
          <FTypography variant="h2" align="center" className={styles.title}>
            {step === "details" ? "Create Account" : "Enter OTP"}
          </FTypography>

          <form
            className={styles.form}
            onSubmit={form.onSubmit(
              step === "details" ? handleSendOtp : handleVerifyOtp,
            )}
          >
            {step === "details" ? (
              <>
                <TextInput
                  label="Name"
                  placeholder="Your Name"
                  classNames={{ input: styles.input, label: styles.input }}
                  {...form.getInputProps("name")}
                  className={styles.input}
                />
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  classNames={{ input: styles.input, label: styles.input }}
                  mt="md"
                  {...form.getInputProps("email")}
                  className={styles.input}
                />
              </>
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
              {step === "details" ? "Send OTP" : "Verify & Signup"}
            </FButton>

            {step === "otp" && (
              <FButton
                variant="ghost"
                fullWidth
                onClick={() => setStep("details")}
                style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}
              >
                Back to Details
              </FButton>
            )}
          </form>
        </FCard>
      </div>
    </div>
  );
}
