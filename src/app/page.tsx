"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [value, setValue] = useState<string>("");
  const trpc = useTRPC();

  const createAi = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: (data) => {
        toast.success("Background job started.");
        console.log("data", data);
      },
      onSettled: () => {
        toast.success("Done");
      },
    })
  );
  return (
    <div className="p-5 flex flex-col gap-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter a value..."
      />

      <Button
        onClick={() => createAi.mutate({ text: value })}
        variant="destructive"
      >
        Run Background Job
      </Button>
    </div>
  );
};

export default Home;
