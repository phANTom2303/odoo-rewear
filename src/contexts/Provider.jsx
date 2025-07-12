"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

const Provider = ({ children }) => {
  const router = useRouter();
  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
};

export default Provider;
