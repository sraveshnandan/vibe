"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [value, setValue] = useState<string>("");
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.createAi.mutationOptions({
      onSuccess: () => {
        toast.success("Job started.");
      },
    })
  );
  console.log(value);
  return (
    <div className="p-5">
      <Input value={value} onChange={(e: any) => setValue(e.target.value)} />
      <Button
        variant={"destructive"}
        disabled={invoke.isPending}
        onClick={() => {
          invoke.mutate({ name: "Sravesh" });
        }}
      >
        Run Background Job
      </Button>
    </div>
  );
};

export default Home;
