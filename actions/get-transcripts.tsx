// "use server";

// import { auth } from "@clerk/nextjs/server";

// export const getTranscripts = async ({
//   filterParams,
//   paginationParams,
// }: {
//   filterParams: {
//     month: string;
//     year: string;
//     page: string;
//   };
//   paginationParams: {
//     page: number;
//     pageSize: number;
//   };
// }): Promise<any[]> => {
//   const queryParams = new URLSearchParams();

//   const { getToken } = auth();
//   const token = await getToken();

//   console.log("Filter params:", filterParams);
//   console.log("Pagination params:", paginationParams);

//   queryParams.append("month", filterParams.month.toString());
//   queryParams.append("year", filterParams.year.toString());
//   queryParams.append("page", paginationParams.page.toString());
//   queryParams.append("pageSize", paginationParams.pageSize.toString());

//   const res = await fetch(`/api/transcripts?${queryParams.toString()}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   console.log("Response status:", res.status);

//   if (!res.ok) {
//     throw new Error(`HTTP error! status: ${res.status}`);
//   }

//   const data = await res.json();

//   return data;
// };
