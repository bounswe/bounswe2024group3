import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Profile from "./profile";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Profile Component", () => {
  const mockRouterReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
    });
    jest.clearAllMocks();
  });

  it("shows loading spinner initially", async () => {
    const { getByTestId } = render(<Profile />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders user data when available", async () => {
    const mockUserData = JSON.stringify({
      user_id: 5,
      name: "Abdul",
      surname: "Gules",
      email: "abdul@example.com",
      labels: ["artist", "organizer"],
    });
  
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockUserData);
  
    const { getByText, getByTestId } = render(<Profile />);
  
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith("userData"));
    
    // Use regex for partial matches to handle formatting issues
    expect(getByText(/Welcome to your profile, Abdul Gules!/)).toBeTruthy();
    expect(getByText(/User ID:/)).toBeTruthy();
    expect(getByText(/5/)).toBeTruthy(); // Updated this line
    expect(getByText(/Email:/)).toBeTruthy();
    expect(getByText(/abdul@example.com/)).toBeTruthy();
    expect(getByText(/artist/)).toBeTruthy();
    expect(getByText(/organizer/)).toBeTruthy();
  });

  it("renders error message when no user data is found", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText, getByTestId } = render(<Profile />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith("userData"));
    expect(getByText(/No user data found./)).toBeTruthy();
  });

  it("clears user data and redirects on logout", async () => {
    const mockUserData = JSON.stringify({
      user_id: 5,
      name: "Abdul",
      surname: "Gules",
      email: "abdul@example.com",
      labels: ["artist", "organizer"],
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockUserData);

    const { getByText, getByTestId } = render(<Profile />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith("userData"));
    fireEvent.press(getByText("Logout"));

    await waitFor(() => expect(AsyncStorage.removeItem).toHaveBeenCalledWith("userData"));
    expect(mockRouterReplace).toHaveBeenCalledWith("/login");
  });
});