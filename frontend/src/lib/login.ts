import axios, { AxiosError } from "axios";
import { API_URL } from "./constants";
import useSWR, { Fetcher } from "swr";

export interface Response<T> {
  data: T;
  error: AxiosError | undefined;
  isLoading: boolean;
}

export interface Logo {
  id: number;
  logo: {
    alt: string;
    url: string;
  };
}

const fetcher: Fetcher<Logo> = (url: string) =>
  axios.get(url).then((res) => res.data);

export async function signIn(name: string, password: string) {}

export const placeholderUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";

export function useLogo() {
  const { data, error, isLoading } = useSWR<Logo>(
    `${API_URL}/api/globals/loginlogo?locale=undefined&draft=false&depth=1`,
    fetcher
  );

  console.log(JSON.stringify(data));

  return {
    data,
    error,
    isLoading,
  } satisfies Response<Logo | undefined>;
}

export function mapLogo(logoModel: Logo): Logo {
  let url: string | undefined = logoModel?.logo?.url;

  return {
    ...logoModel,
    logo: {
      ...logoModel.logo,
      url: url ? `${API_URL}${url}` : placeholderUrl,
    },
  };
}
