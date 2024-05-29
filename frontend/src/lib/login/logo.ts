import axios from "axios";
import { API_URL } from "../constants";
import useSWR, { Fetcher } from "swr";
import { GetResponse } from "../utils";

export interface Logo {
  id: number;
  image: {
    alt: string;
    url: string;
  };
}

const fetcher: Fetcher<Logo> = (url: string) =>
  axios.get(url).then((res) => res.data);

// TODO: Create local image instead of URL
export const placeholderUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";

export function useLogo() {
  const { data, error, isLoading } = useSWR<Logo>(
    `${API_URL}/api/globals/logo?locale=undefined&draft=false&depth=1`,
    fetcher,
    { revalidateIfStale: false }
  );

  return {
    data,
    error,
    isLoading,
  } satisfies GetResponse<Logo | undefined>;
}

export function mapLogo(logoModel: Logo): Logo {
  let url: string | undefined = logoModel?.image?.url;

  return {
    ...logoModel,
    image: {
      ...logoModel.image,
      url: url ? `${API_URL}${url}` : placeholderUrl,
    },
  };
}
