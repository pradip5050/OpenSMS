import { API_URL } from "@/lib/constants";
import { coursesUrl } from "@/lib/dashboard/courses";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(coursesUrl, () => {
    return new HttpResponse(null, { status: 403, statusText: "Unauthorized" });
  }),
];
