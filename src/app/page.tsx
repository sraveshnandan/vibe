import { Button } from "@/components/ui/button";
import { caller } from "@/trpc/server";

const Home = async () => {
  const { message } = await caller.createAi({ name: "Sravesh" });
  console.log(message);
  return (
    <>
      <Button variant={"link"}>{JSON.stringify(message)}</Button>
    </>
  );
};

export default Home;
