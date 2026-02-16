"use client";

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Center, Loader, Text, Group, Button, Box } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Use standard worker setup for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface LessonPDFViewerProps {
    url: string;
}

export default function LessonPDFViewer({ url }: LessonPDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <Center p="xl">
                        <Loader size="sm" />
                    </Center>
                }
                error={<Text c="red" size="sm" ta="center" p="md">Failed to load PDF. Please try downloading it instead.</Text>}
                onLoadError={(error) => console.error("PDF Load Error:", error)}
            >
                <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={800}
                />
            </Document>

            {!loading && numPages > 0 && (
                <Group mt="md" mb="md">
                    <Button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(prev => prev - 1)}
                        variant="default"
                        size="xs"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <Text size="sm">
                        Page {pageNumber} of {numPages}
                    </Text>
                    <Button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(prev => prev + 1)}
                        variant="default"
                        size="xs"
                    >
                        <ChevronRight size={16} />
                    </Button>
                </Group>
            )}
        </Box>
    );
}
