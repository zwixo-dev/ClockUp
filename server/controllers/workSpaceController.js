import prisma from "../configs/prisma.js";

// get all the workSpaces
export const getUserWorkSpaces = async (req, res) => {
    try {
        const { userId } = req.auth; // FIXED: Changed 'await req.auth()' to 'req.auth'
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: { some: { userId: userId } },
            },
            include: {
                members: { include: { user: true } },
                projects: {
                    include: {
                        tasks: {
                            include: {
                                assignee: true,
                                comments: { include: { user: true } }
                            }
                        },
                        members: { include: { user: true } }
                    }
                },
                owner: true
            }
        });
        res.json({ workspaces })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// add the member to the workSpace 

export const addMember = async (req, res) => {
    try {
        const { userId } = req.auth; // FIXED: Changed 'await req.auth()' to 'req.auth'
        const { email, role, workspaceId, message } = req.body;

        // if the use exist

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "user not found !" });
        }

        if (!workspaceId || !role) {
            return res.status(400).json({ message: "Missing required params!" });
        }

        if (!["ADMIN", "MEMBER"].includes(role)) {
            return res.status(400).json({ message: "Invalid role!" });
        }

        // fetching workspace

        const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId }, include: { members: true } });

        if (!workspace) {
            return res.status(404).json({ message: "workspace not found !" });
        }

        // if the creator has admin role

        if (!workspace.members.find((member) => { return member.userId == userId && member.role == "ADMIN" })) {
            return res.status(401).json({ message: "you don't have ADMIN access !" });
        }

        // testing if the user already

        const memberExist = workspace.members.find((member) => { return member.userId === user.id });

        if (memberExist) {
            return res.status(400).json({ message: "user is already a member !" });
        }

        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId,
                role,
                message
            }
        });
        return res.status(201).json({ member, message: "member added successfuly" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}