import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { API_URL } from "../constants";
import { GenericPayload, GetResponse, PostResponse } from "../utils";
import useSWRMutation from "swr/mutation";

export interface AnnouncementPayload {
  title: string;
  content: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: any;
  contentHtml: string;
  createdAt: string;
}

// TODO: Change to Announcement
export interface AnnouncementResponse {
  docs: Announcement[];
}

const getFetcher: Fetcher<AnnouncementResponse> = (url: string) =>
  axios.get(url).then((res) => res.data);

const postFetcher = (
  url: string,
  { arg }: { arg: GenericPayload<AnnouncementPayload> }
) =>
  axios
    .post(url, JSON.stringify(arg.payload), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arg.token}`,
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

export function mapAnnouncements(announcement: Announcement): Announcement {
  const date = new Date(`${announcement.createdAt}`);

  const minutes = date.getMinutes();
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return {
    ...announcement,
    createdAt: `${date.toDateString()} | ${date.getHours()}:${minutesString}`,
  };
}

export function useCreateAnnouncements() {
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/api/announcements`,
    postFetcher
  );

  return {
    trigger,
    isMutating,
  } satisfies PostResponse<AnnouncementPayload>;
}
