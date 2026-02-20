import React, { useState } from 'react';
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
} from '@mantine/core';
import { Trash2, Plus } from 'lucide-react';
import RichTextEditorComponent from '../../ui/RichTextEditor/RichTextEditorComponent';
import { CreateQuizQuestionInput } from '../../generated/graphql';
import { COLORS } from '../../assets/colors/colors';

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
    const [questionText, setQuestionText] = useState(initialValues?.question_text || '');
    const [type, setType] = useState<string>(initialValues?.type || 'single');
    const [options, setOptions] = useState(
        initialValues?.options && initialValues.options.length > 0
            ? initialValues.options
            : [
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]
    );

    const handleOptionChange = (index: number, field: 'option_text' | 'is_correct', value: any) => {
        const newOptions = [...options];

        if (field === 'is_correct' && type === 'single') {
            newOptions.forEach((opt, i) => {
                opt.is_correct = i === index ? value : false;
            });
        } else if (field === 'is_correct' && type === 'true_false') {
            newOptions.forEach((opt, i) => {
                opt.is_correct = i === index ? value : false;
            });
        } else {
            newOptions[index] = { ...newOptions[index], [field]: value };
        }

        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { option_text: '', is_correct: false }]);
    };

    const removeOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleTypeChange = (newType: string) => {
        setType(newType);
        if (newType === 'true_false') {
            setOptions([
                { option_text: 'True', is_correct: true },
                { option_text: 'False', is_correct: false },
            ]);
        } else if (type === 'true_false') {
            setOptions([
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]);
        } else {
            if (newType === 'single') {
                const newOptions = [...options];
                let foundCorrect = false;
                newOptions.forEach((opt) => {
                    if (opt.is_correct && !foundCorrect) {
                        foundCorrect = true;
                    } else {
                        opt.is_correct = false;
                    }
                });
                setOptions(newOptions);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            question_text: questionText,
            type: type,
            options: options.map((opt) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct,
            })),
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack gap="md">
                <Select
                    label="Question Type"
                    data={[
                        { value: 'single', label: 'Single Choice' },
                        { value: 'multiple', label: 'Multiple Choice' },
                        { value: 'true_false', label: 'True / False' },
                    ]}
                    value={type}
                    onChange={(val) => handleTypeChange(val as string)}
                    required
                />

                <Stack gap="xs">
                    <Text size="sm" fw={500}>
                        Question Text <span style={{ color: 'red' }}>*</span>
                    </Text>
                    <div
                        style={{
                            border: `1px solid ${COLORS.blueHover}`,
                            borderRadius: 4,
                            overflow: 'hidden',
                        }}
                    >
                        <RichTextEditorComponent value={questionText} onChange={setQuestionText} />
                    </div>
                </Stack>

                <Stack gap="sm">
                    <Group justify="space-between">
                        <Text size="sm" fw={500}>
                            Options
                        </Text>
                        {type !== 'true_false' && (
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

                    {options.map((option, index) => (
                        <Group key={index} align="center" wrap="nowrap">
                            {type === 'multiple' ? (
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

                            <TextInput
                                style={{ flex: 1 }}
                                placeholder={`Option ${index + 1}`}
                                value={option.option_text}
                                onChange={(event) =>
                                    handleOptionChange(index, 'option_text', event.currentTarget.value)
                                }
                                required
                                disabled={type === 'true_false'}
                            />

                            {type !== 'true_false' && options.length > 2 && (
                                <ActionIcon color="red" onClick={() => removeOption(index)} variant="subtle">
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
                    <Button type="submit" loading={loading} disabled={!questionText}>
                        Save Question
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
