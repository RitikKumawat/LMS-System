import { FormErrors, useForm } from "@mantine/form";
import { yupResolver } from "mantine-form-yup-resolver";
import { Box, Flex, Stepper, Text, Paper, Grid, Stack, Group } from "@mantine/core";
import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { notifications } from "@mantine/notifications";
import classes from "./index.module.scss";
import FInput from "../../ui/FInput/FInput";
import FImageUploader from "../../ui/FImageUploader/FImageUploader";
import RichTextEditorComponent from "../../ui/RichTextEditor/RichTextEditorComponent";
import FButton from "../../ui/FButton/FButton";

import { ROUTES } from "../../enum/routes";
import { INITIAL_VALUES } from "../../form/initial-values";
import { VALIDATIONS } from "../../form/validations";

import {
  Course_Level,
  CreateCourseDocument,
  GetAllCategoriesDocument,
  GetAllCoursesDocument,
  GetCourseByIdDocument,
} from "../../generated/graphql";

// const NAVBAR_HEIGHT = 72;

const AddCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: INITIAL_VALUES.addCourseForm,
    validate: yupResolver(VALIDATIONS.addCourse),
  });

  /* ------------------ Queries ------------------ */

  const { data, loading: courseLoading } = useQuery(GetCourseByIdDocument, {
    skip: !id,
    variables: { courseId: id as string },
  });

  const { data: categoriesData } = useQuery(GetAllCategoriesDocument, {
    variables: { paginationInput: { limit: 100, page: 1 } },
  });

  const { refetch } = useQuery(GetAllCoursesDocument, {
    variables: { paginationInput: { limit: 10, page: 1 }, courseFilters: {} },
  });

  /* ------------------ Mutation ------------------ */

  const [createCourse, { loading }] = useMutation(CreateCourseDocument, {
    onCompleted: async (data) => {
      notifications.show({
        message: `Course ${id ? "updated" : "created"} successfully`,
        color: "green",
      });
      await refetch();
      navigate(ROUTES.COURSE_CURRICULUM + `/${data.createCourse._id}`);
    },
    onError: (error) => {
      notifications.show({
        message: error.message,
        color: "red",
      });
    },
  });

  /* ------------------ Edit Prefill ------------------ */
  useEffect(() => {
    if (id && !courseLoading && data?.getCourseById) {
      const course = data.getCourseById;

      form.setValues({
        title: course.title,
        category: course.category_id,
        description: course.description || "",
        language: course.language,
        level: course.level.toUpperCase(),
        price: course.price,
        thumbnail_url: course.thumbnail_url,
        thumbnail: course.thumbnail_url || null,
      });
    }
  }, [id, courseLoading, data]);

  /* ------------------ Scroll to First Error ------------------ */

  const scrollToFirstError = (errors: FormErrors) => {
    const errorFields = Object.keys(errors);
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


  /* ------------------ Submit ------------------ */

  const handleSubmit = async () => {
    const validation = form.validate();

    if (validation.hasErrors) {
      scrollToFirstError(validation.errors);
      return;
    }

    const values = form.values;

    await createCourse({
      variables: {
        createCourseInput: {
          courseId: id,
          title: values.title,
          description: values.description,
          language: values.language,
          level: values.level as Course_Level,
          price: values.price,
          category_id: values.category,
          thumbnail_url: values.thumbnail_url || undefined,
        },
        thumbnail:
          values.thumbnail instanceof File ? values.thumbnail : undefined,
      },
    });
  };

  const categoryOptions =
    categoriesData?.getAllCategories?.docs?.map((c) => ({
      label: c.name,
      value: c._id,
    })) ?? [];

  /* ------------------ UI ------------------ */

  return (
    <div>
      <Box className={classes.stepperContainer}>
        <Flex gap="lg" align="center">
          <FButton
            variant="outline"
            size="xs"
            handleClick={() => navigate(ROUTES.COURSES)}
            leftIcon={<ArrowLeft size={15} />}
            title=""
          />
          <Text fw={600} size="24px">
            {id ? "Edit" : "Add"} Course Details
          </Text>
        </Flex>
        <Stepper active={0} w={"70%"}>
          <Stepper.Step label="Course Details" />
          <Stepper.Step label="Curriculum" />
        </Stepper>
      </Box>


      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Stack gap="xl" mt="xl" pb="xl">
          {/* Basic Information Card */}
          <Paper shadow="sm" radius="md" p="xl" withBorder>
            <Text fw={600} size="lg" mb="md" c="dimmed">
              Basic Information
            </Text>
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <div id="title">
                  <FInput
                    label="Course Title"
                    placeholder="Enter Course Title"
                    {...form.getInputProps("title")}
                    formHandler={form.getInputProps("title")}
                  />
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <div id="price">
                  <FInput
                    label="Course Price (₹)"
                    variant="number"
                    placeholder="Enter Price"
                    {...form.getInputProps("price")}
                    formHandler={form.getInputProps("price")}
                  />
                </div>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Classification Card */}
          <Paper shadow="sm" radius="md" p="xl" withBorder>
            <Text fw={600} size="lg" mb="md" c="dimmed">
              Classification
            </Text>
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <div id="level">
                  <FInput
                    label="Course Level"
                    variant="select"
                    placeholder="Select Course Level"
                    {...form.getInputProps("level")}
                    formHandler={form.getInputProps("level")}
                    selectOptions={[
                      { label: "Beginner", value: Course_Level.Beginner },
                      { label: "Intermediate", value: Course_Level.Intermediate },
                      { label: "Advanced", value: Course_Level.Advanced },
                    ]}
                  />
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <div id="language">
                  <FInput
                    label="Course Language"
                    placeholder="e.g. English, Spanish"
                    {...form.getInputProps("language")}
                    formHandler={form.getInputProps("language")}
                  />
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <div id="category">
                  <FInput
                    label="Course Category"
                    variant="select"
                    placeholder="Select Category"
                    {...form.getInputProps("category")}
                    formHandler={form.getInputProps("category")}
                    selectOptions={categoryOptions}
                  />
                </div>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Media & Description Card */}
          <Paper shadow="sm" radius="md" p="xl" withBorder>
            <Text fw={600} size="lg" mb="md" c="dimmed">
              Media & Content
            </Text>
            <Stack gap="xl">
              <div id="thumbnail">
                <Text fw={500} size="sm" mb={4}>Course Thumbnail</Text>
                <FImageUploader
                  value={form.values.thumbnail ? [form.values.thumbnail] : []}
                  onChange={(files) =>
                    form.setFieldValue("thumbnail", files[0] || null)
                  }
                  onClear={() => {
                    form.setFieldValue("thumbnail", null);
                    form.setFieldValue("thumbnail_url", "");
                  }}
                  accept="image/*"
                  // label="Course Thumbnail" -> using Text above instead for better alignment
                  maxSize={5 * 1024 * 1024}
                  formError={form.errors.thumbnail?.toString()}
                />
              </div>

              <div id="description">
                <Text fw={500} size="sm" mb={4}>Course Description</Text>
                {form.errors.description && (
                  <Text c="red" size="xs" mb={4}>
                    {form.errors.description}
                  </Text>
                )}
                <Box style={{ border: '1px solid #e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                  <RichTextEditorComponent
                    value={form.values.description}
                    onChange={(val) => form.setFieldValue("description", val)}
                  />
                </Box>
              </div>
            </Stack>
          </Paper>

          {/* Actions */}
          <Group justify="flex-end">
            <FButton
              type="submit"
              loading={loading}
              disabled={loading}
              title={"Save and Next"}
              variant="dark"
            />
          </Group>
        </Stack>
      </form>
    </div>
  );
};

export default AddCourse;
