import { signIn } from "@/auth";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <form
        className="inline bg-black text-white p-3 m-2"
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button type="submit">Continue with GitHub</button>
      </form>
    </div>
  );
};

export default page;
