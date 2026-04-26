import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../components/StatusBadge";

describe("StatusBadge", () => {
  it('renders planned label "Запланирован"', () => {
    render(<StatusBadge status="planned" />);
    expect(screen.getByText("Запланирован")).toBeInTheDocument();
  });

  it('renders active label "В работе"', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("В работе")).toBeInTheDocument();
  });

  it('renders completed label "Завершён"', () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText("Завершён")).toBeInTheDocument();
  });

  it("applies badge-success class for completed", () => {
    render(<StatusBadge status="completed" />);
    const badge = screen.getByText("Завершён");
    expect(badge.className).toContain("badge-success");
  });

  it("applies badge-primary class for planned", () => {
    render(<StatusBadge status="planned" />);
    const badge = screen.getByText("Запланирован");
    expect(badge.className).toContain("badge-primary");
  });

  it("applies badge-secondary class for active", () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText("В работе");
    expect(badge.className).toContain("badge-secondary");
  });

  it("has whitespace-nowrap class", () => {
    render(<StatusBadge status="planned" />);
    expect(screen.getByText("Запланирован").className).toContain("whitespace-nowrap");
  });
});
