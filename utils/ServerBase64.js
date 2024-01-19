export const handleImageConversion = async (imageFile) => {
    try {
        const file = await imageFile;
        const buffer = await file.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');

        // Check if base64String is not empty before adding the prefix
        const prefixedBase64String = base64String ? `data:image/png;base64,${base64String}` : '';

        return prefixedBase64String;
    } catch (error) {
        console.error("Error converting image to base64:", error);
        throw error;
    }
};