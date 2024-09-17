export type ClubProfile = {
  handle: string;
  id: string;
  name: string;
  namespace: string;
  picture: string;
};

export type Club = {
  admins: ClubProfile[];
  categories: string[];
  cover: string;
  description: string;
  handle: string;
  id: string;
  isMember: boolean;
  logo: string;
  moderators: ClubProfile[];
  name: string;
  owner: ClubProfile;
  publication: {
    profile: ClubProfile;
    profileId: string;
    publicationId: string;
  } | null;
  role: "admin" | "member" | "moderator" | "owner";
  totalMembers: number;
};
