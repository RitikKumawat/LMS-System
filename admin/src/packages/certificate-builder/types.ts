export interface CertificateElement {
    id: string;
    type: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
}

export interface CertificateTemplateJSON {
    background_image?: string;
    elements: CertificateElement[];
}

export interface CertificateBuilderProps {
    initialTemplate?: CertificateTemplateJSON;
    availablePlaceholders: { key: string; label: string }[];
    onSave: (templateJSON: CertificateTemplateJSON) => Promise<void>;
    onCancel?: () => void;
    uploadImageFn: (file: File) => Promise<string>;
}
