import AIChatInterface from "../main";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <AIChatInterface />
    </ProtectedRoute>
  );
}
