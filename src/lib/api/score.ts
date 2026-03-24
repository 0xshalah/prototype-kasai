import { ApiResponse } from "./transaction";

export type ScoreFactor = {
  id: string;
  name: string;
  delta: number;
};

export type ScoreSnapshotData = {
  totalScore: number;
  baseScore?: number;
  factors: ScoreFactor[];
};

export async function getScoreSnapshot(): Promise<ApiResponse<ScoreSnapshotData>> {
  const res = await fetch("/api/score", {
    method: "GET",
    cache: "no-store",
  });
  return res.json();
}
