import { Container } from "@mui/material";
import KanbanBoard from "./features/tasks/components/KanbanBoard";

export default function App() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <KanbanBoard />
    </Container>
  );
}
