// Setup Cloudinary URL generator
// Add VITE_CLOUDINARY_CLOUD_NAME to your environment variables

export const getCloudinaryUrl = (publicId: string, options?: { w?: number, h?: number, crop?: string }) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
  let transformations = '';
  
  if (options) {
    const { w, h, crop } = options;
    const parts = [];
    if (w) parts.push(`w_${w}`);
    if (h) parts.push(`h_${h}`);
    if (crop) parts.push(`c_${crop}`);
    if (parts.length > 0) {
      transformations = parts.join(',') + '/';
    }
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
};

export const uploadToCloudinary = async (file: File) => {
  // To upload files directly from client side, you need an upload preset
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
      console.warn("Cloudinary is not configured. Missing environment variables.");
      return null;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};
