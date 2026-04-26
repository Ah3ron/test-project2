import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentForm from "../components/CommentForm";
import { useCommentFormStore } from "../store";

beforeEach(() => {
  useCommentFormStore.getState().reset();
});

describe("CommentForm", () => {
  it("renders input and submit button", () => {
    render(<CommentForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText("Написать комментарий...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("submit button disabled when input empty", () => {
    render(<CommentForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("submit button enabled when input has text", async () => {
    render(<CommentForm onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText("Написать комментарий...");
    await userEvent.type(input, "Hello");
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("calls onSubmit with trimmed content", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CommentForm onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText("Написать комментарий...");
    await userEvent.type(input, "  Hello  ");
    await userEvent.click(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalledWith("Hello");
  });

  it("does not call onSubmit for whitespace-only input", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CommentForm onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText("Написать комментарий...");
    await userEvent.type(input, "   ");
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("resets input after successful submit", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CommentForm onSubmit={onSubmit} />);
    const input = screen.getByPlaceholderText("Написать комментарий...");
    await userEvent.type(input, "Hello");
    await userEvent.click(screen.getByRole("button"));
    expect(input).toHaveValue("");
  });

  it("disables input when disabled prop true", () => {
    render(<CommentForm onSubmit={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText("Написать комментарий...")).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
