/**
 * Returns the toast options based on the theme
 * @param theme Theme
 * @returns Toast options
 */
const getToastOptions = (theme?: string) => ({
  error: {
    className: "border border-red-500",
    iconTheme: {
      primary: "#EF4444",
      secondary: "white"
    }
  },
  loading: { className: "border border-gray-300" },
  style: {
    background: theme === "dark" ? "#18181B" : "",
    color: theme === "dark" ? "#fff" : ""
  },
  success: {
    className: "border border-green-500",
    iconTheme: {
      primary: "#10B981",
      secondary: "white"
    }
  }
});

export default getToastOptions;
