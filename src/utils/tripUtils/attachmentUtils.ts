import * as DocumentPicker from 'react-native-document-picker';

export const SUPPORTED_DOCUMENT_TYPES = [
  DocumentPicker.types.doc,
  DocumentPicker.types.docx,
  DocumentPicker.types.pdf,
  DocumentPicker.types.xls,
  DocumentPicker.types.xlsx,
  DocumentPicker.types.ppt,
  DocumentPicker.types.pptx,
];

export const SUPPORTED_IMAGE_TYPES = [DocumentPicker.types.images];

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = filename.toLowerCase().slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  return imageExtensions.includes(`.${ext}`);
};

export const filterAttachmentsByType = (attachments: any[], type: 'image' | 'document') => {
  return attachments.filter(attachment => 
    type === 'image' 
      ? isImageFile(attachment.originalFilename)
      : !isImageFile(attachment.originalFilename)
  );
};

export const filterPendingFilesByType = (files: DocumentPicker.DocumentPickerResponse[], type: 'image' | 'document') => {
  return files.filter(file => 
    type === 'image' 
      ? isImageFile(file.name || '')
      : !isImageFile(file.name || '')
  );
}; 