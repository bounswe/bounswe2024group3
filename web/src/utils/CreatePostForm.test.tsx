// CreatePostForm.test.tsx
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import CreatePostForm from "../components/CreatePostForm";
import { req } from "./client";

jest.mock("../utils/client", () => ({
  req: jest.fn(),
}));

const mockReq = req as jest.MockedFunction<typeof req>;

describe("CreatePostForm Component", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Set up Axios mock adapter
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset Axios mock adapter
    mock.reset();
    mock.restore();
  });

  it("should open the modal when the '+' button is clicked", () => {
    render(<CreatePostForm />);
    const openModalButton = screen.getByText("+");
    fireEvent.click(openModalButton);
    expect(screen.getByText("Create a New Post")).toBeInTheDocument();
  });

  it("should call req with correct data when form is submitted", async () => {
    render(<CreatePostForm initialLink="https://open.spotify.com/track/7x76RN4ZCsw5DxT8LOmexq" />);
    const openModalButton = screen.getByText("+");
    fireEvent.click(openModalButton);

    const commentInput = screen.getByLabelText("Comment:");
    fireEvent.change(commentInput, { target: { value: "This is a test comment" } });

    const submitButton = screen.getByText("Create Post");
    fireEvent.click(submitButton);

    expect(mockReq).toHaveBeenCalledWith("create-post", "post", {
      link: "https://open.spotify.com/track/7x76RN4ZCsw5DxT8LOmexq",
      comment: "This is a test comment",
      image: "",
      latitude: 0,
      longitude: 0,
    });
  });

  it("should close the modal when the 'Cancel' button is clicked", () => {
    render(<CreatePostForm />);
    const openModalButton = screen.getByText("+");
    fireEvent.click(openModalButton);
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(screen.queryByText("Create a New Post")).not.toBeInTheDocument();
  });
});
