import prisma from "../configs/prisma.js";
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "ClockUp" });


// saving use data 
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses?.[0]?.email_address,
                name: (data?.first_name || "") + " " + (data?.last_name || ""),
                image: data?.image_url,
            }
        });
    }
);


// delete user 
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.delete({
            where: {
                id: data.id
            }
        });
    }
);


// update use data
const syncUseUpdation = inngest.createFunction(
    { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
    async ({ event }) => {
        const { data } = event;
        await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                email: data?.email_addresses?.[0]?.email_address,
                name: (data?.first_name || "") + " " + (data?.last_name || ""),
                image: data?.image_url,
            }
        });
    }
);


export const functions = [syncUserCreation, syncUserDeletion, syncUseUpdation];