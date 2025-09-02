const { v2: cloudinary } = require("cloudinary");
const { NextResponse } = require("next/server");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image"); // match with frontend
    const folderName = formData.get("folderName") || "blogs";

    if (!file) {
      return NextResponse.json(
        { msg: "File not found", statusCode: 404 },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      msg: "File uploaded to Cloudinary",
      url: result.secure_url,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "Error in fileupload route", error: error.message, statusCode: 500 },
      { status: 500 }
    );
  }
}

module.exports = { POST };
