type Action =
  | { type: "SET_IMAGE"; payload: string | null }
  | { type: "SET_SHOW_CAMERA"; payload: boolean }
  | { type: "SET_SHOW_EXISTING_PROBLEMS"; payload: boolean }
  | { type: "SET_MATH_PROBLEM"; payload: string }
  | { type: "SET_SOLUTION"; payload: string | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_IS_SOLUTION_LOADING"; payload: boolean }
  | { type: "SET_IS_MOBILE"; payload: boolean }
  | { type: "SET_FACING_MODE"; payload: "user" | "environment" }
  | { type: "RESET_STATE" };

export const mathSolverInitialState = {
  image: null as string | null,
  showCamera: false,
  showExistingProblems: false,
  mathProblem: "",
  solution: null as string | null,
  error: null as string | null,
  isSolutionLoading: false,
  isMobile: false,
  facingMode: "user" as "user" | "environment",
};

export const mathSolverReducer = (
  state: typeof mathSolverInitialState,
  action: Action,
): typeof mathSolverInitialState => {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "SET_SHOW_CAMERA":
      return { ...state, showCamera: action.payload };
    case "SET_SHOW_EXISTING_PROBLEMS":
      return { ...state, showExistingProblems: action.payload };
    case "SET_MATH_PROBLEM":
      return { ...state, mathProblem: action.payload };
    case "SET_SOLUTION":
      return { ...state, solution: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_IS_SOLUTION_LOADING":
      return { ...state, isSolutionLoading: action.payload };
    case "SET_IS_MOBILE":
      return { ...state, isMobile: action.payload };
    case "SET_FACING_MODE":
      return { ...state, facingMode: action.payload };
    case "RESET_STATE":
      return { ...state, ...mathSolverInitialState };
    default:
      return state;
  }
};
