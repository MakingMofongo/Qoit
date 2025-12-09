// Next.js 15+ page props - params and searchParams are now Promises
export type PageProps = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

