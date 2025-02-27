/**
 * Formats file size into human readable format
 * @param bytes File size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Gets file extension from filename or path
 * @param filename Filename or path
 * @returns File extension without dot
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

/**
 * Gets file type based on extension
 * @param filename Filename or path
 * @returns File type category
 */
export const getFileType = (filename: string): string => {
  const ext = getFileExtension(filename);
  
  const types = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    video: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
    audio: ['mp3', 'wav', 'ogg', 'm4a'],
  };

  for (const [type, extensions] of Object.entries(types)) {
    if (extensions.includes(ext)) return type;
  }

  return 'other';
};

/**
 * Gets icon name for file type (for MaterialIcons)
 * @param filename Filename or path
 * @returns MaterialIcons icon name
 */
export const getFileIcon = (filename: string): string => {
  const type = getFileType(filename);
  
  const icons = {
    image: 'image',
    document: 'description',
    video: 'videocam',
    audio: 'audiotrack',
    other: 'insert-drive-file',
  };

  return icons[type as keyof typeof icons];
};

/**
 * Validates file size
 * @param size File size in bytes
 * @param maxSize Maximum allowed size in MB
 * @returns Boolean indicating if file size is valid
 */
export const isValidFileSize = (size: number, maxSize: number = 5): boolean => {
  const maxBytes = maxSize * 1024 * 1024; // Convert MB to bytes
  return size <= maxBytes;
}; 