import { createSlice } from "@reduxjs/toolkit";
import { submitFeedback } from "@/action/api";

export interface FeedbackState {
  feedback: { [messageId: string]: "up" | "down" | null };
}

const initialState: FeedbackState = {
  feedback: {},
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    updateFeedback: (state, action) => {
      const { messageId, feedback } = action.payload;
      state.feedback[messageId] = feedback;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.fulfilled, (state, action) => {
        const { messageId, feedback } = action.payload;
        if (messageId && feedback) {
          state.feedback[messageId] = feedback;
        } else {
          console.error("Invalid feedback payload:", action.payload);
        }
      })
      .addCase(submitFeedback.rejected, () => {
        console.error("Feedback submission failed:");
      });
  },
});

export const { updateFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
