import { Activity } from './activity';
import { ActivityAnswer } from './activity-answer';

export interface Session {
  id: string;
  accessCode: string;
  title: string;
  status: string;
  createdAt: string;
  respondType: string;
  gameMode: string;
  gameSetting: GameSetting;
  gameState: any;
  exerciseId: string;
}

export interface SessionReport {
  id: string;
  title: string;
  activities: Activity[];
  answers: ActivityAnswer[];
  participants: Participant[];
}

export interface GameSetting {
  roundTime: number;
  selectionAlgorithm: string;
  scoringMode: string;
}

export interface SessionUser {
  id: string;
  userName: string;
  team: string | undefined;
}

export interface Participant {
  id: string;
  name: string;
  team: string | undefined;
}

export interface Team {
  id: string;
  name: string;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: string;
  userName: string;
}
