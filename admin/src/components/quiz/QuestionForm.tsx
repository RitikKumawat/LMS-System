import { useEffect } from 'react';
import {
    Button,
    Select,
    TextInput,
    Checkbox,
    Group,
    Stack,
    Text,
    ActionIcon,
    Radio,
    Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { Trash2, Plus } from 'lucide-react';
import RichTextEditorComponent from '../../ui/RichTextEditor/RichTextEditorComponent';
import { CreateOptionInput, CreateQuizQuestionInput, Quiz_Question_Type } from '../../generated/graphql';
import { COLORS } from '../../assets/colors/colors';
import { INITIAL_VALUES } from '../../form/initial-values';
import { VALIDATIONS } from '../../form/validations';

interface QuestionFormProps {
    initialValues?: Partial<CreateQuizQuestionInput>;
    onSubmit: (values: Omit<CreateQuizQuestionInput, 'quiz_id'>) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function QuestionForm({
    initialValues,
    onSubmit,
    onCancel,
    loading,
}: QuestionFormProps) {
    const form = useForm({
        initialValues: INITIAL_VALUES.addQuizQuestion,
        validate: yupResolver(VALIDATIONS.addQuizQuestion),
    });

    useEffect(() => {
        if (initialValues) {
            form.setValues({
                question_text: initialValues.question_text || '',
                type: initialValues.type || Quiz_Question_Type.SingleChoice,
                options: (initialValues.options && initialValues.options.length > 0)
                    ? initialValues.options.map(opt => ({
                        option_text: opt.option_text,
                        is_correct: opt.is_correct
                    }))
                    : [
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                    ]
            });
        }
    }, [initialValues]);

    const handleOptionChange = (index: number, field: 'option_text' | 'is_correct', value: any) => {
        const type = form.values.type;
        if (field === 'is_correct' && type === Quiz_Question_Type.SingleChoice) {
            const newOptions = form.values.options.map((opt, i) => ({
                ...opt,
                is_correct: i === index ? value : false
            }));
            form.setFieldValue('options', newOptions);
        } else if (field === 'is_correct' && type === Quiz_Question_Type.TrueFalse) {
            const newOptions = form.values.options.map((opt, i) => ({
                ...opt,
                is_correct: i === index ? value : false
            }));
            form.setFieldValue('options', newOptions);
        } else {
            form.setFieldValue(`options.${index}.${field}`, value);
        }
    };

    const addOption = () => {
        form.insertListItem('options', { option_text: '', is_correct: false });
    };

    const removeOption = (index: number) => {
        form.removeListItem('options', index);
    };

    const handleTypeChange = (newType: Quiz_Question_Type) => {
        form.setFieldValue('type', newType);
        if (newType === Quiz_Question_Type.TrueFalse) {
            form.setFieldValue('options', [
                { option_text: 'True', is_correct: true },
                { option_text: 'False', is_correct: false },
            ]);
        } else if (form.values.type === Quiz_Question_Type.SingleChoice) {
            form.setFieldValue('options', [
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]);
        } else {
            if (newType === Quiz_Question_Type.SingleChoice) {
                const newOptions = [...form.values.options];
                let foundCorrect = false;
                newOptions.forEach((opt) => {
                    if (opt.is_correct && !foundCorrect) {
                        foundCorrect = true;
                    } else {
                        opt.is_correct = false;
                    }
                });
                form.setFieldValue('options', newOptions);
            }
        }
    };

    const handleSubmit = form.onSubmit((values) => {
        const payload: Partial<CreateQuizQuestionInput> = {
            question_text: values.question_text,
            type: values.type as Quiz_Question_Type,
            options: values.options.map((opt) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct,
            })),
            quiz_id: initialValues?.quiz_id
        };

        if (initialValues?.id) {
            payload.id = initialValues.id;
        }

        onSubmit({
            options: payload.options as CreateOptionInput[],
            question_text: payload.question_text as string,
            type: payload.type as Quiz_Question_Type,
            id: payload.id,
        });
    });

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack gap="md">
                <Select
                    label="Question Type"
                    data={[
                        { value: Quiz_Question_Type.SingleChoice, label: 'Single Choice' },
                        { value: Quiz_Question_Type.MultipleChoice, label: 'Multiple Choice' },
                        { value: Quiz_Question_Type.TrueFalse, label: 'True / False' },
                    ]}
                    {...form.getInputProps('type')}
                    onChange={(val) => handleTypeChange(val as Quiz_Question_Type)}
                    required
                />

                <Stack gap="xs">
                    <Text size="sm" fw={500}>
                        Question Text <span style={{ color: 'red' }}>*</span>
                    </Text>
                    <div
                        style={{
                            border: form.errors.question_text ? '1px solid red' : `1px solid ${COLORS.blueHover}`,
                            borderRadius: 4,
                            overflow: 'hidden',
                        }}
                    >
                        <RichTextEditorComponent
                            value={form.values.question_text}
                            onChange={(val) => form.setFieldValue('question_text', val)}
                        />
                    </div>
                    {form.errors.question_text && (
                        <Text c="red" size="xs">{form.errors.question_text as string}</Text>
                    )}
                </Stack>

                <Stack gap="sm">
                    <Group justify="space-between">
                        <Text size="sm" fw={500}>
                            Options
                        </Text>
                        {form.values.type !== Quiz_Question_Type.TrueFalse && (
                            <Button
                                size="xs"
                                variant="light"
                                onClick={addOption}
                                leftSection={<Plus size={14} />}
                            >
                                Add Option
                            </Button>
                        )}
                    </Group>
                    {form.errors.options && typeof form.errors.options === 'string' && (
                        <Text c="red" size="xs">{form.errors.options}</Text>
                    )}

                    {form.values.options.map((option, index) => (
                        <Group key={index} align="flex-start" wrap="nowrap">
                            <Box mt={6}>
                                {form.values.type === Quiz_Question_Type.MultipleChoice ? (
                                    <Checkbox
                                        checked={option.is_correct}
                                        onChange={(event) =>
                                            handleOptionChange(index, 'is_correct', event.currentTarget.checked)
                                        }
                                    />
                                ) : (
                                    <Radio
                                        checked={option.is_correct}
                                        onChange={() => handleOptionChange(index, 'is_correct', true)}
                                    />
                                )}
                            </Box>

                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={`Option ${index + 1}`}
                                {...form.getInputProps(`options.${index}.option_text`)}
                                disabled={form.values.type === Quiz_Question_Type.TrueFalse}
                            />

                            {form.values.type !== Quiz_Question_Type.TrueFalse && form.values.options.length > 2 && (
                                <ActionIcon mt={6} color="red" onClick={() => removeOption(index)} variant="subtle">
                                    <Trash2 size={16} />
                                </ActionIcon>
                            )}
                        </Group>
                    ))}
                </Stack>

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        {(initialValues as any)?._id ? 'Update Question' : 'Save Question'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
