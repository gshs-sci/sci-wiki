"use server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/app/lib/prisma"
import crypto from "crypto"
import { headers } from "next/headers";
import { checkEdit } from "@/app/lib/permission";


export const fileUpload = async (formData: FormData) => {

    let user = headers().get("x-user-id")
    const editPerm = await checkEdit(user)
    if(!editPerm || !user) {
        return {
            success:false,
            message:"이미지를 업로드할 권한이 없습니다"
        }
    }

    const file = formData.get('file') as File;
    const fileKey = crypto.randomBytes(16).toString('hex');
    if(["jpeg","png","jpg","gif"].indexOf(file.name.split(".").pop()!)==-1) {
        return {
            success:false,
            message:"이미지 파일만 업로드할 수 있습니다"
        }
    }
    if(file.size>10485760) {
        return {
            success:false,
            message:"파일이 너무 큽니다"
        }
    }

    await prisma.img.create({
        data:{
            uploader:{
                connect:{
                    id:user
                }
            },
            fileName:file.name,
            fileId:fileKey,
        }
    })
    try{
        const s3 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACC}.r2.cloudflarestorage.com`,
            credentials: {
              accessKeyId: process.env.R2_ACCESS,
              secretAccessKey: process.env.R2_ACCESS_PRIVATE,
            }
        })
        const ab = await file.arrayBuffer()
        const result = await s3.send(new PutObjectCommand({
            Bucket:"sciwiki",
            Key:`${fileKey}.${file.name.split(".").pop()}`,
            Body: new Uint8Array(ab),
            ContentType:file.type,
        }))

        if(result.$metadata.httpStatusCode == 200) {
            return {
                success:true,
                message:"",
                url:`https://img.sciwiki.org/${fileKey}.${file.name.split(".").pop()}`
            }
        }else {
            throw new Error()
        }
    }catch(e) {
        return {
            success:false,
            message:"업로드에 실패했습니다",
        }
    }
}
