import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, length } = req.body;
    const free_usage = req.free_usage;
    const plan = req.plan;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit exceeded. Please upgrade to premium plan.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, ${prompt}, ${content},'article')`;

    if (plan != "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
      req.free_usage = free_usage + 1;
    }

    res.json({ success: true, content });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt } = req.body;
    const free_usage = req.free_usage;
    const plan = req.plan;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Free usage limit exceeded. Please upgrade to premium plan.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, ${prompt}, ${content},'blog-title')`;

    if (plan != "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
      req.free_usage = free_usage + 1;
    }

    res.json({ success: true, content });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This Feature is only available for premium user to unlock this tool Subscribe our premium plan.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer", //return data as a binary buffer.
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id, prompt, content,type,publish) VALUES (${userId}, ${prompt}, ${secure_url},'image',${
      publish ?? false
    })`;

    res.json({ success: true, content: secure_url });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This Feature is only available for premium user to unlock this tool Subscribe our premium plan.",
      });
    }
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: {
        effect: "background_removal",
        background_removal: "remove_the_background",
      },
    });

    await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, 'Remove background from the image', ${secure_url},'image')`;

    res.json({ success: true, content: secure_url });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { object } = await req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This Feature is only available for premium user to unlock this tool Subscribe our premium plan.",
      });
    }
    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl},'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message:
          "This Feature is only available for premium user to unlock this tool Subscribe our premium plan.",
      });
    }
    if (resume.size > 5 * 1024 * 1024) {
      //should be atmost of 5mb file
      return res.json({
        success: false,
        message: "Uploaded Resume file size exceeds allowed size (5MB).",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    //parse the resume to extract this
    const pdfdata = await pdf(dataBuffer);
    // generate the prompt

    const prompt = `Review my resume and suggest improvements to make it more effective for job applications & provide constructive feedback on strength, weaknesses & area of improvements. Resume content: ${pdfdata.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content,type) VALUES (${userId}, 'Review the uploaded Resume', ${content},'resume-review')`;

    res.json({ success: true, content });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
