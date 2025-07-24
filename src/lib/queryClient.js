// src/lib/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian data được coi là "fresh" (không cần refetch)
      staleTime: 5 * 60 * 1000, // 5 phút

      // Thời gian data được giữ trong cache khi không sử dụng
      cacheTime: 10 * 60 * 1000, // 10 phút

      // Retry logic
      retry: (failureCount, error) => {
        // Không retry với lỗi 4xx (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry tối đa 3 lần cho các lỗi khác
        return failureCount < 3;
      },

      // Không refetch khi focus window
      refetchOnWindowFocus: false,

      // Refetch khi reconnect internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry cho mutations
      retry: 1,
    },
  },
});
