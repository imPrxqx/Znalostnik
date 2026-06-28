export interface Session {
  id: string;
  accessCode: string;
  status: string;
  respondType: string;
  gameMode: string;
  gameState: any;
}

export interface SessionUser {
  id: string;
  userName: string;
  team: string | undefined;
}

export interface Team {
  id: string;
  teamName: string;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: string;
  userName: string;
}
