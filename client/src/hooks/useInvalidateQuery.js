import { useQueryClient } from "@tanstack/react-query";

const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  return (queryKey) => {
    queryClient.invalidateQueries([queryKey]); // Wrap in an array
  };
};

export default useInvalidateQuery;
