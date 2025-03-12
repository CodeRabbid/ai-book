import GenerateForm from "@/components/GenerateForm";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const prequelId = (await params).id;
  return <GenerateForm prequelId={prequelId} />;
};

export default page;
