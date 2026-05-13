import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { openCreateTaskDialog, setSearch } from "../store/taskUISlice";

export default function SearchBar() {
  const dispatch = useDispatch();
  const search = useSelector((state: RootState) => state.taskUi.search);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <TextField
        size="small"
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        sx={{
          width: {
            xs: "100%",
            md: 420,
          },
          backgroundColor: "white",
        }}
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => dispatch(openCreateTaskDialog())}
      >
        Add Task
      </Button>
    </Box>
  );
}
