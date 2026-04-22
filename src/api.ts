import axios from "axios";
import type { Pagination, Tender } from "./types";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const fetchTenders = async (
  pagination: Pagination
): Promise<{
  pagination: { skip: number; take: number };
  results: Tender[];
}> => {
  const res = await api.post("/tenders/search", {
    pagination,
  });

  return res.data;
};
