"use server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/app/lib/prisma"
import cryptoRandomString from 'crypto-random-string';
import { headers } from "next/headers";
import { checkEdit } from "@/app/lib/permission";
import sizeOf from "image-size";
import sharp from "sharp"
import bs58 from 'bs58'
import { client } from "@/app/lib/redis";

export const fileUpload = async (formData: FormData) => {
    let user = headers().get("x-user-id")
    const editPerm = await checkEdit(user)
    if (!editPerm || !user) {
        return {
            success: false,
            message: "이미지를 업로드할 권한이 없습니다"
        }
    }

    const count = await client.get("img" + user)
    const file = formData.get('file') as File;

    if (count && parseInt(count) > 20) {
        return {
            success: false,
            message: "10분당 20개의 파일만 업로드할 수 있습니다"
        }
    }
    if (["jpeg", "png", "jpg", "gif"].indexOf(file.name.split(".").pop()!) == -1) {
        return {
            success: false,
            message: "이미지 파일만 업로드할 수 있습니다"
        }
    }
    if (file.size > 10485760) {
        return {
            success: false,
            message: "파일이 너무 큽니다"
        }
    }
    try {
        let img = sharp(await file.arrayBuffer())
        const realWidth = (await img.metadata())["width"];
        if (realWidth! > 900) {
            img = img.resize({ width: 900 });
        }
        const ab = await img.webp().toBuffer()
        const { width, height } = sizeOf(new Uint8Array(ab))

        const fileKey = bs58.encode(new Uint8Array((new TextEncoder()).encode(`w${width}h${height}t${Date.now()}`))) + "_" + cryptoRandomString({ length: 16, type: 'alphanumeric' })

        await prisma.img.create({
            data: {
                uploader: {
                    connect: {
                        id: user
                    }
                },
                fileName: file.name,
                fileId: fileKey,
            }
        })
        if (!count) {
            await client.set("img" + user, 1, { EX: 600 })
        } else {
            await client.incr("img" + user)
        }
        const s3 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACC ?? ""}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS ?? "",
                secretAccessKey: process.env.R2_ACCESS_PRIVATE ?? "",
            }
        })
        const result = await s3.send(new PutObjectCommand({
            Bucket: "sciwiki",
            Key: `${fileKey}.webp`,
            Body: new Uint8Array(ab),
            ContentType: "image/webp",
        }))

        if (result.$metadata.httpStatusCode == 200) {
            return {
                success: true,
                message: "",
                url: `https://img.sciwiki.org/${fileKey}.webp`
            }
        } else {
            throw new Error()
        }
    } catch (e) {
        return {
            success: false,
            message: "업로드에 실패했습니다",
        }
    }
}
