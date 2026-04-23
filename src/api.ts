import axios from "axios";
import type { Pagination, Tender } from "./types";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const saveInteraction = async (
  tenderId: number,
  decisionStatus: "TO_ANALYZE" | "REJECTED"
): Promise<void> => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // throw new Error("Fake API Error");
  await api.post("/interactions/decisionStatus", { tenderId, decisionStatus });
};

export const fetchTenders = async (
  pagination: Pagination
): Promise<{
  pagination: { skip: number; take: number };
  results: Tender[];
}> => {
  // Small delay to see the scroll infinite loading
  // await new Promise((resolve) => setTimeout(resolve, 1500));
  const res = await api.post("/tenders/search", pagination);

  return res.data;
};
