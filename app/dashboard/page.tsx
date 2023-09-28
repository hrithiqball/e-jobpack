"use client";

import { Result } from "@/lib/result";
import { asset } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import Nav from "../components/Nav";

export default function Dashboard() {
  const [asset, setAsset] = useState<asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const response: Response = await fetch("/api/asset", { method: "GET" });
    const result: Result<asset[]> = await response.json();

    if (response.status === 200) {
      setAsset(result.data!);
      console.log(result.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.log(result.message);
    }
  };

  return (
    <div>
      <Nav />

      <Button
        color="primary"
        radius="sm"
        onClick={fetchData}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Fetch Assets"}
      </Button>

      <ul>
        {asset.map((asset) => (
          <li key={asset.uid}>{asset.name}</li>
        ))}
      </ul>
    </div>
  );
}
