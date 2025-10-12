const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/s3");
require("dotenv").config();

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const BUCKET_URL = process.env.S3_BUCKET_URL;

/**
 * Upload a text file to S3
 * @param {string} fileName - Name of the file in S3
 * @param {string} content - Text content to upload
 * @returns {Promise<Object>} Upload result with file URL
 */
async function uploadTextFile(fileName, content) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: content,
      ContentType: "text/plain",
    });

    await s3Client.send(command);

    const fileUrl = `${BUCKET_URL}/${fileName}`;

    return {
      success: true,
      message: "File uploaded successfully",
      data: {
        fileName,
        fileUrl,
        bucket: BUCKET_NAME,
        size: content.length,
      },
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Upload a dummy test file to S3
 * @returns {Promise<Object>} Upload result
 */
async function uploadDummyFile() {
  const timestamp = new Date().toISOString();
  const fileName = `test-files/dummy-${Date.now()}.txt`;
  const content = `This is a test file uploaded to S3.
Timestamp: ${timestamp}
Service: Athena Backend
Purpose: Testing S3 integration

This file was automatically generated to verify that:
1. AWS credentials are configured correctly
2. S3 bucket permissions are working
3. File upload functionality is operational

If you can read this, the S3 integration is successful!`;

  return uploadTextFile(fileName, content);
}

module.exports = {
  uploadTextFile,
  uploadDummyFile,
};
