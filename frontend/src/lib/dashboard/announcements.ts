import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { API_URL } from "../constants";
import { GenericPayload, GetResponse, PostResponse } from "../utils";
import useSWRMutation from "swr/mutation";

export interface Announcement {
  title: string;
  content: string;
}

export interface AnnouncementResponse {
  docs: { id: number; title: string; content: any }[];
}

const getFetcher: Fetcher<AnnouncementResponse> = (url: string) =>
  axios.get(url).then((res) => res.data);

const postFetcher = (
  url: string,
  { arg }: { arg: GenericPayload<Announcement> }
) =>
  axios
    .post(url, JSON.stringify(arg.payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${arg.token}`,
      },
    })
    .then((res) => res.data);

export function useAnnouncements() {
  const { data, error, isLoading } = useSWR<AnnouncementResponse>(
    `${API_URL}/api/announcements?draft=false&depth=1`,
    getFetcher
  );

  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<AnnouncementResponse | undefined>;
}

export function useCreateAnnouncements() {
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/api/announcements`,
    postFetcher
  );

  return {
    trigger,
    isMutating,
  } satisfies PostResponse<Announcement>;
}
