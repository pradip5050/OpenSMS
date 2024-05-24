import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { API_URL } from "../constants";
import { GetResponse } from "../utils";

export interface Announcement {
  title: string;
  content: string;
}

const fetcher: Fetcher<Announcement> = (url: string) =>
  axios.get(url).then((res) => res.data);

export function useAnnouncements() {
  const { data, error, isLoading } = useSWR<Announcement>(
    `${API_URL}/api/announcements?draft=false&depth=1`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<Announcement | undefined>;
}
