// // src/repositories/UserDatabase.ts

// import { User } from "../types/types.js";
// import { prisma } from "../utils/prismaClient.js";

// /**
//  * Retrieves a user from the database based on the provided ID.
//  * @param userId - The ID of the user.
//  * @returns The user object with additional properties.
//  * @throws Error if the user is not found.
//  */
// export async function getUserFromDatabase(
//   userId: string
// ): Promise<User | null> {
//   const user = await prisma.user.findFirst({
//     where: { id: userId },
//     include: {
//       organizations: true,
//       OrganizationMember: true,
//     },
//   });

//   let organizations;

//   if (user?.OrganizationMember.length != 0) {
//     organizations = await prisma.organization.findMany({
//       where: {
//         id: user?.OrganizationMember[0].organizationId,
//       },
//       include: {
//         tags: true,
//       },
//     });
//   }

//   if (!user) {
//     return null;
//   }

//   const workspaceTags =
//     organizations
//       ?.map((org: any) => org.tags)
//       .flat()
//       .filter((tag: any) => tag.label !== undefined) ?? [];

//   return {
//     ...user,
//     // slug: organizations[0].slug || '',
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     phone: user.phone || "",
//     name: user.name || "",
//     stripeCustomerId: user.stripeCustomerId || "",
//     email: user.email || "",
//     avatar: user.avatar || "",
//     status: user.status || "",
//     workspace:
//       workspaceTags.length > 0
//         ? { tags: workspaceTags.map((tag: any) => tag.label) }
//         : undefined,
//     organizations: user.organizations.map((org: any) => ({
//       ...org,
//       members: [],
//     })),
//     id: user.id,
//     locale: user.locale || "en",
//   };
// }

// interface UserWithOrganization extends User {
//   slug: any;
// }

// /**
//  * Retrieves a user from the database based on their email.
//  * @param email - The email of the user to retrieve.
//  * @returns A Promise that resolves to a UserWithOrganization object if a user is found, or null if no user is found.
//  */
// export async function getUserFromDatabaseByEmail(
//   email: string
// ): Promise<UserWithOrganization | null> {
//   const user = await prisma.user.findFirst({
//     where: { email: email },
//     include: {
//       organizations: {
//         select: {
//           slug: true,
//         },
//       },
//       OrganizationMember: true,
//     },
//   });

//   let memberOrg;
//   let newOrgMember;

//   if (user?.OrganizationMember.length === 0) {
//     newOrgMember = await handleUserInvitation(email, user?.id || "");
//   } else {
//     memberOrg = await prisma.organization.findFirst({
//       where: {
//         id: user?.OrganizationMember[0].organizationId,
//       },
//     });
//   }

//   if (!user) {
//     console.log("No user found with email:", email);
//     return null;
//   }

//   const hasOrganizations =
//     (user.organizations && user.organizations.length > 0) ||
//     user.OrganizationMember.length > 0;

//   let firstSlug;
//   if (user.OrganizationMember.length > 0) {
//     firstSlug = memberOrg?.slug;
//   } else if (user.organizations.length > 0) {
//     firstSlug = user.organizations[0].slug;
//   } else if (newOrgMember) {
//     firstSlug = newOrgMember.slug;
//   }

//   return {
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     phone: user.phone || "",
//     name: user.name || "",
//     email: user.email || "",
//     avatar: user.avatar || "",
//     status: user.status || "",
//     id: user.id,
//     locale: user.locale || "en",
//     slug: firstSlug || "",
//   };
// }

// /**
//  * Retrieves a user from the database based on their email.
//  * @param email - The email of the user to retrieve.
//  * @returns A Promise that resolves to a UserWithOrganization object if a user is found, or null if no user is found.
//  */
// export async function handleUserInvitation(email: string, userId: string) {
//   const invitation = await prisma.invitation.findFirst({
//     where: {
//       email: email,
//     },
//     include: {
//       Organization: true,
//     },
//   });

//   if (!invitation) {
//     console.log("No invitation found for this email:", email);
//     return;
//   }

//   const existingMember = await prisma.organizationMember.findFirst({
//     where: {
//       userId: userId,
//       organizationId: invitation.organizationId,
//     },
//   });

//   // If the user is already a member, do not add them again
//   if (existingMember) {
//     console.log(
//       "User is already a member of the organization:",
//       existingMember
//     );
//     return;
//   }

//   try {
//     const orgMember = await prisma.organizationMember.create({
//       data: {
//         userId: userId,
//         organizationId: invitation.organizationId,
//         roles: ["member"], // Default role as "member"
//       },
//     });

//     const updatedInvitation = await prisma.invitation.update({
//       where: {
//         id: invitation.id,
//       },
//       data: {
//         accepted: true,
//       },
//     });

//     return invitation.Organization;
//   } catch (error) {
//     console.error("Error adding user to organization:", error);
//     throw error;
//   }
// }

// /**
//  * Updates a user in the database.
//  * @param userId - The ID of the user to update.
//  * @param variables - The updated user data.
//  * @returns A Promise that resolves to the updated user.
//  */
// export async function updateUserInDatabase(
//   userId: string,
//   variables: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone?: string;
//     avatar?: string;
//   }
// ): Promise<User> {
//   const { firstName, lastName, email, phone, avatar } = variables;

//   const user = await prisma.user.update({
//     where: { id: userId },
//     data: {
//       firstName,
//       lastName,
//       email,
//       phone,
//       avatar,
//     },
//   });

//   return {
//     ...user,
//     name: `${firstName} ${lastName}`,
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     phone: user.phone || "",
//     email: user.email || "",
//     stripeCustomerId: user.stripeCustomerId || "",
//     avatar: user.avatar || "",
//     status: user.status || "",
//     locale: user.locale || "en",
//   };
// }

// /**
//  * Adds a user to the database.
//  * @param variables - The user data to add.
//  * @returns A Promise that resolves to the added user.
//  */
// export async function addUserInDatabase(variables: {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
// }) {
//   const { firstName, lastName, email, phone, avatar } = variables;
//   const name = `${firstName} ${lastName}`;
//   const user = await prisma.user.create({
//     data: {
//       name,
//       firstName,
//       lastName,
//       email,
//       phone,
//       avatar,
//     },
//   });

//   return {
//     ...user,
//     name: user.name || "",
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     phone: user.phone || "",
//     email: user.email || "",
//     avatar: user.avatar || "",
//     status: user.status || "",
//   };
// }

// /**
//  * Deletes a user from the database.
//  * @param userId - The ID of the user to delete.
//  * @returns A Promise that resolves to the deleted user.
//  */
// export async function deleteUserFromDatabase(userId: string) {
//   try {
//     await prisma.user.delete({
//       where: { id: userId },
//     });

//     return {
//       id: userId,
//     };
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     throw error;
//   }
// }
