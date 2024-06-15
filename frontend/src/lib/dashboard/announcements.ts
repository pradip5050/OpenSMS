import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../constants";

export interface AnnouncementPayload {
  title: string;
  content: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: any;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementResponse {
  docs?: Announcement[];
}

export const announcementsUrl = `${API_URL}/api/announcements`;

export function getFormattedDatetime(date: Date): {
  date: string;
  hours: string;
  minutes: string;
} {
  const minutes = date.getMinutes();
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return {
    date: date.toDateString(),
    hours: date.getHours().toString(),
    minutes: minutesString,
  };
}

export async function deleteAnnouncements(
  url: string,
  token?: string,
  id?: string
): Promise<{ result?: AxiosResponse; error?: AxiosError }> {
  try {
    const result = await axios.delete(`${url}/${id ?? ""}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { result };
  } catch (error) {
    return { error: error as AxiosError };
  }
}
