import {
  Metadata,
  mapMetadata,
  placeholderUrl,
  useMetadata,
} from "@/lib/login/metadata";
import Image from "next/image";
import Spinner from "../Spinner";

export default function LogoImage() {
  const { data, error, isLoading } = useMetadata();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="50" />
      </div>
    );
  }

  if (error) {
    return (
      <Image
        src={placeholderUrl}
        alt="Image"
        width="1920"
        height="1080"
        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    );
  }

  return (
    <Image
      src={mapMetadata(data!).logo.url}
      alt="Image"
      width="1920"
      height="1080"
      className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
    />
  );
}
