import { FormErrors } from "@mantine/form";

export const scrollToFirstError = (errors: FormErrors) => {
  const errorFields = Object.keys(errors);
  console.log("errorFields",errorFields);
  if (errorFields.length === 0) return;

  const firstError = errorFields[0];
  const el = document.getElementById(firstError);
  if (!el) return;

  const NAVBAR_HEIGHT = 72;

  const y =
    el.getBoundingClientRect().top +
    window.pageYOffset -
    NAVBAR_HEIGHT -
    16;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });

  const input =
    el.querySelector("input, textarea, select") ?? el;

  setTimeout(() => {
    (input as HTMLElement)?.focus();
  }, 300);
};