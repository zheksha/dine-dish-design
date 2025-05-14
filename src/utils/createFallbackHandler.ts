
/**
 * Creates a navigation fallback handler to prevent errors when navigating
 * @param navigate - The navigate function from useNavigate()
 * @param fallbackPath - The path to navigate to if an error occurs
 * @returns A function that safely navigates to the desired path
 */
export function createFallbackHandler(
  navigate: (path: string) => void,
  fallbackPath: string = "/"
) {
  return (path: string) => {
    try {
      if (typeof path === 'string' && path.trim() !== '') {
        navigate(path);
      } else {
        console.warn("Invalid navigation path:", path);
        navigate(fallbackPath);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      navigate(fallbackPath);
    }
  };
}
