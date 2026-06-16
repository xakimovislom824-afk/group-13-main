import { baseApi } from "./baseApi"; // baseApi faylingiz joylashgan yo'lni to'g'rilab oling

export type OrderAddress = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  district: string;
  street: string;
  house: string;
  apartment: string;
  postal_code: string;
  note: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateOrderAddressBody = Omit<
  OrderAddress,
  "id" | "created_at" | "updated_at"
>;

// createApi o'rniga baseApi-ga endpointlarni "ukol" (inject) qilamiz
export const orderAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/commerce-extras/order-addresses/
    getOrderAddresses: builder.query<OrderAddress[], void>({
      query: () => "commerce-extras/order-addresses/",
      providesTags: ["OrderAddress"], // baseApi-dagi tag bilan bir xil bo'lishi shart
    }),

    // POST /api/commerce-extras/order-addresses/
    createOrderAddress: builder.mutation<OrderAddress, CreateOrderAddressBody>({
      query: (body) => ({
        url: "commerce-extras/order-addresses/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OrderAddress"],
    }),

    // DELETE /api/commerce-extras/order-addresses/{id}/
    deleteOrderAddress: builder.mutation<void, number>({
      query: (id) => ({
        url: `commerce-extras/order-addresses/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrderAddress"],
    }),

    // PATCH /api/commerce-extras/order-addresses/{id}/
    updateOrderAddress: builder.mutation<
      OrderAddress,
      { id: number; body: Partial<CreateOrderAddressBody> }
    >({
      query: ({ id, body }) => ({
        url: `commerce-extras/order-addresses/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["OrderAddress"],
    }),
  }),
  overrideExisting: false,
});

// Hooklar avtomatik ravishda generatsiya qilinadi va ularni komponentlarda ishlatsangiz bo'ladi
export const {
  useGetOrderAddressesQuery,
  useCreateOrderAddressMutation,
  useDeleteOrderAddressMutation,
  useUpdateOrderAddressMutation,
} = orderAddressApi;