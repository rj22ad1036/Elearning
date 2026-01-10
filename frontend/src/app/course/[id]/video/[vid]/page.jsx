import Notes from "@/components/Note";

export default function VideoPage({ params }) {
  const { vid } = params;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <div className="col-span-2">{/* video player here */}</div>
      <div className="col-span-1">
        <Notes videoId={vid} />
      </div>
    </div>
  );
}
