/**
 * Upload an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Cloudinary configuration
    const cloudName = 'dqhbkex3f'; // Your Cloudinary cloud name
    const uploadPreset = 'ml_default'; // Your upload preset (you may need to create this in Cloudinary)

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'readian-books'); // Optional: organize uploads in a folder

    console.log('📤 Uploading to Cloudinary...');
    console.log('Cloud Name:', cloudName);
    console.log('Upload Preset:', uploadPreset);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Cloudinary error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    console.log('✅ Cloudinary response:', data);

    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error('❌ Upload to Cloudinary failed:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};
