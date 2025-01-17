import React, { useEffect } from "react";
import { Card, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useQuill } from "react-quilljs";
import { useDispatch, useSelector } from "react-redux";
import { updateStepThree } from "../../redux/slices/createInterviewSlice";
import { RootState } from "../../redux/store";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const StepThree: React.FC = () => {
  const dispatch = useDispatch();
  const { description } = useSelector((state: RootState) => state.createInterview.stepThree);
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    },
  });

  useEffect(() => {
    if (quill) {
      // Set the initial content only if it differs
      if (quill.root.innerHTML !== description) {
        quill.clipboard.dangerouslyPasteHTML(description || "");
      }

      // Debounced handler for text changes
      const handleTextChange = debounce(() => {
        const currentContent = quill.root.innerHTML;
        if (currentContent.trim() === "<p><br></p>" || !currentContent.trim()) {
          toast.error("Description is required in Step Three.");
        }
        dispatch(updateStepThree(currentContent));
      }, 300);

      quill.on("text-change", handleTextChange);

      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, description, dispatch]);

  return (
    <div className="mt-10">
      <Grid container spacing={2}>
        <Grid size={12}>
          <Card>
            <div style={{ height: "100%", marginTop: "10px" }}>
              <div ref={quillRef} style={{ height: 250, overflow: "hidden" }} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(StepThree);
