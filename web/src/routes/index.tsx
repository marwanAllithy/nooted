import { createFileRoute } from "@tanstack/react-router";
import EditorComponent from "@/components/Editor/Editor";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="p-6">
      <EditorComponent />
    </div>
  );
}
