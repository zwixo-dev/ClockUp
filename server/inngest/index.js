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

const syncWorkspaceCreation = inngest.createFunction(
    { id: "sync-workspace-from-clerk", triggers: [{ event: "clerk/organization.created" }] },
    async ({ event }) => {
        const { data } = event;

        // Create the Workspace
        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                ownerId: data.created_by,
                image_url: data.image_url
            }
        });

        // 2. Add Admin Member 
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: "ADMIN"
            }
        });
    }
);

// update the workspace

const syncWorkspaceUpdate = inngest.createFunction(
    { id: "update-workspace-from-clerk", triggers: [{ event: "clerk/organization.updated" }] },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.update({
            where: {
                id: data.id
            },
            data: {
               name: data.name,
               slug: data.slug,
               image_url: data.image_url,
            }
        })
    }
);

// delete workspace

const syncWorkspaceDeletion = inngest.createFunction(
    { id: "delete-workspace-with-clerk", triggers: [{ event: "clerk/organization.deleted" }] },
    async ({ event }) => {
        const { data } = event;
        
        await prisma.workspace.delete({
            where: {
                id: data.id
            }
        });
    }
);

// add member to a workSpace
const syncWorkspaceMemberCreation =  inngest.createFunction(
    { id: "sync-workspace-member-from-clerk", triggers: [{ event: "clerk/organizationInvitation.accepted" }] },

    async ({event}) => {
       const { data } = event;

       await prisma.workspaceMember.create({
        data :{
            userId: data.user_id,
            workspaceId: data.organization_id,
            role: String(data.role).toUpperCase()
        }
       })

    }
);

// export the functions
export const functions = [syncUserCreation, syncUserDeletion, syncUseUpdation,
    syncWorkspaceCreation, syncWorkspaceUpdate, syncWorkspaceDeletion, syncWorkspaceMemberCreation
];